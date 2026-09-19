import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  Share2, 
  Edit3, 
  Folder, 
  CheckCircle2, 
  CreditCard,
  Receipt,
  Sparkles,
  Volume2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_INVOICES, MOCK_TRANSACTIONS } from '../../data/mockStoreData';

export default function LunorDashboard({ 
  summary, 
  activeMerchant, 
  onLaunchCopilot, 
  onPlayChime, 
  onApproveAction,
  onNavigateTab
}) {
  const { isDark } = useTheme();
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('actionmate_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const [invRes, txRes] = await Promise.all([
          fetch('/api/invoices', { headers }),
          fetch('/api/transactions?limit=6', { headers })
        ]);

        if (invRes.ok) {
          const invData = await invRes.json();
          setInvoices(invData || []);
        }
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData || []);
        }
      } catch (err) {
        console.warn('Error fetching dashboard details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardDetails();
  }, [activeMerchant?.id]);

  // Chart data representing actual collections trend
  const chartData = [
    { label: 'Mon', value: 42100, lastWeek: 38200 },
    { label: 'Tue', value: 44800, lastWeek: 41500 },
    { label: 'Wed', value: 48500, lastWeek: 43200 },
    { label: 'Thu', value: 49200, lastWeek: 46800 },
    { label: 'Fri', value: 58900, lastWeek: 52400 },
    { label: 'Sat', value: 68400, lastWeek: 61800 },
    { label: 'Today', value: Number(summary?.todayCollection || 58450), lastWeek: 52100 }
  ];

  const todayCollections = Number(summary?.todayCollection || 58450);
  const todayOrders = Number(summary?.todayOrdersCount || transactions.length || 54);
  const totalInvoicesCount = Number(summary?.totalInvoicesCount || invoices.length || 54);
  const totalInvoicesValue = Number(summary?.totalInvoicesValue || 58450);
  const pendingSettlement = Number(summary?.pendingSettlement || 14200);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. Header & Greeting */}
      <div className="space-y-2">
        <div className="label-editorial text-[10px]">
          STORE INTELLIGENCE & TELEMETRY
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="display-title text-2xl lg:text-3xl text-[#f2ebd8]">
              Welcome back, <em>{activeMerchant?.ownerName || 'Merchant Partner'}</em><span className="dot">.</span>
            </h1>
            <p className="lead-editorial text-xs text-[#9a9382] mt-1">
              {activeMerchant?.name || 'Athees Café'} • {activeMerchant?.location || 'Indiranagar, Bangalore'} • Continuous revenue monitoring & patron telemetry
            </p>
          </div>

          {/* Soundbox Sync Badge */}
          <div 
            onClick={onPlayChime}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1e1c18]/80 hover:bg-[#25221d] border border-[rgba(242,235,216,0.12)] hover:border-[#ed6f5c]/40 text-xs transition cursor-pointer shadow-sm"
            title="Click to trigger Countertop Soundbox live announcement"
          >
            <span className="pulse-dot"></span>
            <span className="text-[#9a9382] text-[10px] font-mono uppercase tracking-wider">Soundbox 3.0:</span>
            <span className="font-semibold text-[#f2ebd8] font-sans">Online (4G)</span>
            <span className="text-[10px] text-[#ed6f5c] font-mono">96%</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Collections */}
        <div className="lunor-card rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
          <span className="corner tl"></span>
          <span className="corner br"></span>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#ed6f5c] uppercase">Today's Collections</span>
            <div className="text-2xl lg:text-3xl font-bold text-[#f2ebd8] mt-1.5 tracking-tight font-sans">
              ₹{todayCollections.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#e9b94a] mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" /> +12.4% vs yesterday
            </p>
          </div>
          <div className="stat-ring coral">
            <ArrowUpRight className="w-5 h-5 stroke-[2]" />
          </div>
        </div>

        {/* Card 2: Invoices Created */}
        <div className="lunor-card rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#9a9382] uppercase">Invoices Billed</span>
            <div className="text-2xl lg:text-3xl font-bold text-[#f2ebd8] mt-1.5 tracking-tight font-sans">
              {totalInvoicesCount}
            </div>
            <p className="text-[11px] text-[#9a9382] mt-1 font-mono">
              ₹{totalInvoicesValue.toLocaleString('en-IN')} total billed
            </p>
          </div>
          <div className="stat-ring">
            <Receipt className="w-4 h-4 stroke-[1.5] text-[#c8c0a8]" />
          </div>
        </div>

        {/* Card 3: Payments Received Today */}
        <div className="lunor-card rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#9a9382] uppercase">Payments Received</span>
            <div className="text-2xl lg:text-3xl font-bold text-[#f2ebd8] mt-1.5 tracking-tight font-sans">
              {todayOrders} Orders
            </div>
            <p className="text-[11px] text-[#9a9382] mt-1 font-mono">
              Store QR & Card POS
            </p>
          </div>
          <div className="stat-ring">
            <CreditCard className="w-4 h-4 stroke-[1.5] text-[#c8c0a8]" />
          </div>
        </div>

        {/* Card 4: Daily Settlement */}
        <div className="lunor-card rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#9a9382] uppercase">Pending Settlement</span>
            <div className="text-2xl lg:text-3xl font-bold text-[#f2ebd8] mt-1.5 tracking-tight font-sans">
              ₹{pendingSettlement.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#6e7448] mt-1 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" /> Tonight 11:30 PM
            </p>
          </div>
          <div className="stat-ring">
            <CheckCircle2 className="w-4 h-4 stroke-[1.5] text-[#6e7448]" />
          </div>
        </div>

      </div>

      {/* 3. Main Analytics Chart */}
      <div className="lunor-card rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <div className="flex items-center justify-between">
          <div>
            <div className="label-editorial text-[9px] mb-1">
              <span className="ix">FIG. 01</span> SALES VELOCITY & COLLECTION CADENCE
            </div>
            <h3 className="text-sm font-bold text-[#f2ebd8] tracking-tight font-sans">Collections & Revenue Trend (Weekly)</h3>
            <p className="text-xs text-[#9a9382] mt-0.5 font-body">Monitoring week-over-week velocity and peak business volumes</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-[#ed6f5c]"></span>
              <span className="text-[#f2ebd8] font-medium">This Week</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-[#6e6860] border-b border-dashed"></span>
              <span className="text-[#9a9382]">Last Week</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="atelierFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ed6f5c" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#ed6f5c" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="label" 
                stroke={isDark ? "#6e6860" : "#a1a1aa"} 
                fontSize={10} 
                fontFamily="JetBrains Mono"
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke={isDark ? "#6e6860" : "#a1a1aa"} 
                fontSize={10} 
                fontFamily="JetBrains Mono"
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#161410' : '#ffffff', 
                  borderColor: isDark ? 'rgba(242,235,216,0.12)' : 'rgba(0,0,0,0.08)', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  color: isDark ? '#f2ebd8' : '#111111',
                  fontSize: '12px',
                  fontFamily: 'Inter Tight'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ed6f5c" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#atelierFill)" 
              />
              <Line 
                type="monotone" 
                dataKey="lastWeek" 
                stroke={isDark ? "rgba(242,235,216,0.25)" : "rgba(0,0,0,0.18)"} 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                dot={false} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Two-Column Row: Recent Invoices & Recent Completed Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Invoices */}
        <div className="lunor-card rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,235,216,0.06)]">
            <div>
              <h3 className="text-sm font-bold text-[#f2ebd8] flex items-center gap-2 font-sans">
                <FileText size={15} className="text-[#ed6f5c]" /> Recent Invoices
              </h3>
              <p className="text-[11px] text-[#9a9382] font-body">Generated bills & customer checkouts</p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-[#ed6f5c] bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 px-2.5 py-0.5 rounded-full">
              {invoices.length} Bills
            </span>
          </div>

          <div className="space-y-2.5">
            {invoices.slice(0, 4).map((inv) => (
              <div key={inv.id} className="p-3 rounded-xl bg-[#1e1c18]/70 border border-[rgba(242,235,216,0.06)] hover:border-[rgba(242,235,216,0.14)] flex items-center justify-between transition">
                <div>
                  <div className="text-xs font-bold text-[#f2ebd8] flex items-center gap-2 font-mono">
                    {inv.invoiceNumber}
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#6e7448]/15 text-[#6e7448] border border-[#6e7448]/30 uppercase">
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#9a9382] mt-0.5 truncate max-w-[220px] font-body">
                    {Array.isArray(inv.items) && inv.items.length > 0 
                      ? inv.items.map(i => `${i.qty}x ${i.name}`).join(', ')
                      : 'Specialty Coffee Order'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#f2ebd8] font-mono">₹{Number(inv.total).toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-[#6e6860] font-mono">
                    {inv.createdAt ? new Date(inv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Stream */}
        <div className="lunor-card rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,235,216,0.06)]">
            <div>
              <h3 className="text-sm font-bold text-[#f2ebd8] flex items-center gap-2 font-sans">
                <CreditCard size={15} className="text-[#e9b94a]" /> Recent Received Payments
              </h3>
              <p className="text-[11px] text-[#9a9382] font-body">Live ledger recorded on Soundbox & QR</p>
            </div>
            <button
              onClick={onPlayChime}
              className="editorial-pill text-xs font-mono"
            >
              <Volume2 size={12} className="text-[#ed6f5c]" /> Soundbox Test
            </button>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 4).map((tx, idx) => (
              <div key={tx.id || idx} className="p-3 rounded-xl bg-[#1e1c18]/70 border border-[rgba(242,235,216,0.06)] hover:border-[rgba(242,235,216,0.14)] flex items-center justify-between transition">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#161410] border border-[rgba(242,235,216,0.1)] flex items-center justify-center text-xs font-mono font-bold text-[#c8c0a8] uppercase">
                    {tx.paymentMode || 'UPI'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#f2ebd8] font-sans">{tx.description || 'Counter QR Payment'}</div>
                    <div className="text-[10px] text-[#6e6860] flex items-center gap-1 mt-0.5 font-mono">
                      <Clock size={10} />
                      {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#e9b94a] font-mono">+₹{Number(tx.amount).toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-[#6e6860] font-mono">{tx.settled ? 'Settled' : 'Pending Batch'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Autonomous AI Assistant Action Cards */}
      <div className="space-y-3">
        <div className="label-editorial text-[9px]">
          <span className="ix">PLATE 02</span> AUTONOMOUS PROPOSITIONS
        </div>
        <h3 className="text-sm font-bold text-[#f2ebd8] tracking-tight font-sans">Autonomous Growth & Customer Intelligence</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Re-engagement Campaign */}
          <div className="lunor-card rounded-2xl p-5 shadow-sm space-y-4 border-[#ed6f5c]/30 relative overflow-hidden">
            <span className="corner tl"></span>
            <span className="corner br"></span>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#ed6f5c]/10 border border-[#ed6f5c]/30 flex items-center justify-center text-[#ed6f5c]">
                  <Folder className="w-5 h-5 fill-[#ed6f5c]/20" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#f2ebd8] font-sans">Patron Re-engagement Special</h4>
                  <p className="text-xs text-[#9a9382] mt-0.5 font-mono">10% OFF &gt; ₹249 • Evening Rush Slot</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#ed6f5c]/15 border border-[#ed6f5c]/30 px-2.5 py-1 rounded-full">
                <span className="text-[10px] font-mono font-bold text-[#ed6f5c]">47 Patrons</span>
              </div>
            </div>

            <p className="lead-editorial text-xs text-[#9a9382] leading-relaxed">
              Arc Mate isolated 47 regular patrons absent for 14+ days. This proposal personalizes a high-margin tea & bake bundle strictly within your 15% discount cap.
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-[rgba(242,235,216,0.06)]">
              <button
                onClick={onApproveAction}
                className="btn-editorial btn-editorial-primary text-xs flex-1 justify-center py-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Approve & Send</span>
              </button>
              <button
                onClick={() => onLaunchCopilot('Analyze our patron re-engagement campaign')}
                className="btn-editorial btn-editorial-ghost text-xs flex-1 justify-center py-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Review in Assistant</span>
              </button>
            </div>
          </div>

          {/* Card 2: Soundbox & Automation Status */}
          <div className="lunor-card rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#e9b94a]/10 border border-[#e9b94a]/30 flex items-center justify-center text-[#e9b94a]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#f2ebd8] font-sans">Store Automation Workflows</h4>
                  <p className="text-xs text-[#9a9382] mt-0.5 font-mono">Soundbox Chimes • Settlement Alerts</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#6e7448]/20 text-[#6e7448] border border-[#6e7448]/30">
                3 Active Rules
              </span>
            </div>

            <p className="lead-editorial text-xs text-[#9a9382] leading-relaxed">
              Automated triggers monitoring high-ticket payments, evening rush hours, and nightly settlement digests directly on your Soundbox and phone.
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-[rgba(242,235,216,0.06)]">
              <button
                onClick={() => onLaunchCopilot('Give me today summary and balance sheet status')}
                className="btn-editorial btn-editorial-ghost text-xs flex-1 justify-center py-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ed6f5c]" />
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
