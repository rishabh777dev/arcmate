import { MarkerType } from '@xyflow/react';

export const PRESET_WORKFLOWS_DATA = [
  {
    id: 'wf_multimodal_whatsapp',
    name: 'WhatsApp Multimodal Radar & Knowledge Agent',
    description: 'Autonomous multimodal pipeline: receives text, voice notes, bill images, and order documents from customers. Routes via Gemini 3.1 & Cognee, dispatches WhatsApp offers, and rings Soundbox 3.0.',
    category: 'Flagship Autonomous Pipeline',
    status: 'ACTIVE',
    nodes: [
      // 0. Green Sticky Note (Exact match to n8n canvas reference)
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

      // 1. WhatsApp Trigger
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

      // 2. Route Types (Router / Switch)
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

      // Branch 1: Text
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

      // Branch 2: Audio Voicenote
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
            mediaId: '{{ $json.message.mediaId }}',
            endpoint: '/v17.0/media'
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
            responseFormat: 'audio/ogg; codecs=opus',
            maxSizeMb: 15
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
            languageCodes: ['hi-IN', 'en-IN'],
            detectEmotion: true
          }
        }
      },

      // Branch 3: Image / Bill
      {
        id: 'node_get_image_url',
        type: 'n8nNode',
        position: { x: 620, y: 240 },
        data: {
          name: 'Get Bill Image URL',
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
        id: 'node_download_image',
        type: 'n8nNode',
        position: { x: 880, y: 240 },
        data: {
          name: 'Download Image',
          subtitle: 'binary stream',
          category: 'action',
          iconName: 'Download',
          color: '#6366f1',
          status: 'ready',
          parameters: {
            mimeType: 'image/jpeg'
          }
        }
      },
      {
        id: 'node_analyze_image',
        type: 'n8nNode',
        position: { x: 1140, y: 240 },
        data: {
          name: 'Gemini Vision OCR',
          subtitle: 'invoice ocr analysis',
          category: 'ai',
          iconName: 'Sparkles',
          color: '#8b5cf6',
          status: 'ready',
          parameters: {
            task: 'EXTRACT_STORE_RECEIPT_ITEMS',
            confidenceThreshold: 0.92
          }
        }
      },
      {
        id: 'node_map_image_prompt',
        type: 'n8nNode',
        position: { x: 1400, y: 240 },
        data: {
          name: 'Map Image Context',
          subtitle: 'json serializer',
          category: 'code',
          iconName: 'Code',
          color: '#f59e0b',
          status: 'ready',
          parameters: {
            format: 'structured_invoice'
          }
        }
      },

      // Branch 4: Documents / Invoices
      {
        id: 'node_get_doc_url',
        type: 'n8nNode',
        position: { x: 620, y: 390 },
        data: {
          name: 'Get Document URL',
          subtitle: 'whatsapp media',
          category: 'action',
          iconName: 'Globe',
          color: '#22c55e',
          status: 'ready',
          parameters: {
            endpoint: '/v17.0/documents'
          }
        }
      },
      {
        id: 'node_download_doc',
        type: 'n8nNode',
        position: { x: 880, y: 390 },
        data: {
          name: 'Download Document',
          subtitle: 'stream parser',
          category: 'action',
          iconName: 'Download',
          color: '#6366f1',
          status: 'ready',
          parameters: {
            bufferSize: '64KB'
          }
        }
      },
      {
        id: 'node_route_doc_types',
        type: 'n8nRouter',
        position: { x: 1140, y: 380 },
        data: {
          name: 'Route Document Types',
          subtitle: 'router / switch',
          category: 'router',
          iconName: 'Sliders',
          color: '#38bdf8',
          status: 'ready',
          parameters: {
            expression: '{{ $json.fileExtension }}'
          },
          ports: [
            { id: 'port_pdf', label: 'PDF Invoice' },
            { id: 'port_xls', label: 'Excel Ledger' },
            { id: 'port_unsupported', label: 'Unsupported' }
          ]
        }
      },
      {
        id: 'node_extract_pdf',
        type: 'n8nNode',
        position: { x: 1420, y: 340 },
        data: {
          name: 'Extract from PDF',
          subtitle: 'pdf parser',
          category: 'action',
          iconName: 'FileText',
          color: '#ef4444',
          status: 'ready',
          parameters: {
            ocrFallback: true
          }
        }
      },
      {
        id: 'node_extract_xls',
        type: 'n8nNode',
        position: { x: 1420, y: 440 },
        data: {
          name: 'Extract from XLS/CSV',
          subtitle: 'spreadsheet parser',
          category: 'action',
          iconName: 'FileSpreadsheet',
          color: '#10b981',
          status: 'ready',
          parameters: {
            sheetIndex: 0
          }
        }
      },
      {
        id: 'node_map_doc_prompt',
        type: 'n8nNode',
        position: { x: 1680, y: 370 },
        data: {
          name: 'Map Document Prompt',
          subtitle: 'payload builder',
          category: 'code',
          iconName: 'Code',
          color: '#f59e0b',
          status: 'ready',
          parameters: {
            contextType: 'store_procurement_records'
          }
        }
      },

      // Core Agent Node: Knowledge Base Agent
      {
        id: 'node_knowledge_agent',
        type: 'n8nAgent',
        position: { x: 2000, y: 190 },
        data: {
          name: 'Arc Mate Knowledge Agent',
          subtitle: 'manager agent (gemini)',
          category: 'agent',
          iconName: 'Bot',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            systemPrompt: 'You are Arc Mate, the autonomous teammate for Indian merchants. Reason over incoming messages, verify margin caps, and draft responses.',
            maxIterations: 3,
            temperature: 0.2
          },
          subHandles: [
            { id: 'handle_model', label: 'Model' },
            { id: 'handle_memory', label: 'Memory' },
            { id: 'handle_vector', label: 'Database' }
          ]
        }
      },

      // Sub-Nodes attached beneath Knowledge Agent
      {
        id: 'sub_gemini_model',
        type: 'n8nSubNode',
        position: { x: 1880, y: 380 },
        data: {
          name: 'Gemini 3.1 Flash-Lite',
          subtitle: 'chat model',
          iconName: 'Cpu',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            temperature: 0.2,
            topP: 0.8
          }
        }
      },
      {
        id: 'sub_window_memory',
        type: 'n8nSubNode',
        position: { x: 2040, y: 380 },
        data: {
          name: 'Session Memory',
          subtitle: 'conversation buffer',
          iconName: 'Clock',
          color: '#f59e0b',
          status: 'ready',
          parameters: {
            k: 10,
            sessionKey: 'merchant_session'
          }
        }
      },
      {
        id: 'sub_supabase_vector',
        type: 'n8nSubNode',
        position: { x: 2200, y: 380 },
        data: {
          name: 'Supabase Vector DB',
          subtitle: 'store catalog & ledger',
          iconName: 'Database',
          color: '#10b981',
          status: 'ready',
          parameters: {
            dimension: 768,
            similarityMetric: 'cosine'
          }
        }
      },
      {
        id: 'sub_cognee_guard',
        type: 'n8nSubNode',
        position: { x: 2200, y: 490 },
        data: {
          name: 'Cognee 15% Margin Guard',
          subtitle: 'policy verification node',
          iconName: 'ShieldCheck',
          color: '#6e7448',
          status: 'ready',
          parameters: {
            policy: 'DISCOUNT_CEILING_MAX_15',
            enforceMerchantMargin: true
          }
        }
      },

      // Output 1: Send WhatsApp Response
      {
        id: 'node_send_response',
        type: 'n8nNode',
        position: { x: 2380, y: 130 },
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

      // Output 2: Soundbox 3.0 Audio Announce
      {
        id: 'node_soundbox_chime',
        type: 'n8nNode',
        position: { x: 2380, y: 260 },
        data: {
          name: 'Paytm Soundbox 3.0 Audio',
          subtitle: 'countertop speech feedback',
          category: 'action',
          iconName: 'Volume2',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            device: 'Soundbox 3.0 4G Dual SIM',
            voiceTemplate: 'Arc Mate: New customer order processed successfully.'
          }
        }
      }
    ],

    edges: [
      // Trigger -> Route Types
      {
        id: 'e_trig_router',
        source: 'node_trigger',
        target: 'node_router_types',
        type: 'bezier',
        animated: true,
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },

      // Route Types -> Branch 1 (Text)
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

      // Route Types -> Branch 2 (Audio)
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

      // Route Types -> Branch 3 (Image)
      {
        id: 'e_router_image',
        source: 'node_router_types',
        sourceHandle: 'port_image',
        target: 'node_get_image_url',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_img_download',
        source: 'node_get_image_url',
        target: 'node_download_image',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_img_analyze',
        source: 'node_download_image',
        target: 'node_analyze_image',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_img_prompt',
        source: 'node_analyze_image',
        target: 'node_map_image_prompt',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_img_agent',
        source: 'node_map_image_prompt',
        target: 'node_knowledge_agent',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },

      // Route Types -> Branch 4 (Document)
      {
        id: 'e_router_doc',
        source: 'node_router_types',
        sourceHandle: 'port_document',
        target: 'node_get_doc_url',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_doc_download',
        source: 'node_get_doc_url',
        target: 'node_download_doc',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_doc_router',
        source: 'node_download_doc',
        target: 'node_route_doc_types',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_route_pdf',
        source: 'node_route_doc_types',
        sourceHandle: 'port_pdf',
        target: 'node_extract_pdf',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_route_xls',
        source: 'node_route_doc_types',
        sourceHandle: 'port_xls',
        target: 'node_extract_xls',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_pdf_map',
        source: 'node_extract_pdf',
        target: 'node_map_doc_prompt',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_xls_map',
        source: 'node_extract_xls',
        target: 'node_map_doc_prompt',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'e_doc_agent',
        source: 'node_map_doc_prompt',
        target: 'node_knowledge_agent',
        type: 'bezier',
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },

      // Sub-node connections to Agent
      {
        id: 'e_sub_model',
        source: 'sub_gemini_model',
        target: 'node_knowledge_agent',
        targetHandle: 'handle_model',
        type: 'bezier',
        style: { stroke: '#ed6f5c', strokeDasharray: '4,4', strokeWidth: 1.5 }
      },
      {
        id: 'e_sub_memory',
        source: 'sub_window_memory',
        target: 'node_knowledge_agent',
        targetHandle: 'handle_memory',
        type: 'bezier',
        style: { stroke: '#f59e0b', strokeDasharray: '4,4', strokeWidth: 1.5 }
      },
      {
        id: 'e_sub_vector',
        source: 'sub_supabase_vector',
        target: 'node_knowledge_agent',
        targetHandle: 'handle_vector',
        type: 'bezier',
        style: { stroke: '#10b981', strokeDasharray: '4,4', strokeWidth: 1.5 }
      },
      {
        id: 'e_sub_guard',
        source: 'sub_cognee_guard',
        target: 'sub_supabase_vector',
        type: 'bezier',
        style: { stroke: '#6e7448', strokeDasharray: '4,4', strokeWidth: 1.5 }
      },

      // Outputs from Agent
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
  },

  // 2. 47 Inactive Evening Regulars Re-engagement
  {
    id: 'wf_reengagement_47',
    name: '47 Inactive Evening Regulars Re-engagement',
    description: 'Triggered when evening repeat customer footfall decline is detected. Filters 47 regulars dormant > 5 days, enforces Cognee 15% discount cap, dispatches WhatsApp vouchers, and notifies shopkeeper on Soundbox.',
    category: 'Retention & Margin Guard',
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

  // 3. Daily 10 PM Collections Settlement
  {
    id: 'wf_daily_settlement',
    name: 'Daily 10 PM Collections Settlement & Audit',
    description: 'Autonomous end-of-day reconciliation: triggers at 22:00 IST, aggregates UPI & Cash transactions, verifies bank settlement, produces digital ledger, and sounds audio summary.',
    category: 'Reconciliation & Audit',
    status: 'ACTIVE',
    nodes: [
      {
        id: 'note_settle',
        type: 'stickyNote',
        position: { x: -300, y: 100 },
        data: {
          title: 'Daily Auto-Settlement Engine',
          content: 'Triggers automatically at 22:00 IST every night. Aggregates all UPI and Cash transactions from Supabase, runs reconciliation against bank gateway, generates downloadable GST summary, and notifies the merchant.',
          badge: 'Scheduled Maintenance'
        }
      },
      {
        id: 'node_cron_10pm',
        type: 'n8nNode',
        position: { x: 80, y: 160 },
        data: {
          name: 'Cron Trigger (22:00 IST)',
          subtitle: 'daily scheduled event',
          category: 'trigger',
          iconName: 'Clock',
          color: '#f59e0b',
          status: 'ready',
          parameters: {
            cron: '0 22 * * *',
            timezone: 'Asia/Kolkata'
          }
        }
      },
      {
        id: 'node_aggregate_ledger',
        type: 'n8nNode',
        position: { x: 360, y: 160 },
        data: {
          name: 'Aggregate Day Ledger',
          subtitle: 'supabase transactions',
          category: 'action',
          iconName: 'Database',
          color: '#10b981',
          status: 'ready',
          parameters: {
            queries: ['UPI_SETTLEMENTS', 'CASH_ENTRIES', 'REFUNDS'],
            date: 'TODAY'
          }
        }
      },
      {
        id: 'node_generate_pdf',
        type: 'n8nNode',
        position: { x: 640, y: 160 },
        data: {
          name: 'Generate GST Ledger PDF',
          subtitle: 'pdf document compiler',
          category: 'action',
          iconName: 'FileText',
          color: '#ef4444',
          status: 'ready',
          parameters: {
            template: 'STANDARD_MERCHANT_GST_DAYBOOK',
            signDigitally: true
          }
        }
      },
      {
        id: 'node_send_merchant_report',
        type: 'n8nNode',
        position: { x: 920, y: 100 },
        data: {
          name: 'Send Merchant WhatsApp',
          subtitle: 'daily pdf dispatch',
          category: 'action',
          iconName: 'MessageSquare',
          color: '#22c55e',
          status: 'ready',
          parameters: {
            recipient: 'OWNER_REGISTERED_PHONE',
            attachDocument: true
          }
        }
      },
      {
        id: 'node_soundbox_settlement',
        type: 'n8nNode',
        position: { x: 920, y: 240 },
        data: {
          name: 'Soundbox Settlement Voice',
          subtitle: 'countertop speech chime',
          category: 'action',
          iconName: 'Volume2',
          color: '#ed6f5c',
          status: 'ready',
          parameters: {
            audioMessage: 'Aaj ka kul collection settlement complete ho gaya hai.'
          }
        }
      }
    ],
    edges: [
      {
        id: 'es1',
        source: 'node_cron_10pm',
        target: 'node_aggregate_ledger',
        type: 'bezier',
        animated: true,
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'es2',
        source: 'node_aggregate_ledger',
        target: 'node_generate_pdf',
        type: 'bezier',
        animated: true,
        style: { stroke: '#52525b', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
      },
      {
        id: 'es3',
        source: 'node_generate_pdf',
        target: 'node_send_merchant_report',
        type: 'bezier',
        style: { stroke: '#22c55e', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
      },
      {
        id: 'es4',
        source: 'node_generate_pdf',
        target: 'node_soundbox_settlement',
        type: 'bezier',
        style: { stroke: '#ed6f5c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
      }
    ]
  }
];
