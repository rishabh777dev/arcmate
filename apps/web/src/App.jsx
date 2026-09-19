import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import LunorSidebar from './components/layout/LunorSidebar';
import LunorDashboard from './components/dashboard/LunorDashboard';
import CustomersView from './components/customers/CustomersView';
import ApprovalsView from './components/approvals/ApprovalsView';
import KnowledgeGraphView from './components/knowledge/KnowledgeGraphView';
import WorkflowStudioView from './components/workflow/WorkflowStudioView';
import CopilotChat from './components/copilot/CopilotChat';
import AccountSettingsModal from './components/common/AccountSettingsModal';
import ShaderBackground from './components/common/ShaderBackground';
import ArcMateLogo from './components/common/ArcMateLogo';
import ThemeToggle from './components/common/ThemeToggle';
import { playPaytmChime } from './services/soundboxAudio';
import { MOCK_SUMMARY, MOCK_PENDING_ACTION } from './data/mockStoreData';

export default function App() {
  // Navigation Router: 'landing' | 'login' | 'app'
  const getInitialView = () => {
    const hash = window.location.hash.toLowerCase();
    const token = localStorage.getItem('actionmate_token');
    if (hash === '#/login') return 'login';
    if (hash === '#/app') {
      return token ? 'app' : 'login';
    }
    return 'landing';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Authenticated State
  const [activeMerchant, setActiveMerchant] = useState(() => {
    try {
      const saved = localStorage.getItem('actionmate_merchant');
      return saved ? JSON.parse(saved) : {
        id: 'a0000000-0000-0000-0000-000000000001',
        name: 'Athees Café',
        ownerName: 'Atheeswaran R.',
        category: 'Specialty Artisan Coffee & Gourmet Bakes',
        location: '100ft Road, Indiranagar, Bangalore',
        preferredLanguage: 'en',
        soundboxDeviceId: 'PAYTM_SBX_BLR_7781',
        operatingHours: '07:30 AM - 11:00 PM',
        avgTicketSize: 240,
        upiId: 'atheescafe@paytm',
        onboardingCompleted: true,
        plan: 'growth'
      };
    } catch (e) {
      return null;
    }
  });

  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [diagnostics, setDiagnostics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'audit_01',
      actor: 'PAYTM_SOUNDBOX',
      actionType: 'DEVICE_TELEMETRY_SYNC',
      details: 'Paytm Soundbox 3.0 Pro online. 4G signal strong, battery 96%, audio chime loop active.',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: 'audit_02',
      actor: 'ACTIONMATE_RADAR',
      actionType: 'ANOMALY_DETECTED',
      details: 'Isolated 47 regular patrons absent for 14+ days. Evening slump detected (-18.4%).',
      timestamp: new Date(Date.now() - 35 * 60000).toISOString()
    },
    {
      id: 'audit_03',
      actor: 'COGNEE_GUARD',
      actionType: 'POLICY_EVALUATION',
      details: '10% discount retention campaign evaluated against store policies. Margin check PASSED (<= 15%).',
      timestamp: new Date(Date.now() - 34 * 60000).toISOString()
    },
    {
      id: 'audit_04',
      actor: 'APPROVAL_GATE',
      actionType: 'ACTION_DRAFT_QUEUED',
      details: 'Evening Regulars Re-engagement Campaign (47 Patrons) queued for merchant authorization.',
      timestamp: new Date(Date.now() - 33 * 60000).toISOString()
    }
  ]);
  const wsRef = useRef(null);

  // Assistant State
  const [messages, setMessages] = useState([]);
  const [agentSteps, setAgentSteps] = useState([
    { step: 'MONITORING', status: 'COMPLETED', details: 'Arc Mate intelligence active and monitoring store signals.' }
  ]);
  const [pendingAction, setPendingAction] = useState(MOCK_PENDING_ACTION);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with browser URL hash
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const token = localStorage.getItem('actionmate_token');
      if (hash === '#/login') setCurrentView('login');
      else if (hash === '#/app') {
        if (!token) {
          window.location.hash = '#/login';
          setCurrentView('login');
        } else {
          setCurrentView('app');
        }
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'landing') window.location.hash = '#/';
    else if (view === 'login') window.location.hash = '#/login';
    else if (view === 'app') window.location.hash = '#/app';
  };

  // Fetch store data whenever entering app
  useEffect(() => {
    if (currentView === 'app') {
      fetchStoreData();
    }
  }, [currentView]);

  // Connect WebSocket for real-time agent updates
  useEffect(() => {
    if (currentView !== 'app') return;

    const token = localStorage.getItem('actionmate_token');
    const mId = activeMerchant?.id || '';
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const wsBase = import.meta.env.VITE_WS_URL || (isDev ? `ws://${window.location.hostname}:4000` : 'wss://actionmate-backend.onrender.com');
    const wsUrl = `${wsBase}?merchantId=${mId}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (token) {
          ws.send(JSON.stringify({ type: 'AUTH', token, merchantId: mId }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.step) {
            setAgentSteps(prev => [...prev.slice(-4), data]);
          }
          if (data.actionDraft) {
            setPendingAction(data.actionDraft);
          }
        } catch (e) {}
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      console.warn('WebSocket connection error:', err);
    }
  }, [currentView, activeMerchant?.id]);

  const fetchStoreData = async () => {
    const token = localStorage.getItem('actionmate_token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      // 1. Fetch Profile & Merchant Details
      const meRes = await fetch('/api/me', { headers });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.merchant) {
          setActiveMerchant(meData.merchant);
          localStorage.setItem('actionmate_merchant', JSON.stringify(meData.merchant));
          
          if (meData.merchant.onboardingCompleted === false) {
            setShowOnboarding(true);
          }
        }
      }

      // 2. Fetch Summary & Diagnostics
      const [sumRes, diagRes, auditRes] = await Promise.all([
        fetch('/api/merchants/current/summary', { headers }),
        fetch('/api/merchants/current/diagnosis', { headers }),
        fetch('/api/audit', { headers })
      ]);

      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setSummary(sumData);
      }
      if (diagRes.ok) {
        const diagData = await diagRes.json();
        setDiagnostics(diagData);
      }
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(Array.isArray(auditData) ? auditData : []);
      }
    } catch (err) {
      console.error('Error loading store data:', err);
    }
  };

  const handleSendMessage = async (text, model = 'gemini-3.1-flash-lite') => {
    if (!text.trim() || isProcessing) return;

    const userMsg = {
      sender: 'merchant',
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setAgentSteps([]);
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('actionmate_token');
      const res = await fetch('/api/copilot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: text,
          model,
          context: {
            merchantId: activeMerchant?.id,
            merchantName: activeMerchant?.name,
            model
          }
        })
      });

      const data = await res.json();
      const assistantMsg = {
        sender: 'actionmate',
        role: 'assistant',
        text: data.reply || 'Analysis complete. I have updated your dashboard.',
        actionDraft: data.actionDraft || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (data.actionDraft) {
        setPendingAction(data.actionDraft);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'actionmate',
          role: 'assistant',
          text: 'I encountered an error connecting to reasoning intelligence. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveAction = async () => {
    if (!pendingAction) return;

    const actionId = pendingAction.id;
    try {
      const token = localStorage.getItem('actionmate_token');
      const res = await fetch(`/api/actions/${actionId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      
      playPaytmChime(`Campaign authorized! Dispatched to regular patrons.`);
      setPendingAction(null);

      setMessages(prev => [
        ...prev,
        {
          sender: 'actionmate',
          role: 'assistant',
          text: `Success! Campaign has been approved and dispatched to customer channels. Countertop Soundbox chime sounded.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      fetchStoreData();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleRejectAction = () => {
    setPendingAction(null);
    setMessages(prev => [
      ...prev,
      {
        sender: 'actionmate',
        role: 'assistant',
        text: 'Action draft rejected and archived. No customer messages were sent.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('actionmate_token');
    localStorage.removeItem('actionmate_merchant');
    localStorage.removeItem('actionmate_user');
    setActiveMerchant(null);
    navigateTo('login');
  };

  // ROUTE: Marketing Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage 
        onLaunchApp={() => {
          const token = localStorage.getItem('actionmate_token');
          navigateTo(token ? 'app' : 'login');
        }} 
      />
    );
  }

  // ROUTE: Authentication Page
  if (currentView === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={(authData) => {
          if (authData?.merchant) {
            setActiveMerchant(authData.merchant);
            if (authData.merchant.onboardingCompleted === false) {
              setShowOnboarding(true);
            }
          }
          navigateTo('app');
        }}
        onGoHome={() => navigateTo('landing')}
      />
    );
  }

  // ROUTE: Merchant App Shell
  return (
    <div className="flex h-screen lunor-bg overflow-hidden font-sans relative">
      {/* Background WebGPU Shader Spotlight & Ripples */}
      <ShaderBackground opacity={0.35} />

      {/* 1. Left Sidebar */}
      <LunorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={pendingAction ? 1 : 0}
        activeMerchant={activeMerchant}
        onPlayChime={() => playPaytmChime(`Countertop Soundbox: Audio verification passed for ${activeMerchant?.name || 'Store'}.`)}
        onExitToLanding={() => navigateTo('landing')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main Center Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-transparent relative z-10">
        
        {/* Top Header Bar with Editorial Metadata */}
        <header className="h-14 border-b border-[rgba(242,235,216,0.08)] bg-[#12100d]/85 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-2.5">
            <ArcMateLogo size={22} className="w-5 h-5 rounded-md shadow-sm shrink-0" />
            <span className="text-xs font-bold text-[#f2ebd8] tracking-tight">{activeMerchant?.name || 'Athees Café'}</span>
            <span className="text-[#6e6860]">•</span>
            <span className="text-[11px] font-serif italic text-[#c8c0a8] capitalize tracking-wide">{activeTab.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] text-[11px] text-[#c8c0a8]">
              <span className="pulse-dot" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9a9382]">Store Intelligence</span>
              <span className="text-[10px] font-bold text-[#ed6f5c] font-mono">LIVE</span>
            </div>

            {/* Sun / Moon Theme Toggle */}
            <ThemeToggle variant="icon" />
          </div>
        </header>

        {/* Tab Views */}
        <div className="p-6 md:p-8 flex-1">
          {activeTab === 'overview' && (
            <LunorDashboard
              summary={summary}
              activeMerchant={activeMerchant}
              onLaunchCopilot={(prompt) => {
                setActiveTab('copilot');
                if (prompt) handleSendMessage(prompt);
              }}
              onPlayChime={() => playPaytmChime(`Countertop Soundbox: ₹${summary?.todayCollection || 24850} received today on store QR.`)}
              onApproveAction={() => setActiveTab('approvals')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'copilot' && (
            <CopilotChat
              messages={messages}
              onSendMessage={handleSendMessage}
              onClearMessages={() => setMessages([])}
              isProcessing={isProcessing}
              agentSteps={agentSteps}
              pendingAction={pendingAction}
              activeMerchant={activeMerchant}
              onApproveAction={handleApproveAction}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView />
          )}

          {activeTab === 'workflow' && (
            <WorkflowStudioView />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeGraphView />
          )}

          {activeTab === 'approvals' && (
            <ApprovalsView
              pendingAction={pendingAction}
              onApprove={handleApproveAction}
              onReject={handleRejectAction}
              onGoToCopilot={() => setActiveTab('copilot')}
            />
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="space-y-1">
                <span className="label-editorial text-[10px]"><span className="ix">PLATE VI</span> TIMELINE</span>
                <h1 className="display-title text-2xl font-bold tracking-tight text-[#f2ebd8]">
                  Audit & Activity <em>Timeline</em><span className="dot">.</span>
                </h1>
                <p className="lead-editorial text-xs text-[#9a9382]">
                  Immutable ledger of autonomous actions, merchant approvals, and Soundbox hardware events.
                </p>
              </div>

              <div className="lunor-card rounded-2xl p-5 shadow-sm space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-[#1e1c18]/70 border border-[rgba(242,235,216,0.06)] flex items-center justify-between text-xs hover:border-[rgba(242,235,216,0.14)] transition">
                    <div>
                      <div className="font-semibold text-[#f2ebd8] flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ed6f5c]/10 text-[#ed6f5c] border border-[#ed6f5c]/25">
                          {log.actor}
                        </span>
                        <span className="font-sans">{log.actionType}</span>
                      </div>
                      <p className="text-[#9a9382] text-[11px] mt-1 font-body">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-[#6e6860] font-mono shrink-0 ml-4">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. Account Settings Modal (Clean store info, no internal API keys) */}
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        merchant={activeMerchant}
        onUpdateMerchant={(updated) => {
          setActiveMerchant(updated);
          localStorage.setItem('actionmate_merchant', JSON.stringify(updated));
        }}
      />

      {/* 4. Onboarding Wizard (Rendered for new stores until completed) */}
      {showOnboarding && (
        <OnboardingWizard
          merchant={activeMerchant}
          onComplete={() => setShowOnboarding(false)}
        />
      )}

    </div>
  );
}
