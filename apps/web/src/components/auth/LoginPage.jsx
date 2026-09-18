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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#0e0d0a] font-sans selection:bg-[#ed6f5c]/30">
      {/* Background with WebGPU Procedural Shaders */}
      <ShaderBackground opacity={0.38} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl mx-auto py-8">
        {/* Navigation Return */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={onGoHome}
            className="editorial-pill"
          >
            <ChevronLeft size={14} className="text-[#ed6f5c]" /> Return to Portal
          </button>
          
          <div className="flex items-center gap-2 bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] text-[#c8c0a8] px-3 py-1 rounded-full text-[11px] font-mono backdrop-blur-md">
            <span className="pulse-dot" />
            <span>Cloud Database Connected</span>
          </div>
        </div>

        {/* Editorial Card */}
        <div className="bg-[#161410]/90 backdrop-blur-2xl border border-[rgba(242,235,216,0.12)] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Technical Corner Brackets */}
          <span className="corner tl"></span>
          <span className="corner tr"></span>
          <span className="corner bl"></span>
          <span className="corner br"></span>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1e1c18] border border-[rgba(242,235,216,0.12)] p-1 shadow-lg mb-4">
              <img src="/logo.png" alt="ActionMate" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="label-editorial text-[10px] justify-center mb-2">
              <span className="ix">PLATE 00</span> AUTONOMOUS MERCHANT ACCESS
            </div>
            <h1 className="display-title text-2xl md:text-3xl text-[#f2ebd8] mb-2">
              Paytm Merchant <em>ActionMate</em><span className="dot">.</span>
            </h1>
            <p className="lead-editorial text-xs text-[#9a9382] max-w-md mx-auto">
              The autonomous AI teammate engineered for modern Indian merchants. Continuous revenue monitoring, patron retention, and hardware automation.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-[#1e1c18]/80 p-1 rounded-xl border border-[rgba(242,235,216,0.08)] mb-6">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all font-sans ${
                tab === 'login'
                  ? 'bg-[#ed6f5c] text-white shadow-md'
                  : 'text-[#9a9382] hover:text-[#f2ebd8]'
              }`}
            >
              Sign In to Store
            </button>
            <button
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all font-sans ${
                tab === 'signup'
                  ? 'bg-[#ed6f5c] text-white shadow-md'
                  : 'text-[#9a9382] hover:text-[#f2ebd8]'
              }`}
            >
              Register New Store
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-3 text-[#ed6f5c] text-xs font-sans">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#c8c0a8] mb-1.5 font-sans">Store Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e6860]" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. athees@atheescafe.com"
                    className="w-full bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl pl-10 pr-4 py-3 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c8c0a8] mb-1.5 font-sans">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e6860]" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl pl-10 pr-4 py-3 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-editorial btn-editorial-primary w-full justify-center mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Opening Workspace...
                  </>
                ) : (
                  <>
                    <span>Sign In to Store Dashboard</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Quick Demo Pre-fill */}
              <div className="pt-4 border-t border-[rgba(242,235,216,0.06)] text-center">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="editorial-pill text-xs font-mono"
                >
                  <Coffee size={14} className="text-[#ed6f5c]" />
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
                  <label className="block text-xs font-medium text-[#c8c0a8] mb-1 font-sans">Store / Business Name *</label>
                  <div className="relative">
                    <Store size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6860]" />
                    <input
                      type="text"
                      required
                      value={signupStoreName}
                      onChange={(e) => setSignupStoreName(e.target.value)}
                      placeholder="e.g. Royal Chai Point"
                      className="w-full bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c8c0a8] mb-1 font-sans">Owner Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6860]" />
                    <input
                      type="text"
                      value={signupOwnerName}
                      onChange={(e) => setSignupOwnerName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-[#c8c0a8] mb-1 font-sans">Email Address *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6860]" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="store@example.com"
                      className="w-full bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c8c0a8] mb-1 font-sans">Password *</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6860]" />
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-[#c8c0a8] mb-1 font-sans">Category</label>
                  <div className="relative">
                    <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6860]" />
                    <select
                      value={signupCategory}
                      onChange={(e) => setSignupCategory(e.target.value)}
                      className="w-full bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#f2ebd8] focus:outline-none focus:border-[#ed6f5c] font-sans"
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
                  <label className="block text-xs font-medium text-[#c8c0a8] mb-1 font-sans">Location / City</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6860]" />
                    <input
                      type="text"
                      value={signupLocation}
                      onChange={(e) => setSignupLocation(e.target.value)}
                      placeholder="City, State"
                      className="w-full bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-editorial btn-editorial-primary w-full justify-center mt-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Store & Provisioning Database...
                  </>
                ) : (
                  <>
                    <span>Complete Registration & Launch Store</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Security Badges */}
          <div className="mt-8 pt-6 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between text-[10px] text-[#6e6860] font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#6e7448]" />
              Row-Level Tenant Security
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#ed6f5c]" />
              Paytm Soundbox 3.0 Compatible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
