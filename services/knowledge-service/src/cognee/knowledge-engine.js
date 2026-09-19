import { dataStore } from '@actionmate/data-service';
import { cogneeCloudService } from './cognee-cloud-service.js';

/**
 * Cognee Knowledge Engine (ECL Architecture)
 * Represents knowledge as Entities, Concepts, and Links (Triples) with graph traversal,
 * dynamic document ingestion, and strict policy guardrails (15% discount ceiling).
 */
export class CogneeKnowledgeEngine {
  constructor() {
    // 1. Initial Knowledge Graph Nodes (Entities & Concepts)
    this.nodes = [
      {
        id: 'ent_merchant_active',
        label: 'Athees Café',
        category: 'MERCHANT',
        type: 'Entity',
        properties: {
          owner: 'Atheeswaran R.',
          category: 'Specialty Artisan Coffee & Gourmet Bakes',
          location: '100ft Road, Indiranagar, Bangalore',
          upiId: 'atheescafe@paytm',
          avgDailyFootfall: 240
        }
      },
      {
        id: 'ent_soundbox_3',
        label: 'Paytm Soundbox 3.0 Pro',
        category: 'DEVICE',
        type: 'Entity',
        properties: {
          deviceId: 'PAYTM_SBX_BLR_7781',
          batteryLevel: 96,
          network: '4G Dual SIM',
          status: 'ONLINE',
          lastChimeAt: new Date().toISOString()
        }
      },
      {
        id: 'ent_balance_sheet',
        label: 'Balance Sheet & Cashflow (FY26-Q3)',
        category: 'FINANCIAL',
        type: 'Entity',
        properties: {
          todayCollections: 58450,
          settledAmount: 44250,
          pendingSettlement: 14200,
          cashFlowStatus: 'HEALTHY'
        }
      },
      {
        id: 'pol_discount_ceiling',
        label: 'Discount Threshold Guardrail (15% Cap)',
        category: 'POLICY',
        type: 'Rule',
        properties: {
          ruleId: 'MAX_DISCOUNT_PERCENT',
          maxDiscountAllowed: 15,
          marginProtectionMargin: 25,
          enforcement: 'STRICT_BLOCKED'
        }
      },
      {
        id: 'pol_working_capital_repay',
        label: 'Loan Auto-Deduction Priority',
        category: 'POLICY',
        type: 'Rule',
        properties: {
          ruleId: 'LOAN_REPAYMENT_PRIORITY',
          dailySweepPercent: 10,
          minLiquidityBuffer: 5000
        }
      },
      {
        id: 'coh_evening_regulars',
        label: 'Evening Chai Regulars Cohort',
        category: 'COHORT',
        type: 'Entity',
        properties: {
          cohortSize: 47,
          peakWindow: '18:00 - 21:00',
          historicalTicketAvg: 165,
          inactivityDays: 14
        }
      },
      {
        id: 'ano_evening_sales_drop',
        label: 'Evening Sales Slump (-18.4%)',
        category: 'ANOMALY',
        type: 'Concept',
        properties: {
          metric: 'Weekly Gross Revenue',
          dropPercentage: 18.4,
          isolatedWindow: '18:00 - 21:00',
          rootCause: 'Lack of evening promotion & office shift change'
        }
      },
      {
        id: 'act_n8n_reengagement',
        label: 'n8n Re-Engagement Campaign',
        category: 'ACTION',
        type: 'Workflow',
        properties: {
          channel: 'WhatsApp + SMS + Soundbox Chime',
          proposedDiscount: 10,
          targetAudience: 47,
          n8nWorkflowId: 'wf_inactive_customers_reengage'
        }
      }
    ];

    // 2. Knowledge Graph Edges (Relationships / Links)
    this.edges = [
      { id: 'e1', source: 'ent_merchant_active', target: 'ent_soundbox_3', relation: 'OPERATES', label: 'operates device' },
      { id: 'e2', source: 'ent_merchant_active', target: 'ent_balance_sheet', relation: 'HOLDS_FINANCES', label: 'tracks financial health' },
      { id: 'e3', source: 'ent_merchant_active', target: 'pol_discount_ceiling', relation: 'GOVERNED_BY', label: 'governed by policy' },
      { id: 'e4', source: 'ent_merchant_active', target: 'pol_working_capital_repay', relation: 'BOUND_BY', label: 'bound by loan sweep' },
      { id: 'e5', source: 'ent_merchant_active', target: 'coh_evening_regulars', relation: 'SERVES_COHORT', label: 'serves customer segment' },
      { id: 'e6', source: 'coh_evening_regulars', target: 'ano_evening_sales_drop', relation: 'EXHIBITS', label: 'exhibits decline' },
      { id: 'e7', source: 'ano_evening_sales_drop', target: 'act_n8n_reengagement', relation: 'MITIGATED_BY', label: 'mitigated by automation' },
      { id: 'e8', source: 'act_n8n_reengagement', target: 'pol_discount_ceiling', relation: 'VALIDATED_AGAINST', label: 'validated against 15% cap' },
      { id: 'e9', source: 'act_n8n_reengagement', target: 'ent_soundbox_3', relation: 'ANNOUNCES_VIA', label: 'announces chime via' }
    ];

    // 3. Flat Text Knowledge Ingestion list (for semantic retrieval)
    this.injectedKnowledge = [
      {
        id: 'kn_1',
        category: 'POLICY',
        title: 'Discount Threshold Guardrail',
        content: 'Promotional discounts must never exceed 15%. Any offer above 15% violates merchant margin rules.',
        rules: { maxDiscount: 15 }
      },
      {
        id: 'kn_2',
        category: 'BALANCE_SHEET',
        title: 'Working Capital Health & Settlements',
        content: 'Daily settlement is active with ₹44,250 cleared and ₹14,200 pending for tonight 11:30 PM. Total today collections: ₹58,450. Clean cash flow maintained.',
        metrics: { todayCollections: 58450, settledToday: 44250, pendingSettlement: 14200 }
      },
      {
        id: 'kn_3',
        category: 'MACHINE_TELEMETRY',
        title: 'Soundbox 3.0 Operational Specs',
        content: 'Paytm Soundbox 3.0 Pro (ID: PAYTM_SBX_BLR_7781) is active on 4G dual-SIM with 96% battery, excellent signal, firmware v4.12.8-in.',
        specs: { soundboxId: 'PAYTM_SBX_BLR_7781', battery: 96, status: 'ONLINE' }
      },
      {
        id: 'kn_4',
        category: 'MERCHANT_HABIT',
        title: 'Tone & Customer Communication Preference',
        content: 'Athees Café prefers welcoming, artisanal tone highlighting specialty coffee roasts and fresh artisanal bakes.',
        preference: { tone: 'warm artisanal', keyPhrases: ['specialty brew', 'fresh bakes'] }
      }
    ];
  }

  /**
   * Returns complete ECL Knowledge Graph representation for frontend visualizers.
   */
  getGraphData(merchant = null) {
    // Dynamically align active merchant node
    const nodes = this.nodes.map(n => {
      if (n.id === 'ent_merchant_active' && merchant) {
        return {
          ...n,
          label: merchant.name || n.label,
          properties: {
            ...n.properties,
            owner: merchant.ownerName || n.properties.owner,
            category: merchant.category || n.properties.category,
            location: merchant.location || n.properties.location,
            upiId: merchant.upiId || n.properties.upiId
          }
        };
      }
      if (n.id === 'ent_soundbox_3' && merchant?.soundboxDeviceId) {
        return {
          ...n,
          properties: {
            ...n.properties,
            deviceId: merchant.soundboxDeviceId
          }
        };
      }
      return n;
    });

    const triples = this.edges.map(e => {
      const srcNode = nodes.find(n => n.id === e.source);
      const tgtNode = nodes.find(n => n.id === e.target);
      return {
        subject: srcNode ? srcNode.label : e.source,
        predicate: e.relation,
        object: tgtNode ? tgtNode.label : e.target
      };
    });

    return {
      nodes,
      edges: this.edges,
      triples,
      cogneeCloud: {
        connected: cogneeCloudService.isConfigured(),
        endpoint: cogneeCloudService.baseUrl,
        tenantId: cogneeCloudService.tenantId
      },
      stats: {
        totalNodes: nodes.length,
        totalEdges: this.edges.length,
        totalTriples: triples.length,
        policiesCount: nodes.filter(n => n.category === 'POLICY').length,
        cogneeConnected: cogneeCloudService.isConfigured(),
        lastUpdated: new Date().toISOString()
      }
    };
  }

  getAllKnowledge() {
    return this.injectedKnowledge;
  }

  /**
   * Ingest new document, policy, or financial telemetry into the knowledge graph
   */
  injectKnowledge(category, title, content, metadata = {}) {
    const entryId = `kn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const entry = {
      id: entryId,
      category,
      title,
      content,
      ...metadata,
      createdAt: new Date().toISOString()
    };
    this.injectedKnowledge.unshift(entry);

    // Auto-generate ECL node for the graph
    const newNodeId = `ent_${Date.now()}`;
    const newNode = {
      id: newNodeId,
      label: title,
      category: category.toUpperCase(),
      type: category.toUpperCase() === 'POLICY' ? 'Rule' : 'Entity',
      properties: {
        content,
        ...metadata,
        injectedAt: new Date().toISOString()
      }
    };
    this.nodes.push(newNode);

    // Connect node to merchant
    this.edges.push({
      id: `e_${Date.now()}`,
      source: 'ent_merchant_active',
      target: newNodeId,
      relation: category.toUpperCase() === 'POLICY' ? 'GOVERNED_BY' : 'INCORPORATES',
      label: category.toUpperCase() === 'POLICY' ? 'governed by' : 'incorporates'
    });

    dataStore.logAuditEvent(
      'MERCHANT',
      'KNOWLEDGE_GRAPH_INJECTED',
      `New business knowledge added to Cognee: "${title}" (${category})`,
      { category, entryId: entry.id, nodeId: newNodeId }
    );

    // Push to Cognee Cloud if API Key is configured
    cogneeCloudService.addDocument({ title, content, category, ...metadata }).catch(err => {
      console.warn('[CogneeCloud] Background sync notice:', err.message);
    });

    return entry;
  }

  /**
   * Semantic and keyword search across injected memory and attached store documents
   */
  async queryKnowledge(query, merchantId = null) {
    let docs = [];
    try {
      docs = await dataStore.getDocuments(merchantId);
    } catch (e) {
      docs = [];
    }

    const docEntries = docs.map(d => ({
      id: d.id,
      category: d.category,
      title: d.title,
      content: `${d.summary || ''} Rules: ${(d.extractedRules || []).join('; ')} Source: ${d.source || ''}`,
      rules: d.extractedRules,
      fileType: d.fileType
    }));

    const all = [...docEntries, ...this.injectedKnowledge];
    if (!query) return all;
    const qLower = query.toLowerCase();
    const matches = all.filter(k => 
      k.title.toLowerCase().includes(qLower) || 
      k.content.toLowerCase().includes(qLower) ||
      k.category.toLowerCase().includes(qLower)
    );
    return matches.length > 0 ? matches : all;
  }

  /**
   * Strict policy evaluation against Cognee graph rules
   */
  validateActionAgainstPolicies(actionParams) {
    const violations = [];
    const warnings = [];
    const discount = Number(actionParams.discountPercent);

    // Rule 1: Max discount 15% ceiling
    if (discount > 15) {
      violations.push({
        rule: 'MAX_DISCOUNT_PERCENT',
        message: `Proposed discount of ${discount}% exceeds merchant policy ceiling of 15%.`,
        severity: 'BLOCKED'
      });
    } else if (discount >= 12) {
      warnings.push({
        rule: 'HIGH_DISCOUNT_WARNING',
        message: `Proposed discount of ${discount}% is close to the 15% limit. Monitor gross margin impact.`
      });
    }

    // Rule 2: Working capital liquidity buffer check
    const todayCollections = 58450;
    if (actionParams.requiresUpfrontExpense && actionParams.upfrontCost > todayCollections * 0.5) {
      violations.push({
        rule: 'WORKING_CAPITAL_PRESERVATION',
        message: 'Action upfront cost exceeds 50% of today\'s settled collections.',
        severity: 'BLOCKED'
      });
    }

    return {
      isValid: violations.length === 0,
      violations,
      warnings,
      evaluatedAt: new Date().toISOString()
    };
  }
}

export const knowledgeEngine = new CogneeKnowledgeEngine();
