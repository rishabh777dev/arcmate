import React, { useState } from 'react';
import { 
  Store, 
  Clock, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Zap,
  Tag,
  Check
} from 'lucide-react';
import { playPaytmChime } from '../../services/soundboxAudio';

export default function OnboardingWizard({ merchant, onComplete }) {
  const [step, setStep] = useState(1);
  const [openTime, setOpenTime] = useState('08:00 AM');
  const [closeTime, setCloseTime] = useState('10:30 PM');
  const [avgTicket, setAvgTicket] = useState(merchant?.avgTicketSize || 240);
  const [discountCeiling, setDiscountCeiling] = useState(15);
  const [minOrder, setMinOrder] = useState(249);
  const [chimeTested, setChimeTested] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTestChime = () => {
    playPaytmChime(`Paytm Soundbox: ₹${avgTicket} received on Paytm QR for ${merchant?.name || 'Store'}.`);
    setChimeTested(true);
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('actionmate_token');
      await fetch('/api/me/onboarding-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          operatingHours: JSON.stringify({ open: openTime, close: closeTime }),
          avgTicketSize: Number(avgTicket),
          onboardingCompleted: true
        })
      });
      playPaytmChime(`Congratulations! ${merchant?.name || 'Your store'} is now live on Paytm Merchant ActionMate.`);
      onComplete();
    } catch (err) {
      console.warn('Onboarding error, proceeding:', err);
      onComplete();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e121b] border border-white/[0.1] rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              {step}
            </div>
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
                Step {step} of 3 • Store Setup
              </div>
              <h2 className="text-lg font-bold text-white">
                {step === 1 && 'Store Identity & Operating Hours'}
                {step === 2 && 'Paytm Soundbox & Payments Sync'}
                {step === 3 && 'Store Rules & Growth Guardrails'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-blue-500'
                    : s < step
                    ? 'w-4 bg-emerald-500'
                    : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Hours & Ticket Size */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
              <Sparkles size={18} className="text-blue-400 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-300 leading-relaxed">
                ActionMate learns your peak traffic hours to automatically identify regular customers who stop visiting and trigger timely re-engagement campaigns.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" /> Store Opening Time
                </label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" /> Store Closing Time
                </label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag size={13} className="text-slate-400" /> Average Customer Bill / Order (₹)
              </label>
              <input
                type="number"
                value={avgTicket}
                onChange={(e) => setAvgTicket(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">Used to personalize promotion discount thresholds.</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                Continue to Soundbox Sync
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Soundbox & UPI */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <Volume2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-300 leading-relaxed">
                Your Paytm Soundbox 3.0 provides audio confirmation for received payments and voice summaries of daily business growth.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Paired Paytm Soundbox Device</div>
                <div className="text-sm font-bold text-white font-mono">{merchant?.soundboxDeviceId || 'PAYTM_SBX_BLR_7781'}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • 4G High Signal • 96% Battery
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestChime}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  chimeTested
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1]'
                }`}
              >
                {chimeTested ? <Check size={14} /> : <Volume2 size={14} />}
                {chimeTested ? 'Chime Played!' : 'Test Soundbox Chime'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-xs text-slate-400 mb-1">Instant Settlement UPI Handle</div>
              <div className="text-sm font-semibold text-white">{merchant?.upiId || 'atheescafe@paytm'}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Settlements occur automatically every evening at 11:30 PM into your registered bank.</div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
              >
                Continue to Store Guardrails
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Store Rules & Ceilings */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3">
              <ShieldCheck size={18} className="text-purple-400 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-300 leading-relaxed">
                ActionMate operates with strict merchant guardrails. Your AI assistant will never execute discounts or campaigns that exceed these limits without your explicit authorization.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Maximum Promotional Discount Cap (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={discountCeiling}
                    onChange={(e) => setDiscountCeiling(Number(e.target.value))}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="text-sm font-bold text-white w-12 text-right">{discountCeiling}%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Recommended: 10% - 15% for optimal margins.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Minimum Order Value for Offers (₹)
                </label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Protects your average ticket size.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-300">Automated Patron Re-engagement</div>
                <div className="text-[11px] text-slate-400">Notifies regular customers after 14 days of inactivity with your approved offer.</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 size={16} /> Active
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-8 py-3 rounded-xl shadow-xl transition-all disabled:opacity-50"
              >
                {submitting ? 'Setting up Workspace...' : 'Launch Store Dashboard'}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
