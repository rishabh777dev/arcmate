export const PRESET_WORKFLOWS = [
  {
    id: 'wf_reengagement_47',
    name: 'Sharma Café — 47 Inactive Evening Regulars Re-engagement',
    description: 'Triggered when evening repeat customer decline is detected. Dispatches 10% Hinglish offer.',
    triggerType: 'SALES_ANOMALY',
    status: 'ACTIVE',
    nodes: [
      {
        id: 'node_trigger',
        name: 'Merchant Anomaly Trigger',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [100, 200],
        parameters: { path: '/webhook/anomaly-reengagement', httpMethod: 'POST' }
      },
      {
        id: 'node_segment',
        name: 'Fetch 47 Inactive Customers',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 2,
        position: [350, 200],
        parameters: { url: 'http://localhost:4000/api/customers?segment=INACTIVE_REGULAR', method: 'GET' }
      },
      {
        id: 'node_policy_check',
        name: 'Cognee Policy & Margin Check',
        type: 'n8n-nodes-base.if',
        typeVersion: 1,
        position: [600, 200],
        parameters: { condition: 'discountPercent <= 15' }
      },
      {
        id: 'node_dispatch_whatsapp',
        name: 'Dispatch WhatsApp Offer (Hinglish)',
        type: 'n8n-nodes-base.whatsApp',
        typeVersion: 1,
        position: [850, 150],
        parameters: {
          template: 'Sharma Café par aapko miss kar rahe hain! Is week evening order par 10% off paaiye.'
        }
      },
      {
        id: 'node_soundbox_alert',
        name: 'Paytm Soundbox 3.0 Audio Announce',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 2,
        position: [850, 300],
        parameters: {
          url: 'http://localhost:4000/api/voice/soundbox-chime',
          message: 'Campaign 47 customers ko successfully bhej di gayi hai.'
        }
      }
    ],
    connections: {
      node_trigger: { main: [[{ node: 'node_segment', type: 'main', index: 0 }]] },
      node_segment: { main: [[{ node: 'node_policy_check', type: 'main', index: 0 }]] },
      node_policy_check: {
        main: [
          [{ node: 'node_dispatch_whatsapp', type: 'main', index: 0 }],
          [{ node: 'node_soundbox_alert', type: 'main', index: 0 }]
        ]
      }
    }
  },
  {
    id: 'wf_evening_rush_booster',
    name: 'Evening Tea-Time Rush Booster (6 PM)',
    description: 'Auto-schedules a snack combo offer every weekday at 5:30 PM to boost footfall.',
    triggerType: 'SCHEDULE_CRON',
    status: 'READY',
    nodes: [
      {
        id: 'node_cron',
        name: 'Cron: Mon-Fri at 17:30',
        type: 'n8n-nodes-base.cron',
        position: [100, 200],
        parameters: { triggerTimes: { item: [{ mode: 'everyWeek', hour: 17, minute: 30 }] } }
      },
      {
        id: 'node_filter_nearby',
        name: 'Filter Sector 62 Customers',
        type: 'n8n-nodes-base.code',
        position: [350, 200],
        parameters: { jsCode: 'return items.filter(c => c.location === "Sector 62");' }
      },
      {
        id: 'node_send_sms',
        name: 'Send Instant Chai SMS',
        type: 'n8n-nodes-base.sms',
        position: [600, 200],
        parameters: { message: 'Garam Garam Chai & Samosa Combo at ₹49 only at Sharma Café!' }
      }
    ],
    connections: {
      node_cron: { main: [[{ node: 'node_filter_nearby', type: 'main', index: 0 }]] },
      node_filter_nearby: { main: [[{ node: 'node_send_sms', type: 'main', index: 0 }]] }
    }
  }
];
