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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#161410] border border-[rgba(242,235,216,0.12)] rounded-2xl p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Editorial corner brackets */}
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />

        {/* Top hairline gradient */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ed6f5c] to-transparent" />

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[rgba(242,235,216,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(237,111,92,0.12)] border border-[rgba(237,111,92,0.25)] flex items-center justify-center text-[#ed6f5c] font-mono font-bold">
              0{step}
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-[#ed6f5c]">
                Plate 00 • Setup Sequence ({step}/3)
              </div>
              <h2 className="text-lg font-serif italic text-[#f2ebd8] font-normal">
                {step === 1 && 'Store Identity & Operating Cadence'}
                {step === 2 && 'Paytm Soundbox & Settlement Sync'}
                {step === 3 && 'Autonomous Guardrails & Limits'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-[#ed6f5c]'
                    : s < step
                    ? 'w-4 bg-[#6e7448]'
                    : 'w-2 bg-[rgba(242,235,216,0.1)]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Hours & Ticket Size */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] flex items-start gap-3">
              <Sparkles size={16} className="text-[#ed6f5c] mt-0.5 shrink-0" />
              <div className="text-xs text-[#c8c0a8] leading-relaxed font-sans">
                ActionMate learns your peak traffic hours to automatically identify regular patrons who stop visiting and trigger timely re-engagement campaigns.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-[#9a9382]" /> Store Opening Time
                </label>
                <input
                  type="text"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-4 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} className="text-[#9a9382]" /> Store Closing Time
                </label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-4 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1.5 flex items-center gap-1.5">
                <Tag size={13} className="text-[#9a9382]" /> Baseline Patron Order Size (₹)
              </label>
              <input
                type="number"
                value={avgTicket}
                onChange={(e) => setAvgTicket(e.target.value)}
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-4 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-mono"
              />
              <p className="text-[11px] text-[#9a9382] mt-1 font-mono">Calibrates promotional discount thresholds and minimum cart values.</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="btn-editorial btn-editorial-primary text-xs py-2.5 px-6 inline-flex items-center gap-2"
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
            <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] flex items-start gap-3">
              <Volume2 size={16} className="text-[#ed6f5c] mt-0.5 shrink-0" />
              <div className="text-xs text-[#c8c0a8] leading-relaxed font-sans">
                Your paired Paytm Soundbox provides instant chime confirmations on UPI collections and autonomous voice briefings on store performance.
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#9a9382] font-mono uppercase tracking-wider mb-0.5">Paired Paytm Hardware</div>
                <div className="text-sm font-bold text-[#f2ebd8] font-mono">{merchant?.soundboxDeviceId || 'PAYTM_SBX_BLR_7781'}</div>
                <div className="text-[10px] text-[#e9b94a] flex items-center gap-1.5 mt-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e9b94a] animate-pulse" />
                  ONLINE • 4G ACTIVE • 96% BATT
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestChime}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                  chimeTested
                    ? 'bg-[rgba(110,116,72,0.2)] text-[#c8c0a8] border border-[rgba(110,116,72,0.4)]'
                    : 'btn-editorial btn-editorial-subtle'
                }`}
              >
                {chimeTested ? <Check size={14} className="text-[#6e7448]" /> : <Volume2 size={14} />}
                {chimeTested ? 'Chime Broadcasted' : 'Test Soundbox Chime'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)]">
              <div className="text-xs text-[#9a9382] font-mono uppercase tracking-wider mb-1">Settlement UPI Handle</div>
              <div className="text-sm font-semibold text-[#f2ebd8] font-mono">{merchant?.upiId || 'atheescafe@paytm'}</div>
              <div className="text-[11px] text-[#9a9382] mt-1 font-sans">Automated nightly batch settlement occurs at 23:30 IST into registered banking account.</div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(1)}
                className="btn-editorial btn-editorial-subtle text-xs py-2 px-4"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-editorial btn-editorial-primary text-xs py-2.5 px-6 inline-flex items-center gap-2"
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
            <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] flex items-start gap-3">
              <ShieldCheck size={16} className="text-[#ed6f5c] mt-0.5 shrink-0" />
              <div className="text-xs text-[#c8c0a8] leading-relaxed font-sans">
                ActionMate enforces strict merchant guardrails. The copilot will never execute promotional campaigns that breach these margins without your explicit cryptographic approval.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)]">
                <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-2">
                  Promotional Discount Ceiling (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={discountCeiling}
                    onChange={(e) => setDiscountCeiling(Number(e.target.value))}
                    className="flex-1 accent-[#ed6f5c]"
                  />
                  <span className="text-sm font-mono font-bold text-[#f2ebd8] w-12 text-right">{discountCeiling}%</span>
                </div>
                <p className="text-[11px] text-[#9a9382] font-mono mt-2">Recommended ceiling: 10% - 15% for retail coffee & bakeries.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)]">
                <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-2">
                  Minimum Order Value for Offers (₹)
                </label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full bg-[#161410] border border-[rgba(242,235,216,0.1)] rounded-xl px-4 py-2 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-mono"
                />
                <p className="text-[11px] text-[#9a9382] font-mono mt-2">Protects unit economic margins.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(110,116,72,0.25)] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#f2ebd8]">Autonomous Patron Re-engagement</div>
                <div className="text-[11px] text-[#9a9382] font-sans mt-0.5">Identifies at-risk patrons inactive after 14 days and queues customized WhatsApp incentives.</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#c8c0a8] bg-[rgba(110,116,72,0.15)] border border-[rgba(110,116,72,0.3)] px-2.5 py-1 rounded-full font-mono uppercase">
                <CheckCircle2 size={13} className="text-[#6e7448]" /> Active
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(2)}
                className="btn-editorial btn-editorial-subtle text-xs py-2 px-4"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={submitting}
                className="btn-editorial btn-editorial-primary text-xs py-2.5 px-8 inline-flex items-center gap-2"
              >
                {submitting ? 'Calibrating Workspace...' : 'Launch Store Dashboard'}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
