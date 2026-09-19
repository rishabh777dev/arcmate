import { MarkerType } from '@xyflow/react';

export const AI_SUGGESTION_PROMPTS = [
  {
    id: 'sug_stock_po',
    label: '🥛 Low Stock Restock PO',
    prompt: 'When inventory of Oat Milk drops below 5 crates, alert manager on WhatsApp and draft restock PO to Country Delight with Soundbox chime.',
    category: 'Inventory & Supply Chain'
  },
  {
    id: 'sug_vip_alert',
    label: '⚡ VIP High-Value Alert',
    prompt: 'When any customer bill exceeds ₹2,500, announce VIP patron on Soundbox 3.0, log priority invoice, and send owner an instant WhatsApp alert.',
    category: 'VIP & High-Value Billing'
  },
  {
    id: 'sug_friday_rush',
    label: '☕ Friday Rush Retention',
    prompt: 'Every Friday at 4 PM, check dormant patrons, verify 12% margin ceiling, and send 10% happy hour vouchers to 47 regulars on WhatsApp.',
    category: 'Customer Retention & Loyalty'
  },
  {
    id: 'sug_margin_guard',
    label: '🛡️ Cognee Margin Guard',
    prompt: 'Before applying any promotional discount, verify Cognee 12% margin cap, block unauthorized overrides, and alert Countertop Soundbox.',
    category: 'Autonomous Guardrails'
  }
];

/**
 * Dynamically synthesizes an n8n visual automation workflow from a natural language prompt.
 * Parses intent, identifies triggers, guardrails, and action channels, and constructs a
 * complete ReactFlow graph with nodes, edges, parameters, and telemetry.
 */
export function generateWorkflowFromPrompt(userPrompt) {
  const promptLower = (userPrompt || '').toLowerCase();
  const timestamp = Date.now();
  const workflowId = `wf_ai_${timestamp}`;

  // 1. Check for Low Stock / Inventory / Supplier PO intent
  if (promptLower.includes('milk') || promptLower.includes('stock') || promptLower.includes('inventory') || promptLower.includes('crate') || promptLower.includes('po') || promptLower.includes('supplier')) {
    const itemName = promptLower.includes('oat') ? 'Oat Milk (Barista Edition)' : promptLower.includes('bean') ? 'Arabica Coffee Beans' : 'Fresh Dairy Milk';
    const supplierName = promptLower.includes('tokai') ? 'Blue Tokai Roasters' : 'Country Delight Fresh Dairy';
    
    return {
      id: workflowId,
      name: `Low Stock Restock PO & Supplier WhatsApp (${itemName.split(' ')[0]})`,
      description: `Autonomous inventory watchdog: monitors ${itemName} stock levels. When below reorder threshold, auto-generates purchase order to ${supplierName}, alerts owner on WhatsApp, and chimes Soundbox.`,
      category: 'Inventory & Supply Chain',
      status: 'ACTIVE',
      isCustomAI: true,
      prompt: userPrompt,
      nodes: [
        {
          id: `note_${timestamp}`,
          type: 'stickyNote',
          position: { x: -320, y: 120 },
          data: {
            title: 'Autonomous Restock & Supplier Pipeline',
            content: `AI Agent generated from prompt: "${userPrompt.slice(0, 100)}...". Automatically tracks stock thresholds in real time, generates supplier POs, and coordinates instant dispatch over WhatsApp and Soundbox.`,
            badge: 'AI Synthesized Workflow'
          }
        },
        {
          id: 'node_stock_radar',
          type: 'n8nNode',
          position: { x: 80, y: 160 },
          data: {
            name: 'Stock Level Telemetry',
            subtitle: 'inventory webhook monitor',
            category: 'trigger',
            iconName: 'Zap',
            color: '#f59e0b',
            status: 'ready',
            parameters: {
              sku: 'SKU-DAIRY-004',
              itemName: itemName,
              minThreshold: 5,
              currentStock: 3,
              triggerOn: 'STOCK_BELOW_MINIMUM'
            }
          }
        },
        {
          id: 'node_generate_po',
          type: 'n8nNode',
          position: { x: 380, y: 160 },
          data: {
            name: 'Draft Supplier PO',
            subtitle: 'automated restock order',
            category: 'action',
            iconName: 'FileText',
            color: '#38bdf8',
            status: 'ready',
            parameters: {
              supplier: supplierName,
              poNumber: `PO-${new Date().getFullYear()}-088`,
              orderQuantity: '12 Crates (72 Liters)',
              estimatedAmount: '₹5,400.00',
              paymentTerms: 'Net 15 Days'
            }
          }
        },
        {
          id: 'node_supplier_whatsapp',
          type: 'n8nNode',
          position: { x: 680, y: 90 },
          data: {
            name: 'Send WhatsApp PO to Supplier',
            subtitle: 'supplier dispatch webhook',
            category: 'action',
            iconName: 'MessageSquare',
            color: '#22c55e',
            status: 'ready',
            parameters: {
              recipient: `${supplierName} Dispatch (+91 99012 34567)`,
              messageFormat: `📦 Athees Café Restock PO: 12 Crates of ${itemName} requested for early morning delivery. PO attached.`
            }
          }
        },
        {
          id: 'node_soundbox_chime',
          type: 'n8nNode',
          position: { x: 680, y: 230 },
          data: {
            name: 'Soundbox Restock Chime',
            subtitle: 'countertop alert audio',
            category: 'action',
            iconName: 'Volume2',
            color: '#ed6f5c',
            status: 'ready',
            parameters: {
              device: 'Paytm Soundbox 3.0 Pro',
              voiceTemplate: `Attention: ${itemName} stock low. Restock PO drafted to supplier.`
            }
          }
        }
      ],
      edges: [
        {
          id: `e1_${timestamp}`,
          source: 'node_stock_radar',
          target: 'node_generate_po',
          type: 'bezier',
          animated: true,
          style: { stroke: '#38bdf8', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
        },
        {
          id: `e2_${timestamp}`,
          source: 'node_generate_po',
          target: 'node_supplier_whatsapp',
          type: 'bezier',
          animated: true,
          style: { stroke: '#22c55e', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
        },
        {
          id: `e3_${timestamp}`,
          source: 'node_generate_po',
          target: 'node_soundbox_chime',
          type: 'bezier',
          animated: true,
          style: { stroke: '#ed6f5c', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
        }
      ]
    };
  }

  // 2. Check for High-Value / VIP Bill Alert intent
  if (promptLower.includes('vip') || promptLower.includes('high') || promptLower.includes('2500') || promptLower.includes('3000') || promptLower.includes('5000') || promptLower.includes('large') || promptLower.includes('bill')) {
    return {
      id: workflowId,
      name: 'VIP High-Value Bill Alert & Soundbox Chime',
      description: 'Real-time billing radar: flags checkouts over threshold, plays a special VIP welcome fanfare chime on Countertop Soundbox 3.0, and alerts manager on WhatsApp.',
      category: 'VIP & High-Value Billing',
      status: 'ACTIVE',
      isCustomAI: true,
      prompt: userPrompt,
      nodes: [
        {
          id: `note_${timestamp}`,
          type: 'stickyNote',
          position: { x: -320, y: 120 },
          data: {
            title: 'High-Value VIP Patron Recognition',
            content: `AI Agent generated from prompt: "${userPrompt.slice(0, 100)}...". Instant VIP acknowledgement: notifies kitchen, plays specialized harmonic chime, and registers customer in VIP loyalty tier.`,
            badge: 'AI Synthesized Workflow'
          }
        },
        {
          id: 'node_checkout_stream',
          type: 'n8nNode',
          position: { x: 80, y: 160 },
          data: {
            name: 'POS Payment Stream',
            subtitle: 'live transaction webhook',
            category: 'trigger',
            iconName: 'Zap',
            color: '#ed6f5c',
            status: 'ready',
            parameters: {
              source: 'Paytm UPI QR & Card POS',
              event: 'PAYMENT_COMPLETED'
            }
          }
        },
        {
          id: 'node_vip_filter',
          type: 'n8nNode',
          position: { x: 380, y: 160 },
          data: {
            name: 'VIP Threshold Evaluator',
            subtitle: 'bill > ₹2,500 filter',
            category: 'router',
            iconName: 'Sliders',
            color: '#f59e0b',
            status: 'ready',
            parameters: {
              minAmountINR: 2500,
              checkCustomerTier: true,
              passCondition: 'amount >= 2500'
            }
          }
        },
        {
          id: 'node_vip_chime',
          type: 'n8nNode',
          position: { x: 680, y: 90 },
          data: {
            name: 'Soundbox VIP Fanfare Audio',
            subtitle: 'special harmonic chime',
            category: 'action',
            iconName: 'Volume2',
            color: '#10b981',
            status: 'ready',
            parameters: {
              frequencyHz: [880, 1174, 1480],
              voiceTemplate: 'VIP Patron bill of ₹{amount} received with gratitude.'
            }
          }
        },
        {
          id: 'node_owner_whatsapp',
          type: 'n8nNode',
          position: { x: 680, y: 230 },
          data: {
            name: 'Instant Manager WhatsApp Ping',
            subtitle: 'high-value alert',
            category: 'action',
            iconName: 'MessageSquare',
            color: '#22c55e',
            status: 'ready',
            parameters: {
              recipient: 'Store Manager (+91 98765 43210)',
              messageFormat: '⭐ High-Value Order: Table 4 checkout of ₹3,450 by Harish Ranganathan. VIP loyalty points credited.'
            }
          }
        }
      ],
      edges: [
        {
          id: `e1_${timestamp}`,
          source: 'node_checkout_stream',
          target: 'node_vip_filter',
          type: 'bezier',
          animated: true,
          style: { stroke: '#f59e0b', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
        },
        {
          id: `e2_${timestamp}`,
          source: 'node_vip_filter',
          target: 'node_vip_chime',
          type: 'bezier',
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
        },
        {
          id: `e3_${timestamp}`,
          source: 'node_vip_filter',
          target: 'node_owner_whatsapp',
          type: 'bezier',
          animated: true,
          style: { stroke: '#22c55e', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
        }
      ]
    };
  }

  // 3. Check for Margin Guard / Policy Ceiling intent
  if (promptLower.includes('margin') || promptLower.includes('ceiling') || promptLower.includes('guard') || promptLower.includes('policy') || promptLower.includes('cap')) {
    return {
      id: workflowId,
      name: 'Cognee 12% Margin Guardrail & Override Shield',
      description: 'Autonomous financial guardrail: verifies every active discount against the store margin floor (12% ceiling). Automatically freezes unapproved discounts and triggers countertop alert.',
      category: 'Autonomous Guardrails',
      status: 'ACTIVE',
      isCustomAI: true,
      prompt: userPrompt,
      nodes: [
        {
          id: `note_${timestamp}`,
          type: 'stickyNote',
          position: { x: -320, y: 120 },
          data: {
            title: 'Cognee Margin Ceiling & Compliance Flow',
            content: `AI Agent generated from prompt: "${userPrompt.slice(0, 100)}...". Protects store bottom-line by enforcing strict discount ceilings before any WhatsApp or POS voucher can execute.`,
            badge: 'AI Synthesized Workflow'
          }
        },
        {
          id: 'node_discount_req',
          type: 'n8nNode',
          position: { x: 80, y: 160 },
          data: {
            name: 'Discount Campaign Trigger',
            subtitle: 'marketing / promo event',
            category: 'trigger',
            iconName: 'Zap',
            color: '#f59e0b',
            status: 'ready',
            parameters: {
              campaign: 'Weekend Rush Promo',
              proposedDiscount: '15%'
            }
          }
        },
        {
          id: 'node_cognee_guard',
          type: 'n8nNode',
          position: { x: 380, y: 160 },
          data: {
            name: 'Cognee Margin Ceiling Check',
            subtitle: 'strict 12% margin floor',
            category: 'guardrail',
            iconName: 'ShieldCheck',
            color: '#10b981',
            status: 'ready',
            parameters: {
              maxCeilingDiscount: 12,
              onViolation: 'CLAMP_TO_12_OR_BLOCK',
              enforceAuditLog: true
            }
          }
        },
        {
          id: 'node_guard_whatsapp',
          type: 'n8nNode',
          position: { x: 680, y: 90 },
          data: {
            name: 'Send Approved WhatsApp Promo',
            subtitle: 'compliant voucher dispatch',
            category: 'action',
            iconName: 'MessageSquare',
            color: '#22c55e',
            status: 'ready',
            parameters: {
              clampedDiscount: '12% OFF (Audited OK)',
              targetAudience: '47 Inactive Patrons'
            }
          }
        },
        {
          id: 'node_guard_soundbox',
          type: 'n8nNode',
          position: { x: 680, y: 230 },
          data: {
            name: 'Soundbox Margin Confirmation',
            subtitle: 'countertop voice check',
            category: 'action',
            iconName: 'Volume2',
            color: '#ed6f5c',
            status: 'ready',
            parameters: {
              message: 'Margin policy verified: Campaign clamped to 12% ceiling cap.'
            }
          }
        }
      ],
      edges: [
        {
          id: `e1_${timestamp}`,
          source: 'node_discount_req',
          target: 'node_cognee_guard',
          type: 'bezier',
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
        },
        {
          id: `e2_${timestamp}`,
          source: 'node_cognee_guard',
          target: 'node_guard_whatsapp',
          type: 'bezier',
          animated: true,
          style: { stroke: '#22c55e', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
        },
        {
          id: `e3_${timestamp}`,
          source: 'node_cognee_guard',
          target: 'node_guard_soundbox',
          type: 'bezier',
          animated: true,
          style: { stroke: '#ed6f5c', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
        }
      ]
    };
  }

  // 4. Default / Generic Custom AI Workflow Synthesis
  // Parse any natural language prompt into a 4-node n8n workflow
  const cleanTitle = userPrompt.length > 45 ? `${userPrompt.slice(0, 42)}...` : userPrompt;

  return {
    id: workflowId,
    name: `AI Automation: ${cleanTitle}`,
    description: `Synthesized natural language workflow: "${userPrompt}". Autonomous pipeline executing trigger, evaluation logic, WhatsApp merchant dispatch, and Soundbox voice notification.`,
    category: 'Custom AI Automation',
    status: 'ACTIVE',
    isCustomAI: true,
    prompt: userPrompt,
    nodes: [
      {
        id: `note_${timestamp}`,
        type: 'stickyNote',
        position: { x: -320, y: 120 },
        data: {
          title: 'Custom AI Synthesized Automation',
          content: `Workflow generated directly from natural language prompt: "${userPrompt}". Triggered on demand or on schedule, evaluating store conditions, and dispatching multi-channel actions.`,
          badge: 'AI Synthesized'
        }
      },
      {
        id: 'node_ai_trigger',
        type: 'n8nNode',
        position: { x: 80, y: 160 },
        data: {
          name: 'Store Event Trigger',
          subtitle: 'event listener / webhook',
          category: 'trigger',
          iconName: 'Zap',
          color: '#f59e0b',
          status: 'ready',
          parameters: {
            triggerSource: 'Real-time Store Event',
            rule: userPrompt.slice(0, 50)
          }
        }
      },
      {
        id: 'node_ai_agent',
        type: 'n8nAgent',
        position: { x: 380, y: 160 },
        data: {
          name: 'Arc Mate Logic Agent',
          subtitle: 'gemini 3.1 decision engine',
          category: 'agent',
          iconName: 'Bot',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            reasoningEngine: 'Gemini 3.1 Flash-Lite',
            instruction: userPrompt,
            complianceGuard: 'ENFORCE_STORE_SAFETY'
          }
        }
      },
      {
        id: 'node_ai_whatsapp',
        type: 'n8nNode',
        position: { x: 680, y: 90 },
        data: {
          name: 'WhatsApp Dispatch',
          subtitle: 'instant notification',
          category: 'action',
          iconName: 'MessageSquare',
          color: '#22c55e',
          status: 'ready',
          parameters: {
            recipientPhone: '+91 98765 43210',
            message: `✨ Arc Mate Automation Alert:\n\nTriggered by: "${userPrompt}"\nStatus: Executed Successfully\nTime: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          }
        }
      },
      {
        id: 'node_ai_soundbox',
        type: 'n8nNode',
        position: { x: 680, y: 230 },
        data: {
          name: 'Countertop Soundbox Audio',
          subtitle: '4G voice confirmation',
          category: 'action',
          iconName: 'Volume2',
          color: '#38bdf8',
          status: 'ready',
          parameters: {
            device: 'Paytm Soundbox 3.0 Pro',
            voiceTemplate: 'Arc Mate AI automation triggered successfully.'
          }
        }
      }
    ],
    edges: [
      {
        id: `e1_${timestamp}`,
        source: 'node_ai_trigger',
        target: 'node_ai_agent',
        type: 'bezier',
        animated: true,
        style: { stroke: '#ed6f5c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
      },
      {
        id: `e2_${timestamp}`,
        source: 'node_ai_agent',
        target: 'node_ai_whatsapp',
        type: 'bezier',
        animated: true,
        style: { stroke: '#22c55e', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
      },
      {
        id: `e3_${timestamp}`,
        source: 'node_ai_agent',
        target: 'node_ai_soundbox',
        type: 'bezier',
        animated: true,
        style: { stroke: '#38bdf8', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
      }
    ]
  };
}
