import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  MessageSquare, 
  Sliders, 
  Code, 
  Globe, 
  Download, 
  Mic, 
  Sparkles, 
  FileText, 
  FileSpreadsheet, 
  Bot, 
  Cpu, 
  Clock, 
  Database, 
  ShieldCheck, 
  Volume2, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileCode
} from 'lucide-react';

const ICON_MAP = {
  MessageSquare,
  Sliders,
  Code,
  Globe,
  Download,
  Mic,
  Sparkles,
  FileText,
  FileSpreadsheet,
  Bot,
  Cpu,
  Clock,
  Database,
  ShieldCheck,
  Volume2,
  Zap,
  FileCode
};

export function N8nIcon({ name, size = 15, color = '#ffffff' }) {
  const IconComp = ICON_MAP[name] || Zap;
  return <IconComp size={size} style={{ color }} />;
}

// 1. Green Sticky Note Node (matches the n8n canvas reference)
export function N8nStickyNoteNode({ data }) {
  return (
    <div className="w-80 rounded-2xl p-4 bg-[#0d2818]/90 border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-left select-none relative group transition-all duration-200 hover:border-emerald-400">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20">
        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {data.badge || 'n8n Production Workflow'}
        </span>
      </div>
      <h4 className="text-xs font-bold text-emerald-200 mb-1.5 font-sans">
        {data.title}
      </h4>
      <p className="text-[11px] text-emerald-100/80 leading-relaxed font-sans">
        {data.content}
      </p>
    </div>
  );
}

// 2. Standard n8n Workflow Node
export function N8nStandardNode({ data, selected }) {
  const isRunning = data.status === 'running';
  const isCompleted = data.status === 'completed';
  const isWarning = data.status === 'warning';

  return (
    <div
      className={`w-[210px] bg-[#18181b]/95 hover:bg-[#202024] rounded-2xl p-3 shadow-xl transition-all duration-150 border text-left select-none relative ${
        selected
          ? 'border-[#ed6f5c] shadow-[0_0_20px_rgba(237,111,92,0.35)] scale-[1.02]'
          : isRunning
          ? 'border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.35)] animate-pulse'
          : isCompleted
          ? 'border-emerald-500/50 hover:border-emerald-400'
          : 'border-white/15 hover:border-white/30'
      }`}
    >
      {/* Target Input Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-zinc-500 hover:!border-emerald-400 hover:!bg-emerald-500 !-left-1.5 transition"
      />

      <div className="flex items-center gap-2.5">
        {/* Squircle Node Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
          style={{
            backgroundColor: `${data.color || '#ed6f5c'}18`,
            border: `1px solid ${data.color || '#ed6f5c'}40`
          }}
        >
          <N8nIcon name={data.iconName} size={17} color={data.color || '#ed6f5c'} />
        </div>

        {/* Labels */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-zinc-100 truncate font-sans">
            {data.name}
          </h4>
          <p className="text-[10px] font-mono text-zinc-400 truncate">
            {data.subtitle || data.category}
          </p>
        </div>

        {/* Status Indicator Badge */}
        <div className="shrink-0">
          {isRunning ? (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping block" />
          ) : isCompleted ? (
            <CheckCircle2 size={13} className="text-emerald-400" />
          ) : isWarning ? (
            <AlertTriangle size={13} className="text-amber-400" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 block" />
          )}
        </div>
      </div>

      {/* Source Output Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-zinc-500 hover:!border-emerald-400 hover:!bg-emerald-500 !-right-1.5 transition"
      />
    </div>
  );
}

// 3. Router / Switch Node with Multi-Port Outputs (n8n Switch)
export function N8nRouterNode({ data, selected }) {
  const ports = data.ports || [
    { id: 'port_1', label: 'Branch 1' },
    { id: 'port_2', label: 'Branch 2' }
  ];

  return (
    <div
      className={`w-[220px] bg-[#18181b]/95 hover:bg-[#202024] rounded-2xl p-3 shadow-xl transition-all duration-150 border text-left select-none relative ${
        selected
          ? 'border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.35)]'
          : 'border-white/15 hover:border-white/30'
      }`}
    >
      {/* Input Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-zinc-500 hover:!border-sky-400 hover:!bg-sky-400 !-left-1.5"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${data.color || '#38bdf8'}18`,
            border: `1px solid ${data.color || '#38bdf8'}40`
          }}
        >
          <N8nIcon name={data.iconName || 'Sliders'} size={17} color={data.color || '#38bdf8'} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-zinc-100 truncate font-sans">
            {data.name}
          </h4>
          <p className="text-[10px] font-mono text-zinc-400 truncate">
            {data.subtitle || 'router / switch'}
          </p>
        </div>
      </div>

      {/* Multi-Handle Output Ports */}
      <div className="pt-2 space-y-1.5">
        {ports.map((port, idx) => {
          const topPercent = 45 + ((idx + 1) * 50) / (ports.length + 1);
          return (
            <div key={port.id} className="relative flex items-center justify-between text-[10px] font-mono text-zinc-400 pr-1">
              <span className="text-[9px] text-zinc-500">#{idx + 1}</span>
              <span className="truncate max-w-[130px] font-medium text-zinc-300">{port.label}</span>
              <Handle
                type="source"
                position={Position.Right}
                id={port.id}
                style={{ top: `${topPercent}%` }}
                className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-[#38bdf8] hover:!bg-[#38bdf8] !-right-1.5 transition"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Agent Node (Manager Agent with Bottom Sub-Node Handles)
export function N8nAgentNode({ data, selected }) {
  const isRunning = data.status === 'running';

  return (
    <div
      className={`w-[240px] bg-[#1e1a24]/95 hover:bg-[#252030] rounded-2xl p-3.5 shadow-2xl transition-all duration-150 border-2 text-left select-none relative ${
        selected
          ? 'border-[#ed6f5c] shadow-[0_0_24px_rgba(237,111,92,0.4)]'
          : isRunning
          ? 'border-amber-400 animate-pulse'
          : 'border-[#ed6f5c]/50 hover:border-[#ed6f5c]/80'
      }`}
    >
      {/* Left Input */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-[#ed6f5c] hover:!bg-[#ed6f5c] !-left-1.5"
      />

      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#ed6f5c]/20 border border-[#ed6f5c]/40 flex items-center justify-center shrink-0 shadow-inner">
          <Bot size={20} className="text-[#ed6f5c]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-white truncate font-sans">
              {data.name}
            </h4>
          </div>
          <p className="text-[10px] font-mono text-[#ed6f5c]/90 truncate">
            {data.subtitle || 'manager agent'}
          </p>
        </div>
      </div>

      <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-[10px] text-zinc-300 font-mono space-y-1">
        <div className="flex items-center justify-between text-[9px] text-zinc-400 uppercase font-semibold">
          <span>Mode: Sub-second</span>
          <span className="text-emerald-400">Gemini 3.1</span>
        </div>
        <p className="text-[10px] text-zinc-400 leading-tight">
          Evaluates multi-turn store context & enforces margin caps.
        </p>
      </div>

      {/* Bottom Sub-Handles for Models & Tools */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="handle_model"
        style={{ left: '25%' }}
        className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-[#ed6f5c] hover:!bg-[#ed6f5c] !-bottom-1.5"
        title="Attached Chat Model"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="handle_memory"
        style={{ left: '50%' }}
        className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-[#f59e0b] hover:!bg-[#f59e0b] !-bottom-1.5"
        title="Attached Session Memory"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="handle_vector"
        style={{ left: '75%' }}
        className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-[#10b981] hover:!bg-[#10b981] !-bottom-1.5"
        title="Attached Database / Vector Search"
      />

      {/* Right Output */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-[#18181b] !border-2 !border-[#ed6f5c] hover:!bg-[#ed6f5c] !-right-1.5"
      />
    </div>
  );
}

// 5. Sub-Node (hanging tools, model, memory attached underneath agent)
export function N8nSubNode({ data, selected }) {
  return (
    <div
      className={`w-[170px] bg-[#141416]/95 hover:bg-[#1a191e] rounded-xl p-2.5 shadow-lg border text-left select-none relative transition-all duration-150 ${
        selected
          ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top Handle plugging into Agent */}
      <Handle
        type="source"
        position={Position.Top}
        className="!w-2 !h-2 !bg-[#18181b] !border-2 !border-zinc-400 hover:!border-white !-top-1.5"
      />

      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${data.color || '#ed6f5c'}20`,
            border: `1px solid ${data.color || '#ed6f5c'}40`
          }}
        >
          <N8nIcon name={data.iconName} size={14} color={data.color || '#ed6f5c'} />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-[11px] font-semibold text-zinc-100 truncate font-sans">
            {data.name}
          </h5>
          <p className="text-[9px] font-mono text-zinc-400 truncate">
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* Optional bottom handle for chain attachments */}
      <Handle
        type="target"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#18181b] !border-2 !border-zinc-400 hover:!border-white !-bottom-1.5"
      />
    </div>
  );
}

export const customNodeTypes = {
  stickyNote: N8nStickyNoteNode,
  n8nNode: N8nStandardNode,
  n8nRouter: N8nRouterNode,
  n8nAgent: N8nAgentNode,
  n8nSubNode: N8nSubNode
};
