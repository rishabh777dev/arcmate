import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  User, 
  ChevronDown, 
  Check, 
  Plus, 
  Flame, 
  Users, 
  Radio, 
  FileText, 
  Database, 
  Info,
  ChevronUp,
  X
} from 'lucide-react';
import { playPaytmChime } from '../../services/soundboxAudio';

const AVAILABLE_MODELS = [
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    badge: 'Active · Fast',
    desc: 'Ultra-low latency reasoning, sales analysis & Cognee policy enforcement'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    badge: 'Deep Analytics',
    desc: 'Cross-week trend modeling and deep patron cohort clustering'
  },
  {
    id: 'rule-engine',
    name: 'Deterministic Rule Engine',
    badge: 'Offline Mode',
    desc: 'Local business policy rules & direct Paytm Soundbox telemetry'
  }
];

export default function CopilotChat({
  messages = [],
  onSendMessage,
  onClearMessages,
  isProcessing = false,
  agentSteps = [],
  pendingAction = null,
  activeMerchant = null,
  onApproveAction,
  onNavigateTab
}) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-flash-lite');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isGuardrailModalOpen, setIsGuardrailModalOpen] = useState(false);
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const dropdownRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentSteps, isProcessing]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Web Speech API integration
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          setIsRecording(false);
        }
      } else {
        setInputText("Check today's sales and customer retention status");
      }
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim(), selectedModel);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickPrompts = [
    { label: "Analyze Today's Collections", prompt: "Check today's sales, payment modes, and settlement status" },
    { label: "Identify Lost Regulars", prompt: "Identify regular customers who stopped visiting in the last 14 days" },
    { label: "Launch Winback Campaign", prompt: "Create automated re-engagement campaign for inactive regulars within policy" },
    { label: "Verify 15% Discount Policy", prompt: "Verify store discount and margin rules in Cognee knowledge graph" }
  ];

  const currentModelObj = AVAILABLE_MODELS.find(m => m.id === selectedModel) || AVAILABLE_MODELS[0];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-5xl mx-auto relative font-sans">
      
      {/* Top Navigation Bar: Model Switcher & Utility Actions */}
      <div className="h-12 flex items-center justify-between px-2 mb-2 shrink-0 z-30">
        
        {/* Model Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181612]/90 hover:bg-[#201d17] border border-[rgba(242,235,216,0.12)] text-[#f2ebd8] text-xs font-medium transition shadow-sm hover:border-[#ed6f5c]/40 cursor-pointer backdrop-blur-md"
          >
            <Sparkles size={14} className="text-[#ed6f5c]" />
            <span className="font-semibold">{currentModelObj.name}</span>
            <span className="text-[10px] text-[#ed6f5c] bg-[#ed6f5c]/10 border border-[#ed6f5c]/20 px-1.5 py-0.2 rounded-full font-mono">
              {currentModelObj.badge}
            </span>
            <ChevronDown size={13} className={`text-[#9a9382] transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isModelDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-[#161410]/95 border border-[rgba(242,235,216,0.14)] rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-mono text-[#9a9382] uppercase px-3 py-1.5 font-semibold">
                Reasoning Architecture
              </div>
              <div className="space-y-1">
                {AVAILABLE_MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start justify-between ${
                      selectedModel === model.id
                        ? 'bg-[#ed6f5c]/15 text-[#f2ebd8] border border-[#ed6f5c]/30'
                        : 'hover:bg-white/[0.04] text-[#c8c0a8]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-semibold">
                        <span>{model.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#ed6f5c]">
                          {model.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9a9382] leading-tight">
                        {model.desc}
                      </p>
                    </div>
                    {selectedModel === model.id && (
                      <Check size={14} className="text-[#ed6f5c] shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={onClearMessages}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181612]/90 hover:bg-[#221f19] border border-[rgba(242,235,216,0.1)] text-xs text-[#c8c0a8] hover:text-[#f2ebd8] transition font-medium cursor-pointer"
              title="Start a new chat session"
            >
              <Plus size={13} className="text-[#ed6f5c]" />
              <span>New Chat</span>
            </button>
          )}

          <button
            onClick={() => setIsGuardrailModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6e7448]/10 hover:bg-[#6e7448]/20 border border-[#6e7448]/30 text-xs text-[#b8c278] transition font-mono font-medium cursor-pointer"
          >
            <ShieldCheck size={13} className="text-[#6e7448]" />
            <span>15% Cap Enforced</span>
          </button>

          <button
            onClick={() => playPaytmChime(`Soundbox 3.0 audio channel verified for ${activeMerchant?.name || 'Store'}.`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181612]/90 hover:bg-[#221f19] border border-[rgba(242,235,216,0.1)] text-xs text-[#c8c0a8] hover:text-[#f2ebd8] transition font-mono cursor-pointer"
            title="Test Paytm Soundbox audio"
          >
            <Volume2 size={13} className="text-[#ed6f5c]" />
            <span>Soundbox Audio</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-between relative scroll-smooth pr-1">
        
        {/* HERO STATE: Empty conversation (Matching Reference Design) */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full text-center py-6 px-4">
            
            {/* 1. Luminous Ambient Orb */}
            <div className="relative mb-6 group cursor-pointer" onClick={() => onSendMessage(quickPrompts[0].prompt, selectedModel)}>
              <div className="absolute -inset-6 bg-gradient-to-r from-[#ed6f5c]/35 via-purple-600/20 to-[#e9b94a]/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition duration-700 animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#161410] via-[#24201a] to-[#362e24] border border-white/25 shadow-[inset_0_2px_12px_rgba(255,255,255,0.3),0_12px_36px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ed6f5c] to-[#a34131] opacity-90 blur-[0.5px] flex items-center justify-center shadow-lg transform group-hover:scale-105 transition">
                  <Sparkles size={20} className="text-[#f2ebd8]" />
                </div>
              </div>
            </div>

            {/* 2. Headline & Subheading */}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f2ebd8] font-sans mb-2">
              Ready to grow {activeMerchant?.name || 'Your Store'}?
            </h1>
            <p className="text-xs md:text-sm text-[#9a9382] max-w-lg mb-7 font-body leading-relaxed">
              ActionMate autonomous AI teammate is monitoring collections, customer cohorts, and Paytm Soundbox hardware.
            </p>

            {/* 3. Quick Action Suggestion Pills (Above Prompt Box) */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4 max-w-2xl">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(item.prompt, selectedModel)}
                  className="px-3.5 py-1.5 rounded-full bg-[#181612]/80 hover:bg-[#221f18] border border-[rgba(242,235,216,0.1)] hover:border-[#ed6f5c]/40 text-[#c8c0a8] hover:text-[#f2ebd8] text-xs transition duration-150 font-medium cursor-pointer shadow-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* 4. Centerpiece Large Prompt Container */}
            <form onSubmit={handleSubmit} className="w-full bg-[#15130f]/95 border border-[rgba(242,235,216,0.14)] focus-within:border-[#ed6f5c]/50 rounded-2xl p-3.5 shadow-2xl transition duration-200 backdrop-blur-xl mb-8 text-left">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-[#ed6f5c] mt-1 shrink-0" />
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about today's collections, invoices, or customer campaigns..."
                  rows={2}
                  className="w-full bg-transparent border-0 resize-none text-sm text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none font-sans leading-relaxed"
                />
              </div>

              {/* Bottom Toolbar inside Prompt Box */}
              <div className="mt-3 pt-2.5 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-[#9a9382] font-mono">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                    <Database size={11} className="text-emerald-400" />
                    <span>Supabase DB</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                    <ShieldCheck size={11} className="text-[#6e7448]" />
                    <span>15% Cap</span>
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                    <Radio size={11} className="text-[#ed6f5c]" />
                    <span>Cognee Cloud</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      isRecording
                        ? 'bg-[#ed6f5c]/25 text-[#ed6f5c] border-[#ed6f5c] animate-pulse'
                        : 'bg-[#1e1c18] hover:bg-[#27231e] text-[#9a9382] hover:text-[#f2ebd8] border-white/[0.08]'
                    }`}
                    title={isRecording ? 'Stop voice listening' : 'Voice input (Speech to Text)'}
                  >
                    {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                  </button>

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isProcessing}
                    className="w-9 h-9 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] disabled:opacity-35 text-white flex items-center justify-center shadow-lg transition cursor-pointer"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </form>

            {/* 5. Three Capability Feature Cards (Reference Design Matching) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full text-left">
              
              <div 
                onClick={() => onSendMessage("Identify regular customers who haven't visited in the last 14 days and create a retention plan", selectedModel)}
                className="p-4 rounded-2xl bg-[#15130f]/80 hover:bg-[#1b1814] border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/40 transition group cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-[#ed6f5c]/10 border border-[#ed6f5c]/25 flex items-center justify-center text-[#ed6f5c] mb-3 group-hover:scale-105 transition">
                  <Users size={16} />
                </div>
                <div className="text-xs font-bold text-[#f2ebd8] font-sans mb-1 flex items-center justify-between">
                  <span>Patron Retention</span>
                  <ArrowRight size={12} className="text-[#9a9382] group-hover:text-[#ed6f5c] group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-[#9a9382] leading-relaxed font-body">
                  Detect repeat customers who stopped visiting and draft targeted winback campaigns.
                </p>
              </div>

              <div 
                onClick={() => onSendMessage("Explain current merchant discount guardrail and margin safety rules", selectedModel)}
                className="p-4 rounded-2xl bg-[#15130f]/80 hover:bg-[#1b1814] border border-[rgba(242,235,216,0.08)] hover:border-[#6e7448]/40 transition group cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-[#6e7448]/15 border border-[#6e7448]/30 flex items-center justify-center text-[#b8c278] mb-3 group-hover:scale-105 transition">
                  <ShieldCheck size={16} />
                </div>
                <div className="text-xs font-bold text-[#f2ebd8] font-sans mb-1 flex items-center justify-between">
                  <span>Policy Guardrail</span>
                  <ArrowRight size={12} className="text-[#9a9382] group-hover:text-[#b8c278] group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-[#9a9382] leading-relaxed font-body">
                  Enforce strict 15% maximum promotional discount cap and margin protection via Cognee.
                </p>
              </div>

              <div 
                onClick={() => onSendMessage("What is the battery and connectivity status of our Paytm Soundbox?", selectedModel)}
                className="p-4 rounded-2xl bg-[#15130f]/80 hover:bg-[#1b1814] border border-[rgba(242,235,216,0.08)] hover:border-[#e9b94a]/40 transition group cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-[#e9b94a]/10 border border-[#e9b94a]/25 flex items-center justify-center text-[#e9b94a] mb-3 group-hover:scale-105 transition">
                  <Radio size={16} />
                </div>
                <div className="text-xs font-bold text-[#f2ebd8] font-sans mb-1 flex items-center justify-between">
                  <span>Paytm Soundbox 3.0</span>
                  <ArrowRight size={12} className="text-[#9a9382] group-hover:text-[#e9b94a] group-hover:translate-x-0.5 transition" />
                </div>
                <p className="text-[11px] text-[#9a9382] leading-relaxed font-body">
                  Synthesize live counter payment audio chimes and check device battery status.
                </p>
              </div>

            </div>

          </div>
        ) : (
          
          /* ACTIVE CONVERSATION STREAM (Centered Spacious Thread) */
          <div className="flex-1 w-full max-w-4xl mx-auto py-4 space-y-6">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'merchant' || msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 flex items-center justify-center text-[#ed6f5c] shrink-0 mt-0.5 shadow-sm">
                      <Bot size={16} />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2`}>
                    
                    {/* Assistant Metadata & Model Badge */}
                    {!isUser && (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#9a9382]">
                        <span className="font-semibold text-[#f2ebd8]">ActionMate Assistant</span>
                        <span>•</span>
                        <span className="text-[#ed6f5c] bg-[#ed6f5c]/10 border border-[#ed6f5c]/20 px-1.5 py-0.2 rounded text-[9px]">
                          {currentModelObj.name}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp || 'Just now'}</span>
                      </div>
                    )}

                    {/* Integrated Collapsible Reasoning Process Accordion */}
                    {!isUser && agentSteps && agentSteps.length > 0 && index === messages.length - 1 && (
                      <div className="mb-2.5 rounded-xl bg-[#14120e] border border-[rgba(242,235,216,0.08)] overflow-hidden text-xs">
                        <button
                          onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono text-[#9a9382] hover:text-[#f2ebd8] transition cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles size={12} className="text-[#ed6f5c]" />
                            <span>Thinking Process ({agentSteps.length} execution steps)</span>
                          </span>
                          {isThinkingOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>

                        {isThinkingOpen && (
                          <div className="p-3 pt-0 space-y-2 border-t border-[rgba(242,235,216,0.04)]">
                            {agentSteps.map((step, sIdx) => (
                              <div key={sIdx} className="p-2 rounded-lg bg-[#1a1713] border border-white/[0.04] text-[11px] space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[10px] font-semibold text-[#ed6f5c] uppercase">
                                    {step.step || 'REASONING'}
                                  </span>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                    step.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-[#e9b94a]/15 text-[#e9b94a] border border-[#e9b94a]/30 animate-pulse'
                                  }`}>
                                    {step.status}
                                  </span>
                                </div>
                                <p className="text-[#c8c0a8] font-body text-[11px]">{step.details}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#ed6f5c] text-white rounded-tr-sm shadow-md font-sans'
                          : 'bg-[#161410] border border-[rgba(242,235,216,0.09)] text-[#f2ebd8] rounded-tl-sm shadow-sm font-sans'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text || msg.content}</p>

                      {/* If assistant attached an action proposal */}
                      {msg.actionDraft && (
                        <div className="mt-3.5 p-4 rounded-xl bg-[#1b1814] border border-[#ed6f5c]/35 text-[#f2ebd8] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-[#ed6f5c] font-sans">{msg.actionDraft.title}</span>
                            <span className="text-[10px] font-mono bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 text-[#ed6f5c] px-2 py-0.5 rounded-full font-semibold">
                              {msg.actionDraft.targetSegment || 'Target Audience'}
                            </span>
                          </div>
                          <p className="text-xs text-[#c8c0a8] font-body leading-relaxed">
                            {msg.actionDraft.offerText}
                          </p>
                          <div className="pt-1">
                            <button
                              onClick={() => onNavigateTab?.('approvals')}
                              className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-semibold text-xs transition cursor-pointer shadow-md"
                            >
                              <span>Inspect in Approval Queue</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <span className="text-[10px] text-[#6e6860] font-mono block text-right pr-1">
                        {msg.timestamp || 'Just now'}
                      </span>
                    )}

                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-[#f2ebd8] shrink-0 mt-0.5">
                      <User size={15} />
                    </div>
                  )}
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex gap-3.5 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 flex items-center justify-center text-[#ed6f5c] shrink-0">
                  <RefreshCw size={14} className="animate-spin text-[#ed6f5c]" />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#161410] border border-[rgba(242,235,216,0.08)] text-xs text-[#9a9382] flex items-center gap-2.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#ed6f5c] animate-pulse" />
                  <span>Reasoning with {currentModelObj.name} & Cognee graph...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

      </div>

      {/* STICKY BOTTOM INPUT: Visible during active conversation */}
      {messages.length > 0 && (
        <div className="pt-2 pb-1 shrink-0 z-20">
          <form onSubmit={handleSubmit} className="w-full bg-[#161410]/95 border border-[rgba(242,235,216,0.14)] focus-within:border-[#ed6f5c]/50 rounded-2xl p-2.5 shadow-2xl transition duration-150 backdrop-blur-xl">
            <div className="flex items-center gap-2 px-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask ActionMate anything..."
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none font-sans py-1"
              />

              <button
                type="button"
                onClick={handleMicClick}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  isRecording
                    ? 'bg-[#ed6f5c]/25 text-[#ed6f5c] border-[#ed6f5c] animate-pulse'
                    : 'bg-[#1e1c18] hover:bg-[#27231e] text-[#9a9382] hover:text-[#f2ebd8] border-white/[0.08]'
                }`}
                title={isRecording ? 'Stop voice listening' : 'Voice input (Speech to Text)'}
              >
                {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="w-8 h-8 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] disabled:opacity-35 text-white flex items-center justify-center shadow-md transition cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POLICY GUARDRAIL INSPECTOR MODAL */}
      {isGuardrailModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-[#161410] border border-[rgba(242,235,216,0.15)] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#6e7448]" />
                <h3 className="text-sm font-bold text-[#f2ebd8] font-sans">Store Policy Guardrails</h3>
              </div>
              <button 
                onClick={() => setIsGuardrailModalOpen(false)}
                className="p-1 rounded-lg text-[#9a9382] hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#1b1814] border border-[#6e7448]/30 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-[#b8c278]">
                  <span>Maximum Promotional Discount</span>
                  <span className="font-mono text-[10px] bg-[#6e7448]/20 px-2 py-0.5 rounded-full">15% Cap</span>
                </div>
                <p className="text-[#9a9382] text-[11px] leading-relaxed">
                  Every campaign proposal drafted by ActionMate is automatically evaluated against this ceiling. Offers &gt; 15% are strictly prohibited.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1b1814] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-[#f2ebd8]">
                  <span>Cognitive Memory Backend</span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">AWS Cloud Active</span>
                </div>
                <p className="text-[#9a9382] text-[11px] leading-relaxed">
                  Connected to Cognee AWS Instance (`tenant-f05eece1-d390-44ab-ae6b-269435b97222.aws.cognee.ai`).
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGuardrailModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-[#f2ebd8] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
