import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';

export default function ApprovalsView({ pendingAction, onApprove, onReject, onGoToCopilot }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Approval Queue</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight mt-1">Store Action Approvals</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          All external customer communications and budget offers pause here for merchant authorization.
        </p>
      </div>

      {pendingAction ? (
        <div className="lunor-card rounded-2xl p-6 shadow-sm space-y-5 border-amber-500/30">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Action Pending</span>
                <h4 className="text-base font-bold text-white">{pendingAction.title}</h4>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full">
              {pendingAction.audienceSize || 38} Patrons
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#1D1E24] border border-white/[0.05]">
              <span className="text-zinc-500 block text-[11px]">Audience Cohort</span>
              <span className="text-sm font-semibold text-white mt-1 block">{pendingAction.targetSegment || 'Inactive Regulars'}</span>
              <span className="text-[10px] text-zinc-500">Missed visits in last 14 days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1D1E24] border border-white/[0.05]">
              <span className="text-zinc-500 block text-[11px]">Proposed Offer</span>
              <span className="text-sm font-semibold text-emerald-400 mt-1 block">{pendingAction.discountPercent || 10}% OFF &gt; ₹249</span>
              <span className="text-[10px] text-zinc-500">Valid: 5 Days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1D1E24] border border-white/[0.05]">
              <span className="text-zinc-500 block text-[11px]">Store Policy Check</span>
              <span className="text-sm font-semibold text-emerald-400 mt-1 block">Passed Ceiling</span>
              <span className="text-[10px] text-zinc-500">Within 15% discount cap</span>
            </div>
          </div>

          <div className="p-4 bg-[#1A1B20] border border-white/[0.06] rounded-xl text-xs space-y-1">
            <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulated WhatsApp & SMS Dispatch Copy:</span>
            </div>
            <p className="text-zinc-300 font-mono text-xs pt-1 italic">"{pendingAction.offerText}"</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onApprove}
              className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize & Dispatch Campaign</span>
            </button>

            <button
              onClick={onGoToCopilot}
              className="w-full sm:w-auto px-4 py-2.5 lunor-button-subtle rounded-xl text-xs font-medium transition flex items-center justify-center gap-2"
            >
              <span>Review in AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onReject}
              className="w-full sm:w-auto px-4 py-2.5 text-zinc-400 hover:text-rose-400 text-xs font-medium transition"
            >
              Reject Action
            </button>
          </div>
        </div>
      ) : (
        <div className="lunor-card rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">Approval Queue is Clear</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            ActionMate has no pending campaign or budget authorization requests. When an anomaly is detected and an action is drafted, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
