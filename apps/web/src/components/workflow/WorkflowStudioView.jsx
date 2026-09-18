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
      <div className="lunor-card p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <div>
          <div className="label-editorial text-[10px] mb-1">
            <span className="ix">PLATE 05</span> WORKFLOW STUDIO & DIRECTIVES
          </div>
          <h1 className="display-title text-2xl font-bold tracking-tight text-[#f2ebd8]">
            Store Automation <em>Studio</em><span className="dot">.</span>
          </h1>
          <p className="lead-editorial text-xs text-[#9a9382] max-w-2xl mt-1">
            Describe merchant triggers or store rules in plain English or Hinglish. ActionMate synthesizes deterministic n8n graph pipelines with guardrails and hardware loops.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleDownloadN8nJson}
            disabled={!selectedWorkflow}
            className="btn-editorial btn-editorial-ghost text-xs"
            title="Download automation definition"
          >
            <Download className="w-3.5 h-3.5 text-[#ed6f5c]" />
            <span>Export Definition</span>
          </button>

          <button
            onClick={handleTestRun}
            disabled={isRunning || !selectedWorkflow}
            className="btn-editorial btn-editorial-primary text-xs"
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
          className="flex-1 bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl px-4 py-2 text-[#f2ebd8] placeholder-[#6e6860] text-xs focus:outline-none focus:border-[#ed6f5c] font-sans"
        />
        <button
          onClick={handleSynthesize}
          disabled={isSynthesizing}
          className="btn-editorial btn-editorial-primary text-xs shrink-0 py-2"
        >
          {isSynthesizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          <span>Synthesize Graph</span>
        </button>
      </div>

      {/* 3. Workflow Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {workflows.map(wf => (
          <button
            key={wf.id}
            onClick={() => {
              setSelectedWorkflow(wf);
              if (wf.nodes?.length > 0) setSelectedNode(wf.nodes[0]);
              setExecutionResult(null);
            }}
            className={`editorial-pill ${selectedWorkflow?.id === wf.id ? 'active' : ''}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ed6f5c]"></span>
            <span>{wf.name.length > 36 ? wf.name.slice(0, 34) + '...' : wf.name}</span>
          </button>
        ))}
      </div>

      {/* 4. Main Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Visual Node Pipeline */}
        <div className="lg:col-span-8 lunor-card rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
          <span className="corner tl"></span>
          <span className="corner tr"></span>
          
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.06)]">
            <div>
              <h3 className="font-bold text-[#f2ebd8] text-sm font-sans">{selectedWorkflow?.name}</h3>
              <p className="text-[#9a9382] text-xs mt-0.5 font-body">{selectedWorkflow?.description || selectedWorkflow?.prompt}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#6e7448]/15 text-[#6e7448] border border-[#6e7448]/30 text-[10px] font-mono font-bold">
              {selectedWorkflow?.nodes?.length || 0} Nodes
            </span>
          </div>

          {/* Nodes Horizontal Pipeline Flow */}
          <div className="py-8 px-4 bg-[#12100d]/90 rounded-xl border border-[rgba(242,235,216,0.06)] overflow-x-auto">
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
                          ? 'bg-[#e9b94a]/20 border-[#e9b94a] shadow-[0_0_20px_rgba(233,185,74,0.3)] scale-105 z-20'
                          : isSelected
                          ? 'bg-[#1e1c18] border-[#ed6f5c] shadow-md z-10'
                          : isCompleted
                          ? 'bg-[#161410] border-[#6e7448]/50'
                          : 'bg-[#161410] border-[rgba(242,235,216,0.08)] hover:border-[rgba(242,235,216,0.18)]'
                      }`}
                    >
                      {/* Status indicator dot */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-mono uppercase font-bold text-[#ed6f5c]">
                          Step 0{i + 1}
                        </span>
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-[#e9b94a] animate-ping"></span>
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#6e7448]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#6e6860]"></span>
                        )}
                      </div>

                      <h4 className="font-bold text-[#f2ebd8] text-xs leading-snug font-sans">{node.name}</h4>
                      <p className="text-[10px] text-[#9a9382] font-mono mt-1 truncate">
                        {node.type.replace('n8n-nodes-base.', '')}
                      </p>
                    </div>

                    {/* Connecting arrow */}
                    {i < (selectedWorkflow?.nodes?.length || 0) - 1 && (
                      <div className="flex items-center justify-center shrink-0">
                        <ArrowRight className={`w-4 h-4 ${isActive || isCompleted ? 'text-[#ed6f5c]' : 'text-[#6e6860]'}`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Execution Trace Logs (If executed) */}
          {executionResult && (
            <div className="p-4 bg-[#12100d] rounded-xl border border-[#6e7448]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6e7448]" />
                  <span className="font-bold text-[#f2ebd8] font-sans">Execution Trace Verified</span>
                </div>
                <span className="font-mono text-[#9a9382] text-[10px]">
                  Total: {executionResult.totalExecutionTimeMs}ms • ID: {executionResult.executionId}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 bg-[#1e1c18] rounded-lg border border-[rgba(242,235,216,0.06)]">
                  <span className="text-[9px] text-[#6e6860] uppercase font-mono block">Audience</span>
                  <span className="text-sm font-bold text-[#f2ebd8] font-mono">{executionResult.targetAudienceCount} Patrons</span>
                </div>
                <div className="p-2 bg-[#1e1c18] rounded-lg border border-[rgba(242,235,216,0.06)]">
                  <span className="text-[9px] text-[#6e6860] uppercase font-mono block">Dispatched</span>
                  <span className="text-sm font-bold text-[#6e7448] font-mono">{executionResult.messagesDispatched} WhatsApp</span>
                </div>
                <div className="p-2 bg-[#1e1c18] rounded-lg border border-[rgba(242,235,216,0.06)]">
                  <span className="text-[9px] text-[#6e6860] uppercase font-mono block">Soundbox Sync</span>
                  <span className="text-sm font-bold text-[#ed6f5c] font-mono">Chime Triggered</span>
                </div>
                <div className="p-2 bg-[#1e1c18] rounded-lg border border-[rgba(242,235,216,0.06)]">
                  <span className="text-[9px] text-[#6e6860] uppercase font-mono block">Ceiling Guard</span>
                  <span className="text-sm font-bold text-[#6e7448] font-mono">10% &lt;= 15% Cap</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Node Inspector & Payload */}
        <div className="lg:col-span-4 lunor-card rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <span className="corner tl"></span>
          <span className="corner br"></span>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.06)]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ed6f5c]" />
                <h3 className="font-bold text-[#f2ebd8] font-sans">Node Inspector</h3>
              </div>
              {selectedNode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1e1c18] text-[#9a9382] border border-[rgba(242,235,216,0.08)]">
                  v{selectedNode.typeVersion || 1}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="pt-4 space-y-3">
                <div>
                  <span className="text-[9px] text-[#6e6860] uppercase tracking-wider font-mono">Node Identifier</span>
                  <h4 className="text-sm font-bold text-[#f2ebd8] mt-0.5 font-sans">{selectedNode.name}</h4>
                  <span className="text-[10px] font-mono text-[#ed6f5c]">{selectedNode.type}</span>
                </div>

                <div className="p-3 bg-[#12100d] rounded-xl border border-[rgba(242,235,216,0.06)] space-y-1.5">
                  <span className="text-[9px] text-[#9a9382] uppercase font-mono block">Configured Parameters</span>
                  <pre className="text-[11px] text-[#c8c0a8] font-mono overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedNode.parameters || {}, null, 2)}
                  </pre>
                </div>

                {selectedNode.name?.includes('Policy') && (
                  <div className="p-3 bg-[#1e1c18] border border-[#6e7448]/30 rounded-xl space-y-1 text-[#6e7448]">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Cognee Guardrail Node</span>
                    </div>
                    <p className="text-[11px] text-[#9a9382] leading-relaxed font-body">
                      Checks discount rate against merchant margin policies before triggering WhatsApp or SMS gateways.
                    </p>
                  </div>
                )}

                {selectedNode.name?.includes('Soundbox') && (
                  <div className="p-3 bg-[#1e1c18] border border-[#ed6f5c]/30 rounded-xl space-y-1 text-[#ed6f5c]">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Soundbox Hardware Loop</span>
                    </div>
                    <p className="text-[11px] text-[#9a9382] leading-relaxed font-body">
                      Plays instant voice confirmation over Paytm Soundbox 3.0 speaker upon campaign dispatch.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-12 text-center text-[#6e6860] font-mono text-xs">
                Click on any node in the canvas to inspect its configuration and parameters.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between text-[#9a9382] text-[11px] font-mono">
            <span>n8n Pipeline Engine:</span>
            <span className="font-semibold text-[#6e7448] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6e7448]"></span> Ready
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
