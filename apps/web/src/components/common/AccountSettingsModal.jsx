import React, { useState } from 'react';
import { 
  X, 
  Store, 
  User, 
  MapPin, 
  Phone, 
  CreditCard, 
  Clock, 
  Volume2, 
  ShieldCheck, 
  Sparkles,
  Save,
  CheckCircle2
} from 'lucide-react';
import { playPaytmChime } from '../../services/soundboxAudio';

export default function AccountSettingsModal({ isOpen, onClose, merchant, onUpdateMerchant }) {
  if (!isOpen) return null;

  const [name, setName] = useState(merchant?.name || '');
  const [ownerName, setOwnerName] = useState(merchant?.ownerName || '');
  const [category, setCategory] = useState(merchant?.category || 'Specialty Artisan Coffee & Gourmet Bakes');
  const [location, setLocation] = useState(merchant?.location || '');
  const [phone, setPhone] = useState(merchant?.phone || '');
  const [upiId, setUpiId] = useState(merchant?.upiId || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const token = localStorage.getItem('actionmate_token');
      const res = await fetch('/api/me/merchant', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name,
          ownerName,
          category,
          location,
          phone,
          upiId
        })
      });

      const data = await res.json();
      if (data.success && data.merchant) {
        onUpdateMerchant(data.merchant);
        setSavedSuccess(true);
        playPaytmChime(`Store settings updated for ${data.merchant.name}.`);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update store:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#161410] border border-[rgba(242,235,216,0.12)] rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Editorial corner brackets */}
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />

        {/* Top hairline highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ed6f5c] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(242,235,216,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(237,111,92,0.12)] border border-[rgba(237,111,92,0.25)] flex items-center justify-center text-[#ed6f5c]">
              <Store size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-[#9a9382]">
                Specification 07 • Store Profile
              </div>
              <h2 className="text-lg font-serif italic text-[#f2ebd8] font-normal">
                Account & Terminal Config
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1e1c18] hover:bg-[#25221d] border border-[rgba(242,235,216,0.1)] flex items-center justify-center text-[#9a9382] hover:text-[#f2ebd8] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="mb-6 p-3 rounded-xl bg-[rgba(110,116,72,0.15)] border border-[rgba(110,116,72,0.3)] flex items-center gap-2 text-[#c8c0a8] text-xs font-mono">
            <CheckCircle2 size={16} className="text-[#6e7448]" />
            Changes saved successfully to cloud database.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Store Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1 flex items-center gap-1.5">
                <Store size={13} className="text-[#9a9382]" /> Store Trade Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1 flex items-center gap-1.5">
                <User size={13} className="text-[#9a9382]" /> Primary Proprietor
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] transition-colors font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1">Business Domain / Specialty</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#9a9382]" /> Storefront Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] transition-colors font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1 flex items-center gap-1.5">
                <Phone size={13} className="text-[#9a9382]" /> Registered Mobile
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-[#c8c0a8] mb-1 flex items-center gap-1.5">
                <CreditCard size={13} className="text-[#9a9382]" /> Settlement UPI VPA
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl px-3.5 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Paired Hardware Section */}
          <div className="pt-4 border-t border-[rgba(242,235,216,0.08)]">
            <div className="text-xs font-mono uppercase tracking-widest text-[#9a9382] mb-3 flex items-center gap-2">
              <Volume2 size={13} className="text-[#ed6f5c]" /> Paired Hardware & Telemetry
            </div>
            
            <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#f2ebd8]">Countertop Soundbox Pro</div>
                <div className="text-[11px] text-[#9a9382] font-mono mt-0.5">Terminal ID: {merchant?.soundboxDeviceId || 'SBX_BLR_7781'}</div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#e9b94a] bg-[rgba(233,185,74,0.1)] border border-[rgba(233,185,74,0.25)] px-3 py-1 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e9b94a] animate-pulse" />
                ACTIVE • 96% BATT
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="pt-1">
            <div className="p-4 rounded-xl bg-[#1e1c18] border border-[rgba(237,111,92,0.2)] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#f2ebd8]">Arc Mate Growth Plan</div>
                <div className="text-[11px] text-[#9a9382] font-sans mt-0.5">Autonomous Agent Assistant, Invoicing & Patron Re-engagement</div>
              </div>
              <span className="text-[10px] font-mono font-medium text-[#ed6f5c] bg-[rgba(237,111,92,0.1)] border border-[rgba(237,111,92,0.25)] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-editorial btn-editorial-subtle text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-editorial btn-editorial-primary text-xs py-2 px-5 inline-flex items-center gap-2"
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Save size={13} />
                  Save Store Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
