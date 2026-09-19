import { getSalesSummary, diagnoseSalesDecline, dataStore } from '@actionmate/data-service';
import { knowledgeEngine } from '@actionmate/knowledge-service';
import { nlWorkflowGenerator, executeWorkflow } from '@actionmate/workflow-engine';
import { financialAdvisor } from '../brain/financial-advisor.js';

export const TOOL_REGISTRY = {
  get_sales_summary: async (merchantId) => await getSalesSummary(merchantId),
  diagnose_sales_decline: async (merchantId) => await diagnoseSalesDecline(merchantId),
  find_inactive_customers: async (merchantId, days = 14) => await dataStore.getCustomers(merchantId, 'INACTIVE_REGULAR'),
  query_knowledge_graph: (query) => knowledgeEngine.queryKnowledge(query),
  create_campaign_draft: async (merchantId, params) => {
    const m = await dataStore.getMerchant(merchantId);
    const inactive = await dataStore.getCustomers(m.id, 'INACTIVE_REGULAR');
    const audienceSize = inactive.length || params.audienceSize || 47;

    const draft = {
      id: `camp_${Date.now()}`,
      merchantId: m.id,
      title: params.title || `${m.name} Patron Re-engagement Special`,
      actionType: 'RE_ENGAGEMENT_CAMPAIGN',
      targetSegment: `${audienceSize} Inactive Regular Patrons`,
      audienceSize,
      offerText: `We miss seeing you at ${m.name}! Enjoy ${params.discountPercent || 10}% off your next order above ₹249 this week.`,
      discountPercent: params.discountPercent || 10,
      validityDays: 5,
      riskLevel: 'LOW',
      requiresApproval: true,
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString()
    };
    await dataStore.saveActionDraft(draft);
    return draft;
  },
  generate_workflow: async (prompt) => {
    return await nlWorkflowGenerator.generateWorkflowFromPrompt(prompt);
  },
  execute_approved_action: async (actionId, merchantId) => {
    const m = await dataStore.getMerchant(merchantId);
    const inactive = await dataStore.getCustomers(m.id, 'INACTIVE_REGULAR');
    return await executeWorkflow(actionId, { 
      audienceSize: inactive.length || 47,
      merchantId: m.id,
      merchantName: m.name
    });
  },
  get_invoices: async (merchantId) => await dataStore.getInvoices(merchantId),
  create_invoice: async (merchantId, invoiceData) => await dataStore.createInvoice(merchantId, invoiceData),
  get_companies: async (merchantId) => await dataStore.getCompanies(merchantId),
  get_shipments: async (merchantId) => await dataStore.getShipments(merchantId),
  create_shipment: async (merchantId, data) => await dataStore.createShipment(merchantId, data),
  diagnose_workflows: async (merchantId) => await dataStore.getWorkflowDiagnostics(merchantId),
  get_store_audit: async (merchantId) => await dataStore.getStoreAudit(merchantId),
  get_policies: async (merchantId) => await dataStore.getPolicies(merchantId),
  add_policy: async (merchantId, policy) => await dataStore.addPolicy(merchantId, policy),
  get_documents: async (merchantId) => await dataStore.getDocuments(merchantId),
  add_document: async (merchantId, docData) => await dataStore.addDocument(merchantId, docData),
  delete_document: async (merchantId, docId) => await dataStore.deleteDocument(merchantId, docId),
  get_balance_sheet: async (merchantId) => await dataStore.getBalanceSheet(merchantId),
  
  // Financial Advisor Tool Functions
  get_profit_margin_advice: async (merchantId) => {
    const audit = await dataStore.getStoreAudit(merchantId);
    const docs = await dataStore.getDocuments(merchantId);
    return financialAdvisor.generateProfitMarginAdvice(audit, docs);
  },
  get_cost_reduction_plan: async (merchantId) => {
    const audit = await dataStore.getStoreAudit(merchantId);
    const comps = await dataStore.getCompanies(merchantId);
    const docs = await dataStore.getDocuments(merchantId);
    return financialAdvisor.generateCostReductionPlan(audit, comps, docs);
  },
  get_working_capital_advice: async (merchantId) => {
    const bs = await dataStore.getBalanceSheet(merchantId);
    const invs = await dataStore.getInvoices(merchantId);
    return financialAdvisor.generateWorkingCapitalAdvice(bs, invs);
  },
  evaluate_discount: async (merchantId, pct, category = 'General') => {
    return financialAdvisor.evaluateDiscountRequest(pct, category);
  },
  get_tax_summary: async (merchantId) => {
    const audit = await dataStore.getStoreAudit(merchantId);
    const invs = await dataStore.getInvoices(merchantId);
    return financialAdvisor.generateTaxSummary(audit, invs);
  },
  query_cognee_documents: async (merchantId, query) => {
    return await knowledgeEngine.queryKnowledge(query, merchantId);
  }
};
