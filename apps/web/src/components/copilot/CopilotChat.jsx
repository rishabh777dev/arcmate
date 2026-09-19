import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  ArrowUp, 
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
  Database, 
  ChevronUp,
  X,
  Sliders,
  Paperclip
} from 'lucide-react';
import { playPaytmChime } from '../../services/soundboxAudio';
import ArcMateLogo from '../common/ArcMateLogo';

const AVAILABLE_MODELS = [
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    badge: 'Fast',
    label: 'Fast Reasoning',
    desc: 'Sub-second real-time reasoning & Cognee policy enforcement'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    badge: 'Deep',
    label: 'Deep Analytics',
    desc: 'Complex multi-turn cross-day sales pattern synthesis'
  },
  {
    id: 'rule-engine',
    name: 'Rule Engine',
    badge: 'Offline',
    label: 'Rule Engine',
    desc: 'Direct database policies & instant Paytm Soundbox telemetry'
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
  const [isContextPopoverOpen, setIsContextPopoverOpen] = useState(false);
  const [isGuardrailModalOpen, setIsGuardrailModalOpen] = useState(false);
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const dropdownRef = useRef(null);
  const contextRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentSteps, isProcessing]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false);
      }
      if (contextRef.current && !contextRef.current.contains(event.target)) {
        setIsContextPopoverOpen(false);
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickPrompts = [
    "Give a full store audit of revenue and costing",
    "Check if there is any bug flow in our workflows",
    "Show supplier invoices and pending bills",
    "Where are our shipments and restock packages?"
  ];

  const currentModelObj = AVAILABLE_MODELS.find(m => m.id === selectedModel) || AVAILABLE_MODELS[0];
  const ownerFirstName = activeMerchant?.ownerName?.split(' ')[0] || activeMerchant?.name || 'there';

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] w-full max-w-4xl mx-auto relative font-sans select-none">
      
      {/* Top Bar: Always clean & minimal */}
      <div className="h-10 flex items-center justify-between px-1 shrink-0 z-30">
        
        {/* Model Selector Pill (Just like Lovable / Claude) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-zinc-200 text-xs font-medium transition cursor-pointer backdrop-blur-md"
          >
            <Sparkles size={13} className="text-[#ed6f5c]" />
            <span>{currentModelObj.name}</span>
            <span className="text-[10px] text-zinc-400 font-mono">({currentModelObj.badge})</span>
            <ChevronDown size={12} className={`text-zinc-400 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isModelDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#18181b]/98 border border-white/15 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl animate-in fade-in duration-100">
              <div className="text-[10px] font-mono text-zinc-400 uppercase px-3 py-1 font-semibold">
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
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start justify-between cursor-pointer ${
                      selectedModel === model.id
                        ? 'bg-[#ed6f5c]/15 text-white border border-[#ed6f5c]/30'
                        : 'hover:bg-white/[0.06] text-zinc-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-semibold text-zinc-100">
                        <span>{model.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                          {model.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
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
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs text-zinc-300 hover:text-white transition font-medium cursor-pointer"
              title="Start a new chat session"
            >
              <Plus size={13} className="text-[#ed6f5c]" />
              <span>New Chat</span>
            </button>
          )}

          <button
            onClick={() => setIsGuardrailModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#6e7448]/15 hover:bg-[#6e7448]/25 border border-[#6e7448]/30 text-xs text-[#b8c278] transition font-mono cursor-pointer"
          >
            <ShieldCheck size={12} className="text-[#6e7448]" />
            <span>15% Cap</span>
          </button>

          <button
            onClick={() => playPaytmChime(`Soundbox 3.0 audio channel verified for ${activeMerchant?.name || 'Store'}.`)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs text-zinc-300 hover:text-white transition font-mono cursor-pointer"
            title="Test Paytm Soundbox audio"
          >
            <Volume2 size={12} className="text-[#ed6f5c]" />
            <span>Soundbox</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center relative pr-1">
        
        {/* ============================================================ */}
        {/* HERO START STATE: DEAD-CENTER (Lovable / ChatGPT / Codex)     */}
        {/* ============================================================ */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-4 text-center my-auto">
            
            {/* 1. Subtle Lovable-style Announcement Pill */}
            <div 
              onClick={() => setIsGuardrailModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs text-zinc-300 transition cursor-pointer mb-5 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ed6f5c] animate-pulse" />
              <span>Arc Mate Autonomous Teammate 2.0</span>
              <ArrowRight size={12} className="text-zinc-500" />
            </div>

            {/* 2. Bold Clean Centered Question (Lovable Style: "What should we build, Humble?") */}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-6 text-center font-sans">
              What should we grow, {ownerFirstName}?
            </h1>

            {/* 3. The Centerpiece Input Capsule (Exact Match to Reference Image!) */}
            <div className="w-full bg-[#1c1c1f]/95 hover:bg-[#202024] focus-within:bg-[#202024] border border-white/15 focus-within:border-white/30 rounded-3xl p-3.5 shadow-2xl transition-all duration-200 backdrop-blur-2xl mb-4 text-left">
              
              {/* Input Text Area */}
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about store audits, bug flows, invoices, shipments, or automations..."
                rows={2}
                className="w-full bg-transparent border-0 resize-none text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans leading-relaxed px-1"
              />

              {/* Bottom Capsule Bar: (+) on left | Plan & mic & (?) on right */}
              <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                
                {/* Left Side: (+) Attach Context */}
                <div className="relative" ref={contextRef}>
                  <button
                    type="button"
                    onClick={() => setIsContextPopoverOpen(!isContextPopoverOpen)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition cursor-pointer"
                    title="Attached context and databases"
                  >
                    <Plus size={16} />
                  </button>

                  {isContextPopoverOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#18181b] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-100">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">
                        Connected Store Data
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.04] text-zinc-200">
                        <span className="flex items-center gap-1.5">
                          <Database size={12} className="text-emerald-400" />
                          <span>Supabase DB</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">Live</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.04] text-zinc-200">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck size={12} className="text-[#6e7448]" />
                          <span>Cognee Rules</span>
                        </span>
                        <span className="text-[10px] text-[#6e7448] font-mono">15% Cap</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Mode/Plan + Mic + Solid (?) Send Button */}
                <div className="flex items-center gap-2">
                  
                  {/* Mode Selector Pill (Lovable "Plan" pill) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                      className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/10 text-[11px] text-zinc-300 hover:text-white transition flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <span>{currentModelObj.label}</span>
                      <ChevronDown size={11} className="text-zinc-400" />
                    </button>
                  </div>

                  {/* Speech to text mic */}
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                      isRecording
                        ? 'bg-[#ed6f5c] text-white animate-pulse'
                        : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                    }`}
                    title={isRecording ? 'Listening...' : 'Voice Input'}
                  >
                    {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>

                  {/* Solid White Circle Send Button with Up-Arrow (Just like Reference!) */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!inputText.trim() || isProcessing}
                    className="w-7 h-7 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 disabled:opacity-20 disabled:hover:bg-white transition cursor-pointer shadow-md"
                    title="Send query"
                  >
                    <ArrowUp size={15} strokeWidth={2.5} />
                  </button>

                </div>
              </div>

            </div>

            {/* 4. Suggestion Quick Action Pills Underneath */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt, selectedModel)}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-zinc-300 hover:text-white text-xs transition cursor-pointer shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>

          </div>
        ) : (
          
          /* ============================================================ */
          /* ACTIVE CONVERSATION STATE                                   */
          /* ============================================================ */
          <div className="flex-1 w-full max-w-2xl mx-auto py-3 space-y-5 overflow-y-auto">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'merchant' || msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <ArcMateLogo size={24} className="w-7 h-7 rounded-lg shadow-sm shrink-0 mt-0.5" />
                  )}

                  <div className="max-w-[85%] space-y-1.5">
                    
                    {/* Collapsible Reasoning Process Accordion */}
                    {!isUser && agentSteps && agentSteps.length > 0 && index === messages.length - 1 && (
                      <div className="mb-2 rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden text-xs">
                        <button
                          onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                          className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={11} className="text-[#ed6f5c]" />
                            <span>Thinking Process ({agentSteps.length} steps)</span>
                          </span>
                          {isThinkingOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {isThinkingOpen && (
                          <div className="p-2.5 pt-0 space-y-1.5 border-t border-white/[0.04]">
                            {agentSteps.map((step, sIdx) => (
                              <div key={sIdx} className="p-2 rounded-lg bg-black/30 border border-white/[0.04] text-[11px] space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[10px] font-semibold text-[#ed6f5c] uppercase">
                                    {step.step || 'STEP'}
                                  </span>
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400">
                                    {step.status}
                                  </span>
                                </div>
                                <p className="text-zinc-300 text-[11px]">{step.details}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#27272a] text-zinc-100 rounded-tr-sm shadow-sm font-sans'
                          : 'bg-white/[0.04] border border-white/10 text-zinc-200 rounded-tl-sm font-sans'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text || msg.content}</p>

                      {/* Action Proposal Attachment */}
                      {msg.actionDraft && (
                        <div className="mt-3 p-3.5 rounded-xl bg-[#18181b] border border-[#ed6f5c]/30 text-zinc-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#ed6f5c]">{msg.actionDraft.title}</span>
                            <span className="text-[9px] font-mono bg-[#ed6f5c]/15 text-[#ed6f5c] px-2 py-0.5 rounded-full font-semibold">
                              {msg.actionDraft.targetSegment || 'Target Audience'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400">
                            {msg.actionDraft.offerText}
                          </p>
                          <button
                            onClick={() => onNavigateTab?.('approvals')}
                            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-semibold text-xs transition cursor-pointer shadow-sm"
                          >
                            <span>Inspect in Approval Queue</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-zinc-500 font-mono block text-right pr-1">
                      {msg.timestamp || 'Just now'}
                    </span>

                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-zinc-200 shrink-0 mt-0.5">
                      <User size={13} />
                    </div>
                  )}
                </div>
              );
            })}

            {isProcessing && (
              <div className="space-y-2">
                {agentSteps && agentSteps.length > 0 && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden text-xs max-w-[85%]">
                    <button
                      type="button"
                      onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={11} className="text-[#ed6f5c]" />
                        <span>Live Reasoning Process ({agentSteps.length} steps)</span>
                      </span>
                      {isThinkingOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isThinkingOpen && (
                      <div className="p-2.5 pt-0 space-y-1.5 border-t border-white/[0.04]">
                        {agentSteps.map((step, sIdx) => (
                          <div key={step.id || sIdx} className="p-2 rounded-lg bg-black/30 border border-white/[0.04] text-[11px] space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-semibold text-[#ed6f5c] uppercase">
                                {step.step || 'STEP'}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400">
                                {step.status}
                              </span>
                            </div>
                            <p className="text-zinc-300 text-[11px]">{step.details}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-7 h-7 rounded-full bg-[#ed6f5c]/20 border border-[#ed6f5c]/30 flex items-center justify-center text-[#ed6f5c] shrink-0">
                    <RefreshCw size={13} className="animate-spin text-[#ed6f5c]" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-zinc-400 flex items-center gap-2 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ed6f5c] animate-pulse" />
                    <span>Reasoning with {currentModelObj.name}...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

      </div>

      {/* Bottom Sticky Input when in Active Conversation (Same Sleek Capsule!) */}
      {messages.length > 0 && (
        <div className="pt-2 pb-1 shrink-0 z-20 max-w-2xl mx-auto w-full">
          <div className="w-full bg-[#1c1c1f]/95 border border-white/15 focus-within:border-white/30 rounded-2xl p-2.5 shadow-2xl transition-all duration-200 backdrop-blur-xl">
            <div className="flex items-center gap-2 px-1">
              
              <button
                type="button"
                onClick={() => setIsContextPopoverOpen(!isContextPopoverOpen)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition cursor-pointer"
                title="Store context"
              >
                <Plus size={14} />
              </button>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Arc Mate anything..."
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans py-1"
              />

              <button
                type="button"
                onClick={handleMicClick}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer ${
                  isRecording
                    ? 'bg-[#ed6f5c] text-white animate-pulse'
                    : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                }`}
                title={isRecording ? 'Listening...' : 'Voice Input'}
              >
                {isRecording ? <MicOff size={13} /> : <Mic size={13} />}
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                className="w-6 h-6 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 disabled:opacity-20 disabled:hover:bg-white transition cursor-pointer shadow-sm"
              >
                <ArrowUp size={13} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POLICY GUARDRAIL MODAL */}
      {isGuardrailModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-100">
          <div className="bg-[#18181b] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#6e7448]" />
                <h3 className="text-sm font-bold text-white font-sans">Store Policy Guardrails</h3>
              </div>
              <button 
                onClick={() => setIsGuardrailModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-[#6e7448]/30 space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#b8c278]">
                  <span>Maximum Promotional Discount</span>
                  <span className="font-mono text-[10px] bg-[#6e7448]/20 px-2 py-0.5 rounded-full">15% Cap</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  All proposals drafted by Arc Mate are verified against your 15% discount limit.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>Cognee AWS Cloud</span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">Connected</span>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  Connected to live Cognee AWS instance (`f05eece1-d390-44ab-ae6b-269435b97222.aws.cognee.ai`).
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGuardrailModalOpen(false)}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
