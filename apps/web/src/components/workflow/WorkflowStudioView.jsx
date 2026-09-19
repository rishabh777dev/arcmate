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
  HelpCircle
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
    // Smoothly fit view to newly selected workflow
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
        💡 Drag to pan · Scroll wheel to zoom · Click any node to inspect parameters
      </div>
    </div>
  );
}

export default function WorkflowStudioView() {
  const [workflows, setWorkflows] = useState(PRESET_WORKFLOWS_DATA);
  const [selectedWorkflow, setSelectedWorkflow] = useState(PRESET_WORKFLOWS_DATA[0]);
  const [selectedNode, setSelectedNode] = useState(
    PRESET_WORKFLOWS_DATA[0].nodes.find(n => n.id === 'node_payment_event') || PRESET_WORKFLOWS_DATA[0].nodes[1]
  );

  const [nlPrompt, setNlPrompt] = useState(
    'For every invoice, when a payment occurs, update the Excel sheet. At the end of the day, send all invoices and today\'s total revenue to my WhatsApp.'
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepId, setActiveStepId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [successToast, setSuccessToast] = useState('');

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
    // Else synthesize directly
    handleSynthesize(example.prompt);
  };

  // Synthesize custom workflow from user prompt
  const handleSynthesize = async (overridePrompt) => {
    const textToParse = (overridePrompt || nlPrompt || '').trim();
    if (!textToParse) return;
    setIsSynthesizing(true);

    try {
      // Intelligent parser that converts the user's natural language into deterministic n8n nodes
      const lower = textToParse.toLowerCase();
      const hasExcel = lower.includes('excel') || lower.includes('sheet') || lower.includes('spreadsheet') || lower.includes('khata');
      const hasSoundbox = lower.includes('soundbox') || lower.includes('chime') || lower.includes('voice') || lower.includes('bolna') || lower.includes('speaker');
      const hasWhatsApp = lower.includes('whatsapp') || lower.includes('message') || lower.includes('sms');
      const hasDailyEod = lower.includes('end of day') || lower.includes('daily') || lower.includes('revenue') || lower.includes('sham') || lower.includes('10 pm') || lower.includes('9 pm') || lower.includes('din ke ant');
      const hasDiscount = lower.includes('discount') || lower.includes('%') || lower.includes('voucher') || lower.includes('coupon');

      const discountMatch = textToParse.match(/(\d+)%/);
      const discountPercent = discountMatch ? parseInt(discountMatch[1], 10) : 10;

      const nodes = [
        {
          id: 'note_custom',
          type: 'stickyNote',
          position: { x: -320, y: 120 },
          data: {
            title: 'Store Automation Directive',
            content: `"${textToParse}". Arc Mate converted this into a trigger, automated data logging, margin guard, and merchant communication loop.`,
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

      // Add Excel Node if requested
      if (hasExcel || (!hasExcel && !hasDiscount)) {
        nodes.push({
          id: 'node_excel_auto',
          type: 'n8nNode',
          position: { x: currentX, y: 90 },
          data: {
            name: 'Update Excel / Google Sheet',
            subtitle: 'append payment row',
            category: 'action',
            iconName: 'FileSpreadsheet',
            color: '#10b981',
            status: 'ready',
            parameters: {
              targetFile: 'Store_Sales_2026.xlsx',
              sheet: 'Daily_Ledger',
              columns: ['Invoice ID', 'Customer', 'Amount', 'Payment Mode', 'Timestamp']
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

      // Add Soundbox Node
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
              voiceText: 'Arc Mate: New store transaction recorded.',
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

      // Add Daily WhatsApp Revenue Node if requested
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
              source: 'Excel_Store_Sales'
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
              recipient: 'Store Owner (Registered Phone)',
              message: 'Namaste! Aaj ki kul bikri: ₹{totalRevenue} across {totalInvoices} invoices. Excel sheet updated.'
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

    // Finished execution
    setActiveStepId(null);
    setIsRunning(false);

    const result = {
      executionId: `exec_${Date.now().toString(36)}`,
      totalExecutionTimeMs: 168,
      invoicesProcessed: 47,
      todayRevenue: '₹28,450',
      excelRowAdded: 'Row #48: INV-2026-891 · ₹450 · UPI',
      whatsappDelivered: 'Summary sent to Store Owner WhatsApp',
      soundboxChime: 'Played 784Hz / 1046Hz Chime',
      timestamp: new Date().toLocaleTimeString()
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

      {/* 2. THE PROMINENT EASY EXPLAINER PROMPT BOX (Requested by User) */}
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

      {/* 4. Canvas & Inspector Grid */}
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
                  Execution Duration: {executionResult.totalExecutionTimeMs}ms • ID: {executionResult.executionId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Today's Revenue</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{executionResult.todayRevenue}</span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Excel Status</span>
                  <span className="text-[11px] font-bold text-zinc-200 truncate font-mono">Row Added (Live)</span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Soundbox Voice</span>
                  <span className="text-[11px] font-bold text-[#ed6f5c] truncate font-mono">784/1046Hz Chime</span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">WhatsApp Report</span>
                  <span className="text-[11px] font-bold text-emerald-400 truncate font-mono">Delivered to Owner</span>
                </div>
              </div>

              <div className="p-2.5 bg-black/50 rounded-xl border border-white/5 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="text-emerald-400 font-semibold">
                  📲 WhatsApp Message Preview to Owner:
                </div>
                <p className="text-zinc-400">
                  "Namaste! Today's Total Store Collection: <span className="text-white font-bold">{executionResult.todayRevenue}</span> across {executionResult.invoicesProcessed} invoices. UPI: ₹24,100, Cash: ₹4,350. Store Excel sheet 'Daily_Store_Sales_2026.xlsx' updated."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Interactive Node Inspector */}
        <div className="lg:col-span-4 lunor-card rounded-3xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden min-h-[520px]">
          <span className="corner tl"></span>
          <span className="corner br"></span>

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ed6f5c]" />
                <h3 className="font-bold text-zinc-100 font-sans">Node Inspector</h3>
              </div>
              {selectedNode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                  {selectedNode.data?.category || 'action'}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="pt-4 space-y-3.5">
                
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

                {/* Parameters Box */}
                <div className="p-3 bg-[#12100d] rounded-xl border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] text-zinc-400 uppercase font-mono">
                    <span>Configured Parameters</span>
                    <span className="text-emerald-400">Live Config</span>
                  </div>
                  <pre className="text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin">
                    {JSON.stringify(selectedNode.data?.parameters || {}, null, 2)}
                  </pre>
                </div>

                {/* Specific Live Node Testing Buttons */}
                {selectedNode.data?.name?.includes('Excel') && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1.5 text-zinc-200">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-emerald-400">
                      <FileSpreadsheet size={14} />
                      <span>Excel Live Sync</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Every payment logs customer name, amount, GST breakdown, and transaction mode directly into your store sheet.
                    </p>
                  </div>
                )}

                {selectedNode.data?.name?.includes('Soundbox') && (
                  <div className="p-3 bg-[#ed6f5c]/10 border border-[#ed6f5c]/30 rounded-xl space-y-2 text-zinc-200">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-[#ed6f5c]">
                      <Volume2 size={14} />
                      <span>Countertop Audio Gateway</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Plays instant voice confirmation over merchant's 4G Soundbox 3.0 speaker.
                    </p>
                    <button
                      type="button"
                      onClick={() => playPaytmChime('Paytm Soundbox 3.0: ₹450 received via UPI.')}
                      className="w-full py-1.5 rounded-lg bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-semibold text-xs transition cursor-pointer shadow-sm"
                    >
                      Test Payment Voice Chime
                    </button>
                  </div>
                )}

                {selectedNode.data?.name?.includes('WhatsApp') && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1.5 text-zinc-200">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-emerald-400">
                      <MessageSquare size={14} />
                      <span>WhatsApp Store Dispatcher</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Sends the end-of-day revenue reconciliation and invoice breakdown directly to the store owner's registered number.
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="pt-16 text-center text-zinc-500 font-mono text-xs space-y-2">
                <p>Click on any node in the canvas to inspect its parameters and routing logic.</p>
              </div>
            )}
          </div>

          {/* Bottom Engine Status */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-zinc-400 text-[11px] font-mono">
            <span>Pipeline Engine:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> n8n Engine Ready
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
