import { MarkerType } from '@xyflow/react';

export const PRESET_WORKFLOWS_DATA = [
  // 1. PRIMARY FLAGSHIP (User's Exact Request: Invoices to Excel & End of Day WhatsApp Revenue)
  {
    id: 'wf_invoice_excel_whatsapp',
    name: 'Invoice Auto-Sync to Excel & Daily WhatsApp Revenue',
    description: 'For every new payment, automatically append the invoice to the store Excel sheet and announce via Soundbox. At the end of the day (10 PM), compile all invoices and send today\'s total revenue to your WhatsApp.',
    category: 'Store Accounting & Daily Settlement',
    status: 'ACTIVE',
    nodes: [
      {
        id: 'note_invoice_flow',
        type: 'stickyNote',
        position: { x: -320, y: 120 },
        data: {
          title: 'Store Accounting & Daily Revenue Flow',
          content: 'Simple Store Automation: For every new payment, an invoice is generated, logged into your Excel sheet, and announced on the Countertop Soundbox. At the end of the day, all invoices and total collection are compiled and sent directly to your WhatsApp.',
          badge: 'Daily Store Automation'
        }
      },

      // Payment Trigger
      {
        id: 'node_payment_event',
        type: 'n8nNode',
        position: { x: 80, y: 150 },
        data: {
          name: 'New Payment / Invoice Event',
          subtitle: 'pos / upi / qr webhook',
          category: 'trigger',
          iconName: 'Zap',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            trigger: 'ON_PAYMENT_SUCCESS',
            channels: ['Paytm QR', 'UPI Soundbox', 'Card POS', 'Cash Counter'],
            dataFields: ['invoiceId', 'customerName', 'amount', 'paymentMode', 'timestamp']
          }
        }
      },

      // Action 1: Excel Append
      {
        id: 'node_excel_sync',
        type: 'n8nNode',
        position: { x: 380, y: 80 },
        data: {
          name: 'Auto-Update Excel Sheet',
          subtitle: 'append new invoice row',
          category: 'action',
          iconName: 'FileSpreadsheet',
          color: '#10b981',
          status: 'ready',
          parameters: {
            spreadsheetName: 'Daily_Store_Sales_2026.xlsx',
            worksheet: 'Invoices_Log',
            action: 'APPEND_ROW',
            columns: ['Invoice #', 'Date & Time', 'Customer', 'Amount (₹)', 'Payment Method', 'GST (5%)']
          }
        }
      },

      // Action 2: Soundbox Chime
      {
        id: 'node_soundbox_voice',
        type: 'n8nNode',
        position: { x: 380, y: 220 },
        data: {
          name: 'Soundbox Countertop Chime',
          subtitle: 'instant 4G voice confirmation',
          category: 'action',
          iconName: 'Volume2',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            device: 'Paytm Soundbox 3.0 Pro',
            voiceTemplate: '₹{amount} received successfully via UPI.',
            frequencyHz: [784, 1046]
          }
        }
      },

      // End of Day Trigger (10 PM)
      {
        id: 'node_eod_cron',
        type: 'n8nNode',
        position: { x: 80, y: 390 },
        data: {
          name: 'End of Day Trigger (10:00 PM)',
          subtitle: 'daily closing cron schedule',
          category: 'trigger',
          iconName: 'Clock',
          color: '#f59e0b',
          status: 'ready',
          parameters: {
            cronExpression: '0 22 * * *',
            timezone: 'Asia/Kolkata',
            description: 'Triggers automatically every evening at 10 PM closing'
          }
        }
      },

      // Revenue Aggregator
      {
        id: 'node_calc_revenue',
        type: 'n8nNode',
        position: { x: 380, y: 390 },
        data: {
          name: 'Compile Today\'s Revenue & Invoices',
          subtitle: 'aggregate daily collections',
          category: 'action',
          iconName: 'Database',
          color: '#38bdf8',
          status: 'ready',
          parameters: {
            source: 'Daily_Store_Sales_2026.xlsx + Supabase Ledger',
            metricsToCompute: [
              'Total Revenue Collected',
              'Total Invoices Count',
              'UPI vs Cash Breakdown',
              'Peak Sales Hour'
            ]
          }
        }
      },

      // WhatsApp Summary to Merchant
      {
        id: 'node_whatsapp_summary',
        type: 'n8nNode',
        position: { x: 680, y: 390 },
        data: {
          name: 'Send WhatsApp Revenue Report',
          subtitle: 'daily store summary to owner',
          category: 'action',
          iconName: 'MessageSquare',
          color: '#22c55e',
          status: 'ready',
          parameters: {
            recipient: 'Store Owner (Registered Phone)',
            messageFormat: 'Namaste! Aaj ki kul bikri: ₹{totalRevenue} across {totalInvoices} invoices. (UPI: ₹{upiTotal}, Cash: ₹{cashTotal}). Excel Sheet updated.',
            attachPdfSummary: true
          }
        }
      }
    ],

    edges: [
      {
        id: 'e_pay_excel',
        source: 'node_payment_event',
        target: 'node_excel_sync',
        type: 'bezier',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
      },
      {
        id: 'e_pay_soundbox',
        source: 'node_payment_event',
        target: 'node_soundbox_voice',
        type: 'bezier',
        animated: true,
        style: { stroke: '#ed6f5c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
      },
      {
        id: 'e_excel_calc',
        source: 'node_excel_sync',
        target: 'node_calc_revenue',
        type: 'bezier',
        style: { stroke: '#52525b', strokeDasharray: '4,4', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_cron_calc',
        source: 'node_eod_cron',
        target: 'node_calc_revenue',
        type: 'bezier',
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' }
      },
      {
        id: 'e_calc_whatsapp',
        source: 'node_calc_revenue',
        target: 'node_whatsapp_summary',
        type: 'bezier',
        animated: true,
        style: { stroke: '#22c55e', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
      }
    ]
  },

  // 2. 47 Inactive Patrons Winback & Soundbox Loop
  {
    id: 'wf_reengagement_47',
    name: '47 Lost Regulars Re-engagement & 10% Voucher',
    description: 'When regular patrons haven\'t visited in 5 days, automatically send a personalized 10% discount voucher on WhatsApp, enforce Cognee 15% margin guard, and alert you on the Countertop Soundbox.',
    category: 'Customer Retention & Margin Guard',
    status: 'ACTIVE',
    nodes: [
      {
        id: 'note_reengage',
        type: 'stickyNote',
        position: { x: -300, y: 100 },
        data: {
          title: 'Dormancy Radar & Margin Loop',
          content: 'Detects 47 regular patrons who haven\'t visited in 5 days. Formulates personalized Hinglish discounts, checks Cognee margin guard (<= 15%), dispatches WhatsApp vouchers, and announces completion over Countertop Soundbox 3.0 audio chime.',
          badge: 'Autonomous Campaign Flow'
        }
      },
      {
        id: 'node_radar',
        type: 'n8nNode',
        position: { x: 80, y: 160 },
        data: {
          name: 'Merchant Anomaly Radar',
          subtitle: 'sales telemetry trigger',
          category: 'trigger',
          iconName: 'Zap',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            anomalyType: 'EVENING_REGULARS_DECLINE',
            thresholdPercentage: -32
          }
        }
      },
      {
        id: 'node_fetch_patrons',
        type: 'n8nNode',
        position: { x: 360, y: 160 },
        data: {
          name: 'Fetch 47 Dormant Patrons',
          subtitle: 'supabase cohort query',
          category: 'action',
          iconName: 'Database',
          color: '#10b981',
          status: 'ready',
          parameters: {
            cohort: 'INACTIVE_REGULAR_5D',
            targetCount: 47,
            fields: ['name', 'phone', 'avgBill', 'favoriteItems']
          }
        }
      },
      {
        id: 'node_policy_check',
        type: 'n8nNode',
        position: { x: 640, y: 160 },
        data: {
          name: 'Cognee 15% Margin Guard',
          subtitle: 'margin policy ceiling',
          category: 'guardrail',
          iconName: 'ShieldCheck',
          color: '#6e7448',
          status: 'ready',
          parameters: {
            discountPercent: 10,
            ceilingCap: 15,
            actionOnViolation: 'BLOCK_AND_FLAG'
          }
        }
      },
      {
        id: 'node_dispatch_whatsapp',
        type: 'n8nNode',
        position: { x: 920, y: 100 },
        data: {
          name: 'Dispatch WhatsApp Offer',
          subtitle: 'hinglish messaging',
          category: 'action',
          iconName: 'MessageSquare',
          color: '#22c55e',
          status: 'ready',
          parameters: {
            template: 'Sharma Café par aapko miss kar rahe hain! Is week evening order par 10% off paaiye.',
            audienceSize: 47
          }
        }
      },
      {
        id: 'node_soundbox_alert',
        type: 'n8nNode',
        position: { x: 920, y: 240 },
        data: {
          name: 'Soundbox 3.0 Audio Chime',
          subtitle: 'countertop audio loop',
          category: 'action',
          iconName: 'Volume2',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            message: 'Campaign 47 customers ko successfully bhej di gayi hai.',
            frequencyHz: [784, 1046]
          }
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'node_radar',
        target: 'node_fetch_patrons',
        type: 'bezier',
        animated: true,
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e2',
        source: 'node_fetch_patrons',
        target: 'node_policy_check',
        type: 'bezier',
        animated: true,
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e3',
        source: 'node_policy_check',
        target: 'node_dispatch_whatsapp',
        type: 'bezier',
        style: { stroke: '#22c55e', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
      },
      {
        id: 'e4',
        source: 'node_policy_check',
        target: 'node_soundbox_alert',
        type: 'bezier',
        style: { stroke: '#ed6f5c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
      }
    ]
  },

  // 3. WhatsApp Multimodal Radar & Knowledge Agent
  {
    id: 'wf_multimodal_whatsapp',
    name: 'WhatsApp Multimodal Radar & Knowledge Agent',
    description: 'Autonomous multimodal pipeline: receives text, voice notes, bill images, and order documents from customers. Routes via Gemini 3.1 & Cognee, dispatches WhatsApp offers, and rings Soundbox 3.0.',
    category: 'Multimodal Customer Service',
    status: 'ACTIVE',
    nodes: [
      {
        id: 'note_main',
        type: 'stickyNote',
        position: { x: -340, y: 140 },
        data: {
          title: 'Store Multimodal Ingestion Pipeline',
          content: 'This workflow listens to WhatsApp messages (text, audio, image, documents), converts that into context embeddings, evaluates store margin rules, and uses Gemini 3.1 Flash-Lite to provide context-aware answers with conversation memory and Soundbox voice telemetry.',
          badge: 'n8n Production Workflow'
        }
      },
      {
        id: 'node_trigger',
        type: 'n8nNode',
        position: { x: 80, y: 220 },
        data: {
          name: 'WhatsApp Trigger',
          subtitle: 'whatsapp webhook',
          category: 'trigger',
          iconName: 'MessageSquare',
          color: '#22c55e',
          status: 'ready',
          parameters: {
            event: 'message_received',
            allowedTypes: ['text', 'audio', 'image', 'document'],
            channel: 'customer_support'
          },
          inputs: [],
          outputs: ['Payload']
        }
      },
      {
        id: 'node_router_types',
        type: 'n8nRouter',
        position: { x: 340, y: 190 },
        data: {
          name: 'Route Types',
          subtitle: 'router / switch',
          category: 'router',
          iconName: 'Sliders',
          color: '#38bdf8',
          status: 'ready',
          parameters: {
            routingProperty: 'message.type',
            rules: [
              { port: 'text', condition: 'type == "text"' },
              { port: 'audio', condition: 'type == "audio"' },
              { port: 'image', condition: 'type == "image"' },
              { port: 'document', condition: 'type == "document"' }
            ]
          },
          ports: [
            { id: 'port_text', label: 'Text Message' },
            { id: 'port_audio', label: 'Voicenote' },
            { id: 'port_image', label: 'Bill / Photo' },
            { id: 'port_document', label: 'Order Doc' }
          ]
        }
      },
      {
        id: 'node_map_text',
        type: 'n8nNode',
        position: { x: 620, y: 20 },
        data: {
          name: 'Map Text Prompt',
          subtitle: 'prompt formatter',
          category: 'code',
          iconName: 'Code',
          color: '#f59e0b',
          status: 'ready',
          parameters: {
            template: '{{ $json.message.body }}',
            includeHistory: true
          }
        }
      },
      {
        id: 'node_get_audio_url',
        type: 'n8nNode',
        position: { x: 620, y: 130 },
        data: {
          name: 'Get Voicenote URL',
          subtitle: 'whatsapp media',
          category: 'action',
          iconName: 'Globe',
          color: '#22c55e',
          status: 'ready',
          parameters: {
            mediaId: '{{ $json.message.mediaId }}'
          }
        }
      },
      {
        id: 'node_download_audio',
        type: 'n8nNode',
        position: { x: 880, y: 130 },
        data: {
          name: 'Download Voicenote',
          subtitle: 'binary stream',
          category: 'action',
          iconName: 'Download',
          color: '#6366f1',
          status: 'ready',
          parameters: {
            responseFormat: 'audio/ogg; codecs=opus'
          }
        }
      },
      {
        id: 'node_transcribe_audio',
        type: 'n8nNode',
        position: { x: 1140, y: 130 },
        data: {
          name: 'Gemini 3.1 Transcribe',
          subtitle: 'hinglish speech-to-text',
          category: 'ai',
          iconName: 'Mic',
          color: '#ec4899',
          status: 'ready',
          parameters: {
            model: 'gemini-3.1-flash-lite',
            languageCodes: ['hi-IN', 'en-IN']
          }
        }
      },
      {
        id: 'node_knowledge_agent',
        type: 'n8nAgent',
        position: { x: 1440, y: 160 },
        data: {
          name: 'Arc Mate Knowledge Agent',
          subtitle: 'manager agent (gemini)',
          category: 'agent',
          iconName: 'Bot',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            systemPrompt: 'You are Arc Mate, the autonomous teammate for Indian merchants. Reason over incoming messages, verify margin caps, and draft responses.'
          }
        }
      },
      {
        id: 'node_send_response',
        type: 'n8nNode',
        position: { x: 1740, y: 100 },
        data: {
          name: 'Send WhatsApp Response',
          subtitle: 'whatsapp sender',
          category: 'action',
          iconName: 'MessageSquare',
          color: '#22c55e',
          status: 'ready',
          parameters: {
            recipient: '{{ $json.customerPhone }}',
            message: '{{ $json.agentResponse }}'
          }
        }
      },
      {
        id: 'node_soundbox_chime',
        type: 'n8nNode',
        position: { x: 1740, y: 220 },
        data: {
          name: 'Paytm Soundbox 3.0 Audio',
          subtitle: 'countertop speech feedback',
          category: 'action',
          iconName: 'Volume2',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            device: 'Soundbox 3.0 4G Dual SIM'
          }
        }
      }
    ],
    edges: [
      {
        id: 'e_trig_router',
        source: 'node_trigger',
        target: 'node_router_types',
        type: 'bezier',
        animated: true,
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_router_text',
        source: 'node_router_types',
        sourceHandle: 'port_text',
        target: 'node_map_text',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_text_agent',
        source: 'node_map_text',
        target: 'node_knowledge_agent',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_router_audio',
        source: 'node_router_types',
        sourceHandle: 'port_audio',
        target: 'node_get_audio_url',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_audio_download',
        source: 'node_get_audio_url',
        target: 'node_download_audio',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_audio_transcribe',
        source: 'node_download_audio',
        target: 'node_transcribe_audio',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_transcribe_agent',
        source: 'node_transcribe_audio',
        target: 'node_knowledge_agent',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_agent_whatsapp',
        source: 'node_knowledge_agent',
        target: 'node_send_response',
        type: 'bezier',
        animated: true,
        style: { stroke: '#22c55e', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
      },
      {
        id: 'e_agent_soundbox',
        source: 'node_knowledge_agent',
        target: 'node_soundbox_chime',
        type: 'bezier',
        animated: true,
        style: { stroke: '#ed6f5c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
      }
    ]
  }
];
