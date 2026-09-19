import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Receipt, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  RefreshCw,
  Search,
  Share2,
  Trash2,
  UploadCloud,
  X,
  ArrowRight,
  ExternalLink,
  Layers,
  Filter,
  Eye,
  Check,
  FileCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CATEGORY_COLORS = {
  MERCHANT: { bg: 'bg-[#ed6f5c]/10', border: 'border-[#ed6f5c]/40', text: 'text-[#ed6f5c]', dot: '#ed6f5c' },
  DEVICE: { bg: 'bg-[#6e7448]/15', border: 'border-[#6e7448]/40', text: 'text-[#6e7448]', dot: '#6e7448' },
  FINANCIAL: { bg: 'bg-[#e9b94a]/15', border: 'border-[#e9b94a]/40', text: 'text-[#e9b94a]', dot: '#e9b94a' },
  POLICY: { bg: 'bg-[#ed6f5c]/15', border: 'border-[#ed6f5c]/40', text: 'text-[#ed6f5c]', dot: '#ed6f5c' },
  COHORT: { bg: 'bg-[rgba(242,235,216,0.08)]', border: 'border-[rgba(242,235,216,0.2)]', text: 'text-[#f2ebd8]', dot: '#f2ebd8' },
  ANOMALY: { bg: 'bg-[#ed6f5c]/15', border: 'border-[#ed6f5c]/40', text: 'text-[#ed6f5c]', dot: '#ed6f5c' },
  ACTION: { bg: 'bg-[rgba(242,235,216,0.08)]', border: 'border-[rgba(242,235,216,0.2)]', text: 'text-[#c8c0a8]', dot: '#c8c0a8' },
  PDF_GUIDELINE: { bg: 'bg-[#ed6f5c]/10', border: 'border-[#ed6f5c]/30', text: 'text-[#ed6f5c]', dot: '#ed6f5c' },
  INVOICE_BILL: { bg: 'bg-[#e9b94a]/15', border: 'border-[#e9b94a]/30', text: 'text-[#e9b94a]', dot: '#e9b94a' },
  VOICE_TALK: { bg: 'bg-[#6e7448]/15', border: 'border-[#6e7448]/30', text: 'text-[#8fa358]', dot: '#6e7448' },
  STORE_POLICY: { bg: 'bg-[#ed6f5c]/15', border: 'border-[#ed6f5c]/40', text: 'text-[#ed6f5c]', dot: '#ed6f5c' }
};

export default function KnowledgeGraphView() {
  const { isDark } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'rules' | 'graph'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Inspection
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [detailDoc, setDetailDoc] = useState(null);
  
  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('PDF_GUIDELINE');
  const [uploadSummary, setUploadSummary] = useState('');
  const [uploadRules, setUploadRules] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Voice Memo / Talk Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/knowledge/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const fetchGraph = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/knowledge/graph');
      const data = await res.json();
      setGraphData(data);
      if (data.nodes && data.nodes.length > 0 && !selectedNode) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error('Failed to fetch knowledge graph:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchGraph();
  }, []);

  // Web Speech Recognition for Staff Voice Talks
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setVoiceTranscript(currentText.trim());
        setUploadSummary(currentText.trim());
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }

    return () => {
      try {
        recognitionRef.current?.abort();
      } catch (e) {}
    };
  }, []);

  const handleToggleVoice = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      showToast('Voice memo recorded and transcribed!');
    } else {
      if (recognitionRef.current) {
        try {
          setVoiceTranscript('');
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          setIsRecording(false);
        }
      } else {
        const sampleText = "Staff meeting note: Never apply discount to single-origin brews, only apply offers to bakery snack combos.";
        setVoiceTranscript(sampleText);
        setUploadSummary(sampleText);
        showToast('Sample talk loaded (Speech recognition requires microphone permissions).');
      }
    }
  };

  // Handle File Input Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    if (!uploadTitle) {
      setUploadTitle(file.name);
    }
    
    // Auto-detect category
    const fLower = file.name.toLowerCase();
    if (fLower.includes('invoice') || fLower.includes('bill') || fLower.endsWith('.csv')) {
      setUploadCategory('INVOICE_BILL');
    } else if (fLower.includes('talk') || fLower.includes('memo') || fLower.includes('meeting') || fLower.endsWith('.mp3') || fLower.endsWith('.m4a') || fLower.endsWith('.wav')) {
      setUploadCategory('VOICE_TALK');
    } else if (fLower.includes('rule') || fLower.includes('policy') || fLower.includes('guardrail')) {
      setUploadCategory('STORE_POLICY');
    } else {
      setUploadCategory('PDF_GUIDELINE');
    }
  };

  // Ingest Document Handler
  const handleUploadSubmit = async (e) => {
    e?.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const parsedRules = uploadRules
        .split(/[,;\n]/)
        .map(r => r.trim())
        .filter(r => r.length > 0);

      const payload = {
        title: uploadTitle.trim(),
        category: uploadCategory,
        fileType: uploadFile ? uploadFile.name.split('.').pop().toUpperCase() : (uploadCategory === 'VOICE_TALK' ? 'AUDIO' : uploadCategory === 'INVOICE_BILL' ? 'INVOICE' : uploadCategory === 'STORE_POLICY' ? 'POLICY' : 'PDF'),
        fileSize: uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB` : '120 KB',
        summary: uploadSummary.trim() || 'Store document ingested and indexed into AI Copilot memory.',
        extractedRules: parsedRules.length > 0 ? parsedRules : ['Auto-indexed into Copilot knowledge guardrails'],
        source: uploadFile ? 'Direct Upload' : (uploadCategory === 'VOICE_TALK' ? 'Voice Memo' : 'Store Setup')
      };

      const res = await fetch('/api/knowledge/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setDocuments(prev => [result.document, ...prev]);
        showToast(`Document "${uploadTitle}" attached and indexed!`);
        setIsUploadModalOpen(false);
        setUploadTitle('');
        setUploadSummary('');
        setUploadRules('');
        setUploadFile(null);
        setVoiceTranscript('');
        fetchGraph();
      }
    } catch (err) {
      console.error('Upload failed:', err);
      showToast('Error uploading document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Ingest Presets
  const handleAttachPreset = async (type) => {
    setIsSubmitting(true);
    let preset = null;
    if (type === 'blue_tokai') {
      preset = {
        title: 'Blue Tokai Coffee Roastery Supply Agreement (2026).pdf',
        category: 'PDF_GUIDELINE',
        fileType: 'PDF',
        fileSize: '1.4 MB',
        summary: 'Annual commercial supply agreement for Arabica AA beans. Sets wholesale pricing at ₹580/kg, Net 15 days credit, and minimum monthly quota of 25kg.',
        extractedRules: ['Coffee bean wholesale price locked at ₹580/kg', 'Payment terms: Net 15 days credit', 'Minimum monthly batch: 25kg'],
        source: 'Quick Preset'
      };
    } else if (type === 'monin_invoice') {
      preset = {
        title: 'Monin Gourmet Syrups Restock Bill (INV-2026-044).pdf',
        category: 'INVOICE_BILL',
        fileType: 'INVOICE',
        fileSize: '380 KB',
        summary: 'Delivery bill for 12 glass syrup bottles (Vanilla, Caramel, Hazelnut). Total ₹7,245 payable within 30 days.',
        extractedRules: ['Vanilla syrup unit price: ₹580', 'Net 30 days settlement deadline'],
        source: 'Invoice Preset'
      };
    } else if (type === 'barista_memo') {
      preset = {
        title: 'Morning Shift Lead Handover Voice Note.m4a',
        category: 'VOICE_TALK',
        fileType: 'AUDIO',
        fileSize: '1.9 MB',
        summary: 'Barista shift instructions: "Never apply discounts to single-origin pourovers. Only apply promotional discounts to bakery pairings and cold brew combos."',
        extractedRules: ['Zero discount on single-origin pourover coffee', 'Promotional discounts limited to bakery combos'],
        source: 'Voice Preset'
      };
    }

    if (preset) {
      try {
        const res = await fetch('/api/knowledge/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preset)
        });
        if (res.ok) {
          const result = await res.json();
          setDocuments(prev => [result.document, ...prev]);
          showToast(`Preset "${preset.title}" attached & indexed!`);
          fetchGraph();
        }
      } catch (e) {
        showToast('Failed to attach preset.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Delete Document
  const handleDeleteDoc = async (docId, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from AI knowledge?`)) return;
    try {
      const res = await fetch(`/api/knowledge/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
        showToast(`Document "${title}" removed.`);
        fetchGraph();
      }
    } catch (err) {
      showToast('Error removing document.');
    }
  };

  // Filtered documents list
  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.summary && doc.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.extractedRules && doc.extractedRules.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  // Collect all extracted rules for the Rules tab
  const allExtractedRules = [];
  documents.forEach(doc => {
    (doc.extractedRules || []).forEach((rule, idx) => {
      allExtractedRules.push({
        id: `${doc.id}_${idx}`,
        rule,
        originDoc: doc.title,
        category: doc.category,
        fileType: doc.fileType,
        status: 'ACTIVE_GUARDRAIL'
      });
    });
  });

  // Radial Node positions for Graph View
  const getNodePositions = (nodes) => {
    if (!nodes || nodes.length === 0) return {};
    const center = { x: 340, y: 220 };
    const radius = 170;
    const positions = {};
    const otherNodes = nodes.filter(n => n.category !== 'MERCHANT');
    const totalOthers = otherNodes.length || 1;

    nodes.forEach((node) => {
      if (node.category === 'MERCHANT') {
        positions[node.id] = { x: center.x, y: center.y };
      } else {
        const otherIdx = Math.max(0, otherNodes.findIndex(n => n.id === node.id));
        const angle = (otherIdx / totalOthers) * 2 * Math.PI - Math.PI / 2;
        positions[node.id] = {
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle)
        };
      }
    });

    return positions;
  };

  const positions = graphData ? getNodePositions(graphData.nodes) : {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#18181b] border border-[#ed6f5c]/40 rounded-2xl shadow-2xl flex items-center gap-2.5 text-zinc-100 text-xs font-sans animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#ed6f5c]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Workflow Hero */}
      <div className="lunor-card p-6 rounded-2xl shadow-sm relative overflow-hidden space-y-5">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ed6f5c] font-semibold">
                AUTONOMOUS STORE KNOWLEDGE & GUARDRAILS
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f2ebd8] font-sans">
              Store Knowledge & <em className="font-serif italic font-normal text-white">Documents</em>
            </h1>
            <p className="text-xs text-[#9a9382] max-w-2xl mt-1.5 leading-relaxed">
              Attach supplier PDFs, invoices, meeting talks, and store policies. Arc Mate instantly extracts rules and prices to train your AI Copilot and protect your profit margins.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Attach Document / Talk</span>
            </button>
          </div>
        </div>

        {/* 2. Visual 3-Step Process Stepper */}
        <div className="pt-4 border-t border-[rgba(242,235,216,0.06)] grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-[rgba(242,235,216,0.06)] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#ed6f5c]/15 text-[#ed6f5c] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-[#f2ebd8] text-xs">Attach Document / Talk</span>
              <p className="text-[11px] text-[#9a9382] leading-tight">
                Upload PDFs, scan invoices, or record staff audio memos.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-[rgba(242,235,216,0.06)] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#e9b94a]/15 text-[#e9b94a] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-[#f2ebd8] text-xs">AI Extracts Terms & Rules</span>
              <p className="text-[11px] text-[#9a9382] leading-tight">
                Comprehends discount caps, credit deadlines, and product prices.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-[rgba(242,235,216,0.06)] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#6e7448]/20 text-[#8fa358] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-[#f2ebd8] text-xs">Active Guardrail in Copilot</span>
              <p className="text-[11px] text-[#9a9382] leading-tight">
                Copilot references your files and enforces strict margin policies.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[rgba(242,235,216,0.06)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Hub ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Store Rules ({allExtractedRules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'graph'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>AI Memory Map</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: DOCUMENT HUB (MAIN VIEW)                              */}
      {/* ============================================================ */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          
          {/* Action Row: Dropzone & Voice Memo Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Left 2 Cols: Drag & Drop Card */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="md:col-span-2 p-5 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#ed6f5c]/50 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.mp3,.wav,.m4a" 
                onChange={(e) => {
                  handleFileChange(e);
                  setIsUploadModalOpen(true);
                }} 
                className="hidden" 
              />
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#ed6f5c]/15 text-[#ed6f5c] flex items-center justify-center shrink-0">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Drop your PDFs, Invoices, or Notes here</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Supports PDFs, Bills, Receipts, CSVs, and Audio memos (up to 25MB)
                  </p>
                </div>
              </div>
              <button 
                type="button"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs whitespace-nowrap"
              >
                Browse Files
              </button>
            </div>

            {/* Right 1 Col: Direct Voice Memo Mic Card */}
            <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Staff Talk / Memo</span>
                {isRecording && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Recording
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-white text-xs">Record Verbal Store Instructions</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Speak meeting notes or rules directly into Arc Mate.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition cursor-pointer ${
                  isRecording 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                    : 'bg-[#6e7448]/25 hover:bg-[#6e7448]/35 text-[#c8d48a] border border-[#6e7448]/40'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Stop & Save Memo' : 'Tap to Record Voice Talk'}</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons (1-Click Demos) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-zinc-400 mr-1">Quick Presets:</span>
            <button
              onClick={() => handleAttachPreset('blue_tokai')}
              disabled={isSubmitting}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3 text-[#ed6f5c]" />
              <span>Blue Tokai Supply Contract (PDF)</span>
            </button>
            <button
              onClick={() => handleAttachPreset('monin_invoice')}
              disabled={isSubmitting}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3 text-[#e9b94a]" />
              <span>Monin Syrups Invoice (Bill)</span>
            </button>
            <button
              onClick={() => handleAttachPreset('barista_memo')}
              disabled={isSubmitting}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3 text-[#8fa358]" />
              <span>Morning Shift Voice Talk (Audio)</span>
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: `All (${documents.length})` },
                { id: 'PDF_GUIDELINE', label: 'PDFs & Guides' },
                { id: 'INVOICE_BILL', label: 'Invoices & Bills' },
                { id: 'VOICE_TALK', label: 'Voice Talks' },
                { id: 'STORE_POLICY', label: 'Store Policies' }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedCategory(chip.id)}
                  className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === chip.id
                      ? 'bg-[#ed6f5c]/20 text-[#ed6f5c] border border-[#ed6f5c]/40 font-semibold'
                      : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/5'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search documents or rules..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ed6f5c]"
              />
            </div>
          </div>

          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map(doc => {
              const isPdf = doc.fileType === 'PDF' || doc.category === 'PDF_GUIDELINE';
              const isInvoice = doc.fileType === 'INVOICE' || doc.category === 'INVOICE_BILL';
              const isVoice = doc.fileType === 'AUDIO' || doc.category === 'VOICE_TALK';
              const isPolicy = doc.fileType === 'POLICY' || doc.category === 'STORE_POLICY';

              return (
                <div 
                  key={doc.id}
                  className="lunor-card rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group transition hover:border-white/20 hover:shadow-lg"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Icon, Category Badge & Delete */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isPdf ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                          isInvoice ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                          isVoice ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                          'bg-[#ed6f5c]/15 text-[#ed6f5c] border border-[#ed6f5c]/30'
                        }`}>
                          {isPdf && <FileText className="w-4 h-4" />}
                          {isInvoice && <Receipt className="w-4 h-4" />}
                          {isVoice && <Mic className="w-4 h-4" />}
                          {isPolicy && <ShieldCheck className="w-4 h-4" />}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 font-semibold">
                          {doc.fileType || 'DOC'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteDoc(doc.id, doc.title)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded transition opacity-60 hover:opacity-100"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Document Title */}
                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug line-clamp-2">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1 font-mono">
                        <span>{doc.fileSize}</span>
                        <span>•</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{doc.source}</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-[11px] text-zinc-300 line-clamp-3 leading-relaxed">
                      {doc.summary}
                    </p>

                    {/* Extracted Rules */}
                    {doc.extractedRules && doc.extractedRules.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                        <span className="text-[9px] font-mono uppercase text-[#ed6f5c] font-semibold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Extracted Store Rule:
                        </span>
                        <p className="text-[11px] text-zinc-200 line-clamp-2">
                          {doc.extractedRules[0]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Status & Inspect */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active in Copilot</span>
                    </span>

                    <button
                      onClick={() => setDetailDoc(doc)}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 transition font-medium"
                    >
                      <span>View Details</span>
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDocs.length === 0 && (
            <div className="p-12 text-center lunor-card rounded-2xl space-y-3">
              <FileText className="w-8 h-8 text-zinc-500 mx-auto" />
              <h3 className="font-semibold text-white text-sm">No documents found</h3>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                No documents match your filter. Try attaching a new PDF, invoice, or recording a staff talk note.
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#ed6f5c] text-white text-xs font-semibold"
              >
                Attach First Document
              </button>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: ACTIVE STORE RULES & GUARDRAILS                       */}
      {/* ============================================================ */}
      {activeTab === 'rules' && (
        <div className="lunor-card rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
          <span className="corner tl"></span>
          <span className="corner tr"></span>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[rgba(242,235,216,0.06)]">
            <div>
              <h3 className="font-bold text-[#f2ebd8] text-sm font-sans">Enforced Store Guardrails & Rules</h3>
              <p className="text-[#9a9382] text-xs mt-0.5">
                All business constraints extracted from your attached PDFs, supplier agreements, and talks.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#ed6f5c]/15 text-[#ed6f5c] border border-[#ed6f5c]/30 font-mono text-xs font-semibold self-start sm:self-auto">
              {allExtractedRules.length} Active Guardrails
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(242,235,216,0.06)] text-[#9a9382] text-[10px] font-mono uppercase tracking-wider">
                  <th className="py-2.5 px-3">Rule / Constraint</th>
                  <th className="py-2.5 px-3">Originating Document</th>
                  <th className="py-2.5 px-3">Document Type</th>
                  <th className="py-2.5 px-3">Copilot Enforcement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(242,235,216,0.04)] font-sans text-xs">
                {allExtractedRules.map((item) => (
                  <tr key={item.id} className="hover:bg-[rgba(242,235,216,0.02)] transition">
                    <td className="py-3 px-3 text-white font-medium max-w-sm">
                      {item.rule}
                    </td>
                    <td className="py-3 px-3 text-[#c8c0a8] max-w-xs truncate text-[11px]">
                      {item.originDoc}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-300">
                        {item.fileType}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                        Strictly Enforced
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: AI MEMORY MAP (GRAPH VIEW)                            */}
      {/* ============================================================ */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 8 Cols: Interactive SVG Graph */}
          <div className="lg:col-span-8 lunor-card rounded-2xl p-4 flex flex-col relative overflow-hidden h-[540px]">
            <span className="corner tl"></span>
            <span className="corner tr"></span>
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.06)] z-10">
              <div className="flex items-center gap-2 font-sans font-semibold text-[#f2ebd8]">
                <Share2 className="w-4 h-4 text-[#ed6f5c]" />
                <span>AI Memory & Relationship Visualizer</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-[#9a9382] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ed6f5c]"></span> Store
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#e9b94a]"></span> Policy
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#6e7448]"></span> Device
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="flex-1 w-full h-full relative flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[#9a9382] animate-pulse font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#ed6f5c]" />
                  <span>Loading AI Knowledge Graph...</span>
                </div>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 680 440">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill={isDark ? "#6e6860" : "#a8a29e"} />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ed6f5c" />
                    </marker>
                  </defs>

                  {/* Render Edges */}
                  {graphData?.edges?.map(edge => {
                    const src = positions[edge.source];
                    const tgt = positions[edge.target];
                    if (!src || !tgt) return null;

                    const isConnected = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

                    return (
                      <g key={edge.id}>
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          stroke={isConnected ? '#ed6f5c' : (isDark ? 'rgba(242, 235, 216, 0.15)' : 'rgba(20, 18, 14, 0.15)')}
                          strokeWidth={isConnected ? 2 : 1.2}
                          strokeDasharray={isConnected ? 'none' : '4,3'}
                          markerEnd={isConnected ? 'url(#arrow-active)' : 'url(#arrow)'}
                        />
                        <text
                          x={(src.x + tgt.x) / 2}
                          y={(src.y + tgt.y) / 2 - 5}
                          fill={isConnected ? '#ed6f5c' : (isDark ? '#9a9382' : '#78716c')}
                          fontSize="8"
                          textAnchor="middle"
                          className="select-none font-mono"
                        >
                          {edge.relation}
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Nodes */}
                  {graphData?.nodes?.map(node => {
                    const pos = positions[node.id];
                    if (!pos) return null;

                    const isSelected = selectedNode?.id === node.id;
                    const catTheme = CATEGORY_COLORS[node.category] || CATEGORY_COLORS.MERCHANT;

                    return (
                      <g 
                        key={node.id} 
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onClick={() => setSelectedNode(node)}
                        className="cursor-pointer transition-all group"
                      >
                        <circle
                          r={node.category === 'MERCHANT' ? 28 : 20}
                          fill={isSelected ? (isDark ? '#1e1c18' : '#eee8dc') : (isDark ? '#161410' : '#ffffff')}
                          stroke={isSelected ? '#ed6f5c' : catTheme.dot}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          className="group-hover:scale-110 transition-transform"
                        />
                        {isSelected && (
                          <circle
                            r={node.category === 'MERCHANT' ? 34 : 26}
                            fill="none"
                            stroke="#ed6f5c"
                            strokeWidth="1"
                            opacity="0.4"
                            className="animate-ping"
                          />
                        )}
                        <text
                          y={3}
                          fill={isDark ? '#f2ebd8' : '#14120e'}
                          fontSize={node.category === 'MERCHANT' ? '10' : '9'}
                          fontWeight="bold"
                          textAnchor="middle"
                          className="select-none pointer-events-none font-mono"
                        >
                          {node.category === 'MERCHANT' ? 'SHOP' : node.category.slice(0, 3)}
                        </text>
                        <text
                          y={node.category === 'MERCHANT' ? 42 : 32}
                          fill={isSelected ? (isDark ? '#f2ebd8' : '#14120e') : (isDark ? '#9a9382' : '#57534e')}
                          fontSize="9"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          textAnchor="middle"
                          className="select-none pointer-events-none font-sans"
                        >
                          {node.label.length > 18 ? node.label.slice(0, 16) + '...' : node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          {/* Right 4 Cols: Node Inspector */}
          <div className="lg:col-span-4 lunor-card rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
            <span className="corner tl"></span>
            <span className="corner br"></span>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,235,216,0.06)]">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#ed6f5c]" />
                  <h3 className="font-bold text-[#f2ebd8] font-sans">Entity Inspector</h3>
                </div>
                {selectedNode && (
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[selectedNode.category]?.bg} ${CATEGORY_COLORS[selectedNode.category]?.border} ${CATEGORY_COLORS[selectedNode.category]?.text}`}>
                    {selectedNode.category}
                  </span>
                )}
              </div>

              {selectedNode ? (
                <div className="pt-4 space-y-3">
                  <div>
                    <span className="text-[9px] text-[#6e6860] uppercase tracking-wider font-mono">Entity Label</span>
                    <h4 className="text-sm font-bold text-[#f2ebd8] mt-0.5 font-sans">{selectedNode.label}</h4>
                    <span className="text-[10px] font-mono text-[#9a9382]">{selectedNode.id}</span>
                  </div>

                  <div className="p-3 bg-[#12100d] rounded-xl border border-[rgba(242,235,216,0.06)] space-y-2">
                    <span className="text-[9px] text-[#9a9382] uppercase font-mono">Properties & Rules</span>
                    <pre className="text-[11px] text-[#c8c0a8] font-mono overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedNode.properties, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="pt-12 text-center text-[#6e6860] font-mono text-xs">
                  Click on any graph node to inspect its attributes and active triples.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[rgba(242,235,216,0.06)] flex items-center justify-between text-[#9a9382] text-[11px] font-mono">
              <span>Memory Synchronized:</span>
              <span className="font-semibold text-[#6e7448] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6e7448]"></span> Live
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ATTACH DOCUMENT / TALK / INVOICE                      */}
      {/* ============================================================ */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-100">
          <div className="bg-[#18181b] border border-white/15 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#ed6f5c]" />
                <h3 className="text-sm font-bold text-white font-sans">Attach Store Knowledge or Document</h3>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              {/* Category */}
              <div>
                <label className="font-medium text-zinc-300 block mb-1 font-sans">Document Type</label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  className="w-full bg-[#242427] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#ed6f5c] text-xs"
                >
                  <option value="PDF_GUIDELINE">📄 PDF / Operational Guide (Menu, Contract, SOP)</option>
                  <option value="INVOICE_BILL">🧾 Supplier Invoice / Bill (Receipt, Delivery Challan)</option>
                  <option value="VOICE_TALK">🎙️ Staff Voice Talk / Audio Memo</option>
                  <option value="STORE_POLICY">🛡️ Store Policy / Discount Limit Rule</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="font-medium text-zinc-300 block mb-1 font-sans">Document Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. 'Blue Tokai Roastery Contract (2026)' or 'Espresso Zero-Discount Rule'"
                  required
                  className="w-full bg-[#242427] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ed6f5c] text-xs"
                />
              </div>

              {/* Summary or Voice Transcript */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-zinc-300 font-sans">Content / AI Summary</label>
                  {uploadCategory === 'VOICE_TALK' && (
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                        isRecording ? 'bg-rose-500 text-white' : 'bg-[#6e7448]/30 text-[#c8d48a]'
                      }`}
                    >
                      <Mic className="w-3 h-3" />
                      <span>{isRecording ? 'Listening...' : 'Speak Voice Memo'}</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={uploadSummary}
                  onChange={e => setUploadSummary(e.target.value)}
                  placeholder="Briefly describe what this document covers or paste key clauses..."
                  className="w-full bg-[#242427] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ed6f5c] text-xs resize-none"
                />
              </div>

              {/* Extracted Rules */}
              <div>
                <label className="font-medium text-zinc-300 block mb-1 font-sans">
                  Store Rules to Enforce <span className="text-zinc-500 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={uploadRules}
                  onChange={e => setUploadRules(e.target.value)}
                  placeholder="e.g. 'Bean price ₹580/kg, Net 15 days credit, 10% max snack discount'"
                  className="w-full bg-[#242427] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ed6f5c] text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !uploadTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Indexing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Attach & Index Document</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: VIEW DOCUMENT DETAILS                                 */}
      {/* ============================================================ */}
      {detailDoc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-100">
          <div className="bg-[#18181b] border border-white/15 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-sans truncate max-w-xs">{detailDoc.title}</h3>
              </div>
              <button 
                onClick={() => setDetailDoc(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white">{detailDoc.fileType}</span>
                <span>{detailDoc.fileSize}</span>
                <span>•</span>
                <span>Uploaded {new Date(detailDoc.uploadedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">AI Comprehension & Summary</span>
                <p className="text-zinc-200 mt-1 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                  {detailDoc.summary}
                </p>
              </div>

              {detailDoc.extractedRules && detailDoc.extractedRules.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-[#ed6f5c] uppercase font-semibold">Enforced Rules in Copilot</span>
                  <div className="mt-1 space-y-1.5">
                    {detailDoc.extractedRules.map((rule, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.04] text-zinc-100 text-xs">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2 font-mono">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>This document is indexed in your store AI brain. All campaigns and questions strictly adhere to its terms.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDetailDoc(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
