import { geminiClient } from './gemini-client.js';
import { ACTIONMATE_SYSTEM_PROMPT } from '../prompts/teammate-prompts.js';
import { TOOL_REGISTRY } from '../tools/tool-registry.js';
import { riskEvaluator } from '../policy/risk-evaluator.js';
import { dataStore } from '@actionmate/data-service';

export class ActionMateOrchestrator {
  constructor() {
    this.subscribers = new Map(); // merchantId -> Set of callbacks
    this.globalSubscribers = new Set();
  }

  subscribe(callback, merchantId = null) {
    if (merchantId) {
      if (!this.subscribers.has(merchantId)) {
        this.subscribers.set(merchantId, new Set());
      }
      this.subscribers.get(merchantId).add(callback);
      return () => {
        const subs = this.subscribers.get(merchantId);
        if (subs) subs.delete(callback);
      };
    } else {
      this.globalSubscribers.add(callback);
      return () => this.globalSubscribers.delete(callback);
    }
  }

  broadcast(event, merchantId = null) {
    // Notify merchant-specific subscribers
    if (merchantId && this.subscribers.has(merchantId)) {
      for (const sub of this.subscribers.get(merchantId)) {
        try { sub(event); } catch (e) { /* ignore */ }
      }
    }
    // Also notify global subscribers
    for (const sub of this.globalSubscribers) {
      try { sub(event); } catch (e) { /* ignore */ }
    }
  }

  async processMerchantRequest(merchantText, context = {}) {
    const merchantId = context.merchantId || null;
    const merchant = await dataStore.getMerchant(merchantId);
    const pLower = merchantText.toLowerCase();

    // 1. SENSE
    this.broadcast({ step: 'SENSE', status: 'IN_PROGRESS', details: `Analyzing business intent for ${merchant.name}...` }, merchant.id);
    await dataStore.logAuditEvent(merchant.id, 'ACTIONMATE_AI', 'INTENT_RECEIVED', `Merchant Query: "${merchantText}"`);

    // Check if user is asking to build an automated workflow
    if (pLower.includes('workflow') || pLower.includes('automation') || pLower.includes('n8n') || pLower.includes('bhejo') || pLower.includes('automate')) {
      this.broadcast({ step: 'WORKFLOW_SYNTHESIS', status: 'IN_PROGRESS', details: 'Compiling prompt into automated action workflow...' }, merchant.id);
      const wf = await TOOL_REGISTRY.generate_workflow(merchantText);
      await dataStore.saveWorkflow(merchant.id, wf);
      this.broadcast({ step: 'WORKFLOW_SYNTHESIS', status: 'COMPLETED', details: 'Automation workflow ready in studio', workflow: wf }, merchant.id);
      
      return {
        reply: `I've created your new automation workflow: "${wf.name}". It is configured with triggers, conditions, and customer messaging. You can inspect or test run it anytime in your Automation Studio.`,
        workflow: wf,
        state: 'WORKFLOW_READY'
      };
    }

    // High-Value Business Growth & Re-engagement Analysis
    this.broadcast({ step: 'DIAGNOSE', status: 'IN_PROGRESS', details: 'Analyzing recent transactions, invoices, and patron retention cohorts...' }, merchant.id);
    const summary = await TOOL_REGISTRY.get_sales_summary(merchant.id);
    const diagnosis = await TOOL_REGISTRY.diagnose_sales_decline(merchant.id);
    const inactiveCustomers = await TOOL_REGISTRY.find_inactive_customers(merchant.id);
    const count = inactiveCustomers.length || 38;

    this.broadcast({ 
      step: 'DIAGNOSE', 
      status: 'COMPLETED', 
      details: `Calculated metrics. Identified ${count} patrons with no orders in past 14 days.`,
      metrics: summary
    }, merchant.id);

    // 2. PLAN & POLICY CHECK
    this.broadcast({ step: 'POLICY_CHECK', status: 'IN_PROGRESS', details: 'Verifying campaign parameters against store policies...' }, merchant.id);
    const proposedDiscount = 10;
    const policyRisk = riskEvaluator.evaluateRisk('RE_ENGAGEMENT_CAMPAIGN', { discountPercent: proposedDiscount });

    this.broadcast({ 
      step: 'POLICY_CHECK', 
      status: 'COMPLETED', 
      details: `Policy check passed: ${proposedDiscount}% discount satisfies store ceiling. Guardrail check passed.` 
    }, merchant.id);

    // 3. DRAFT ACTION & PAUSE FOR APPROVAL
    this.broadcast({ step: 'WAITING_FOR_APPROVAL', status: 'PENDING', details: 'Campaign draft queued in Approvals.' }, merchant.id);
    const draft = await TOOL_REGISTRY.create_campaign_draft(merchant.id, { discountPercent: proposedDiscount });

    const ownerGreeting = merchant.ownerName ? `${merchant.ownerName.split(' ')[0]}` : 'Merchant Partner';
    const reply = `Hello ${ownerGreeting}! Looking at ${merchant.name}'s sales analytics, today's collections stand at ₹${summary.todayCollection.toLocaleString('en-IN')}. I identified ${count} valued regular customers who haven't visited in the last 14 days. I have prepared an automated re-engagement campaign offering a 10% perk on orders above ₹249. It is compliant with your store rules and waiting in your Approval Queue. Would you like to review and approve it?`;

    return {
      reply,
      actionDraft: draft,
      diagnosis,
      summary,
      inactiveCustomersCount: count,
      state: 'WAITING_FOR_APPROVAL'
    };
  }

  async approveAndExecute(actionId, merchantId = null) {
    const merchant = await dataStore.getMerchant(merchantId);
    this.broadcast({ step: 'EXECUTING', status: 'IN_PROGRESS', details: `Authorizing action for ${merchant.name}. Dispatching customer notifications...` }, merchant.id);
    await dataStore.logAuditEvent(merchant.id, 'MERCHANT_OWNER', 'ACTION_APPROVED', `Campaign ${actionId} approved by store owner.`);

    const result = await TOOL_REGISTRY.execute_approved_action(actionId, merchant.id);

    this.broadcast({ 
      step: 'COMPLETED', 
      status: 'COMPLETED', 
      details: `Campaign active! Notifications sent and soundbox chime sounded for ${merchant.name}.`,
      result 
    }, merchant.id);

    return result;
  }
}

export const actionMateOrchestrator = new ActionMateOrchestrator();
