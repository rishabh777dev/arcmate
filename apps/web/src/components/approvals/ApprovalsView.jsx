import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';

export default function ApprovalsView({ pendingAction, onApprove, onReject, onGoToCopilot }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="label-editorial text-[10px]">
          HUMAN-IN-THE-LOOP AUTHORIZATION
        </div>
        <h1 className="display-title text-2xl font-bold tracking-tight text-[#f2ebd8] mt-1">
          Store Action <em>Approvals</em><span className="dot">.</span>
        </h1>
        <p className="lead-editorial text-xs text-[#9a9382] mt-0.5">
          All external customer dispatches, WhatsApp blasts, and margin perks halt here for merchant authorization.
        </p>
      </div>

      {pendingAction ? (
        <div className="lunor-card rounded-2xl p-6 shadow-sm space-y-5 border-[#ed6f5c]/35 relative overflow-hidden">
          <span className="corner tl"></span>
          <span className="corner br"></span>
          
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(242,235,216,0.06)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 text-[#ed6f5c] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-semibold text-[#9a9382] uppercase tracking-wider block">Action Pending</span>
                <h4 className="text-base font-bold text-[#f2ebd8] font-sans">{pendingAction.title}</h4>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 bg-[#ed6f5c]/15 text-[#ed6f5c] border border-[#ed6f5c]/30 rounded-full">
              {pendingAction.audienceSize || 38} Patrons
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.08)]">
              <span className="text-[#6e6860] block text-[10px] font-mono uppercase">Audience Cohort</span>
              <span className="text-sm font-semibold text-[#f2ebd8] mt-1 block font-sans">{pendingAction.targetSegment || 'Inactive Regulars'}</span>
              <span className="text-[10px] text-[#9a9382] font-mono">14-day absence threshold</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.08)]">
              <span className="text-[#6e6860] block text-[10px] font-mono uppercase">Proposed Offer</span>
              <span className="text-sm font-semibold text-[#e9b94a] mt-1 block font-mono">{pendingAction.discountPercent || 10}% OFF &gt; ₹249</span>
              <span className="text-[10px] text-[#9a9382] font-mono">Validity: 5 Days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.08)]">
              <span className="text-[#6e6860] block text-[10px] font-mono uppercase">Store Policy Check</span>
              <span className="text-sm font-semibold text-[#6e7448] mt-1 block font-mono">Passed Ceiling</span>
              <span className="text-[10px] text-[#9a9382] font-mono">Within 15% discount cap</span>
            </div>
          </div>

          <div className="p-4 bg-[#1e1c18]/90 border border-[rgba(242,235,216,0.08)] rounded-xl text-xs space-y-1.5">
            <div className="font-semibold text-[#c8c0a8] flex items-center gap-1.5 font-sans">
              <MessageSquare className="w-3.5 h-3.5 text-[#ed6f5c]" />
              <span>Simulated WhatsApp & SMS Customer Dispatch Copy:</span>
            </div>
            <p className="text-[#f2ebd8] font-mono text-xs pt-1 italic bg-[#161410] p-3 rounded-lg border border-[rgba(242,235,216,0.06)]">
              "{pendingAction.offerText}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onApprove}
              className="btn-editorial btn-editorial-primary w-full sm:flex-1 justify-center text-xs py-2.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize & Dispatch Campaign</span>
            </button>

            <button
              onClick={onGoToCopilot}
              className="btn-editorial btn-editorial-ghost w-full sm:w-auto justify-center text-xs py-2.5"
            >
              <span>Review in AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onReject}
              className="w-full sm:w-auto px-4 py-2.5 text-[#9a9382] hover:text-[#ed6f5c] text-xs font-mono transition"
            >
              Reject Action
            </button>
          </div>
        </div>
      ) : (
        <div className="lunor-card rounded-2xl p-12 text-center space-y-3 relative overflow-hidden">
          <span className="corner tl"></span>
          <span className="corner br"></span>
          <div className="w-12 h-12 rounded-xl bg-[#6e7448]/15 text-[#6e7448] flex items-center justify-center mx-auto border border-[#6e7448]/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="display-title text-base font-bold text-[#f2ebd8]">Approval Queue is Clear</h4>
          <p className="lead-editorial text-xs text-[#9a9382] max-w-sm mx-auto">
            Arc Mate has no pending campaign or budget authorization requests. When an anomaly is detected and an action is drafted, it will pause here.
          </p>
        </div>
      )}
    </div>
  );
}
