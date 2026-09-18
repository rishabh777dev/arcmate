import React, { useState } from 'react';
import { 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Store, 
  ChevronLeft,
  Mail,
  User,
  MapPin,
  Tag,
  AlertCircle,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import ShaderBackground from '../common/ShaderBackground';
import { playPaytmChime } from '../../services/soundboxAudio';

export default function LoginPage({ onLoginSuccess, onGoHome }) {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupStoreName, setSignupStoreName] = useState('');
  const [signupOwnerName, setSignupOwnerName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCategory, setSignupCategory] = useState('Artisan Café & Bakery');
  const [signupLocation, setSignupLocation] = useState('Bangalore, Karnataka');
  const [signupPhone, setSignupPhone] = useState('+91 98450 12890');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(null);
    if (!loginEmail.trim() || !loginPassword) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      if (data.token) {
        localStorage.setItem('actionmate_token', data.token);
      }
      if (data.merchant) {
        localStorage.setItem('actionmate_merchant', JSON.stringify(data.merchant));
      }
      if (data.user) {
        localStorage.setItem('actionmate_user', JSON.stringify(data.user));
      }

      playPaytmChime(`Welcome back ${data.merchant?.ownerName || 'Merchant'}. ${data.merchant?.name || 'Store'} workspace online.`);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    setError(null);
    if (!signupEmail.trim() || !signupPassword || !signupStoreName.trim()) {
      setError('Please fill in Store Name, Email, and Password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail.trim(),
          password: signupPassword,
          name: signupStoreName.trim(),
          ownerName: signupOwnerName.trim() || signupStoreName.trim(),
          category: signupCategory,
          location: signupLocation.trim(),
          phone: signupPhone.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to create merchant account.');
      }

      if (data.token) {
        localStorage.setItem('actionmate_token', data.token);
      }
      if (data.merchant) {
        localStorage.setItem('actionmate_merchant', JSON.stringify(data.merchant));
      }
      if (data.user) {
        localStorage.setItem('actionmate_user', JSON.stringify(data.user));
      }

      playPaytmChime(`Welcome to ActionMate, ${data.merchant?.name || signupStoreName}! Account setup complete.`);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setLoginEmail('athees@atheescafe.com');
    setLoginPassword('Password123!');
    setTab('login');
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#090b10] font-sans selection:bg-indigo-500/30">
      {/* Background with Procedural Shaders */}
      <ShaderBackground opacity={0.35} />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Navigation Return */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={onGoHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-3.5 py-1.5 rounded-full backdrop-blur-md"
          >
            <ChevronLeft size={14} /> Back to Overview
          </button>
          
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Cloud Database Connected
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#0e121b]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 mb-4">
              <img src="/logo.png" alt="ActionMate" className="w-full h-full object-cover rounded-[14px]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Paytm Merchant ActionMate
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              The autonomous AI teammate built for Indian merchants. Manage revenue, grow patrons, and automate store operations.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] mb-6">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In to Store
            </button>
            <button
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register New Store
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Store Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. athees@atheescafe.com"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Opening Workspace...
                  </>
                ) : (
                  <>
                    Sign In to Store Dashboard
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Quick Demo Pre-fill */}
              <div className="pt-4 border-t border-white/[0.06] text-center">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3.5 py-1.5 rounded-lg transition-all"
                >
                  <Coffee size={14} />
                  Try Verified Test Store (Athees Café)
                </button>
              </div>
            </form>
          )}

          {/* 2. SIGNUP TAB */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Store / Business Name *</label>
                  <div className="relative">
                    <Store size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={signupStoreName}
                      onChange={(e) => setSignupStoreName(e.target.value)}
                      placeholder="e.g. Royal Chai Point"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Owner Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={signupOwnerName}
                      onChange={(e) => setSignupOwnerName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="store@example.com"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <div className="relative">
                    <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select
                      value={signupCategory}
                      onChange={(e) => setSignupCategory(e.target.value)}
                      className="w-full bg-[#121622] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/60"
                    >
                      <option value="Quick Service Restaurant / Café">Quick Service Restaurant / Café</option>
                      <option value="Specialty Bakery & Pastry">Specialty Bakery & Pastry</option>
                      <option value="Grocery & Daily Essentials">Grocery & Daily Essentials</option>
                      <option value="Retail Apparel & Footwear">Retail Apparel & Footwear</option>
                      <option value="Electronics & Accessories">Electronics & Accessories</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location / City</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={signupLocation}
                      onChange={(e) => setSignupLocation(e.target.value)}
                      placeholder="City, State"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/60"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Store & Provisioning Database...
                  </>
                ) : (
                  <>
                    Complete Registration & Launch Store
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Security Badges */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              Row-Level Tenant Security
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-blue-500" />
              Paytm Soundbox 3.0 Compatible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
