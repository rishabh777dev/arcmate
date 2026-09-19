import { PRESET_WORKFLOWS } from '../templates/preset-workflows.js';
import { dataStore } from '@actionmate/data-service';

export class NLWorkflowGenerator {
  /**
   * Translates a natural language merchant automation prompt into an n8n workflow graph
   */
  async generateWorkflowFromPrompt(prompt, merchantId = 'merchant_sharma_cafe') {
    const pLower = prompt.toLowerCase();
    const wfId = `wf_gen_${Date.now()}`;

    // Extract offer discount and audience if mentioned
    let discount = 10;
    const discMatch = prompt.match(/(\d+)\s*%/);
    if (discMatch) discount = parseInt(discMatch[1], 10);

    let triggerName = 'Daily Schedule Trigger';
    let triggerType = 'n8n-nodes-base.cron';
    if (pLower.includes('payment') || pLower.includes('fail') || pLower.includes('qr')) {
      triggerName = 'Paytm QR Payment Event';
      triggerType = 'n8n-nodes-base.webhook';
    } else if (pLower.includes('customer') || pLower.includes('wapas') || pLower.includes('inactive')) {
      triggerName = 'Customer Inactivity Trigger';
      triggerType = 'n8n-nodes-base.webhook';
    }

    const workflow = {
      id: wfId,
      merchantId,
      name: `Auto-Generated: ${prompt.slice(0, 48)}...`,
      prompt,
      triggerType: 'NATURAL_LANGUAGE_PROMPT',
      status: 'COMPILED_READY',
      createdAt: new Date().toISOString(),
      nodes: [
        {
          id: 'node_1_trigger',
          name: triggerName,
          type: triggerType,
          typeVersion: 1,
          position: [120, 220],
          parameters: { description: 'Fired upon detected merchant condition' }
        },
        {
          id: 'node_2_filter',
          name: 'Target Cohort Filter',
          type: 'n8n-nodes-base.code',
          typeVersion: 1,
          position: [380, 220],
          parameters: { jsCode: `// Filter audience\nreturn items.filter(c => c.segment === 'INACTIVE_REGULAR');` }
        },
        {
          id: 'node_3_guardrail',
          name: 'Cognee Policy Check',
          type: 'n8n-nodes-base.if',
          typeVersion: 1,
          position: [640, 220],
          parameters: { condition: `discount <= 15 (Current: ${discount}%)` }
        },
        {
          id: 'node_4_channel',
          name: 'Dispatch WhatsApp / SMS Campaign',
          type: 'n8n-nodes-base.whatsApp',
          typeVersion: 1,
          position: [900, 160],
          parameters: {
            message: `Sharma Café Offer: Get ${discount}% OFF on your next order! Powered by Paytm ActionMate.`
          }
        },
        {
          id: 'node_5_soundbox',
          name: 'Soundbox 3.0 Voice Receipt',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 2,
          position: [900, 300],
          parameters: {
            action: 'PLAY_CHIME_AND_VOICE',
            voiceAlert: `Paytm ActionMate: Workflow successfully executed for ${discount}% offer.`
          }
        }
      ],
      connections: {
        node_1_trigger: { main: [[{ node: 'node_2_filter', type: 'main', index: 0 }]] },
        node_2_filter: { main: [[{ node: 'node_3_guardrail', type: 'main', index: 0 }]] },
        node_3_guardrail: {
          main: [
            [{ node: 'node_4_channel', type: 'main', index: 0 }],
            [{ node: 'node_5_soundbox', type: 'main', index: 0 }]
          ]
        }
      }
    };

    await dataStore.saveWorkflow(merchantId, workflow);
    dataStore.logAuditEvent(
      'ACTIONMATE_AGENT',
      'WORKFLOW_SYNTHESIZED',
      `Natural language prompt converted to n8n workflow: "${workflow.name}"`,
      { workflowId: wfId, discountProposed: discount }
    );

    return workflow;
  }
}

export const nlWorkflowGenerator = new NLWorkflowGenerator();
