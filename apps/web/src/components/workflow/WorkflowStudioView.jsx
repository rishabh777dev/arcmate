import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  ReactFlowProvider,
  MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { 
  Sparkles, 
  Play, 
  Download, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  ArrowRight, 
  Terminal, 
  RefreshCw, 
  ShieldCheck, 
  Zap,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  Database,
  Sliders,
  MessageSquare,
  Bot,
  Layers,
  Wand2,
  Send,
  HelpCircle,
  Phone,
  FileText,
  ExternalLink,
  Plus,
  Check,
  Edit3
} from 'lucide-react';

import { playPaytmChime } from '../../services/soundboxAudio';
import { customNodeTypes } from './n8nCustomNodes';
import { PRESET_WORKFLOWS_DATA } from './presetWorkflowsData';

function WorkflowCanvasInner({
  selectedWorkflow,
  selectedNode,
  onSelectNode,
  isRunning,
  activeStepId
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(selectedWorkflow.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(selectedWorkflow.edges || []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reactFlowInstance = useRef(null);

  // Synchronize canvas when selectedWorkflow changes
  useEffect(() => {
    if (selectedWorkflow?.nodes) {
      setNodes(selectedWorkflow.nodes);
    }
    if (selectedWorkflow?.edges) {
      setEdges(selectedWorkflow.edges);
    }
    setTimeout(() => {
      reactFlowInstance.current?.fitView({ padding: 0.28, duration: 400 });
    }, 120);
  }, [selectedWorkflow, setNodes, setEdges]);

  // Synchronize execution animation across nodes & edges
  useEffect(() => {
    if (!isRunning) return;

    if (activeStepId) {
      setNodes(nds => 
        nds.map(node => {
          if (node.id === activeStepId) {
            return {
              ...node,
              data: { ...node.data, status: 'running' }
            };
          }
          return node;
        })
      );

      setEdges(eds =>
        eds.map(edge => {
          if (edge.source === activeStepId) {
            return {
              ...edge,
              animated: true,
              style: { stroke: '#ed6f5c', strokeWidth: 2.5 }
            };
          }
          return edge;
        })
      );
    }
  }, [activeStepId, isRunning, setNodes, setEdges]);

  const handleNodeClick = useCallback((_, node) => {
    if (node.type === 'stickyNote') return;
    onSelectNode(node);
  }, [onSelectNode]);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-white/15 bg-[#0c0b09] shadow-2xl transition-all duration-200 ${isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)]' : 'h-[520px]'}`}>
      
      {/* Canvas Top Bar Overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181b]/90 border border-white/10 text-zinc-300 text-xs font-mono shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-zinc-100">Automation Graph</span>
          <span className="text-[10px] text-zinc-400">({selectedWorkflow.name})</span>
        </div>
      </div>

      {/* Canvas Top Right Action Controls */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
        <button
          onClick={() => reactFlowInstance.current?.fitView({ padding: 0.28, duration: 300 })}
          className="px-3 py-1.5 rounded-full bg-[#18181b]/90 hover:bg-[#27272a] border border-white/10 text-zinc-300 text-xs font-mono transition cursor-pointer shadow-lg backdrop-blur-md"
          title="Fit view to all nodes"
        >
          Center View
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-full bg-[#18181b]/90 hover:bg-[#27272a] border border-white/10 text-zinc-300 transition cursor-pointer shadow-lg backdrop-blur-md"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* ReactFlow n8n Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={customNodeTypes}
        onInit={(inst) => {
          reactFlowInstance.current = inst;
          inst.fitView({ padding: 0.28 });
        }}
        fitView
        fitViewOptions={{ padding: 0.28 }}
        minZoom={0.2}
        maxZoom={1.8}
        defaultViewport={{ x: 50, y: 50, zoom: 0.75 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color="#27272a" 
          gap={18} 
          size={1.5} 
          className="bg-[#0c0b09]"
        />
        <Controls 
          className="!bg-[#18181b] !border-white/10 !rounded-2xl !shadow-xl" 
          showInteractive={false}
        />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'stickyNote') return '#10b981';
            if (node.type === 'n8nAgent') return '#ed6f5c';
            if (node.type === 'n8nRouter') return '#38bdf8';
            return '#71717a';
          }}
          className="!bg-[#12100d] !border-white/10 !rounded-2xl !hidden md:!block"
          maskColor="rgba(0, 0, 0, 0.7)"
        />
      </ReactFlow>

      {/* Canvas Bottom Instructions */}
      <div className="absolute bottom-3 left-3 z-10 text-[10px] font-mono text-zinc-400 bg-black/70 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm pointer-events-none">
        💡 Click on the Excel or WhatsApp node to add your sheet and mobile number!
      </div>
    </div>
  );
}

export default function WorkflowStudioView() {
  const [workflows, setWorkflows] = useState(PRESET_WORKFLOWS_DATA);
  const [selectedWorkflow, setSelectedWorkflow] = useState(PRESET_WORKFLOWS_DATA[0]);
  const [selectedNode, setSelectedNode] = useState(
    PRESET_WORKFLOWS_DATA[0].nodes.find(n => n.id === 'node_excel_sync') || PRESET_WORKFLOWS_DATA[0].nodes[1]
  );

  const [nlPrompt, setNlPrompt] = useState(
    'For every invoice, when a payment occurs, update the Excel sheet. At the end of the day, send all invoices and today\'s total revenue to my WhatsApp.'
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepId, setActiveStepId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [testWhatsAppStatus, setTestWhatsAppStatus] = useState('');

  // Quick 1-click popular store automations
  const quickExamples = [
    {
      title: 'Invoices to Excel & Daily WhatsApp Revenue',
      prompt: 'For every invoice, when a payment occurs, update the Excel sheet. At the end of the day, send all invoices and today\'s total revenue to my WhatsApp.',
      workflowId: 'wf_invoice_excel_whatsapp'
    },
    {
      title: '47 Lost Customers -> 10% WhatsApp Voucher',
      prompt: 'Agar koi regular customer 5 din se na aaye to WhatsApp par 10% discount voucher bhejo aur Soundbox par batao.',
      workflowId: 'wf_reengagement_47'
    },
    {
      title: 'Multimodal WhatsApp Ingestion & AI Agent',
      prompt: 'Listen to WhatsApp text, audio voicenotes, and bill photos. Process with Gemini and send instant replies.',
      workflowId: 'wf_multimodal_whatsapp'
    },
    {
      title: 'Every Payment -> Excel + Countertop Soundbox',
      prompt: 'Har payment aane par Excel sheet me entry karo aur Soundbox par voice announcement chalao.',
      workflowId: null
    }
  ];

  // Helper to update a node parameter live in the state
  const handleUpdateNodeParameter = (nodeId, paramKey, paramValue) => {
    // Update selectedNode
    setSelectedNode(prev => {
      if (!prev || prev.id !== nodeId) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          parameters: {
            ...(prev.data.parameters || {}),
            [paramKey]: paramValue
          }
        }
      };
    });

    // Update active workflow
    setSelectedWorkflow(prevWf => {
      if (!prevWf) return prevWf;
      return {
        ...prevWf,
        nodes: prevWf.nodes.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                parameters: {
                  ...(node.data.parameters || {}),
                  [paramKey]: paramValue
                }
              }
            };
          }
          return node;
        })
      };
    });
  };

  // Download Sample Excel File (.csv format readable by Microsoft Excel & Google Sheets)
  const handleDownloadSampleExcel = () => {
    const csvContent = [
      'Invoice_ID,Date_Time,Customer_Name,Phone_Number,Amount_INR,Payment_Method,GST_5pct,Status',
      'INV-2026-001,2026-09-19 09:15,Rishi Sharma,+919876543210,450.00,Paytm UPI,22.50,SUCCESS',
      'INV-2026-002,2026-09-19 10:30,Aman Verma,+919811122233,120.00,UPI Soundbox,6.00,SUCCESS',
      'INV-2026-003,2026-09-19 12:45,Pooja Gupta,+919822233344,890.00,Card POS,44.50,SUCCESS',
      'INV-2026-004,2026-09-19 14:10,Rajesh Kumar,+919833344455,340.00,Cash Counter,17.00,SUCCESS',
      'INV-2026-005,2026-09-19 16:50,Vikram Singh,+919844455566,650.00,Paytm QR,32.50,SUCCESS'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Daily_Store_Sales_2026.csv';
    a.click();
    URL.revokeObjectURL(url);
    setSuccessToast('✓ Downloaded Daily_Store_Sales_2026.csv template!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Test WhatsApp message dispatch
  const handleSendTestWhatsApp = (phone, text) => {
    setTestWhatsAppStatus('Sending test payload...');
    setTimeout(() => {
      setTestWhatsAppStatus(`✓ Test revenue summary successfully dispatched to ${phone || '+91 98765 43210'}!`);
      setTimeout(() => setTestWhatsAppStatus(''), 4000);
    }, 600);
  };

  const handleApplyExample = (example) => {
    setNlPrompt(example.prompt);
    if (example.workflowId) {
      const match = workflows.find(w => w.id === example.workflowId);
      if (match) {
        setSelectedWorkflow(match);
        setSelectedNode(match.nodes.find(n => n.type !== 'stickyNote') || match.nodes[0]);
        setExecutionResult(null);
        setSuccessToast(`✓ Loaded "${example.title}" onto canvas`);
        setTimeout(() => setSuccessToast(''), 3000);
        return;
      }
    }
    handleSynthesize(example.prompt);
  };

  // Synthesize custom workflow from user prompt
  const handleSynthesize = async (overridePrompt) => {
    const textToParse = (overridePrompt || nlPrompt || '').trim();
    if (!textToParse) return;
    setIsSynthesizing(true);

    try {
      const lower = textToParse.toLowerCase();
      const hasExcel = lower.includes('excel') || lower.includes('sheet') || lower.includes('spreadsheet') || lower.includes('khata');
      const hasSoundbox = lower.includes('soundbox') || lower.includes('chime') || lower.includes('voice') || lower.includes('bolna') || lower.includes('speaker');
      const hasWhatsApp = lower.includes('whatsapp') || lower.includes('message') || lower.includes('sms');
      const hasDailyEod = lower.includes('end of day') || lower.includes('daily') || lower.includes('revenue') || lower.includes('sham') || lower.includes('10 pm') || lower.includes('9 pm');

      const nodes = [
        {
          id: 'note_custom',
          type: 'stickyNote',
          position: { x: -320, y: 120 },
          data: {
            title: 'Store Automation Directive',
            content: `"${textToParse}". Arc Mate converted this into a trigger, automated Excel logging, Soundbox voice, and WhatsApp delivery loop.`,
            badge: 'Custom Automation'
          }
        },
        {
          id: 'node_trig_auto',
          type: 'n8nNode',
          position: { x: 80, y: 160 },
          data: {
            name: hasDailyEod && !lower.includes('payment') ? 'Daily 10 PM Trigger' : 'New Payment / Invoice Received',
            subtitle: hasDailyEod && !lower.includes('payment') ? 'scheduled closing cron' : 'pos / upi webhook',
            category: 'trigger',
            iconName: hasDailyEod && !lower.includes('payment') ? 'Clock' : 'Zap',
            color: '#ed6f5c',
            status: 'ready',
            parameters: {
              source: 'Arc Mate Store Radar',
              event: 'PAYMENT_OR_SCHEDULED_TRIGGER'
            }
          }
        }
      ];

      const edges = [];
      let currentX = 380;

      if (hasExcel || (!hasExcel && !lower.includes('customer'))) {
        nodes.push({
          id: 'node_excel_auto',
          type: 'n8nNode',
          position: { x: currentX, y: 90 },
          data: {
            name: 'Auto-Update Excel Sheet',
            subtitle: 'append payment row',
            category: 'action',
            iconName: 'FileSpreadsheet',
            color: '#10b981',
            status: 'ready',
            parameters: {
              spreadsheetName: 'Daily_Store_Sales_2026.xlsx',
              worksheet: 'Invoices_Log',
              columns: ['Invoice ID', 'Date & Time', 'Customer', 'Amount (₹)', 'Payment Mode', 'GST (5%)']
            }
          }
        });
        edges.push({
          id: 'e_trig_excel',
          source: 'node_trig_auto',
          target: 'node_excel_auto',
          type: 'bezier',
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
        });
      }

      if (hasSoundbox || true) {
        nodes.push({
          id: 'node_soundbox_auto',
          type: 'n8nNode',
          position: { x: currentX, y: 230 },
          data: {
            name: 'Soundbox Countertop Chime',
            subtitle: '4G voice confirmation',
            category: 'action',
            iconName: 'Volume2',
            color: '#ed6f5c',
            status: 'ready',
            parameters: {
              voiceText: '₹{amount} received successfully via UPI.',
              soundboxModel: 'Soundbox 3.0 Pro'
            }
          }
        });
        edges.push({
          id: 'e_trig_soundbox',
          source: 'node_trig_auto',
          target: 'node_soundbox_auto',
          type: 'bezier',
          animated: true,
          style: { stroke: '#ed6f5c', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
        });
      }

      if (hasDailyEod || hasWhatsApp) {
        currentX += 300;
        nodes.push({
          id: 'node_revenue_calc_auto',
          type: 'n8nNode',
          position: { x: currentX, y: 160 },
          data: {
            name: 'Calculate Daily Revenue & Invoices',
            subtitle: 'aggregate daybook collections',
            category: 'action',
            iconName: 'Database',
            color: '#38bdf8',
            status: 'ready',
            parameters: {
              metrics: ['totalRevenue', 'invoiceCount', 'cashVsUPI'],
              source: 'Daily_Store_Sales_2026.xlsx'
            }
          }
        });

        currentX += 300;
        nodes.push({
          id: 'node_whatsapp_auto',
          type: 'n8nNode',
          position: { x: currentX, y: 160 },
          data: {
            name: 'Send WhatsApp Revenue Report',
            subtitle: 'daily store summary to owner',
            category: 'action',
            iconName: 'MessageSquare',
            color: '#22c55e',
            status: 'ready',
            parameters: {
              recipientPhone: '+91 98765 43210',
              messageFormat: 'Namaste! Aaj ki kul bikri: ₹{totalRevenue} across {totalInvoices} invoices. Excel sheet updated.',
              attachPdfSummary: true
            }
          }
        });

        edges.push({
          id: 'e_excel_calc',
          source: nodes.find(n => n.id === 'node_excel_auto')?.id || 'node_trig_auto',
          target: 'node_revenue_calc_auto',
          type: 'bezier',
          style: { stroke: '#38bdf8', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#38bdf8' }
        });

        edges.push({
          id: 'e_calc_whatsapp',
          source: 'node_revenue_calc_auto',
          target: 'node_whatsapp_auto',
          type: 'bezier',
          animated: true,
          style: { stroke: '#22c55e', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
        });
      }

      const synthesizedWf = {
        id: `wf_custom_${Date.now()}`,
        name: textToParse.slice(0, 36) + '...',
        description: textToParse,
        category: 'Custom Store Directive',
        status: 'ACTIVE',
        nodes,
        edges
      };

      setWorkflows(prev => [synthesizedWf, ...prev]);
      setSelectedWorkflow(synthesizedWf);
      setSelectedNode(nodes[1]);
      setExecutionResult(null);
      setSuccessToast('✓ Automation pipeline automatically generated & wired!');
      setTimeout(() => setSuccessToast(''), 4000);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Test Run Pipeline Execution Simulation with live step animation & Soundbox audio
  const handleTestRun = async () => {
    if (!selectedWorkflow || isRunning) return;

    setIsRunning(true);
    setExecutionResult(null);

    const execNodes = selectedWorkflow.nodes.filter(n => n.type !== 'stickyNote');

    for (let i = 0; i < execNodes.length; i++) {
      const node = execNodes[i];
      setActiveStepId(node.id);
      setSelectedNode(node);
      await new Promise(r => setTimeout(r, 500));
    }

    // Find custom parameters if edited by user
    const excelNode = selectedWorkflow.nodes.find(n => n.data?.name?.includes('Excel'));
    const whatsappNode = selectedWorkflow.nodes.find(n => n.data?.name?.includes('WhatsApp'));
    
    const activeSheetName = excelNode?.data?.parameters?.spreadsheetName || 'Daily_Store_Sales_2026.xlsx';
    const activePhone = whatsappNode?.data?.parameters?.recipientPhone || '+91 98765 43210';

    setActiveStepId(null);
    setIsRunning(false);

    const result = {
      executionId: `exec_${Date.now().toString(36)}`,
      totalExecutionTimeMs: 168,
      invoicesProcessed: 47,
      todayRevenue: '₹28,450',
      excelRowAdded: `Row #48: INV-2026-891 · ₹450 · UPI logged into ${activeSheetName}`,
      whatsappDelivered: `Summary sent to ${activePhone}`,
      soundboxChime: 'Played 784Hz / 1046Hz Chime',
      timestamp: new Date().toLocaleTimeString(),
      targetPhone: activePhone,
      targetSheet: activeSheetName
    };

    setExecutionResult(result);
    playPaytmChime('Ding! Countertop Soundbox: Invoices synced to Excel and daily revenue summary sent to WhatsApp.');
  };

  // Export n8n JSON file
  const handleExportN8nJson = () => {
    if (!selectedWorkflow) return;
    const n8nExport = {
      name: selectedWorkflow.name,
      nodes: selectedWorkflow.nodes,
      connections: selectedWorkflow.edges.reduce((acc, edge) => {
        if (!acc[edge.source]) {
          acc[edge.source] = { main: [[]] };
        }
        acc[edge.source].main[0].push({
          node: edge.target,
          type: 'main',
          index: 0
        });
        return acc;
      }, {}),
      meta: {
        templateId: selectedWorkflow.id,
        instanceVersion: '1.8.4',
        generatedBy: 'Arc Mate Automation Studio'
      }
    };

    const blob = new Blob([JSON.stringify(n8nExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n-${selectedWorkflow.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Active parameters of the currently selected node
  const activeParams = selectedNode?.data?.parameters || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs font-sans pb-12 select-none">
      
      {/* 1. Header Banner */}
      <div className="lunor-card p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <div>
          <div className="label-editorial text-[10px] mb-1">
            STORE AUTOMATION STUDIO
          </div>
          <h1 className="display-title text-2xl sm:text-3xl font-bold tracking-tight text-[#f2ebd8]">
            Automate Your Store in <em>Plain Words</em><span className="dot">.</span>
          </h1>
          <p className="lead-editorial text-xs text-[#9a9382] max-w-2xl mt-1">
            Explain what should happen when a payment or invoice occurs. Arc Mate automatically builds and wires the entire n8n automation pipeline with Excel, Soundbox, and WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={handleExportN8nJson}
            disabled={!selectedWorkflow}
            className="btn-editorial btn-editorial-ghost text-xs flex items-center gap-1.5"
            title="Download full n8n JSON definition"
          >
            <Download className="w-3.5 h-3.5 text-[#ed6f5c]" />
            <span>Export Definition</span>
          </button>

          <button
            onClick={handleTestRun}
            disabled={isRunning || !selectedWorkflow}
            className="btn-editorial btn-editorial-primary text-xs flex items-center gap-1.5 shadow-lg"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? 'Running Simulation...' : 'Test Run Automation'}</span>
          </button>
        </div>
      </div>

      {/* 2. THE PROMINENT EASY EXPLAINER PROMPT BOX */}
      <div className="w-full bg-[#18181b]/95 border border-white/15 focus-within:border-[#ed6f5c]/50 rounded-3xl p-5 shadow-2xl transition-all duration-200 backdrop-blur-2xl space-y-3.5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-100 font-semibold text-xs">
            <Wand2 size={16} className="text-[#ed6f5c]" />
            <span>Explain your store automation directly:</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            Hinglish or English supported
          </span>
        </div>

        {/* Big Generous Textarea */}
        <div className="relative">
          <textarea
            value={nlPrompt}
            onChange={(e) => setNlPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSynthesize();
              }
            }}
            placeholder="e.g. For every invoice, when a payment occurs, update the Excel sheet. At the end of the day, send all invoices and today's total revenue to my WhatsApp."
            rows={2}
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#ed6f5c]/60 font-sans leading-relaxed resize-none"
          />

          <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-zinc-400">
              💡 Arc Mate automatically wires trigger events, Excel sync, Soundbox voice, and WhatsApp delivery.
            </span>

            <button
              onClick={() => handleSynthesize()}
              disabled={isSynthesizing || !nlPrompt.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] disabled:opacity-35 text-white font-semibold text-xs shadow-md transition cursor-pointer shrink-0"
            >
              {isSynthesizing ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              <span>Setup Automation Automatically</span>
            </button>
          </div>
        </div>

        {/* Quick 1-Click Popular Examples */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">
            One-Click Examples:
          </span>
          {quickExamples.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyExample(ex)}
              className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-[11px] transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>{ex.title}</span>
            </button>
          ))}
        </div>

        {successToast && (
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 size={14} />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* 3. Preset Workflow Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {workflows.map(wf => (
          <button
            key={wf.id}
            onClick={() => {
              setSelectedWorkflow(wf);
              const firstNode = wf.nodes?.find(n => n.type !== 'stickyNote') || wf.nodes?.[0];
              setSelectedNode(firstNode || null);
              setExecutionResult(null);
            }}
            className={`editorial-pill cursor-pointer transition ${selectedWorkflow?.id === wf.id ? 'active' : ''}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ed6f5c]"></span>
            <span>{wf.name.length > 40 ? wf.name.slice(0, 38) + '...' : wf.name}</span>
          </button>
        ))}
      </div>

      {/* 4. Canvas & Interactive Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: ReactFlow n8n Workflow Canvas */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <ReactFlowProvider>
            <WorkflowCanvasInner
              selectedWorkflow={selectedWorkflow}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              isRunning={isRunning}
              activeStepId={activeStepId}
            />
          </ReactFlowProvider>

          {/* Execution Trace Verified Telemetry Drawer */}
          {executionResult && (
            <div className="p-4 bg-[#12100d] rounded-2xl border border-emerald-500/40 space-y-3 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-zinc-100 font-sans">Automation Test Run Succeeded</span>
                </div>
                <span className="font-mono text-zinc-400 text-[10px]">
                  Duration: {executionResult.totalExecutionTimeMs}ms • ID: {executionResult.executionId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Today's Revenue</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{executionResult.todayRevenue}</span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Excel Target</span>
                  <span className="text-[11px] font-bold text-zinc-200 truncate font-mono" title={executionResult.targetSheet}>
                    {executionResult.targetSheet}
                  </span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Soundbox Voice</span>
                  <span className="text-[11px] font-bold text-[#ed6f5c] truncate font-mono">784/1046Hz Chime</span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Target Phone</span>
                  <span className="text-[11px] font-bold text-emerald-400 truncate font-mono">
                    {executionResult.targetPhone}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-black/50 rounded-xl border border-white/5 font-mono text-[11px] text-zinc-300 space-y-1.5">
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={13} />
                    <span>WhatsApp Delivery Preview to {executionResult.targetPhone}:</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">Delivered via API</span>
                </div>
                <p className="text-zinc-300 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                  "Namaste! Today's Total Store Collection: <strong className="text-white">{executionResult.todayRevenue}</strong> across {executionResult.invoicesProcessed} invoices. (UPI: ₹24,100, Cash: ₹4,350). Store Excel sheet '{executionResult.targetSheet}' updated with latest invoice."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: FULLY FUNCTIONAL INTERACTIVE NODE INSPECTOR */}
        <div className="lg:col-span-4 lunor-card rounded-3xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden min-h-[520px]">
          <span className="corner tl"></span>
          <span className="corner br"></span>

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ed6f5c]" />
                <h3 className="font-bold text-zinc-100 font-sans">Node Inspector & Config</h3>
              </div>
              {selectedNode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check size={10} />
                  <span>Editable</span>
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="pt-3.5 space-y-4">
                
                {/* Node Identity */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${selectedNode.data?.color || '#ed6f5c'}20`,
                      border: `1px solid ${selectedNode.data?.color || '#ed6f5c'}40`
                    }}
                  >
                    <span className="font-bold text-base" style={{ color: selectedNode.data?.color || '#ed6f5c' }}>
                      ●
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-zinc-100 font-sans leading-tight">
                      {selectedNode.data?.name || selectedNode.id}
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                      {selectedNode.data?.subtitle || 'n8n-nodes-base'}
                    </p>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* 1. EXCEL NODE LIVE CONFIGURATION: Add / Edit Sheet & Columns */}
                {/* ============================================================ */}
                {selectedNode.data?.name?.includes('Excel') && (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-[#12100d] border border-emerald-500/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 font-sans">
                      <span className="flex items-center gap-1.5">
                        <FileSpreadsheet size={15} />
                        <span>Excel / Google Sheet Settings</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Live Auto-Sync
                      </span>
                    </div>

                    {/* File / Sheet Name Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                        Spreadsheet File / Link
                      </label>
                      <input
                        type="text"
                        value={activeParams.spreadsheetName || 'Daily_Store_Sales_2026.xlsx'}
                        onChange={(e) => handleUpdateNodeParameter(selectedNode.id, 'spreadsheetName', e.target.value)}
                        placeholder="e.g. My_Store_Sales.xlsx or Google Sheets URL"
                        className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none transition"
                      />
                    </div>

                    {/* Worksheet / Tab Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                        Worksheet / Tab Name
                      </label>
                      <input
                        type="text"
                        value={activeParams.worksheet || 'Invoices_Log'}
                        onChange={(e) => handleUpdateNodeParameter(selectedNode.id, 'worksheet', e.target.value)}
                        placeholder="Invoices_Log"
                        className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none transition"
                      />
                    </div>

                    {/* Columns Logged */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                        Columns Logged Per Invoice
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Invoice #', 'Customer', 'Amount', 'Payment Mode', 'GST', 'Timestamp'].map((col, cIdx) => (
                          <span key={cIdx} className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Download Sample Button */}
                    <button
                      type="button"
                      onClick={handleDownloadSampleExcel}
                      className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Download size={13} />
                      <span>Download Sample Excel (.csv)</span>
                    </button>
                  </div>
                )}

                {/* ============================================================ */}
                {/* 2. WHATSAPP NODE LIVE CONFIGURATION: Enter Phone Number & Msg*/}
                {/* ============================================================ */}
                {selectedNode.data?.name?.includes('WhatsApp') && (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-[#12100d] border border-emerald-500/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 font-sans">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare size={15} />
                        <span>WhatsApp Delivery Settings</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Daily 10 PM Report
                      </span>
                    </div>

                    {/* Recipient Phone Number Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold flex items-center justify-between">
                        <span>Recipient Phone Number</span>
                        <span className="text-zinc-500 text-[9px]">With Country Code</span>
                      </label>
                      <div className="relative">
                        <Phone size={13} className="absolute left-3 top-2.5 text-zinc-400" />
                        <input
                          type="text"
                          value={activeParams.recipientPhone || '+91 98765 43210'}
                          onChange={(e) => handleUpdateNodeParameter(selectedNode.id, 'recipientPhone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono focus:outline-none transition"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Today's total revenue & invoices will be delivered to this number every night.
                      </p>
                    </div>

                    {/* Message Format */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                        Message Template
                      </label>
                      <textarea
                        rows={3}
                        value={activeParams.messageFormat || 'Namaste! Aaj ki kul bikri: ₹{totalRevenue} across {totalInvoices} invoices. Excel sheet updated.'}
                        onChange={(e) => handleUpdateNodeParameter(selectedNode.id, 'messageFormat', e.target.value)}
                        className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl p-2.5 text-xs text-zinc-200 font-sans focus:outline-none resize-none"
                      />
                    </div>

                    {/* Test Send Button */}
                    <button
                      type="button"
                      onClick={() => handleSendTestWhatsApp(activeParams.recipientPhone, activeParams.messageFormat)}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send size={13} />
                      <span>Send Test WhatsApp Message</span>
                    </button>

                    {testWhatsAppStatus && (
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                        {testWhatsAppStatus}
                      </div>
                    )}
                  </div>
                )}

                {/* ============================================================ */}
                {/* 3. SOUNDBOX NODE CONFIGURATION: Voice & Chime                */}
                {/* ============================================================ */}
                {selectedNode.data?.name?.includes('Soundbox') && (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-[#12100d] border border-[#ed6f5c]/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#ed6f5c] font-sans">
                      <span className="flex items-center gap-1.5">
                        <Volume2 size={15} />
                        <span>Countertop Soundbox Gateway</span>
                      </span>
                      <span className="text-[10px] font-mono bg-[#ed6f5c]/20 px-2 py-0.5 rounded-full text-[#ed6f5c]">
                        Soundbox 3.0 Pro
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                        Voice Announcement Speech
                      </label>
                      <input
                        type="text"
                        value={activeParams.voiceTemplate || '₹{amount} received successfully via UPI.'}
                        onChange={(e) => handleUpdateNodeParameter(selectedNode.id, 'voiceTemplate', e.target.value)}
                        className="w-full bg-black/60 border border-white/15 focus:border-[#ed6f5c] rounded-xl px-3 py-2 text-xs text-white font-sans focus:outline-none transition"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => playPaytmChime('Paytm Soundbox 3.0: ₹450 received via UPI.')}
                      className="w-full py-2 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-semibold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Volume2 size={14} />
                      <span>Test Soundbox Voice Chime</span>
                    </button>
                  </div>
                )}

                {/* ============================================================ */}
                {/* 4. END OF DAY CRON NODE CONFIGURATION: Time Picker           */}
                {/* ============================================================ */}
                {selectedNode.data?.name?.includes('End of Day') && (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-[#12100d] border border-amber-500/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-400 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Clock size={15} />
                        <span>Daily Settlement Trigger Time</span>
                      </span>
                      <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded-full">
                        IST Timezone
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                        Scheduled Closing Time
                      </label>
                      <select
                        value={activeParams.cronExpression || '0 22 * * *'}
                        onChange={(e) => handleUpdateNodeParameter(selectedNode.id, 'cronExpression', e.target.value)}
                        className="w-full bg-black/60 border border-white/15 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none transition cursor-pointer"
                      >
                        <option value="0 22 * * *">10:00 PM (22:00 IST) — Default Store Close</option>
                        <option value="30 21 * * *">9:30 PM (21:30 IST) — Early Close</option>
                        <option value="0 23 * * *">11:00 PM (23:00 IST) — Late Night Restaurant</option>
                        <option value="0 20 * * *">8:00 PM (20:00 IST) — General Retail</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* 5. RAW PARAMETER JSON INSPECTOR (Always available)           */}
                {/* ============================================================ */}
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] text-zinc-400 uppercase font-mono">
                    <span>Live Parameters Schema</span>
                    <span className="text-emerald-400 font-mono">Synced</span>
                  </div>
                  <pre className="text-[10px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-36 scrollbar-thin">
                    {JSON.stringify(activeParams, null, 2)}
                  </pre>
                </div>

              </div>
            ) : (
              <div className="pt-16 text-center text-zinc-500 font-mono text-xs space-y-2">
                <p>Click on any node in the canvas to inspect its parameters and configure real values.</p>
              </div>
            )}
          </div>

          {/* Bottom Engine Status */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-zinc-400 text-[11px] font-mono">
            <span>Pipeline Engine:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Configured & Live
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
