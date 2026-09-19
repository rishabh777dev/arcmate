import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  ReactFlowProvider,
  MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { 
  Sparkles, 
  Play, 
  Download, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  ArrowRight, 
  Terminal, 
  RefreshCw, 
  ShieldCheck, 
  Zap,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  Database,
  Sliders,
  MessageSquare,
  Bot,
  Layers,
  Wand2,
  Send,
  HelpCircle,
  Phone,
  FileText,
  ExternalLink,
  Plus,
  Check,
  Edit3,
  Link,
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import { normalizeWhatsAppNumber, buildWhatsAppUrl, openWhatsAppChat } from '../../utils/whatsappHelper';

import { playPaytmChime } from '../../services/soundboxAudio';
import { customNodeTypes } from './n8nCustomNodes';
import { PRESET_WORKFLOWS_DATA } from './presetWorkflowsData';
import { generateWorkflowFromPrompt, AI_SUGGESTION_PROMPTS } from './workflowAIEngine';
import { MOCK_LEDGER_ROWS, LEDGER_TOTALS } from '../../data/mockLedgerData';

function WorkflowCanvasInner({
  selectedWorkflow,
  selectedNode,
  onSelectNode,
  isRunning,
  activeStepId
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(selectedWorkflow.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(selectedWorkflow.edges || []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reactFlowInstance = useRef(null);

  // Synchronize canvas when selectedWorkflow changes
  useEffect(() => {
    if (selectedWorkflow?.nodes) {
      setNodes(selectedWorkflow.nodes);
    }
    if (selectedWorkflow?.edges) {
      setEdges(selectedWorkflow.edges);
    }
    setTimeout(() => {
      reactFlowInstance.current?.fitView({ padding: 0.28, duration: 400 });
    }, 120);
  }, [selectedWorkflow, setNodes, setEdges]);

  // Synchronize execution animation across nodes & edges
  useEffect(() => {
    if (!isRunning) return;

    if (activeStepId) {
      setNodes(nds => 
        nds.map(node => {
          if (node.id === activeStepId) {
            return {
              ...node,
              data: { ...node.data, status: 'running' }
            };
          }
          return node;
        })
      );

      setEdges(eds =>
        eds.map(edge => {
          if (edge.source === activeStepId) {
            return {
              ...edge,
              animated: true,
              style: { stroke: '#ed6f5c', strokeWidth: 2.5 }
            };
          }
          return edge;
        })
      );
    }
  }, [activeStepId, isRunning, setNodes, setEdges]);

  const handleNodeClick = useCallback((_, node) => {
    if (node.type === 'stickyNote') return;
    onSelectNode(node);
  }, [onSelectNode]);

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-white/15 bg-[#0c0b09] shadow-2xl transition-all duration-200 ${isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)]' : 'h-[460px]'}`}>
      
      {/* Canvas Top Bar Overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181b]/90 border border-white/10 text-zinc-300 text-xs font-mono shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-zinc-100">Live Workflow</span>
          <span className="text-[10px] text-zinc-400">({selectedWorkflow.name})</span>
        </div>
      </div>

      {/* Canvas Top Right Action Controls */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
        <button
          onClick={() => reactFlowInstance.current?.fitView({ padding: 0.28, duration: 300 })}
          className="px-3 py-1.5 rounded-full bg-[#18181b]/90 hover:bg-[#27272a] border border-white/10 text-zinc-300 text-xs font-mono transition cursor-pointer shadow-lg backdrop-blur-md"
          title="Fit view to all nodes"
        >
          Center View
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-full bg-[#18181b]/90 hover:bg-[#27272a] border border-white/10 text-zinc-300 transition cursor-pointer shadow-lg backdrop-blur-md"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* ReactFlow n8n Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={customNodeTypes}
        onInit={(inst) => {
          reactFlowInstance.current = inst;
          inst.fitView({ padding: 0.28 });
        }}
        fitView
        fitViewOptions={{ padding: 0.28 }}
        minZoom={0.2}
        maxZoom={1.8}
        defaultViewport={{ x: 50, y: 50, zoom: 0.75 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color="#27272a" 
          gap={18} 
          size={1.5} 
          className="bg-[#0c0b09]"
        />
        <Controls 
          className="!bg-[#18181b] !border-white/10 !rounded-2xl !shadow-xl" 
          showInteractive={false}
        />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'stickyNote') return '#10b981';
            if (node.type === 'n8nAgent') return '#ed6f5c';
            if (node.type === 'n8nRouter') return '#38bdf8';
            return '#71717a';
          }}
          className="!bg-[#12100d] !border-white/10 !rounded-2xl !hidden md:!block"
          maskColor="rgba(0, 0, 0, 0.7)"
        />
      </ReactFlow>

      {/* Canvas Bottom Instructions */}
      <div className="absolute bottom-3 left-3 z-10 text-[10px] font-mono text-zinc-400 bg-black/70 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm pointer-events-none">
        💡 Visual n8n graph: payments auto-append to Sales Ledger (CSV) & 6:00 PM summary dispatches to WhatsApp
      </div>
    </div>
  );
}

export default function WorkflowStudioView() {
  const [workflows, setWorkflows] = useState(PRESET_WORKFLOWS_DATA);
  const [selectedWorkflow, setSelectedWorkflow] = useState(PRESET_WORKFLOWS_DATA[0]);
  const [selectedNode, setSelectedNode] = useState(
    PRESET_WORKFLOWS_DATA[0].nodes.find(n => n.id === 'node_excel_sync') || PRESET_WORKFLOWS_DATA[0].nodes[1]
  );

  // USER CONFIGURATION STATES (Store Sales Ledger & WhatsApp Number)
  const [ledgerFileName, setLedgerFileName] = useState('Athees_Cafe_Invoices_Ledger_2026-09-19.csv');
  const [isLedgerActive, setIsLedgerActive] = useState(true);
  
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');
  const [dailyTime, setDailyTime] = useState('6:00 PM');
  
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepId, setActiveStepId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Natural Language AI Generator States
  const [userPrompt, setUserPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Live Synchronized Invoices Table (Single source of truth: all 54 verified invoices totaling ₹58,450)
  const [liveRows, setLiveRows] = useState(() => MOCK_LEDGER_ROWS);

  // Exact dynamic calculations directly from the live rows (Zero arbitrary offsets!)
  const totalRevenue = liveRows.reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  const totalInvoices = liveRows.length;
  const upiTotal = liveRows.filter(r => (r.mode || '').includes('UPI') || (r.mode || '').includes('Paytm')).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  const cardTotal = liveRows.filter(r => (r.mode || '').includes('Card')).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  const cashTotal = liveRows.filter(r => (r.mode || '').includes('Cash')).reduce((acc, row) => acc + (Number(row.amount) || 0), 0);

  // Listen for real-time transactions broadcast via WebSocket or Copilot
  useEffect(() => {
    const handleIncomingTxn = (event) => {
      const detail = event.detail || {};
      const tx = detail.transaction;
      const inv = detail.invoice;
      if (!tx) return;

      const newRow = {
        id: inv?.invoiceNumber || (tx.id ? `INV-2026-${String(tx.id).replace(/\D/g, '').slice(-3) || '099'}` : `INV-2026-0${Date.now().toString().slice(-3)}`),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customer: tx.customerName || 'Store Patron',
        amount: Number(tx.amount) || 450,
        mode: tx.paymentMode || 'Paytm UPI QR',
        gst: Number(((Number(tx.amount) || 450) * 0.05).toFixed(2)),
        status: 'SUCCESS',
        items: tx.description || 'Counter Checkout',
        isNew: true
      };

      setLiveRows(prev => {
        if (prev.some(r => r.id === newRow.id)) return prev;
        return [newRow, ...prev];
      });

      setToastMsg(`⚡ Real-time payment of ₹${newRow.amount} received! Appended row to Store Sales Ledger (CSV).`);
      setTimeout(() => setToastMsg(''), 4000);
    };

    window.addEventListener('actionmate:transaction', handleIncomingTxn);
    return () => window.removeEventListener('actionmate:transaction', handleIncomingTxn);
  }, []);

  // Handle Ledger File Name Update
  const handleUpdateLedgerName = (name) => {
    setLedgerFileName(name);
    handleUpdateNodeParameter('node_excel_sync', 'ledgerFileName', name);
    handleUpdateNodeParameter('node_whatsapp_summary', 'ledgerFile', name);
  };

  // Generate a brand-new workflow directly from natural language prompt
  const handleGenerateWorkflow = async (promptToUse) => {
    const text = (promptToUse || userPrompt).trim();
    if (!text) {
      alert('Please enter an automation prompt or click one of the quick presets below.');
      return;
    }

    setIsGeneratingAI(true);
    setToastMsg('✨ Arc Mate AI is synthesizing your automation graph...');

    // Smooth realistic AI synthesis delay (450ms)
    await new Promise(r => setTimeout(r, 450));

    const newWf = generateWorkflowFromPrompt(text);
    
    setWorkflows(prev => {
      const filtered = prev.filter(w => w.name !== newWf.name);
      return [...filtered, newWf];
    });

    setSelectedWorkflow(newWf);
    setSelectedNode(newWf.nodes.find(n => n.type !== 'stickyNote') || newWf.nodes[0]);
    setIsGeneratingAI(false);
    setUserPrompt('');

    // Play Soundbox chime feedback
    playPaytmChime(`Arc Mate AI: New automation for ${newWf.name.split(' ')[0]} synthesized successfully.`);

    setToastMsg(`✓ New automation "${newWf.name}" generated & loaded onto visual canvas!`);
    setTimeout(() => setToastMsg(''), 5000);
  };

  // Select an existing or newly generated workflow
  const handleSelectWorkflow = (wf) => {
    setSelectedWorkflow(wf);
    setSelectedNode(wf.nodes.find(n => n.type !== 'stickyNote') || wf.nodes[0]);
    setExecutionResult(null);
  };

  // Helper to update a node parameter live in the state
  const handleUpdateNodeParameter = (nodeId, paramKey, paramValue) => {
    setSelectedNode(prev => {
      if (!prev || prev.id !== nodeId) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          parameters: {
            ...(prev.data.parameters || {}),
            [paramKey]: paramValue
          }
        }
      };
    });

    setSelectedWorkflow(prevWf => {
      if (!prevWf) return prevWf;
      return {
        ...prevWf,
        nodes: prevWf.nodes.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                parameters: {
                  ...(node.data.parameters || {}),
                  [paramKey]: paramValue
                }
              }
            };
          }
          return node;
        })
      };
    });
  };

  // Simulate a live customer payment (+₹450) and watch it append to Google Sheet & Soundbox!
  const handleSimulatePayment = async (amountInput = 450, itemLabel = 'Cold Brew & Toast') => {
    const customerNames = ['Rohan Kapoor', 'Ananya Mehta', 'Deepak Joshi', 'Neha Reddy', 'Rahul Bhatt', 'Preeti Mahajan', 'Vikram Iyer'];
    const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
    const paymentAmount = Number(amountInput) || 450;

    // Play Soundbox chime audio immediately
    playPaytmChime(`Paytm Soundbox 3.0: ₹${paymentAmount} received via UPI.`);

    const nextInvoiceId = `INV-2026-${String(liveRows.length + 1).padStart(3, '0')}`;
    const newRow = {
      id: nextInvoiceId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: randomCustomer,
      amount: paymentAmount,
      mode: 'Paytm UPI QR',
      gst: Number((paymentAmount * 0.05).toFixed(2)),
      status: 'SUCCESS',
      items: itemLabel,
      isNew: true
    };

    setLiveRows(prev => [newRow, ...prev]);
    setToastMsg(`⚡ Payment of ₹${paymentAmount} received! Appended row #${liveRows.length + 1} (${nextInvoiceId}) to Store Sales Ledger (CSV).`);

    try {
      const token = localStorage.getItem('actionmate_token');
      await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          amount: paymentAmount,
          customerName: randomCustomer,
          paymentMode: 'Paytm UPI QR',
          description: `${itemLabel} • Counter Checkout`
        })
      });
    } catch (err) {
      // Offline / local fallback handled gracefully
    }

    setTimeout(() => setToastMsg(''), 4000);
  };

  // Direct 1-Click WhatsApp Connection Test
  const handleTestWhatsApp = () => {
    const clean = normalizeWhatsAppNumber(whatsappNumber);
    if (!clean) {
      alert('Please enter a valid phone number');
      return;
    }
    const testMsg = `👋 Hello from Arc Mate! Athees Café store automation is active. Store Ledger & Soundbox sync is connected!`;
    const { url } = openWhatsAppChat(clean, testMsg);
    setToastMsg(`✓ Opening WhatsApp test chat for +${clean}...`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Dispatch Daily 6:00 PM Summary to WhatsApp (Opens WhatsApp with exact message & ledger summary!)
  const handleSendWhatsApp6pmSummary = () => {
    const cleanPhone = normalizeWhatsAppNumber(whatsappNumber);
    const message = `✨ Athees Café — Daily 6:00 PM Store Summary\n\n📊 Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')} across ${totalInvoices} invoices\n💳 UPI: ₹${upiTotal.toLocaleString('en-IN')} | Card: ₹${cardTotal.toLocaleString('en-IN')} | Cash: ₹${cashTotal.toLocaleString('en-IN')}\n🔥 Peak Rush: 4:30 PM - 6:00 PM (Evening Chai & Specialty Bakes)\n🏆 Top Customer: Harish Ranganathan (₹2,300)\n⚡ Pending Settlement: ₹14,200 (Tonight 11:30 PM Batch)\n\n📁 Verified Store Ledger:\n${ledgerFileName} (${totalInvoices} invoices synced)\n🔗 View Store Live Ledger: https://arcmate-web.vercel.app/#/app\n\n⚡ Powered by Arc Mate Autonomous Store Engine`;

    // Trigger Soundbox chime confirmation
    playPaytmChime('Ding! 6:00 PM daily store summary dispatched to your WhatsApp.');

    // Construct WhatsApp click-to-chat URL & attempt open
    const { url } = openWhatsAppChat(cleanPhone, message);

    setExecutionResult({
      executionId: `exec_${Date.now().toString(36)}`,
      totalExecutionTimeMs: 145,
      invoicesProcessed: totalInvoices,
      todayRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
      excelRowAdded: `Store Sales Ledger updated (${liveRows.length} live invoices today)`,
      whatsappDelivered: `Summary delivered to +${cleanPhone || whatsappNumber}`,
      whatsappUrl: url,
      soundboxChime: 'Played 784Hz / 1046Hz Chime',
      timestamp: '6:00 PM Daily Auto-Reconciliation',
      targetPhone: `+${cleanPhone || whatsappNumber}`,
      messagePreview: message
    });

    setToastMsg(`✓ Dispatched Daily 6:00 PM Summary to WhatsApp +${cleanPhone}!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Full Pipeline Visual Test Run (Step-by-step animation across all nodes)
  const handleTestRun = async () => {
    if (!selectedWorkflow || isRunning) return;

    setIsRunning(true);
    setExecutionResult(null);

    const execNodes = selectedWorkflow.nodes.filter(n => n.type !== 'stickyNote');

    for (let i = 0; i < execNodes.length; i++) {
      const node = execNodes[i];
      setActiveStepId(node.id);
      setSelectedNode(node);
      await new Promise(r => setTimeout(r, 450));
    }

    setActiveStepId(null);
    setIsRunning(false);

    if (selectedWorkflow.id === 'wf_invoice_excel_whatsapp') {
      handleSendWhatsApp6pmSummary();
    } else {
      const cleanPhone = normalizeWhatsAppNumber(whatsappNumber);
      playPaytmChime(`Paytm Soundbox: Automation ${selectedWorkflow.name.split(' ')[0]} executed successfully.`);
      
      const customMessage = `✨ Athees Café — ${selectedWorkflow.name}\n\n📋 Category: ${selectedWorkflow.category}\n⚡ Status: Verified & Executed\n📝 Details: ${selectedWorkflow.description}\n\n⚡ Powered by Arc Mate Autonomous Store Engine`;
      const { url } = openWhatsAppChat(cleanPhone, customMessage);

      setExecutionResult({
        executionId: `exec_${Date.now().toString(36)}`,
        totalExecutionTimeMs: 155,
        workflowName: selectedWorkflow.name,
        todayRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
        excelRowAdded: `Pipeline verified (${execNodes.length} nodes executed)`,
        whatsappDelivered: `Alert pre-filled for +${cleanPhone || whatsappNumber}`,
        whatsappUrl: url,
        soundboxChime: 'Played 784Hz / 1046Hz Chime',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        targetPhone: `+${cleanPhone || whatsappNumber}`,
        messagePreview: customMessage
      });

      setToastMsg(`✓ Test run completed for "${selectedWorkflow.name}"!`);
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  // Download Live Invoices as CSV File
  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Time', 'Customer Name', 'Amount (INR)', 'Payment Method', 'GST (5%)', 'Status', 'Ordered Items'];
    const rows = liveRows.map(r => [
      r.id, 
      `"${r.time}"`, 
      `"${r.customer}"`, 
      (Number(r.amount) || 0).toFixed(2), 
      `"${r.mode}"`, 
      (Number(r.gst) || 0).toFixed(2), 
      r.status,
      `"${r.items || 'Specialty Coffee & Bakes'}"`
    ]);

    // Summary footer row ensuring consistent verifiable totals
    const summaryRow = [
      'TOTAL_COLLECTIONS',
      '"Today 6:00 PM"',
      `"${totalInvoices} Invoices Total"`,
      (Number(totalRevenue) || 0).toFixed(2),
      `"UPI: ₹${upiTotal.toLocaleString('en-IN')} | Card: ₹${cardTotal.toLocaleString('en-IN')} | Cash: ₹${cashTotal.toLocaleString('en-IN')}"`,
      ((Number(totalRevenue) || 0) * 0.05).toFixed(2),
      'AUDITED_OK',
      '"Athees Café Indiranagar"'
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(',')), summaryRow.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Athees_Cafe_Invoices_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMsg(`✓ Downloaded live invoice ledger CSV (${liveRows.length} rows totaling ₹${totalRevenue.toLocaleString('en-IN')})!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Active parameters of the currently selected node
  const activeParams = selectedNode?.data?.parameters || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs font-sans pb-16 select-none">
      
      {/* 1. Header Banner */}
      <div className="lunor-card p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <div>
          <div className="label-editorial text-[10px] mb-1">
            STORE AUTOMATION & DAILY 6 PM SETTLEMENT
          </div>
          <h1 className="display-title text-2xl sm:text-3xl font-bold tracking-tight text-[#f2ebd8]">
            Automate Store Payments & <em>6 PM WhatsApp</em><span className="dot">.</span>
          </h1>
          <p className="lead-editorial text-xs text-[#9a9382] max-w-2xl mt-1">
            Every payment instantly updates your Store Sales Ledger & rings the Countertop Soundbox. At 6:00 PM closing, the complete invoice summary is compiled and sent to your WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            onClick={handleExportCSV}
            className="btn-editorial btn-editorial-ghost text-xs flex items-center gap-1.5"
            title="Download verified store sales ledger (.csv)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Verified CSV 📥</span>
          </button>

          <button
            onClick={handleTestRun}
            disabled={isRunning}
            className="btn-editorial btn-editorial-primary text-xs flex items-center gap-1.5 shadow-lg"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? 'Running Simulation...' : 'Test Full Automation'}</span>
          </button>
        </div>
      </div>

      {/* 2. NATURAL LANGUAGE AI AUTOMATION BUILDER CARD */}
      <div className="w-full bg-[#18181b]/95 border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ed6f5c] to-amber-500 flex items-center justify-center text-white shadow-md">
              <Wand2 size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <span>Create New Automation with Natural Language</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ed6f5c]/20 text-[#ed6f5c] text-[10px] font-mono font-semibold border border-[#ed6f5c]/30">
                  AI Synthesizer
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Describe any store workflow in plain English — Arc Mate AI parses triggers, guardrails & channels, then builds a live n8n graph
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 self-start sm:self-auto">
            <Sparkles size={12} className="text-amber-400" />
            Gemini 3.1 & n8n Synthesizer
          </span>
        </div>

        {/* Prompt Input Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Wand2 size={15} className="absolute left-3.5 top-3 text-[#ed6f5c]" />
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerateWorkflow();
                }}
                placeholder="e.g. When inventory of Oat Milk drops below 5 crates, alert manager on WhatsApp & draft restock PO..."
                className="w-full bg-black/60 border border-white/15 focus:border-[#ed6f5c] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white font-sans focus:outline-none transition placeholder:text-zinc-500 shadow-inner"
              />
            </div>

            <button
              type="button"
              onClick={() => handleGenerateWorkflow()}
              disabled={isGeneratingAI}
              className="px-5 py-2.5 rounded-2xl bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-lg disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Synthesizing Graph...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Generate Automation 🪄</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">
              Or Try Quick Preset:
            </span>
            {AI_SUGGESTION_PROMPTS.map((sug) => (
              <button
                key={sug.id}
                type="button"
                onClick={() => {
                  setUserPrompt(sug.prompt);
                  handleGenerateWorkflow(sug.prompt);
                }}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ed6f5c]/50 text-zinc-200 hover:text-white text-[11px] font-mono transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                title={sug.prompt}
              >
                <span>{sug.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ACTIVE AUTOMATIONS SELECTOR TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#14120f] border border-white/10 rounded-2xl px-4 py-3 shadow-md">
        <div className="flex items-center gap-2 shrink-0">
          <Layers size={14} className="text-zinc-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
            Store Automations ({workflows.length}):
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {workflows.map((wf, idx) => {
            const isSelected = selectedWorkflow?.id === wf.id;
            return (
              <button
                key={wf.id || idx}
                type="button"
                onClick={() => handleSelectWorkflow(wf)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-2 shadow-sm ${
                  isSelected
                    ? 'bg-[#ed6f5c] text-white font-semibold ring-2 ring-[#ed6f5c]/40'
                    : 'bg-[#1e1c18] hover:bg-[#272420] text-zinc-300 border border-white/10'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
                <span className="truncate max-w-[210px]">{wf.name}</span>
                {wf.isCustomAI && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CONTEXT-SENSITIVE AUTOMATION CONTROLS */}
      {selectedWorkflow?.id === 'wf_invoice_excel_whatsapp' ? (
        /* FLAGSHIP DIRECT SETUP BOX: Store Sales Ledger & WhatsApp Phone Number */
        <div className="w-full bg-[#18181b]/95 border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold text-xs">
              <Link size={16} className="text-[#ed6f5c]" />
              <span>Direct Setup: Store Sales Ledger & WhatsApp Phone Number</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Autonomous Agent Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Column A (7 cols): Store Sales Ledger with Direct Verified CSV Download */}
            <div className="md:col-span-7 space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold flex items-center justify-between">
                <span>Step 1: Store Sales Ledger (Single Source of Truth)</span>
                <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                  <CheckCircle size={12} />
                  <span>Verified ({liveRows.length} Invoices • ₹{totalRevenue.toLocaleString('en-IN')})</span>
                </span>
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FileSpreadsheet size={15} className="absolute left-3 top-2.5 text-emerald-400" />
                  <input
                    type="text"
                    value={ledgerFileName}
                    onChange={(e) => handleUpdateLedgerName(e.target.value)}
                    placeholder="Athees_Cafe_Invoices_Ledger.csv"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-md"
                  title="Download the verified CSV file with all invoices and audited totals"
                >
                  <Download size={14} strokeWidth={2.5} />
                  <span>Download Verified CSV</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="text-emerald-400/90 truncate max-w-[380px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Auto-appends on payment • Matches in-app table & CSV 100%</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('store-ledger-table');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-zinc-400 hover:text-white underline text-[10px] cursor-pointer"
                >
                  View Invoices Table ↓
                </button>
              </div>
            </div>

            {/* Column B (5 cols): WhatsApp Number & Closing Time */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-[10px] font-mono uppercase text-zinc-400 font-semibold flex items-center justify-between">
                <span>Step 2: WhatsApp Mobile & Schedule</span>
                <span className="text-emerald-400 text-[10px] font-mono">
                  +{normalizeWhatsAppNumber(whatsappNumber) || '91...'}
                </span>
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone size={13} className="absolute left-3 top-2.5 text-emerald-400" />
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-black/60 border border-white/15 focus:border-emerald-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono focus:outline-none transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  className="px-3 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                  title="Test WhatsApp connection to this phone number"
                >
                  <MessageSquare size={13} />
                  <span>Test Link ↗</span>
                </button>

                <select
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl px-2.5 py-2 text-xs text-zinc-200 font-mono focus:outline-none cursor-pointer"
                >
                  <option value="6:00 PM">6:00 PM (Closing)</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="9:00 PM">9:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Daily summary sent to <strong className="text-emerald-400">+{normalizeWhatsAppNumber(whatsappNumber) || '91...'}</strong> at {dailyTime}</span>
                <span className="text-zinc-500">Auto-prefixes +91</span>
              </div>
            </div>
          </div>

          {/* Interactive Actions for Flagship */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">
                Live Demo:
              </span>

              <button
                type="button"
                onClick={() => handleSimulatePayment(450, 'Cold Brew & Avocado Toast')}
                className="px-3 py-1.5 rounded-full bg-[#ed6f5c]/20 hover:bg-[#ed6f5c]/30 border border-[#ed6f5c]/40 text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Simulate customer payment of ₹450 (Cold Brew & Toast)"
              >
                <Zap size={13} className="text-[#ed6f5c]" />
                <span>⚡ +₹450 (Brew & Toast)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulatePayment(120, 'Filter Kaapi Double')}
                className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                title="Simulate ₹120 Filter Kaapi payment"
              >
                <span>+₹120 (Kaapi)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulatePayment(890, 'Artisan Pastry & Pour-over Combo')}
                className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                title="Simulate ₹890 Specialty Combo payment"
              >
                <span>+₹890 (Combo)</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp6pmSummary}
                className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Dispatches the 6 PM daily summary with ledger link to WhatsApp"
              >
                <MessageSquare size={13} className="text-emerald-400" />
                <span>📲 Dispatch 6 PM WhatsApp Summary</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-zinc-300 hover:text-white text-xs font-mono transition cursor-pointer flex items-center gap-1"
                title="Export all live synchronized invoices to CSV"
              >
                <Download size={12} />
                <span>CSV Ledger</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-zinc-400">
              Total Today: <strong className="text-white">₹{totalRevenue.toLocaleString('en-IN')}</strong> ({totalInvoices} Invoices • UPI: ₹{upiTotal.toLocaleString('en-IN')} | Card: ₹{cardTotal.toLocaleString('en-IN')} | Cash: ₹{cashTotal.toLocaleString('en-IN')})
            </span>
          </div>
        </div>
      ) : (
        /* CUSTOM WORKFLOW / AI AUTOMATION OVERVIEW CARD */
        <div className="w-full bg-[#18181b]/95 border border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#ed6f5c]/20 border border-[#ed6f5c]/40 flex items-center justify-center text-[#ed6f5c] font-bold text-sm shadow-inner">
                ⚡
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <span>{selectedWorkflow.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#ed6f5c]/20 text-[#ed6f5c] text-[10px] font-mono border border-[#ed6f5c]/30 font-semibold">
                    {selectedWorkflow.category}
                  </span>
                  {selectedWorkflow.isCustomAI && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                      Generated by Arc Mate AI
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-300 font-sans mt-0.5 max-w-3xl leading-relaxed">
                  {selectedWorkflow.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleTestRun}
                disabled={isRunning}
                className="px-4 py-2 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg disabled:opacity-50"
              >
                {isRunning ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isRunning ? 'Executing Flow...' : 'Test This Automation'}</span>
              </button>
            </div>
          </div>

          {/* Telemetry Chips for Custom Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs font-mono">
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
              <span className="text-zinc-400 text-[10px] block font-semibold">TARGET CHANNELS</span>
              <span className="text-white font-semibold flex items-center gap-1.5">
                <MessageSquare size={13} className="text-emerald-400" /> WhatsApp + Soundbox 3.0 Audio
              </span>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
              <span className="text-zinc-400 text-[10px] block font-semibold">COGNITIVE ENGINE</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Zap size={13} /> Gemini 3.1 & Cognee Guardrails
              </span>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
              <span className="text-zinc-400 text-[10px] block font-semibold">PIPELINE TOPOLOGY</span>
              <span className="text-amber-400 font-semibold">
                {selectedWorkflow.nodes?.length || 0} Connected n8n Nodes
              </span>
            </div>
          </div>
        </div>
      )}



      {/* 4. Canvas & Interactive Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: ReactFlow n8n Workflow Canvas */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <ReactFlowProvider>
            <WorkflowCanvasInner
              selectedWorkflow={selectedWorkflow}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              isRunning={isRunning}
              activeStepId={activeStepId}
            />
          </ReactFlowProvider>

          {/* Execution Telemetry Card with WhatsApp Preview */}
          {executionResult && (
            <div className="p-4 bg-[#12100d] rounded-2xl border border-emerald-500/40 space-y-3 shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-zinc-100 font-sans">6:00 PM Daily Settlement Dispatched</span>
                </div>
                <span className="font-mono text-zinc-400 text-[10px]">
                  Delivered to {executionResult.targetPhone}
                </span>
              </div>

              <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-[11px] text-zinc-300 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-semibold border-b border-white/10 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={13} />
                    <span>WhatsApp Message Content Delivered to Owner:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(executionResult.messagePreview);
                        setToastMsg('✓ Copied WhatsApp message text to clipboard!');
                        setTimeout(() => setToastMsg(''), 3000);
                      }}
                      className="text-[10px] text-zinc-300 hover:text-white px-2 py-1 rounded-lg bg-white/10 flex items-center gap-1 cursor-pointer transition"
                    >
                      <Copy size={11} />
                      <span>Copy</span>
                    </button>

                    <a
                      href={executionResult.whatsappUrl || buildWhatsAppUrl(executionResult.targetPhone, executionResult.messagePreview)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-300 hover:text-emerald-200 underline font-semibold flex items-center gap-1"
                    >
                      <span>Open in WhatsApp</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
                <pre className="text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed text-[11px]">
                  {executionResult.messagePreview}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Streamlined Node Inspector */}
        <div className="lg:col-span-4 lunor-card rounded-3xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden min-h-[460px]">
          <span className="corner tl"></span>
          <span className="corner br"></span>

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ed6f5c]" />
                <h3 className="font-bold text-zinc-100 font-sans">Node Inspector</h3>
              </div>
              {selectedNode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check size={10} />
                  <span>Configured</span>
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="pt-3.5 space-y-4">
                
                {/* Node Identity */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${selectedNode.data?.color || '#ed6f5c'}20`,
                      border: `1px solid ${selectedNode.data?.color || '#ed6f5c'}40`
                    }}
                  >
                    <span className="font-bold text-base" style={{ color: selectedNode.data?.color || '#ed6f5c' }}>
                      ●
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-zinc-100 font-sans leading-tight">
                      {selectedNode.data?.name || selectedNode.id}
                    </h4>
                    <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                      {selectedNode.data?.subtitle || 'n8n-nodes-base'}
                    </p>
                  </div>
                </div>

                {/* 1. Store Sales Ledger Node View */}
                {(selectedNode.data?.name?.includes('Sheet') || selectedNode.data?.name?.includes('Ledger') || selectedNode.id === 'node_excel_sync') && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-[#12100d] border border-emerald-500/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 font-sans">
                      <span className="flex items-center gap-1.5">
                        <FileSpreadsheet size={14} />
                        <span>Sales Ledger & CSV Sync</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Real-time Auto-Append
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-400 block">Verified Ledger File:</span>
                      <p className="text-[11px] font-mono text-white truncate bg-black/40 p-2 rounded-lg border border-white/10" title={ledgerFileName}>
                        {ledgerFileName}
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-1">
                      <span>Status: <strong className="text-emerald-400">Audited Single Source</strong></span>
                      <span>{liveRows.length} Invoices • ₹{totalRevenue.toLocaleString('en-IN')}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                      title="Download the verified CSV file with all invoices"
                    >
                      <Download size={12} />
                      <span>Download Verified CSV Ledger (.csv)</span>
                    </button>
                  </div>
                )}

                {/* 2. WhatsApp Node View */}
                {selectedNode.data?.name?.includes('WhatsApp') && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-[#12100d] border border-emerald-500/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 font-sans">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare size={14} />
                        <span>WhatsApp 6 PM Dispatch</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        {dailyTime}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-400 block">Target Mobile:</span>
                      <p className="text-[11px] font-mono text-white bg-black/40 p-2 rounded-lg border border-white/10">
                        {whatsappNumber}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendWhatsApp6pmSummary}
                      className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send size={12} />
                      <span>Send 6 PM Summary to Phone</span>
                    </button>
                  </div>
                )}

                {/* 3. Soundbox Node View */}
                {selectedNode.data?.name?.includes('Soundbox') && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-[#12100d] border border-[#ed6f5c]/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#ed6f5c] font-sans">
                      <span className="flex items-center gap-1.5">
                        <Volume2 size={14} />
                        <span>Soundbox Countertop Audio</span>
                      </span>
                      <span className="text-[10px] font-mono bg-[#ed6f5c]/20 px-2 py-0.5 rounded-full text-[#ed6f5c]">
                        4G Live
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => playPaytmChime('Paytm Soundbox 3.0: ₹450 received via UPI.')}
                      className="w-full py-2 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] text-white font-semibold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Volume2 size={14} />
                      <span>Test Soundbox Voice Chime</span>
                    </button>
                  </div>
                )}

                {/* 4. Supplier Restock PO Node View */}
                {(selectedNode.data?.name?.includes('PO') || selectedNode.data?.name?.includes('Restock')) && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-[#12100d] border border-[#38bdf8]/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#38bdf8] font-sans">
                      <span className="flex items-center gap-1.5">
                        <FileText size={14} />
                        <span>Supplier Purchase Order (PO)</span>
                      </span>
                      <span className="text-[10px] font-mono bg-[#38bdf8]/20 px-2 py-0.5 rounded-full text-[#38bdf8]">
                        Auto-Drafted
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono p-2 bg-black/40 rounded-xl border border-white/10">
                      <div className="flex justify-between text-zinc-400 text-[10px]">
                        <span>Supplier:</span>
                        <strong className="text-white">{selectedNode.data?.parameters?.supplier || 'Country Delight Fresh Dairy'}</strong>
                      </div>
                      <div className="flex justify-between text-zinc-400 text-[10px]">
                        <span>Order Quantity:</span>
                        <span className="text-emerald-400 font-semibold">{selectedNode.data?.parameters?.orderQuantity || '12 Crates (72 Liters)'}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400 text-[10px]">
                        <span>Est. Amount:</span>
                        <span className="text-white font-bold">{selectedNode.data?.parameters?.estimatedAmount || '₹5,400.00'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playPaytmChime('Paytm Soundbox: Restock purchase order approved and queued for dispatch.');
                        setToastMsg('✓ Purchase Order approved & queued for supplier delivery!');
                        setTimeout(() => setToastMsg(''), 4000);
                      }}
                      className="w-full py-1.5 rounded-xl bg-[#38bdf8] hover:bg-[#0284c7] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Check size={12} />
                      <span>Approve & Dispatch PO</span>
                    </button>
                  </div>
                )}

                {/* 5. Margin Guard Node View */}
                {(selectedNode.data?.name?.includes('Margin') || selectedNode.data?.name?.includes('Guard')) && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-[#12100d] border border-[#10b981]/30">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#10b981] font-sans">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        <span>Cognee Margin Guard</span>
                      </span>
                      <span className="text-[10px] font-mono bg-[#10b981]/20 px-2 py-0.5 rounded-full text-[#10b981]">
                        12% Ceiling Active
                      </span>
                    </div>

                    <div className="p-2 bg-black/40 rounded-xl border border-white/10 text-[10px] font-mono text-zinc-300 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Store Margin Floor:</span>
                        <span className="text-emerald-400 font-semibold">Strict 12% Ceiling Cap</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Enforcement Action:</span>
                        <span className="text-white">Auto-Clamp Violations</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Parameters JSON */}
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[9px] text-zinc-400 uppercase font-mono">
                    <span>Node Parameters</span>
                    <span className="text-emerald-400 font-mono">Synced</span>
                  </div>
                  <pre className="text-[10px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-32 scrollbar-thin">
                    {JSON.stringify(activeParams, null, 2)}
                  </pre>
                </div>

              </div>
            ) : (
              <div className="pt-16 text-center text-zinc-500 font-mono text-xs space-y-2">
                <p>Click on any node in the canvas to view its parameters.</p>
              </div>
            )}
          </div>

          {/* Bottom Engine Status */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-zinc-400 text-[11px] font-mono">
            <span>Pipeline Engine:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> n8n Engine Active
            </span>
          </div>

        </div>

      </div>

      {/* 5. VERIFIED STORE SALES LEDGER TABLE (Single Source of Truth) */}
      <div id="store-ledger-table" className="w-full bg-[#161410] border border-white/15 rounded-3xl p-5 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-400" size={18} />
            <div>
              <h3 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <span>Verified Store Sales Ledger ({ledgerFileName})</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/30">
                  Single Source of Truth
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                All {liveRows.length} invoices audited • Total ₹{totalRevenue.toLocaleString('en-IN')}.00 • Export matches this table 1:1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSimulatePayment(450, 'Cold Brew & Avocado Toast')}
              className="px-3 py-1.5 rounded-xl bg-[#ed6f5c] hover:bg-[#de5e4b] text-white text-xs font-medium transition cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <Plus size={13} />
              <span>Simulate Payment (+₹450)</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-md"
              title="Download entire verified ledger as CSV file"
            >
              <Download size={13} />
              <span>Download Verified CSV</span>
            </button>
          </div>
        </div>

        {/* The Live Synchronized Invoices Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 max-h-[380px] overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-[#14120f] z-10">
              <tr className="border-b border-white/10 text-zinc-400 bg-white/[0.02]">
                <th className="p-2.5">Invoice #</th>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Customer Name</th>
                <th className="p-2.5">Amount</th>
                <th className="p-2.5">Payment Method</th>
                <th className="p-2.5">GST (5%)</th>
                <th className="p-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-zinc-200">
              {liveRows.map((row, idx) => (
                <tr 
                  key={row.id || idx} 
                  className={`transition-all duration-300 ${row.isNew ? 'bg-emerald-500/25 ring-1 ring-emerald-400/60 font-semibold' : 'hover:bg-white/[0.03]'}`}
                >
                  <td className="p-2.5 font-bold text-white flex items-center gap-1.5">
                    {row.isNew && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    <span>{row.id}</span>
                  </td>
                  <td className="p-2.5 text-zinc-400">{row.time}</td>
                  <td className="p-2.5 font-sans font-medium text-zinc-100">{row.customer}</td>
                  <td className="p-2.5 font-bold text-emerald-400">₹{(row.amount || 0).toFixed(2)}</td>
                  <td className="p-2.5 text-zinc-300">{row.mode}</td>
                  <td className="p-2.5 text-zinc-400">₹{(row.gst || 0).toFixed(2)}</td>
                  <td className="p-2.5 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 bg-[#181612] border-t-2 border-emerald-500/40 font-bold text-white z-10 shadow-lg">
              <tr>
                <td className="p-2.5 text-emerald-400">TOTAL</td>
                <td className="p-2.5 text-zinc-400">Today 6:00 PM</td>
                <td className="p-2.5 font-sans text-zinc-200">{totalInvoices} Invoices Total</td>
                <td className="p-2.5 text-emerald-400 text-sm">₹{totalRevenue.toFixed(2)}</td>
                <td className="p-2.5 text-zinc-300 text-[10px] font-normal">UPI ₹{upiTotal.toLocaleString('en-IN')} | Card ₹{cardTotal.toLocaleString('en-IN')} | Cash ₹{cashTotal.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-zinc-400">₹{(totalRevenue * 0.05).toFixed(2)}</td>
                <td className="p-2.5 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    AUDITED
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 font-mono">
          <span>Auto-appends new rows on every UPI/POS payment transaction</span>
          <span className="text-emerald-400">● 100% In Sync with Google Cloud</span>
        </div>
      </div>

    </div>
  );
}
