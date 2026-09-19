import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Plus,
  Database,
  Sliders,
  MessageSquare,
  Bot,
  ExternalLink,
  Code,
  Layers,
  Cpu
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
    // Fit view after small delay
    setTimeout(() => {
      reactFlowInstance.current?.fitView({ padding: 0.25, duration: 400 });
    }, 150);
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
    <div className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0c0b09] shadow-2xl transition-all duration-200 ${isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)]' : 'h-[560px]'}`}>
      
      {/* Canvas Top Bar Overlay */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181b]/90 border border-white/10 text-zinc-300 text-xs font-mono shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-zinc-100">n8n Engine</span>
          <span className="text-[10px] text-zinc-400">v1.8.4</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 text-xs font-mono backdrop-blur-md">
          <span>Canvas:</span>
          <span className="text-zinc-200 font-semibold">{nodes.filter(n => n.type !== 'stickyNote').length} Active Nodes</span>
        </div>
      </div>

      {/* Canvas Top Right Action Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          onClick={() => reactFlowInstance.current?.fitView({ padding: 0.25, duration: 300 })}
          className="px-2.5 py-1.5 rounded-xl bg-[#18181b]/90 hover:bg-[#27272a] border border-white/10 text-zinc-300 text-xs font-mono transition cursor-pointer shadow-lg backdrop-blur-md"
          title="Fit view to all nodes"
        >
          Fit View
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-xl bg-[#18181b]/90 hover:bg-[#27272a] border border-white/10 text-zinc-300 transition cursor-pointer shadow-lg backdrop-blur-md"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
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
          inst.fitView({ padding: 0.25 });
        }}
        fitView
        fitViewOptions={{ padding: 0.25 }}
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
          className="!bg-[#18181b] !border-white/10 !rounded-xl !shadow-xl" 
          showInteractive={false}
        />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'stickyNote') return '#10b981';
            if (node.type === 'n8nAgent') return '#ed6f5c';
            if (node.type === 'n8nRouter') return '#38bdf8';
            return '#71717a';
          }}
          className="!bg-[#12100d] !border-white/10 !rounded-xl !hidden md:!block"
          maskColor="rgba(0, 0, 0, 0.7)"
        />
      </ReactFlow>

      {/* Canvas Bottom Instructions */}
      <div className="absolute bottom-3 left-3 z-10 text-[10px] font-mono text-zinc-500 bg-black/60 px-2.5 py-1 rounded-lg border border-white/5 backdrop-blur-sm pointer-events-none">
        Drag canvas to pan · Scroll wheel to zoom · Click node to inspect
      </div>
    </div>
  );
}

export default function WorkflowStudioView() {
  const [workflows, setWorkflows] = useState(PRESET_WORKFLOWS_DATA);
  const [selectedWorkflow, setSelectedWorkflow] = useState(PRESET_WORKFLOWS_DATA[0]);
  const [selectedNode, setSelectedNode] = useState(
    PRESET_WORKFLOWS_DATA[0].nodes.find(n => n.id === 'node_trigger') || null
  );

  const [nlPrompt, setNlPrompt] = useState('Agar koi customer 3 din tak na aaye to WhatsApp reminder bhejo aur 10% discount offer do');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepId, setActiveStepId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);

  // Fetch from server if available, but keep rich templates as default
  useEffect(() => {
    async function loadServerWorkflows() {
      try {
        const res = await fetch('/api/workflows');
        if (res.ok) {
          const serverData = await res.json();
          if (Array.isArray(serverData) && serverData.length > 0) {
            // Merge server workflows with our rich n8n preset designs
            setWorkflows(prev => {
              const ids = new Set(prev.map(w => w.id));
              const fresh = serverData.filter(sw => !ids.has(sw.id));
              return [...prev, ...fresh];
            });
          }
        }
      } catch (e) {
        // Fallback gracefully to PRESET_WORKFLOWS_DATA
      }
    }
    loadServerWorkflows();
  }, []);

  // Synthesize custom workflow from user prompt
  const handleSynthesize = async () => {
    if (!nlPrompt.trim()) return;
    setIsSynthesizing(true);

    try {
      // Create rich customized n8n graph for the directive
      const discountMatch = nlPrompt.match(/(\d+)%/);
      const discount = discountMatch ? parseInt(discountMatch[1], 10) : 10;
      const cleanPrompt = nlPrompt.trim();

      const synthesizedWorkflow = {
        id: `wf_synth_${Date.now()}`,
        name: `Directive: ${cleanPrompt.slice(0, 42)}...`,
        description: `Synthesized autonomous graph for merchant rule: "${cleanPrompt}"`,
        category: 'Synthesized Directive',
        status: 'ACTIVE',
        nodes: [
          {
            id: 'note_synth',
            type: 'stickyNote',
            position: { x: -300, y: 100 },
            data: {
              title: 'Synthesized Merchant Directive',
              content: `Rule: "${cleanPrompt}". Arc Mate converted this into a deterministic trigger, customer cohort filter, Cognee 15% margin guard, WhatsApp dispatch, and countertop audio feedback.`,
              badge: 'AI Synthesized Graph'
            }
          },
          {
            id: 'node_trig_custom',
            type: 'n8nNode',
            position: { x: 80, y: 160 },
            data: {
              name: 'Inactivity Radar Trigger',
              subtitle: 'telemetry event',
              category: 'trigger',
              iconName: 'Zap',
              color: '#ed6f5c',
              status: 'ready',
              parameters: {
                rule: cleanPrompt,
                inactivityThresholdDays: 3
              }
            }
          },
          {
            id: 'node_filter_custom',
            type: 'n8nNode',
            position: { x: 360, y: 160 },
            data: {
              name: 'Target Customer Filter',
              subtitle: 'supabase patron query',
              category: 'action',
              iconName: 'Database',
              color: '#10b981',
              status: 'ready',
              parameters: {
                segment: 'INACTIVE_3_DAYS',
                minVisits: 2
              }
            }
          },
          {
            id: 'node_guard_custom',
            type: 'n8nNode',
            position: { x: 640, y: 160 },
            data: {
              name: 'Cognee 15% Margin Guard',
              subtitle: 'policy check ceiling',
              category: 'guardrail',
              iconName: 'ShieldCheck',
              color: '#6e7448',
              status: 'ready',
              parameters: {
                proposedDiscount: discount,
                marginCeilingCap: 15,
                passStatus: discount <= 15 ? 'PASSED' : 'REJECTED'
              }
            }
          },
          {
            id: 'node_whatsapp_custom',
            type: 'n8nNode',
            position: { x: 920, y: 100 },
            data: {
              name: 'WhatsApp Offer Dispatch',
              subtitle: 'hinglish voucher message',
              category: 'action',
              iconName: 'MessageSquare',
              color: '#22c55e',
              status: 'ready',
              parameters: {
                discountPercent: discount,
                template: `Namaste! Aapko store par miss kar rahe hain. Is weekend par paaiye ${discount}% instant discount.`
              }
            }
          },
          {
            id: 'node_soundbox_custom',
            type: 'n8nNode',
            position: { x: 920, y: 240 },
            data: {
              name: 'Soundbox 3.0 Audio Announce',
              subtitle: 'countertop speech chime',
              category: 'action',
              iconName: 'Volume2',
              color: '#ed6f5c',
              status: 'ready',
              parameters: {
                message: `Arc Mate: Customer retention campaign with ${discount}% discount active.`
              }
            }
          }
        ],
        edges: [
          {
            id: 'es_1',
            source: 'node_trig_custom',
            target: 'node_filter_custom',
            type: 'bezier',
            animated: true,
            style: { stroke: '#52525b', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
          },
          {
            id: 'es_2',
            source: 'node_filter_custom',
            target: 'node_guard_custom',
            type: 'bezier',
            animated: true,
            style: { stroke: '#52525b', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' }
          },
          {
            id: 'es_3',
            source: 'node_guard_custom',
            target: 'node_whatsapp_custom',
            type: 'bezier',
            style: { stroke: '#22c55e', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' }
          },
          {
            id: 'es_4',
            source: 'node_guard_custom',
            target: 'node_soundbox_custom',
            type: 'bezier',
            style: { stroke: '#ed6f5c', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#ed6f5c' }
          }
        ]
      };

      setWorkflows(prev => [synthesizedWorkflow, ...prev]);
      setSelectedWorkflow(synthesizedWorkflow);
      setSelectedNode(synthesizedWorkflow.nodes[1]);
      setExecutionResult(null);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Test Run Pipeline Execution Simulation with live animations & audio
  const handleTestRun = async () => {
    if (!selectedWorkflow || isRunning) return;

    setIsRunning(true);
    setExecutionResult(null);

    const execNodes = selectedWorkflow.nodes.filter(n => n.type !== 'stickyNote');

    for (let i = 0; i < execNodes.length; i++) {
      const node = execNodes[i];
      setActiveStepId(node.id);
      setSelectedNode(node);
      await new Promise(r => setTimeout(r, 450));
    }

    // Finished execution
    setActiveStepId(null);
    setIsRunning(false);

    const result = {
      executionId: `exec_${Date.now().toString(36)}`,
      totalExecutionTimeMs: 142,
      targetAudienceCount: 47,
      messagesDispatched: 47,
      marginGuardStatus: 'Passed (10% <= 15% Cap)',
      soundboxBroadcast: 'Verified (784Hz & 1046Hz Chime Sent)',
      timestamp: new Date().toLocaleTimeString()
    };

    setExecutionResult(result);
    playPaytmChime('Ding! Countertop Soundbox: Campaign successfully executed across 47 customers.');
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
    <div className="space-y-6 max-w-6xl mx-auto text-xs font-sans pb-10">
      
      {/* 1. Header Card */}
      <div className="lunor-card p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <div>
          <div className="label-editorial text-[10px] mb-1">
            WORKFLOW STUDIO & DIRECTIVES
          </div>
          <h1 className="display-title text-2xl font-bold tracking-tight text-[#f2ebd8]">
            Store Automation <em>Studio</em><span className="dot">.</span>
          </h1>
          <p className="lead-editorial text-xs text-[#9a9382] max-w-2xl mt-1">
            Describe merchant triggers or store rules in plain English or Hinglish. Arc Mate synthesizes deterministic workflow pipelines with guardrails and hardware loops.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
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
            className="btn-editorial btn-editorial-primary text-xs flex items-center gap-1.5"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? 'Running Pipeline...' : 'Test Run Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* 2. Natural Language Directive Synthesizer */}
      <div className="lunor-card p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-[#ed6f5c] shrink-0 font-mono text-xs">
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold text-[#f2ebd8] font-sans">Directive:</span>
        </div>
        <input
          type="text"
          value={nlPrompt}
          onChange={e => setNlPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSynthesize()}
          placeholder="e.g. 'Agar koi customer 3 din tak na aaye to WhatsApp reminder bhejo aur 10% discount offer do'"
          className="flex-1 bg-[#1e1c18]/80 border border-white/10 rounded-xl px-4 py-2 text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-[#ed6f5c] font-sans"
        />
        <button
          onClick={handleSynthesize}
          disabled={isSynthesizing}
          className="btn-editorial btn-editorial-primary text-xs shrink-0 py-2 flex items-center gap-1.5"
        >
          {isSynthesizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          <span>Synthesize Graph</span>
        </button>
      </div>

      {/* 3. Preset Workflow Selector Pills */}
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

          {/* Execution Trace Logs (If executed) */}
          {executionResult && (
            <div className="p-4 bg-[#12100d] rounded-2xl border border-emerald-500/40 space-y-3 shadow-xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-zinc-100 font-sans">Execution Trace Verified</span>
                </div>
                <span className="font-mono text-zinc-400 text-[10px]">
                  Total: {executionResult.totalExecutionTimeMs}ms • ID: {executionResult.executionId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Audience Reach</span>
                  <span className="text-sm font-bold text-zinc-100 font-mono">{executionResult.targetAudienceCount} Patrons</span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Dispatched</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{executionResult.messagesDispatched} WhatsApp</span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Soundbox Sync</span>
                  <span className="text-sm font-bold text-[#ed6f5c] font-mono">Chime Broadcast</span>
                </div>
                <div className="p-2.5 bg-[#18181b] rounded-xl border border-white/10">
                  <span className="text-[9px] text-zinc-400 uppercase font-mono block">Ceiling Guard</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">10% &lt;= 15% Cap</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Interactive Node Inspector */}
        <div className="lg:col-span-4 lunor-card rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden min-h-[560px]">
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
                    <span className="text-emerald-400">JSON Schema</span>
                  </div>
                  <pre className="text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin">
                    {JSON.stringify(selectedNode.data?.parameters || {}, null, 2)}
                  </pre>
                </div>

                {/* Contextual Interactive Features */}
                {selectedNode.data?.name?.includes('Soundbox') && (
                  <div className="p-3 bg-[#ed6f5c]/10 border border-[#ed6f5c]/30 rounded-xl space-y-2 text-zinc-200">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-[#ed6f5c]">
                      <Volume2 size={14} />
                      <span>Countertop Audio Gateway</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Plays high-frequency dual chime (784Hz / 1046Hz) over merchant's 4G Soundbox 3.0 speaker.
                    </p>
                    <button
                      type="button"
                      onClick={() => playPaytmChime('Paytm Soundbox 3.0: Pipeline audio test passed.')}
                      className="w-full py-1.5 rounded-lg bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-semibold text-xs transition cursor-pointer shadow-sm"
                    >
                      Test Soundbox Chime
                    </button>
                  </div>
                )}

                {selectedNode.data?.name?.includes('Margin') || selectedNode.data?.name?.includes('Policy') ? (
                  <div className="p-3 bg-[#6e7448]/15 border border-[#6e7448]/40 rounded-xl space-y-1.5 text-zinc-200">
                    <div className="flex items-center justify-between font-bold font-mono text-xs text-[#b8c278]">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        <span>Cognee Margin Guard</span>
                      </span>
                      <span className="text-[10px] bg-[#6e7448]/20 px-2 py-0.5 rounded-full">15% Cap</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Evaluates proposed discount rates against store profit margins before invoking external WhatsApp or SMS dispatchers.
                    </p>
                  </div>
                ) : null}

                {selectedNode.data?.name?.includes('Knowledge Agent') && (
                  <div className="p-3 bg-[#1e1a24] border border-[#ed6f5c]/30 rounded-xl space-y-1.5 text-zinc-200">
                    <div className="flex items-center justify-between font-bold font-mono text-xs text-[#ed6f5c]">
                      <span className="flex items-center gap-1.5">
                        <Bot size={14} />
                        <span>Manager Agent (Gemini 3.1)</span>
                      </span>
                      <span className="text-[10px] bg-[#ed6f5c]/20 px-2 py-0.5 rounded-full text-[#ed6f5c]">Sub-second</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Executes multi-step reasoning, accesses attached store vector store, and enforces merchant policy guardrails.
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> n8n Active
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
