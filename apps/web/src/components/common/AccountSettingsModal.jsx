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
      <div className="relative w-full max-w-xl bg-[#0e121b] border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Store size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Store Account Settings</h2>
              <p className="text-xs text-slate-400">Manage business profile, contact details, and paired hardware</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 size={16} />
            Changes saved successfully to cloud database.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Store Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Store size={13} className="text-slate-400" /> Store Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User size={13} className="text-slate-400" /> Owner / Manager Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" /> Store Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" /> Merchant Mobile
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <CreditCard size={13} className="text-slate-400" /> Settlement UPI VPA
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/60"
              />
            </div>
          </div>

          {/* Paired Hardware Section */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Volume2 size={14} className="text-blue-400" /> Paired Hardware & Connectivity
            </div>
            
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Paytm Soundbox 3.0 Pro</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">Device: {merchant?.soundboxDeviceId || 'PAYTM_SBX_BLR_7781'}</div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active • 96% Battery
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="pt-2">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-blue-300">ActionMate Growth Plan</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Autonomous Agent Assistant, Invoicing, & Automated Patron Re-engagement</div>
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {saving ? (
                'Saving Changes...'
              ) : (
                <>
                  <Save size={14} />
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
