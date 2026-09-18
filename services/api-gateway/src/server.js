import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';

import { dataStore, getSalesSummary, diagnoseSalesDecline } from '@actionmate/data-service';
import { knowledgeEngine, cogneeCloudService } from '@actionmate/knowledge-service';
import { nlWorkflowGenerator, convertN8nToReactFlow, executeWorkflow, exportToN8nStandardJson } from '@actionmate/workflow-engine';
import { voiceRouter, soundboxSynth } from '@actionmate/voice-service';
import { actionMateOrchestrator } from '@actionmate/agent-orchestrator';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket real-time agent stream with merchant-level isolation
wss.on('connection', (ws, req) => {
  let clientMerchantId = null;

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    clientMerchantId = url.searchParams.get('merchantId');
  } catch (e) {}

  console.log(`[WebSocket] Client connected for merchant: ${clientMerchantId || 'default'}`);
  
  const unsubscribe = actionMateOrchestrator.subscribe((event) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(event));
    }
  }, clientMerchantId);

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'AUTH' && msg.token) {
        const auth = await dataStore.verifyToken(msg.token);
        if (auth?.merchant) {
          clientMerchantId = auth.merchant.id;
          console.log(`[WebSocket] Client authenticated for store: ${auth.merchant.name} (${auth.merchant.id})`);
        }
      }
    } catch (e) {}
  });

  ws.on('close', () => {
    unsubscribe();
    console.log('[WebSocket] Client disconnected');
  });
});

// Auth & Tenant Context Middleware
async function resolveMerchantContext(req, res, next) {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (token) {
    const authResult = await dataStore.verifyToken(token);
    if (authResult?.merchant) {
      req.user = authResult.user;
      req.userProfile = authResult.userProfile;
      req.merchant = authResult.merchant;
      req.merchantId = authResult.merchant.id;
      return next();
    }
  }

  // Fallback to query/header merchantId or default store
  const headerMerchantId = req.headers['x-merchant-id'] || req.query.merchantId;
  const merchant = await dataStore.getMerchant(headerMerchantId);
  req.merchant = merchant;
  req.merchantId = merchant.id;
  next();
}

// Global middleware for tenant context
app.use(resolveMerchantContext);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'ActionMate SaaS API Gateway',
    architecture: 'Multi-Tenant Microservices',
    database: 'Supabase PostgreSQL (Active)',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 1. Authentication & Onboarding Routes
// ==========================================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, ownerName, category, location, phone, upiId } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await dataStore.signUpMerchant({
      email,
      password,
      name: name || 'New Store',
      ownerName: ownerName || 'Store Owner',
      category: category || 'Food & Beverage',
      location: location || 'India',
      phone: phone || null,
      upiId: upiId || null
    });

    res.json({
      success: true,
      user: result.user,
      merchant: result.merchant,
      token: result.token
    });
  } catch (err) {
    console.error('[API] Signup error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const result = await dataStore.loginMerchant({ email, password });
    res.json({
      success: true,
      user: result.user,
      merchant: result.merchant,
      token: result.token
    });
  } catch (err) {
    console.error('[API] Login error:', err.message);
    res.status(401).json({ error: err.message || 'Invalid credentials' });
  }
});

app.get('/api/me', async (req, res) => {
  res.json({
    user: req.user || { email: req.merchant.email, name: req.merchant.ownerName },
    merchant: req.merchant
  });
});

app.put('/api/me/merchant', async (req, res) => {
  try {
    const updated = await dataStore.updateMerchant(req.merchantId, req.body);
    res.json({ success: true, merchant: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete Onboarding Wizard Step
app.post('/api/me/onboarding-complete', async (req, res) => {
  try {
    const updated = await dataStore.updateMerchant(req.merchantId, { onboardingCompleted: true, ...req.body });
    res.json({ success: true, merchant: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. Merchant Profile & Overview
// ==========================================
app.get('/api/merchants', async (req, res) => {
  const all = await dataStore.getAllMerchants();
  res.json({
    merchants: all,
    activeMerchant: req.merchant
  });
});

app.get('/api/merchants/:id', async (req, res) => {
  const mId = req.params.id === 'current' ? req.merchantId : req.params.id;
  const merchant = await dataStore.getMerchant(mId);
  const balanceSheet = await dataStore.getBalanceSheet(mId);
  const telemetry = await dataStore.getTelemetry(mId);

  res.json({
    merchant,
    balanceSheet,
    telemetry
  });
});

// ==========================================
// 3. Analytics & Diagnostics
// ==========================================
app.get('/api/merchants/:id/summary', async (req, res) => {
  const mId = req.params.id === 'current' ? req.merchantId : req.params.id;
  const summary = await getSalesSummary(mId);
  res.json(summary);
});

app.get('/api/merchants/:id/diagnosis', async (req, res) => {
  const mId = req.params.id === 'current' ? req.merchantId : req.params.id;
  const diagnosis = await diagnoseSalesDecline(mId);
  res.json(diagnosis);
});

// ==========================================
// 4. Customers Directory
// ==========================================
app.get('/api/customers', async (req, res) => {
  const { segment } = req.query;
  const customers = await dataStore.getCustomers(req.merchantId, segment);
  res.json(customers);
});

// ==========================================
// 5. Invoices & Billing
// ==========================================
app.get('/api/invoices', async (req, res) => {
  const invoices = await dataStore.getInvoices(req.merchantId);
  res.json(invoices);
});

app.post('/api/invoices', async (req, res) => {
  try {
    const created = await dataStore.createInvoice(req.merchantId, req.body);
    res.json({ success: true, invoice: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. Transactions
// ==========================================
app.get('/api/transactions', async (req, res) => {
  const limit = parseInt(req.query.limit || '50', 10);
  const txs = await dataStore.getTransactions(req.merchantId, limit);
  res.json(txs);
});

// ==========================================
// 7. AI Assistant & Copilot
// ==========================================
app.post('/api/copilot/message', async (req, res) => {
  const { message, context = {} } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const result = await actionMateOrchestrator.processMerchantRequest(message, {
      merchantId: req.merchantId,
      merchantName: req.merchant.name,
      ...context
    });
    res.json(result);
  } catch (err) {
    console.error('[API] Copilot error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. Actions & Approvals
// ==========================================
app.post('/api/actions/:id/approve', async (req, res) => {
  try {
    const result = await actionMateOrchestrator.approveAndExecute(req.params.id, req.merchantId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. Knowledge Base & Rules
// ==========================================
app.get('/api/knowledge', async (req, res) => {
  const policies = await dataStore.getPolicies(req.merchantId);
  const balanceSheet = await dataStore.getBalanceSheet(req.merchantId);
  const telemetry = await dataStore.getTelemetry(req.merchantId);

  res.json({
    knowledge: knowledgeEngine.getAllKnowledge(),
    policies,
    balanceSheet,
    telemetry
  });
});

app.get('/api/knowledge/graph', (req, res) => {
  res.json(knowledgeEngine.getGraphData());
});

app.post('/api/knowledge/inject', async (req, res) => {
  const { category, title, content, value, metadata } = req.body;
  
  // Persist to Supabase policies table
  const policy = await dataStore.addPolicy(req.merchantId, {
    ruleKey: `RULE_${Date.now()}`,
    title,
    description: content,
    constraintType: category || 'policy',
    value: value || 15
  });

  // Also ingest into Cognee Cloud if configured
  if (cogneeCloudService.isConfigured()) {
    cogneeCloudService.addDocument({ title, content, category }, `merchant_${req.merchantId}`);
  }

  res.json({ 
    success: true, 
    entry: policy, 
    policies: await dataStore.getPolicies(req.merchantId),
    graph: knowledgeEngine.getGraphData() 
  });
});

// ==========================================
// 10. Automation Studio (Workflows)
// ==========================================
app.get('/api/workflows', async (req, res) => {
  const userWorkflows = await dataStore.getWorkflows(req.merchantId);
  
  const enriched = userWorkflows.map(wf => ({
    ...wf,
    reactFlowGraph: convertN8nToReactFlow(wf)
  }));
  res.json(enriched);
});

app.post('/api/workflows/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  const wf = await nlWorkflowGenerator.generateWorkflowFromPrompt(prompt);
  const saved = await dataStore.saveWorkflow(req.merchantId, wf);
  
  res.json({
    workflow: saved,
    reactFlowGraph: convertN8nToReactFlow(saved)
  });
});

app.post('/api/workflows/:id/execute', async (req, res) => {
  const result = await executeWorkflow(req.params.id, {
    merchantId: req.merchantId,
    merchantName: req.merchant.name,
    ...req.body
  });
  res.json(result);
});

app.get('/api/workflows/:id/export', async (req, res) => {
  const workflows = await dataStore.getWorkflows(req.merchantId);
  const wf = workflows.find(w => w.id === req.params.id) || workflows[0];
  const n8nJson = exportToN8nStandardJson(wf);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${wf?.name ? wf.name.replace(/\s+/g, '_') : 'automation_workflow'}.json"`);
  res.json(n8nJson);
});

// ==========================================
// 11. Voice & Soundbox
// ==========================================
app.post('/api/voice/process', async (req, res) => {
  const result = await voiceRouter.processVoiceInput(null, 'audio/wav');
  res.json(result);
});

app.post('/api/voice/soundbox-chime', (req, res) => {
  const { message } = req.body;
  const chime = soundboxSynth.getChimePayload(message, req.merchant.soundboxDeviceId);
  res.json(chime);
});

// ==========================================
// 12. Audit Timeline
// ==========================================
app.get('/api/audit', async (req, res) => {
  const logs = await dataStore.getAuditLogs(req.merchantId);
  res.json(logs);
});

// ==========================================
// 13. Merchant Account Settings (No exposed API keys!)
// ==========================================
app.get('/api/account', async (req, res) => {
  res.json({
    merchant: req.merchant,
    soundbox: {
      deviceId: req.merchant.soundboxDeviceId || 'PAYTM_SBX_BLR_7781',
      status: 'ONLINE',
      battery: 96,
      model: 'Paytm Soundbox 3.0 Pro'
    },
    subscription: {
      plan: req.merchant.plan || 'growth',
      status: 'ACTIVE',
      renewalDate: '2026-10-18'
    }
  });
});

app.put('/api/account', async (req, res) => {
  try {
    const updated = await dataStore.updateMerchant(req.merchantId, req.body);
    res.json({ success: true, merchant: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`[ActionMate Gateway] Running on http://localhost:${PORT}`);
  console.log(`[ActionMate Gateway] WebSocket stream active on ws://localhost:${PORT}`);
});
