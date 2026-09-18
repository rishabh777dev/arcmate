import { getSalesSummary, diagnoseSalesDecline, dataStore } from '@actionmate/data-service';
import { knowledgeEngine } from '@actionmate/knowledge-service';
import { nlWorkflowGenerator, executeWorkflow } from '@actionmate/workflow-engine';

export const TOOL_REGISTRY = {
  get_sales_summary: async (merchantId) => await getSalesSummary(merchantId),
  diagnose_sales_decline: async (merchantId) => await diagnoseSalesDecline(merchantId),
  find_inactive_customers: async (merchantId, days = 14) => await dataStore.getCustomers(merchantId, 'INACTIVE_REGULAR'),
  query_knowledge_graph: (query) => knowledgeEngine.queryKnowledge(query),
  create_campaign_draft: async (merchantId, params) => {
    const m = await dataStore.getMerchant(merchantId);
    const inactive = await dataStore.getCustomers(m.id, 'INACTIVE_REGULAR');
    const audienceSize = inactive.length || params.audienceSize || 38;

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
      audienceSize: inactive.length || 38,
      merchantId: m.id,
      merchantName: m.name
    });
  }
};
