import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  ShieldCheck, 
  TrendingDown, 
  CheckCircle2, 
  Bot, 
  Workflow, 
  Database, 
  ChevronRight, 
  Star,
  ExternalLink,
  Play
} from 'lucide-react';
import ShaderBackground from '../common/ShaderBackground';
import { playPaytmChime } from '../../services/soundboxAudio';

export default function LandingPage({ onLaunchApp, onGoLogin }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [activeLabFilter, setActiveLabFilter] = useState('all');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (y / rect.height) * -8, y: (x / rect.width) * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const labItems = [
    {
      id: 'radar',
      category: 'slump',
      tag: 'Radar',
      num: '01',
      title: 'Slump Cohort Isolation',
      desc: 'Compares hourly UPI transaction streams against 14-day normal bands to isolate 47 inactive evening regulars.',
      metric: '-18.4% isolated',
      actionText: 'Inspect Live Radar'
    },
    {
      id: 'voice',
      category: 'voice',
      tag: 'Voice & Dialect',
      num: '02',
      title: 'Sarvam Hinglish Synthesis',
      desc: 'Dual-engine voice stack processing natural merchant queries in colloquial Hinglish with instant conversational turn-around.',
      metric: 'Hindi / Hinglish',
      actionText: 'Test Voice Node'
    },
    {
      id: 'soundbox',
      category: 'hardware',
      tag: 'Hardware',
      num: '03',
      title: 'Soundbox 3.0 Audio Gateway',
      desc: 'Dual-sine wave Web Audio synthesis (784 Hz + 1046 Hz) for tactile merchant announcements right at the store billing counter.',
      metric: 'Dual-sine 784+1046Hz',
      actionText: 'Play Chime Now',
      isChime: true
    },
    {
      id: 'workflows',
      category: 'workflows',
      tag: 'Studio',
      num: '04',
      title: 'Speech-to-n8n Compiler',
      desc: 'Translates spoken retail intentions into executable, visual multi-node automation graphs with zero code.',
      metric: 'JSON Graph Compiler',
      actionText: 'Explore Nodes'
    },
    {
      id: 'guardrails',
      category: 'guardrail',
      tag: 'Guardrail',
      num: '05',
      title: 'Cognee Margin Ceiling',
      desc: 'Strict knowledge-graph policy verification ensuring no autonomous retention offer exceeds the merchant’s 15% margin limit.',
      metric: '15% Ceiling Strict',
      actionText: 'Verify Policies'
    }
  ];

  const filteredLabs = activeLabFilter === 'all' 
    ? labItems 
    : labItems.filter(item => item.category === activeLabFilter);

  return (
    <div className="min-h-screen bg-[#0e0d0a] text-[#f2ebd8] relative overflow-x-hidden selection:bg-[#ed6f5c]/30 selection:text-white">
      {/* 1. Mouse-Reactive WebGPU Ambient Shader Canvas */}
      <ShaderBackground opacity={0.35} />

      {/* 2. Sticky Clean Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(242,235,216,0.08)] bg-[#0e0d0a]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between gap-6">
          
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[rgba(242,235,216,0.25)] bg-[#1e1c18] flex items-center justify-center font-serif italic text-base text-[#f2ebd8] shadow-sm">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-sm sm:text-base tracking-tight text-[#f2ebd8]">Paytm ActionMate</span>
                <span className="hidden sm:inline-block text-[9.5px] font-mono font-semibold text-[#ed6f5c] bg-[#ed6f5c]/10 border border-[#ed6f5c]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Track 3
                </span>
              </div>
            </div>
          </div>

          {/* Clean Navigation Links (no confusing superscript numbers) */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-[#c8c0a8]">
            <a href="#capabilities" className="hover:text-[#ed6f5c] transition">
              Capabilities
            </a>
            <a href="#labs" className="hover:text-[#ed6f5c] transition">
              Studio Labs
            </a>
            <a href="#method" className="hover:text-[#ed6f5c] transition">
              Pipeline
            </a>
            <a href="#work" className="hover:text-[#ed6f5c] transition">
              Selected Cases
            </a>
            <a href="#pricing" className="hover:text-[#ed6f5c] transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#ed6f5c] transition">
              FAQ
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => playPaytmChime('Paytm Soundbox 3.0 online. Battery 88 percent.')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(242,235,216,0.04)] hover:bg-[rgba(242,235,216,0.08)] border border-[rgba(242,235,216,0.12)] text-[#f2ebd8] text-xs font-medium transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#ed6f5c]" />
              <span>Soundbox Audio</span>
            </button>

            <button
              onClick={onGoLogin}
              className="px-3.5 py-1.5 rounded-full bg-[rgba(242,235,216,0.04)] hover:bg-[rgba(242,235,216,0.08)] text-[#c8c0a8] hover:text-[#f2ebd8] border border-[rgba(242,235,216,0.12)] text-xs font-semibold transition"
            >
              Merchant Login
            </button>

            <button
              onClick={onLaunchApp}
              className="btn-editorial btn-editorial-primary text-xs py-1.5 px-4"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* =================================================================
            SECTION I: HERO
            ================================================================= */}
        <section id="top" className="pt-10 pb-20 border-b border-[rgba(242,235,216,0.08)]">
          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Editorial Display Typography & CTAs */}
            <div className="lg:col-span-7 space-y-7 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(237,111,92,0.1)] border border-[rgba(237,111,92,0.25)] text-xs font-mono text-[#ed6f5c]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ed6f5c] animate-pulse" />
                Autonomous Merchant Intelligence
              </div>

              <h1 className="display-title text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#f2ebd8]">
                The Autonomous AI Teammate for <em>Indian Merchants</em><span className="dot">.</span>
              </h1>

              <p className="lead-editorial text-base sm:text-lg max-w-2xl text-[#c8c0a8]">
                Move seamlessly from <em>"What happened to my evening sales?"</em> to <em>"Auto-resolved with Gemini reasoning, n8n retention campaigns, and broadcast live via Soundbox 3.0."</em>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onLaunchApp}
                  className="btn-editorial btn-editorial-primary text-sm py-3 px-6 shadow-xl group"
                >
                  <span>Explore Live Demo (Sharma Café)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => {
                    playPaytmChime('Paytm Soundbox: ₹14,280 settled. 47 inactive evening regulars offer dispatched.');
                  }}
                  className="btn-editorial btn-editorial-ghost text-sm py-3 px-6"
                >
                  <Volume2 className="w-4 h-4 text-[#ed6f5c]" />
                  <span>Play Soundbox 3.0 Chime</span>
                </button>
              </div>

              {/* Editorial Stat Rings */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[rgba(242,235,216,0.08)]">
                <div className="flex items-center gap-3">
                  <span className="stat-ring solid">18%</span>
                  <div className="text-[11px] font-sans leading-tight">
                    <b className="block text-[#f2ebd8] font-bold">Slump</b>
                    <span className="text-[#9a9382] uppercase tracking-wider font-mono text-[10px]">Isolated</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="stat-ring coral">47</span>
                  <div className="text-[11px] font-sans leading-tight">
                    <b className="block text-[#f2ebd8] font-bold">Regulars</b>
                    <span className="text-[#9a9382] uppercase tracking-wider font-mono text-[10px]">Retained</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="stat-ring mustard">15</span>
                  <div className="text-[11px] font-sans leading-tight">
                    <b className="block text-[#f2ebd8] font-bold">RPM Limit</b>
                    <span className="text-[#9a9382] uppercase tracking-wider font-mono text-[10px]">Gemini 3.1</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="stat-ring">784</span>
                  <div className="text-[11px] font-sans leading-tight">
                    <b className="block text-[#f2ebd8] font-bold">Hz Chime</b>
                    <span className="text-[#9a9382] uppercase tracking-wider font-mono text-[10px]">Soundbox 3.0</span>
                  </div>
                </div>
              </div>

              {/* Bottom Status Info */}
              <div className="flex items-center text-[11px] font-mono text-[#6e6860] pt-4">
                <span>⚡ Automated n8n workflow active · Instant merchant recovery</span>
              </div>
            </div>

            {/* Right Column: 3D Interactive Telemetry Card */}
            <div className="lg:col-span-5 relative">
              <div 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={onLaunchApp}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="relative rounded-2xl bg-[#161410]/90 border border-[rgba(242,235,216,0.14)] p-6 shadow-2xl backdrop-blur-xl cursor-pointer group hover:border-[#ed6f5c]/40 transition-all"
              >
                {/* Subtle Corner Accents */}
                <span className="corner tl"></span>
                <span className="corner tr"></span>
                <span className="corner bl"></span>
                <span className="corner br"></span>
                
                {/* Top Terminal Bar */}
                <div className="flex items-center justify-between pb-4 pt-1 border-b border-[rgba(242,235,216,0.08)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ed6f5c]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e9b94a]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-mono text-[#9a9382] ml-2">TELEMETRY · SHARMA CAFÉ</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#ed6f5c] bg-[#ed6f5c]/10 border border-[#ed6f5c]/20 px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                {/* Inner Data Cards */}
                <div className="space-y-3 pt-4 text-left">
                  
                  {/* Metric 1 */}
                  <div className="p-3.5 rounded-xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.06)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a9382] block">Today's Settlements</span>
                      <span className="text-xl font-bold font-sans text-[#f2ebd8]">₹14,280</span>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      +8.2% vs avg
                    </span>
                  </div>

                  {/* Metric 2: Anomaly Alert */}
                  <div className="p-3.5 rounded-xl bg-[#23201c]/90 border border-[#ed6f5c]/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#ed6f5c] font-semibold flex items-center gap-1.5">
                        <TrendingDown className="w-3.5 h-3.5" />
                        SLUMP DETECTED
                      </span>
                      <span className="text-[10px] font-mono text-[#9a9382]">6 PM - 9 PM</span>
                    </div>
                    <div className="text-base font-bold font-sans text-[#f2ebd8]">
                      -18.4% Evening Slump (47 Regulars Inactive)
                    </div>
                    <p className="text-[11px] text-[#c8c0a8]">
                      Root cause: Street construction outside outlet.
                    </p>
                  </div>

                  {/* Metric 3: Automated n8n Recovery Draft */}
                  <div className="p-3.5 rounded-xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.06)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#e9b94a] flex items-center gap-1.5">
                        <Workflow className="w-3.5 h-3.5" />
                        n8n ACTION DRAFT
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">Policy Passed</span>
                    </div>
                    <div className="text-sm font-semibold text-[#f2ebd8]">
                      WhatsApp Campaign: "Special 10% Chai & Samosa Combo"
                    </div>
                    <div className="w-full bg-[#2a2620] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#ed6f5c] h-full w-3/4 rounded-full"></div>
                    </div>
                  </div>

                </div>

                {/* Bottom Step Progression Index */}
                <div className="grid grid-cols-4 gap-2 pt-4 mt-2 border-t border-[rgba(242,235,216,0.08)] text-center text-[10px] font-mono">
                  <div className="p-1.5 rounded bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] text-[#c8c0a8]">
                    <span className="block text-[#ed6f5c] font-bold">01</span>Detect
                  </div>
                  <div className="p-1.5 rounded bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] text-[#c8c0a8]">
                    <span className="block text-[#e9b94a] font-bold">02</span>Reason
                  </div>
                  <div className="p-1.5 rounded bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] text-[#c8c0a8]">
                    <span className="block text-indigo-400 font-bold">03</span>Execute
                  </div>
                  <div className="p-1.5 rounded bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] text-[#c8c0a8]">
                    <span className="block text-emerald-400 font-bold">04</span>Soundbox
                  </div>
                </div>

                <div className="text-center pt-3 text-[11px] font-sans font-semibold text-[#ed6f5c] group-hover:underline flex items-center justify-center gap-1">
                  <span>Click to launch interactive workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            SECTION II: WIRE / CONTINUOUS LIVE TELEMETRY MARQUEE
            ================================================================= */}
        <section className="py-8 border-b border-[rgba(242,235,216,0.08)]" aria-label="Live Telemetry Wire">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* Wire Label */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="pulse-dot"></span>
              <div>
                <b className="block text-xs font-sans text-[#f2ebd8] uppercase tracking-wider">Store Wire</b>
                <span className="text-[10px] font-mono text-[#6e6860]">NCR · 150+ Merchants</span>
              </div>
            </div>

            {/* Marquee Tickers */}
            <div className="flex-1 w-full overflow-hidden space-y-2">
              {/* Row 1: Indian Cities */}
              <div className="marquee-wrapper">
                <div className="marquee-track text-xs font-mono text-[#9a9382]">
                  <span>• <b>Noida</b></span>
                  <span>• <b>New Delhi</b></span>
                  <span>• <b>Gurgaon</b></span>
                  <span>• <b>Bangalore</b></span>
                  <span>• <b>Mumbai</b></span>
                  <span>• <b>Jaipur</b></span>
                  <span>• <b>Hyderabad</b></span>
                  <span>• <b>Chennai</b></span>
                  <span>• <b>Kolkata</b></span>
                  <span>• <b>Pune</b></span>
                  {/* Duplicated for seamless loop */}
                  <span>• <b>Noida</b></span>
                  <span>• <b>New Delhi</b></span>
                  <span>• <b>Gurgaon</b></span>
                  <span>• <b>Bangalore</b></span>
                  <span>• <b>Mumbai</b></span>
                  <span>• <b>Jaipur</b></span>
                  <span>• <b>Hyderabad</b></span>
                  <span>• <b>Chennai</b></span>
                  <span>• <b>Kolkata</b></span>
                  <span>• <b>Pune</b></span>
                </div>
              </div>

              {/* Row 2: Live Telemetry Events */}
              <div className="marquee-wrapper">
                <div className="marquee-track reverse text-xs font-mono text-[#c8c0a8]">
                  <span>⚡ ₹14,280 settled via Paytm Soundbox</span>
                  <span>⚡ Evening slump isolated (-18.4%)</span>
                  <span>⚡ 47 WhatsApp retention vouchers claimed</span>
                  <span>⚡ Cognee 15% discount limit validated</span>
                  <span>⚡ Sarvam AI voice prompt transcribed in Hinglish</span>
                  <span>⚡ Sharma Café recovered ₹19,200 revenue</span>
                  {/* Duplicated for seamless loop */}
                  <span>⚡ ₹14,280 settled via Paytm Soundbox</span>
                  <span>⚡ Evening slump isolated (-18.4%)</span>
                  <span>⚡ 47 WhatsApp retention vouchers claimed</span>
                  <span>⚡ Cognee 15% discount limit validated</span>
                  <span>⚡ Sarvam AI voice prompt transcribed in Hinglish</span>
                  <span>⚡ Sharma Café recovered ₹19,200 revenue</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            SECTION II: ABOUT
            ================================================================= */}
        <section id="about" className="py-20 border-b border-[rgba(242,235,216,0.08)] text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="label-editorial">
                About ActionMate
              </div>
              <h2 className="display-title text-3xl sm:text-5xl font-extrabold text-[#f2ebd8]">
                We treat store intelligence as an <em>autonomous teammate,</em> not a static spreadsheet<span className="dot">.</span>
              </h2>
              <p className="lead-editorial text-base sm:text-lg text-[#c8c0a8]">
                Indian shopkeepers work 14 hours a day. When evening footfall drops 18%, they don't have time to download CSV files, build pivot tables, or write SQL queries. ActionMate acts continuously in the background: detecting revenue churn cohorts, reasoning through remedies, drafting automated n8n WhatsApp campaigns, and broadcasting results audibly via Paytm Soundbox 3.0.
              </p>
              
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={onLaunchApp}
                  className="btn-editorial btn-editorial-ghost text-xs"
                >
                  <span>Read System Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ed6f5c]" />
                </button>
                <span className="text-xs font-mono text-[#6e6860]">
                  Track 3 Finals · Built for India
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.12)] space-y-4">
              <div className="text-xs font-mono text-[#ed6f5c] uppercase tracking-wider">
                Field Observation
              </div>
              <p className="text-xs text-[#c8c0a8] leading-relaxed italic">
                "92% of Indian retail slumps are caused by temporary external factors (weather, nearby roadwork, competitor discount weeks). If an automated retention campaign reaches regulars within 48 hours, 76% return immediately."
              </p>
              <div className="border-t border-[rgba(242,235,216,0.08)] pt-3 text-[11px] font-mono text-[#6e6860]">
                Source: NCR Retail Sensor Ledger, 2026
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION III: CAPABILITIES MATRIX
            ================================================================= */}
        <section id="capabilities" className="py-20 border-b border-[rgba(242,235,216,0.08)] text-left">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="label-editorial">
              Core Capabilities
            </div>
            <h2 className="display-title text-3xl sm:text-4xl font-extrabold text-[#f2ebd8]">
              Engineered specifically for the Indian merchant workflow<span className="dot">.</span>
            </h2>
            <p className="lead-editorial text-sm sm:text-base text-[#c8c0a8]">
              Unlike generic chat bots, ActionMate tightly unifies counter-top hardware, natural voice comprehension, dynamic execution graphs, and strict risk guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 01: Anomaly Radar */}
            <div className="p-7 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/50 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-[#ed6f5c] font-bold">01</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a9382] bg-[#1e1c18] px-2.5 py-1 rounded-full border border-[rgba(242,235,216,0.06)]">
                    Radar
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] flex items-center justify-center text-[#ed6f5c] group-hover:scale-110 transition">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Autonomous Anomaly Radar</h3>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  Continuously streams UPI transactions and compares them hour-by-hour against 14-day Bayesian normal bands. Pinpoints exact churn cohorts (e.g. 47 evening regulars) before revenue erodes.
                </p>
              </div>
              <div className="text-[11px] font-mono font-semibold text-[#ed6f5c] flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Automatic root-cause diagnosis →</span>
              </div>
            </div>

            {/* Card 02: Dual Voice Engine */}
            <div className="p-7 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/50 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-[#ed6f5c] font-bold">02</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a9382] bg-[#1e1c18] px-2.5 py-1 rounded-full border border-[rgba(242,235,216,0.06)]">
                    Voice
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] flex items-center justify-center text-[#e9b94a] group-hover:scale-110 transition">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Dual Voice Stack (Hinglish)</h3>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  Blends <strong>Sarvam AI</strong> (Saaras STT & Bulbul TTS for authentic vernacular accents and colloquial Hinglish) with automatic failover to <strong>Gemini Live Multimodal Audio</strong>.
                </p>
              </div>
              <div className="text-[11px] font-mono font-semibold text-[#e9b94a] flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Vernacular speech understanding →</span>
              </div>
            </div>

            {/* Card 03: Dynamic n8n Studio */}
            <div className="p-7 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/50 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-[#ed6f5c] font-bold">03</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a9382] bg-[#1e1c18] px-2.5 py-1 rounded-full border border-[rgba(242,235,216,0.06)]">
                    Studio
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Dynamic n8n Workflow Compiler</h3>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  Merchants articulate operational rules in speech (<em>"Agar koi regular 3 din na aaye to WhatsApp reminder bhejo"</em>). ActionMate compiles it into an executable, visual multi-node n8n workflow graph.
                </p>
              </div>
              <div className="text-[11px] font-mono font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Speech-to-n8n compilation →</span>
              </div>
            </div>

            {/* Card 04: Cognee Policy Memory */}
            <div className="p-7 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/50 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-[#ed6f5c] font-bold">04</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a9382] bg-[#1e1c18] px-2.5 py-1 rounded-full border border-[rgba(242,235,216,0.06)]">
                    Memory
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Cognee Policy Memory</h3>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  Store margins, working capital limits, and promotional rules are grounded in a semantic knowledge graph. ActionMate mathematically refuses any retention action exceeding the 15% discount cap.
                </p>
              </div>
              <div className="text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Zero margin breaches guaranteed →</span>
              </div>
            </div>

            {/* Card 05: Paytm Soundbox 3.0 */}
            <div className="p-7 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/50 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-[#ed6f5c] font-bold">05</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a9382] bg-[#1e1c18] px-2.5 py-1 rounded-full border border-[rgba(242,235,216,0.06)]">
                    Hardware
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] flex items-center justify-center text-[#ed6f5c] group-hover:scale-110 transition">
                  <Volume2 className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Paytm Soundbox 3.0 Sync</h3>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  Transforms merchant alerts into instant audio chimes via Web Audio dual-sine wave synthesis (784 Hz + 1046 Hz). Confirms settlements and campaign dispatches audibly on the countertop.
                </p>
              </div>
              <div className="text-[11px] font-mono font-semibold text-[#ed6f5c] flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Audible counter-top feedback →</span>
              </div>
            </div>

            {/* Card 06: Human-in-the-Loop Risk Guardrail */}
            <div className="p-7 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/50 transition-all flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-[#ed6f5c] font-bold">06</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9a9382] bg-[#1e1c18] px-2.5 py-1 rounded-full border border-[rgba(242,235,216,0.06)]">
                    Guardrail
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#1e1c18] border border-[rgba(242,235,216,0.1)] flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Human-in-the-Loop Guardrail</h3>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  Actions are tiered into Low, Medium, and High risk. Any outward WhatsApp dispatch, budget commitment, or store discount must wait in the Approval Queue until explicitly approved by the merchant.
                </p>
              </div>
              <div className="text-[11px] font-mono font-semibold text-rose-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>No rogue autonomous spend →</span>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            SECTION IV: LABS / INTERACTIVE HARDWARE & LOGIC STUDIO
            ================================================================= */}
        <section id="labs" className="py-20 border-b border-[rgba(242,235,216,0.08)] text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-3">
              <div className="label-editorial">
                Studio Labs
              </div>
              <h2 className="display-title text-3xl sm:text-4xl font-extrabold text-[#f2ebd8]">
                A living catalog of merchant <em>intelligence</em> & hardware nodes<span className="dot">.</span>
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setActiveLabFilter('all')}
                className={`editorial-pill ${activeLabFilter === 'all' ? 'active' : ''}`}
              >
                All <span className="count">05</span>
              </button>
              <button 
                onClick={() => setActiveLabFilter('slump')}
                className={`editorial-pill ${activeLabFilter === 'slump' ? 'active' : ''}`}
              >
                Slump Radar <span className="count">01</span>
              </button>
              <button 
                onClick={() => setActiveLabFilter('voice')}
                className={`editorial-pill ${activeLabFilter === 'voice' ? 'active' : ''}`}
              >
                Voice & Dialect <span className="count">01</span>
              </button>
              <button 
                onClick={() => setActiveLabFilter('hardware')}
                className={`editorial-pill ${activeLabFilter === 'hardware' ? 'active' : ''}`}
              >
                Soundbox Sync <span className="count">01</span>
              </button>
              <button 
                onClick={() => setActiveLabFilter('workflows')}
                className={`editorial-pill ${activeLabFilter === 'workflows' ? 'active' : ''}`}
              >
                Workflows <span className="count">01</span>
              </button>
            </div>
          </div>

          {/* Labs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs.map((lab) => (
              <div 
                key={lab.id} 
                className="p-6 rounded-2xl bg-[#161410]/90 border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#9a9382]">
                    <span>{lab.num}</span>
                    <span className="text-[#ed6f5c] font-semibold bg-[#ed6f5c]/10 border border-[#ed6f5c]/20 px-2 py-0.5 rounded">
                      {lab.tag}
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-lg text-[#f2ebd8]">{lab.title}</h4>
                  <p className="text-xs text-[#c8c0a8] leading-relaxed">{lab.desc}</p>
                </div>

                <div className="pt-4 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#e9b94a]">{lab.metric}</span>
                  {lab.isChime ? (
                    <button
                      onClick={() => playPaytmChime('Paytm Soundbox chime verification. System operating with zero latency.')}
                      className="btn-editorial btn-editorial-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{lab.actionText}</span>
                    </button>
                  ) : (
                    <button
                      onClick={onLaunchApp}
                      className="text-xs font-mono text-[#ed6f5c] hover:underline flex items-center gap-1"
                    >
                      <span>{lab.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =================================================================
            SECTION V: METHOD / THE 4-STAGE AUTONOMOUS LOOP
            ================================================================= */}
        <section id="method" className="py-20 border-b border-[rgba(242,235,216,0.08)] text-left">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="label-editorial">
              The Autonomous Loop
            </div>
            <h2 className="display-title text-3xl sm:text-4xl font-extrabold text-[#f2ebd8]">
              From telemetry signals to countertop <em>resolution</em><span className="dot">.</span>
            </h2>
            <p className="lead-editorial text-sm sm:text-base text-[#c8c0a8]">
              Each loop is deterministic, policy-checked, and audible on the shop counter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] space-y-3">
              <span className="font-mono text-xl text-[#ed6f5c] font-black">01</span>
              <h4 className="font-sans font-bold text-base text-[#f2ebd8]">Detect & Ingest →</h4>
              <p className="text-xs text-[#c8c0a8] leading-relaxed">
                Paytm QR transactions and Soundbox receipts stream in. ActionMate models normal footfall vs hourly anomalies in real-time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] space-y-3">
              <span className="font-mono text-xl text-[#e9b94a] font-black">02</span>
              <h4 className="font-sans font-bold text-base text-[#f2ebd8]">Reason & Policy Check →</h4>
              <p className="text-xs text-[#c8c0a8] leading-relaxed">
                Gemini 3.1 Flash-Lite analyzes the slump (e.g. 18.4% drop) and formulates an offer, validating it strictly against Cognee margin policies.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] space-y-3">
              <span className="font-mono text-xl text-indigo-400 font-black">03</span>
              <h4 className="font-sans font-bold text-base text-[#f2ebd8]">Execute via n8n →</h4>
              <p className="text-xs text-[#c8c0a8] leading-relaxed">
                Once approved via one tap or voice affirmative, n8n dispatches personalized WhatsApp vouchers to the 47 inactive regulars.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] space-y-3">
              <span className="font-mono text-xl text-emerald-400 font-black">04</span>
              <h4 className="font-sans font-bold text-base text-[#f2ebd8]">Announce Live</h4>
              <p className="text-xs text-[#c8c0a8] leading-relaxed">
                Paytm Soundbox 3.0 sounds the chime on the shop counter, announcing the campaign launch and tracking returned customer footfall.
              </p>
            </div>

          </div>
        </section>

        {/* =================================================================
            SECTION VI: SELECTED CASES / NCR MERCHANT IMPACT
            ================================================================= */}
        <section id="work" className="py-20 border-b border-[rgba(242,235,216,0.08)] text-left">
          <div className="max-w-3xl mb-10 space-y-3">
            <div className="label-editorial">
              Merchant Impact Cases
            </div>
            <h2 className="display-title text-3xl sm:text-4xl font-extrabold text-[#f2ebd8]">
              Measurable recovery in active <em>retail stores</em><span className="dot">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Case 1: Sharma Café */}
            <div className="p-6 rounded-2xl bg-[#161410]/90 border border-[rgba(242,235,216,0.1)] space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#9a9382]">
                <span>NOIDA SECTOR 62</span>
                <span className="text-[#ed6f5c]">CAFÉ & SNACKS</span>
              </div>
              <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Sharma Café</h3>
              <p className="text-xs text-[#c8c0a8] leading-relaxed">
                Suffered a sudden 18.4% slump during evening peak due to pavement work. ActionMate re-engaged 47 dormant regular tea drinkers within 48 hours.
              </p>
              <div className="pt-3 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">₹19,200 Recovered</span>
                <span className="text-[10px] font-mono text-[#6e6860]">34/47 Returned</span>
              </div>
            </div>

            {/* Case 2: Amritsari Kulcha Hub */}
            <div className="p-6 rounded-2xl bg-[#161410]/90 border border-[rgba(242,235,216,0.1)] space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#9a9382]">
                <span>GURGAON CYBER CITY</span>
                <span className="text-[#e9b94a]">RESTAURANT</span>
              </div>
              <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Amritsari Kulcha Hub</h3>
              <p className="text-xs text-[#c8c0a8] leading-relaxed">
                Owner utilized natural Hinglish speech to trigger automated weekend lunch coupons. Soundbox 3.0 confirmed dispatch without typing on any device.
              </p>
              <div className="pt-3 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">+24% Weekend Rush</span>
                <span className="text-[10px] font-mono text-[#6e6860]">Voice-Triggered</span>
              </div>
            </div>

            {/* Case 3: Kolkata Daily Mart */}
            <div className="p-6 rounded-2xl bg-[#161410]/90 border border-[rgba(242,235,216,0.1)] space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#9a9382]">
                <span>DELHI CR PARK</span>
                <span className="text-indigo-400">KIRANA & GROCERY</span>
              </div>
              <h3 className="font-sans font-bold text-lg text-[#f2ebd8]">Kolkata Daily Mart</h3>
              <p className="text-xs text-[#c8c0a8] leading-relaxed">
                Automated perishable stock clearance campaign created strictly within Cognee’s 12% margin ceiling, eliminating inventory spoilage.
              </p>
              <div className="pt-3 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">0% Margin Breach</span>
                <span className="text-[10px] font-mono text-[#6e6860]">Auto-Cleared</span>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            SECTION VIII: TRANSPARENT PRICING MATRIX
            ================================================================= */}
        <section id="pricing" className="py-20 border-b border-[rgba(242,235,216,0.08)] text-left">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <div className="label-editorial justify-center">
              Simple & Transparent Pricing
            </div>
            <h2 className="display-title text-3xl sm:text-4xl font-extrabold text-[#f2ebd8]">
              Plans for every Indian merchant stall<span className="dot">.</span>
            </h2>
            <p className="lead-editorial text-sm text-[#c8c0a8]">
              Start free with anomaly radar. Upgrade as footfall expands and you want voice automation and dynamic execution graphs.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center p-1 bg-[#1e1c18] rounded-full border border-[rgba(242,235,216,0.1)] text-xs mt-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full transition ${
                  billingCycle === 'monthly'
                    ? 'bg-[#2a2620] text-[#f2ebd8] font-bold shadow'
                    : 'text-[#9a9382] hover:text-[#f2ebd8]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-[#2a2620] text-[#f2ebd8] font-bold shadow'
                    : 'text-[#9a9382] hover:text-[#f2ebd8]'
                }`}
              >
                <span>Annual</span>
                <span className="text-[9px] font-bold text-[#ed6f5c] bg-[#ed6f5c]/10 border border-[#ed6f5c]/20 px-1.5 py-0.2 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Tier 1: Starter */}
            <div className="p-8 rounded-2xl bg-[#161410]/90 border border-[rgba(242,235,216,0.08)] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#f2ebd8]">Starter Kirana</h3>
                  <p className="text-xs text-[#9a9382] mt-1">For single merchant stalls and tea points</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#f2ebd8]">₹0</span>
                  <span className="text-xs text-[#9a9382]">/ forever free</span>
                </div>

                <ul className="space-y-3 text-xs text-[#c8c0a8] pt-4 border-t border-[rgba(242,235,216,0.08)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span>1 Paytm Soundbox 3.0 Sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span>Daily Slump Anomaly Radar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span>Gemini 3.1 Flash-Lite Intelligence</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#6e6860]">
                    <span className="w-4 h-4 flex items-center justify-center font-bold">✕</span>
                    <span>Automated WhatsApp Campaigns</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onLaunchApp}
                className="btn-editorial btn-editorial-ghost w-full justify-center text-xs"
              >
                Get Started Free
              </button>
            </div>

            {/* Tier 2: Growth Merchant (Popular) */}
            <div className="p-8 rounded-2xl bg-[#1e1c18]/90 border-2 border-[#ed6f5c] shadow-[0_0_30px_rgba(237,111,92,0.15)] flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-white bg-[#ed6f5c] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                Most Popular
              </span>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#f2ebd8]">Growth Merchant</h3>
                  <p className="text-xs text-[#9a9382] mt-1">For busy cafés, dhabas, and retail shops</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#f2ebd8]">
                    {billingCycle === 'monthly' ? '₹499' : '₹399'}
                  </span>
                  <span className="text-xs text-[#9a9382]">/ month</span>
                </div>

                <ul className="space-y-3 text-xs text-[#f2ebd8] pt-4 border-t border-[rgba(242,235,216,0.1)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span><strong>Dual Voice Engine:</strong> Sarvam + Gemini</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span><strong>Automated n8n Workflows:</strong> WhatsApp Retention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span><strong>Cognee Policy Engine:</strong> 15% Margin Guard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span>Soundbox 3.0 Live Audio Chimes</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onLaunchApp}
                className="btn-editorial btn-editorial-primary w-full justify-center text-xs py-3"
              >
                <span>Start 14-Day Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tier 3: Enterprise Franchise */}
            <div className="p-8 rounded-2xl bg-[#161410]/90 border border-[rgba(242,235,216,0.08)] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#f2ebd8]">Franchise Multi-Outlet</h3>
                  <p className="text-xs text-[#9a9382] mt-1">For restaurant chains and retail franchises</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#f2ebd8]">
                    {billingCycle === 'monthly' ? '₹1,999' : '₹1,599'}
                  </span>
                  <span className="text-xs text-[#9a9382]">/ store / month</span>
                </div>

                <ul className="space-y-3 text-xs text-[#c8c0a8] pt-4 border-t border-[rgba(242,235,216,0.08)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span>Multi-Outlet Synchronized Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span>Tally & ERP Balance Sheet Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span>Custom Brand Voice for Soundbox</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#ed6f5c] shrink-0" />
                    <span>Dedicated 24/7 SLA Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onLaunchApp}
                className="btn-editorial btn-editorial-ghost w-full justify-center text-xs"
              >
                Contact Franchise Sales
              </button>
            </div>

          </div>
        </section>

        {/* =================================================================
            SECTION IX: TESTIMONIALS & FRONTLINE VOICES
            ================================================================= */}
        <section id="testimonials" className="py-20 border-b border-[rgba(242,235,216,0.08)] text-left">
          
          <div className="max-w-4xl mx-auto mb-8 text-center">
            <div className="label-editorial justify-center">
              Merchant Voices
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.12)] space-y-6">
            <div className="flex items-center gap-1 text-[#e9b94a]">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>

            <blockquote className="font-serif italic text-xl sm:text-2xl text-[#f2ebd8] leading-relaxed">
              “Pichle hafte hamari shaam ki chai sales gir gayi thi. ActionMate ne notice kiya ki 47 regular patrons nahi aaye. AI ne 10% coupon bana kar WhatsApp bhej diya aur do din me ₹19,000 ki sales wapas aa gayi!”
            </blockquote>

            <div className="flex items-center justify-between pt-4 border-t border-[rgba(242,235,216,0.08)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1e1c18] border border-[rgba(242,235,216,0.2)] flex items-center justify-center font-bold text-xs text-[#ed6f5c]">
                  RS
                </div>
                <div>
                  <h5 className="font-sans font-bold text-sm text-[#f2ebd8]">Ramesh Sharma</h5>
                  <p className="text-[11px] font-mono text-[#9a9382]">Owner, Sharma Café & Snacks (Noida)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#ed6f5c]">Verified Merchant</span>
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION X: FAQ SECTION
            ================================================================= */}
        <section id="faq" className="py-20 border-b border-[rgba(242,235,216,0.08)] text-left">
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <div className="label-editorial justify-center">
                Frequently Asked Questions
              </div>
              <h2 className="display-title text-3xl font-extrabold text-[#f2ebd8]">
                Everything you need to know<span className="dot">.</span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] space-y-2">
                <h4 className="font-sans font-bold text-base text-[#f2ebd8]">
                  Kya ActionMate bina pooche discount bhej sakta hai?
                </h4>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  Nahi, bilkul nahi. ActionMate ke paas strict Human-in-the-Loop guardrail hai. Har ek campaign draft hokar Approval Queue mein aati hai. Jab tak merchant use approve nahi karta, tab tak ek bhi message ya discount trigger nahi hota.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] space-y-2">
                <h4 className="font-sans font-bold text-base text-[#f2ebd8]">
                  Paytm Soundbox 3.0 ke sath kaise connect hota hai?
                </h4>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  ActionMate Paytm IoT gateway ke saath real-time telemetry connect karta hai. Jab bhi payment aati hai ya campaign approve hoti hai, Soundbox counter par 784 Hz + 1046 Hz voice chime ke sath announce karta hai.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#161410]/80 border border-[rgba(242,235,216,0.08)] space-y-2">
                <h4 className="font-sans font-bold text-base text-[#f2ebd8]">
                  Kaunsa AI model use hota hai? Rate limit issue to nahi aayega?
                </h4>
                <p className="text-xs text-[#c8c0a8] leading-relaxed">
                  ActionMate strictly <strong>Gemini 3.1 Flash-Lite</strong> use karta hai jisme 10-15 RPM ki high rate limit milti hai. Voice ke liye Sarvam AI aur Gemini Live ka dual engine hai jo token aur credit consume hone par automatic failover karta hai.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================================
            SECTION XI: CALL TO ACTION
            ================================================================= */}
        <section className="py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="label-editorial justify-center">
              Deploy In Minutes
            </div>
            
            <h2 className="display-title text-3xl sm:text-5xl font-extrabold text-[#f2ebd8]">
              Let's make every merchant stall <em>autonomous</em> and <em>unslumpable</em><span className="dot">.</span>
            </h2>

            <p className="lead-editorial text-sm sm:text-base max-w-xl mx-auto text-[#c8c0a8]">
              Join the finals demonstration. Three clicks to deploy your store radar and link your Paytm Soundbox 3.0.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onLaunchApp}
                className="btn-editorial btn-editorial-primary text-sm py-3.5 px-8 shadow-2xl"
              >
                <span>Launch Interactive App</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoLogin}
                className="btn-editorial btn-editorial-ghost text-sm py-3.5 px-8"
              >
                <span>Merchant Login</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* =================================================================
          MEGA TYPOGRAPHIC FOOTER
          ================================================================= */}
      <footer className="relative z-10 border-t border-[rgba(242,235,216,0.1)] bg-[#0e0d0a]/90 text-left pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[rgba(242,235,216,0.2)] bg-[#1e1c18] flex items-center justify-center font-serif italic text-sm text-[#f2ebd8]">
                  AM
                </div>
                <span className="font-sans font-bold text-base text-[#f2ebd8]">Paytm ActionMate</span>
              </div>
              <p className="text-xs text-[#9a9382] leading-relaxed">
                The Autonomous AI Teammate for Indian Merchants. Built for the Paytm Build for India Hackathon Finals.
              </p>
              <div className="text-[11px] font-mono text-[#6e6860]">
                Apache-2.0 · Made in India
              </div>
            </div>

            {/* Navigation 1 */}
            <div className="space-y-3">
              <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-[#f2ebd8]">Systems</h5>
              <ul className="space-y-2 text-xs text-[#9a9382]">
                <li><a href="#capabilities" className="hover:text-[#ed6f5c] transition">Anomaly Radar</a></li>
                <li><a href="#capabilities" className="hover:text-[#ed6f5c] transition">Dual Voice Engine</a></li>
                <li><a href="#capabilities" className="hover:text-[#ed6f5c] transition">n8n Workflow Studio</a></li>
                <li><a href="#capabilities" className="hover:text-[#ed6f5c] transition">Cognee Policy Guard</a></li>
                <li><a href="#capabilities" className="hover:text-[#ed6f5c] transition">Paytm Soundbox 3.0</a></li>
              </ul>
            </div>

            {/* Navigation 2 */}
            <div className="space-y-3">
              <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-[#f2ebd8]">Hardware & Models</h5>
              <ul className="space-y-2 text-xs text-[#9a9382]">
                <li><span className="hover:text-[#f2ebd8] transition">Gemini 3.1 Flash-Lite</span></li>
                <li><span className="hover:text-[#f2ebd8] transition">Sarvam AI Saaras STT</span></li>
                <li><span className="hover:text-[#f2ebd8] transition">Sarvam AI Bulbul TTS</span></li>
                <li><span className="hover:text-[#f2ebd8] transition">Web Audio 784/1046 Hz</span></li>
                <li><span className="hover:text-[#f2ebd8] transition">Supabase Telemetry</span></li>
              </ul>
            </div>

            {/* Hackathon Track Info */}
            <div className="space-y-3">
              <h5 className="font-sans font-bold text-xs uppercase tracking-wider text-[#f2ebd8]">Hackathon Finals</h5>
              <p className="text-xs text-[#9a9382] leading-relaxed">
                Track 3 Finalist Build. Autonomous merchant telemetry, edge voice synthesis, and countertop audio feedback.
              </p>
              <div className="text-[11px] font-mono text-[#ed6f5c]">
                ● Status: Ready for Evaluation
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[rgba(242,235,216,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6e6860]">
            <div className="flex items-center gap-2">
              <span className="pulse-dot"></span>
              <span>© {new Date().getFullYear()} Paytm ActionMate</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Built with ❤️ for Indian Merchants</span>
            </div>
          </div>

          {/* Mega Wordmark */}
          <div className="pt-4 text-center select-none opacity-20 pointer-events-none">
            <span className="font-sans font-black text-6xl sm:text-8xl lg:text-9xl tracking-tighter text-[#f2ebd8]">
              Action<em className="font-serif italic font-normal text-[#ed6f5c]">Mate</em>.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
