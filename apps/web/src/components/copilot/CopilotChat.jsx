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
  TrendingDown,
  User,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { playPaytmChime } from '../../services/soundboxAudio';

export default function CopilotChat({
  messages,
  onSendMessage,
  isProcessing,
  agentSteps,
  pendingAction,
  activeMerchant,
  onApproveAction,
  onNavigateTab
}) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentSteps]);

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
        setInputText(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
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
        // Fallback for browsers without speech recognition
        setInputText('Check today sales and customer retention status');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    "Check today's sales and settlement status",
    "Identify regular customers who stopped visiting",
    "Create automated re-engagement campaign",
    "Verify store discount and margin rules"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto h-[calc(100vh-140px)]">
      
      {/* Left Chat Window (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col h-full bg-[#121318] border border-white/[0.08] rounded-3xl overflow-hidden shadow-xl">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-white/[0.06] bg-[#16171E] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                ActionMate AI Assistant
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Online
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Connected to {activeMerchant?.name || 'Store'} Knowledge Graph & Policies
              </p>
            </div>
          </div>

          <button
            onClick={() => playPaytmChime(`Soundbox 3.0 audio channel verified for ${activeMerchant?.name || 'Store'}.`)}
            className="text-[11px] font-medium text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition"
          >
            <Volume2 size={12} className="text-blue-400" />
            Soundbox Audio
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'merchant' || msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-[#1A1B22] border border-white/[0.06] text-zinc-200 rounded-bl-sm space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text || msg.content}</p>

                  {/* If assistant attached an action draft */}
                  {msg.actionDraft && (
                    <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-400">{msg.actionDraft.title}</span>
                        <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-full font-semibold">
                          {msg.actionDraft.targetSegment || 'Target Audience'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300">
                        {msg.actionDraft.offerText}
                      </p>
                      <button
                        onClick={() => onNavigateTab?.('approvals')}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        Go to Approval Queue
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] text-zinc-500 block text-right pt-0.5">
                    {msg.timestamp || 'Just now'}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <RefreshCw size={13} className="animate-spin text-blue-400" />
              </div>
              <div className="p-3 rounded-2xl bg-[#1A1B22] border border-white/[0.06] text-xs text-zinc-400 flex items-center gap-2">
                <span>Reasoning with Gemini 3.1 Flash-Lite & store data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 px-4 bg-[#14151B] border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(p)}
              className="shrink-0 text-[11px] text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-3 py-1 rounded-full transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#16171E] border-t border-white/[0.06] flex items-center gap-2">
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-2.5 rounded-xl border transition ${
              isRecording
                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border-white/[0.06]'
            }`}
            title={isRecording ? 'Stop Recording' : 'Voice Input'}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about today's collections, invoices, or customer campaigns..."
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl shadow-lg transition"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* Right Reasoning & Guardrails Inspector (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto">
        
        {/* 1. Reasoning Steps Stream */}
        <div className="bg-[#121318] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-blue-400" />
              AI Thinking & Execution Steps
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Real-time</span>
          </div>

          <div className="space-y-2.5">
            {agentSteps && agentSteps.length > 0 ? (
              agentSteps.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-400 uppercase text-[10px]">
                      {s.step || 'ACTION'}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      s.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-300 animate-pulse'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300">{s.details}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No active reasoning step. Send a query to see live execution trace.
              </div>
            )}
          </div>
        </div>

        {/* 2. Store Policy Guardrail Card */}
        <div className="bg-[#121318] border border-white/[0.08] rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              Store Policy Guardrail
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
              Enforced
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
            <div className="font-semibold text-emerald-300">
              Maximum Promotional Discount: 15%
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Every campaign proposed by ActionMate is automatically verified against your minimum margins. Any offer exceeding 15% requires explicit human authorization.
            </p>
          </div>

          {pendingAction && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
              <div className="font-semibold text-amber-300 flex items-center justify-between">
                <span>Action Waiting for Authorization</span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full uppercase">1 Pending</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                {pendingAction.title} ({pendingAction.targetSegment})
              </p>
              <button
                onClick={() => onNavigateTab?.('approvals')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                Review in Approvals
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
