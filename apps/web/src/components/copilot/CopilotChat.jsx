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
      <div className="lg:col-span-7 flex flex-col h-full bg-[#161410]/90 border border-[rgba(242,235,216,0.1)] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        
        {/* Chat Header */}
        <div className="p-4 border-b border-[rgba(242,235,216,0.06)] bg-[#1e1c18]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ed6f5c]/10 border border-[#ed6f5c]/30 flex items-center justify-center text-[#ed6f5c]">
              <Bot size={20} />
            </div>
            <div>
              <div className="label-editorial text-[9px] mb-0.5">
                <span className="ix">AI</span> REASONING AGENT
              </div>
              <h2 className="text-sm font-bold text-[#f2ebd8] flex items-center gap-2 font-sans">
                ActionMate Assistant
                <span className="pulse-dot"></span>
              </h2>
              <p className="text-[11px] text-[#9a9382] font-body">
                Trained on {activeMerchant?.name || 'Store'} Knowledge Graph & Policies
              </p>
            </div>
          </div>

          <button
            onClick={() => playPaytmChime(`Soundbox 3.0 audio channel verified for ${activeMerchant?.name || 'Store'}.`)}
            className="editorial-pill text-xs font-mono"
          >
            <Volume2 size={12} className="text-[#ed6f5c]" />
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
                  <div className="w-7 h-7 rounded-lg bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 flex items-center justify-center text-[#ed6f5c] shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#ed6f5c] text-white rounded-br-sm shadow-md font-sans'
                      : 'bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] text-[#f2ebd8] rounded-bl-sm space-y-2 font-sans'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text || msg.content}</p>

                  {/* If assistant attached an action draft */}
                  {msg.actionDraft && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#161410] border border-[#ed6f5c]/30 text-[#f2ebd8] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#ed6f5c] font-sans">{msg.actionDraft.title}</span>
                        <span className="text-[9px] font-mono bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 text-[#ed6f5c] px-2 py-0.5 rounded-full font-semibold">
                          {msg.actionDraft.targetSegment || 'Target Audience'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#c8c0a8] font-body">
                        {msg.actionDraft.offerText}
                      </p>
                      <button
                        onClick={() => onNavigateTab?.('approvals')}
                        className="btn-editorial btn-editorial-primary w-full justify-center text-xs py-1.5 mt-2"
                      >
                        <span>Inspect in Approval Queue</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}

                  <span className="text-[9px] text-[#6e6860] font-mono block text-right pt-0.5">
                    {msg.timestamp || 'Just now'}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[rgba(242,235,216,0.1)] border border-[rgba(242,235,216,0.15)] flex items-center justify-center text-[#f2ebd8] shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 flex items-center justify-center text-[#ed6f5c] shrink-0">
                <RefreshCw size={13} className="animate-spin text-[#ed6f5c]" />
              </div>
              <div className="p-3 rounded-2xl bg-[#1e1c18] border border-[rgba(242,235,216,0.08)] text-xs text-[#9a9382] flex items-center gap-2 font-mono">
                <span>Reasoning with Gemini 3.1 Flash-Lite & store data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 px-4 bg-[#14120f] border-t border-[rgba(242,235,216,0.06)] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(p)}
              className="editorial-pill shrink-0 text-xs font-mono"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#1e1c18] border-t border-[rgba(242,235,216,0.06)] flex items-center gap-2">
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-2.5 rounded-xl border transition ${
              isRecording
                ? 'bg-[#ed6f5c]/20 text-[#ed6f5c] border-[#ed6f5c]/50 animate-pulse'
                : 'bg-[#161410] hover:bg-[rgba(242,235,216,0.08)] text-[#9a9382] hover:text-[#f2ebd8] border-[rgba(242,235,216,0.1)]'
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
            className="flex-1 bg-[#161410] border border-[rgba(242,235,216,0.1)] rounded-xl px-4 py-2.5 text-xs text-[#f2ebd8] placeholder-[#6e6860] focus:outline-none focus:border-[#ed6f5c] font-sans"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className="p-2.5 bg-[#ed6f5c] hover:bg-[#e25e4a] disabled:opacity-40 text-white rounded-xl shadow-lg transition cursor-pointer"
          >
            <Send size={15} />
          </button>
        </form>
      </div>

      {/* Right Reasoning & Guardrails Inspector (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto">
        
        {/* 1. Reasoning Steps Stream */}
        <div className="bg-[#161410]/90 border border-[rgba(242,235,216,0.1)] rounded-3xl p-5 shadow-xl space-y-3 relative">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,235,216,0.06)]">
            <h3 className="text-xs font-bold text-[#f2ebd8] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Sparkles size={14} className="text-[#ed6f5c]" />
              AI Thinking & Execution Steps
            </h3>
            <span className="text-[10px] text-[#6e6860] font-mono">Real-time</span>
          </div>

          <div className="space-y-2.5">
            {agentSteps && agentSteps.length > 0 ? (
              agentSteps.map((s, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#1e1c18]/70 border border-[rgba(242,235,216,0.06)] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#ed6f5c] uppercase text-[10px] font-mono">
                      {s.step || 'ACTION'}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      s.status === 'COMPLETED' ? 'bg-[#6e7448]/15 text-[#6e7448] border border-[#6e7448]/30' : 'bg-[#e9b94a]/15 text-[#e9b94a] border border-[#e9b94a]/30 animate-pulse'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c8c0a8] font-body">{s.details}</p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[#6e6860] text-xs font-mono">
                No active reasoning step. Send a query to see live execution trace.
              </div>
            )}
          </div>
        </div>

        {/* 2. Store Policy Guardrail Card */}
        <div className="bg-[#161410]/90 border border-[rgba(242,235,216,0.1)] rounded-3xl p-5 shadow-xl space-y-3 relative">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,235,216,0.06)]">
            <h3 className="text-xs font-bold text-[#f2ebd8] uppercase tracking-wider flex items-center gap-2 font-mono">
              <ShieldCheck size={14} className="text-[#6e7448]" />
              Store Policy Guardrail
            </h3>
            <span className="text-[9px] text-[#6e7448] bg-[#6e7448]/15 border border-[#6e7448]/30 px-2 py-0.5 rounded-full font-mono font-semibold">
              Enforced
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#1e1c18]/70 border border-[rgba(242,235,216,0.08)] space-y-2 text-xs">
            <div className="font-semibold text-[#f2ebd8] font-sans">
              Maximum Promotional Discount: 15%
            </div>
            <p className="text-[11px] text-[#9a9382] leading-relaxed font-body">
              Every campaign proposed by ActionMate is automatically verified against your minimum margins. Any offer exceeding 15% requires explicit human authorization.
            </p>
          </div>

          {pendingAction && (
            <div className="p-3.5 rounded-2xl bg-[#e9b94a]/10 border border-[#e9b94a]/30 space-y-2 text-xs">
              <div className="font-semibold text-[#e9b94a] flex items-center justify-between font-sans">
                <span>Action Waiting for Authorization</span>
                <span className="text-[9px] font-mono bg-[#e9b94a]/20 px-2 py-0.5 rounded-full uppercase">1 Pending</span>
              </div>
              <p className="text-[11px] text-[#c8c0a8] font-body">
                {pendingAction.title} ({pendingAction.targetSegment})
              </p>
              <button
                onClick={() => onNavigateTab?.('approvals')}
                className="btn-editorial btn-editorial-primary w-full justify-center text-xs py-2 bg-[#e9b94a] text-[#0e0d0a] hover:bg-[#dfaf40]"
              >
                <span>Review in Approvals</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
