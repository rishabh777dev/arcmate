/**
 * Model Context Protocol (MCP) Standard Tool Definitions for ActionMate
 */

export const ACTIONMATE_MCP_TOOLS = [
  {
    name: 'get_sales_summary',
    description: 'Retrieves current day, week, and previous week sales aggregations for the merchant.',
    parameters: {
      type: 'object',
      properties: {
        merchantId: { type: 'string', description: 'Unique identifier for the merchant' },
        period: { type: 'string', enum: ['today', 'this_week', 'last_week', 'last_14_days'], description: 'Time window for summary' }
      },
      required: ['merchantId']
    }
  },
  {
    name: 'analyze_sales_decline',
    description: 'Pinpoints the exact operational causes of revenue or footfall decline (e.g. evening drop, repeat churn).',
    parameters: {
      type: 'object',
      properties: {
        merchantId: { type: 'string', description: 'Unique identifier for the merchant' },
        comparisonPeriod: { type: 'string', description: 'Period to compare current performance against', default: 'previous_week' }
      },
      required: ['merchantId']
    }
  },
  {
    name: 'find_inactive_customers',
    description: 'Identifies regular customers who have not visited or transacted within a specified threshold (e.g. 14 days).',
    parameters: {
      type: 'object',
      properties: {
        merchantId: { type: 'string', description: 'Unique identifier for the merchant' },
        inactivityDaysThreshold: { type: 'integer', description: 'Days since last purchase', default: 14 },
        cohort: { type: 'string', enum: ['ALL', 'EVENING_REGULARS', 'HIGH_VALUE'], default: 'EVENING_REGULARS' }
      },
      required: ['merchantId']
    }
  },
  {
    name: 'create_campaign_draft',
    description: 'Synthesizes a hyper-targeted, Hinglish re-engagement campaign draft with offer, validity, and projected ROI.',
    parameters: {
      type: 'object',
      properties: {
        merchantId: { type: 'string', description: 'Unique identifier for the merchant' },
        title: { type: 'string', description: 'Campaign title' },
        discountPercent: { type: 'number', description: 'Proposed discount percentage (must comply with merchant policy)' },
        minOrderValue: { type: 'number', description: 'Minimum order amount in rupees' },
        targetSegment: { type: 'string', description: 'Audience segment name' },
        validityDays: { type: 'integer', description: 'Validity duration in days' },
        language: { type: 'string', enum: ['hinglish', 'hindi', 'english'], default: 'hinglish' }
      },
      required: ['merchantId', 'discountPercent', 'targetSegment']
    }
  },
  {
    name: 'request_campaign_approval',
    description: 'Submits the prepared action draft to the Merchant Approval Center with risk assessment.',
    parameters: {
      type: 'object',
      properties: {
        campaignId: { type: 'string', description: 'Campaign draft identifier' },
        riskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], description: 'Calculated risk level' },
        reason: { type: 'string', description: 'Plain-language justification shown to merchant' }
      },
      required: ['campaignId', 'riskLevel', 'reason']
    }
  },
  {
    name: 'generate_n8n_workflow',
    description: 'Translates a natural language merchant automation request into an executable n8n workflow graph.',
    parameters: {
      type: 'object',
      properties: {
        merchantId: { type: 'string', description: 'Merchant ID' },
        prompt: { type: 'string', description: 'Merchant plain-language workflow description' },
        triggerType: { type: 'string', enum: ['SCHEDULE_CRON', 'SALES_ANOMALY', 'CUSTOMER_INACTIVITY', 'PAYMENT_EVENT'] }
      },
      required: ['merchantId', 'prompt']
    }
  },
  {
    name: 'query_knowledge_graph',
    description: 'Queries Cognee memory for store policies, balance sheet ledger, or Soundbox machine telemetry.',
    parameters: {
      type: 'object',
      properties: {
        merchantId: { type: 'string', description: 'Merchant ID' },
        query: { type: 'string', description: 'Search concept, e.g. "maximum allowed discount" or "soundbox battery"' }
      },
      required: ['merchantId', 'query']
    }
  }
];
