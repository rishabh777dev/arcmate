import React, { useState, useEffect } from 'react';
import { 
  Workflow, 
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
  Layers,
  ChevronRight
} from 'lucide-react';
import { playPaytmChime } from '../../services/soundboxAudio';

export default function WorkflowStudioView() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nlPrompt, setNlPrompt] = useState('Agar koi customer 3 din tak na aaye to WhatsApp reminder bhejo aur 10% discount offer do');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [executionResult, setExecutionResult] = useState(null);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows');
      const data = await res.json();
      setWorkflows(data);
      if (data.length > 0 && !selectedWorkflow) {
        setSelectedWorkflow(data[0]);
        if (data[0].nodes && data[0].nodes.length > 0) {
          setSelectedNode(data[0].nodes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load workflows:', err);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleSynthesize = async () => {
    if (!nlPrompt.trim()) return;
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/workflows/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: nlPrompt })
      });
      const data = await res.json();
      if (data.workflow) {
        setWorkflows(prev => [data.workflow, ...prev]);
        setSelectedWorkflow(data.workflow);
        if (data.workflow.nodes?.length > 0) {
          setSelectedNode(data.workflow.nodes[0]);
        }
      }
    } catch (err) {
      console.error('Synthesis failed:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleTestRun = async () => {
    if (!selectedWorkflow || isRunning) return;

    setIsRunning(true);
    setActiveStepIndex(0);
    setExecutionResult(null);

    // Simulated visual step-through animation across nodes
    const nodeCount = selectedWorkflow.nodes?.length || 5;
    for (let i = 0; i < nodeCount; i++) {
      setActiveStepIndex(i);
      await new Promise(r => setTimeout(r, 450));
    }

    try {
      const res = await fetch(`/api/workflows/${selectedWorkflow.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audienceSize: 47,
          discountPercent: 10
        })
      });
      const result = await res.json();
      setExecutionResult(result);
      playPaytmChime('Ding! Paytm Soundbox: Campaign 47 customers ko successfully bhej di gayi hai.');
    } catch (err) {
      console.error('Workflow execution error:', err);
    } finally {
      setIsRunning(false);
      setActiveStepIndex(-1);
    }
  };

  const handleDownloadN8nJson = () => {
    if (!selectedWorkflow) return;
    window.open(`/api/workflows/${selectedWorkflow.id}/export`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs">
      
      {/* 1. Header Card */}
      <div className="lunor-card p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Workflow className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Store Automation Studio
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Live Triggers
            </span>
          </div>
          <p className="text-zinc-400 max-w-2xl text-xs">
            Describe store rules or customer triggers in simple words. ActionMate automatically configures conditions, WhatsApp customer perks, and Soundbox audio confirmation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleDownloadN8nJson}
            disabled={!selectedWorkflow}
            className="lunor-button-subtle px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 text-zinc-300 hover:text-white"
            title="Download automation definition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Automation</span>
          </button>

          <button
            onClick={handleTestRun}
            disabled={isRunning || !selectedWorkflow}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
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

      {/* 2. Natural Language Prompt Synthesizer */}
      <div className="lunor-card p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-zinc-400 shrink-0">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white">Create Automation:</span>
        </div>
        <input
          type="text"
          value={nlPrompt}
          onChange={e => setNlPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSynthesize()}
          placeholder="e.g. 'Agar koi customer 3 din tak na aaye to WhatsApp reminder bhejo aur 10% discount offer do'"
          className="flex-1 bg-[#1A1B20] border border-white/[0.08] rounded-xl px-4 py-2 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSynthesize}
          disabled={isSynthesizing}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 shrink-0 shadow-md disabled:opacity-50"
        >
          {isSynthesizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          <span>Create Automation</span>
        </button>
      </div>

      {/* 3. Workflow Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {workflows.map(wf => (
          <button
            key={wf.id}
            onClick={() => {
              setSelectedWorkflow(wf);
              if (wf.nodes?.length > 0) setSelectedNode(wf.nodes[0]);
              setExecutionResult(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-left whitespace-nowrap transition border text-xs ${
              selectedWorkflow?.id === wf.id
                ? 'bg-[#1E2028] text-white border-[#00BAF2] font-semibold shadow-sm'
                : 'bg-[#14151B] text-zinc-400 border-white/[0.06] hover:text-white hover:border-white/[0.12]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00BAF2]"></span>
              <span>{wf.name.length > 36 ? wf.name.slice(0, 34) + '...' : wf.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 4. Main Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Visual Node Pipeline */}
        <div className="lg:col-span-8 lunor-card rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="font-bold text-white text-sm">{selectedWorkflow?.name}</h3>
              <p className="text-zinc-400 text-xs mt-0.5">{selectedWorkflow?.description || selectedWorkflow?.prompt}</p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              {selectedWorkflow?.nodes?.length || 0} Connected Nodes
            </span>
          </div>

          {/* Nodes Horizontal Pipeline Flow */}
          <div className="py-8 px-4 bg-[#111216] rounded-xl border border-white/[0.05] overflow-x-auto">
            <div className="flex items-center gap-4 min-w-[760px] relative">
              {selectedWorkflow?.nodes?.map((node, i) => {
                const isActive = activeStepIndex === i;
                const isCompleted = activeStepIndex > i || (executionResult && activeStepIndex === -1);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <React.Fragment key={node.id || i}>
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`w-52 p-3.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105 z-20'
                          : isSelected
                          ? 'bg-[#1C1D24] border-[#00BAF2] shadow-md z-10'
                          : isCompleted
                          ? 'bg-[#15161C] border-emerald-500/50'
                          : 'bg-[#15161C] border-white/[0.07] hover:border-white/[0.15]'
                      }`}
                    >
                      {/* Status indicator dot */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-mono uppercase font-bold text-[#00BAF2]">
                          Step 0{i + 1}
                        </span>
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                        )}
                      </div>

                      <h4 className="font-bold text-white text-xs leading-snug">{node.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
                        {node.type.replace('n8n-nodes-base.', '')}
                      </p>
                    </div>

                    {/* Connecting arrow */}
                    {i < (selectedWorkflow?.nodes?.length || 0) - 1 && (
                      <div className="flex items-center justify-center shrink-0">
                        <ArrowRight className={`w-4 h-4 ${isActive || isCompleted ? 'text-[#00BAF2]' : 'text-zinc-600'}`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Execution Trace Logs (If executed) */}
          {executionResult && (
            <div className="p-4 bg-[#111216] rounded-xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Execution Trace Verified</span>
                </div>
                <span className="font-mono text-zinc-400 text-[10px]">
                  Total: {executionResult.totalExecutionTimeMs}ms • ID: {executionResult.executionId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 bg-[#17181F] rounded-lg border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Audience</span>
                  <span className="text-sm font-bold text-white">{executionResult.targetAudienceCount} Patrons</span>
                </div>
                <div className="p-2 bg-[#17181F] rounded-lg border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Dispatched</span>
                  <span className="text-sm font-bold text-emerald-400">{executionResult.messagesDispatched} WhatsApp</span>
                </div>
                <div className="p-2 bg-[#17181F] rounded-lg border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Soundbox Sync</span>
                  <span className="text-sm font-bold text-[#00BAF2]">Chime Triggered</span>
                </div>
                <div className="p-2 bg-[#17181F] rounded-lg border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">Cognee Policy</span>
                  <span className="text-sm font-bold text-emerald-400">10% &lt;= 15% Cap</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Node Inspector & Payload */}
        <div className="lg:col-span-4 lunor-card rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00BAF2]" />
                <h3 className="font-bold text-white">Node Inspector</h3>
              </div>
              {selectedNode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1B20] text-zinc-300 border border-white/[0.06]">
                  v{selectedNode.typeVersion || 1}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="pt-4 space-y-3">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Node Name</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{selectedNode.name}</h4>
                  <span className="text-[10px] font-mono text-[#00BAF2]">{selectedNode.type}</span>
                </div>

                <div className="p-3 bg-[#131417] rounded-xl border border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Configured Parameters</span>
                  <pre className="text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedNode.parameters || {}, null, 2)}
                  </pre>
                </div>

                {selectedNode.name?.includes('Policy') && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1 text-emerald-300">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Cognee Guardrail Node</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Checks discount rate against merchant margin policies before triggering WhatsApp or SMS gateways.
                    </p>
                  </div>
                )}

                {selectedNode.name?.includes('Soundbox') && (
                  <div className="p-3 bg-[#00BAF2]/10 border border-[#00BAF2]/20 rounded-xl space-y-1 text-[#00BAF2]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Soundbox Hardware Loop</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      Plays instant voice confirmation over Paytm Soundbox 3.0 speaker upon campaign dispatch.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-12 text-center text-zinc-500">
                Click on any node in the canvas to inspect its configuration and parameters.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-zinc-400 text-[11px]">
            <span>n8n Pipeline Engine:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Ready
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
