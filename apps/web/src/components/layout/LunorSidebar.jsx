import React from 'react';
import { 
  LayoutGrid, 
  Bot, 
  Users, 
  Workflow, 
  Database, 
  ShieldAlert, 
  Volume2, 
  LogOut,
  Home,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function LunorSidebar({ 
  activeTab, 
  setActiveTab, 
  pendingApprovalsCount, 
  activeMerchant,
  onPlayChime,
  onExitToLanding,
  onOpenSettings,
  onLogout
}) {
  const primaryNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutGrid },
    { id: 'copilot', label: 'AI Assistant', icon: Bot, badge: 'AI', dot: true },
    { id: 'customers', label: 'Patrons & Cohorts', icon: Users, alertDot: true },
    { id: 'workflow', label: 'Automation Studio', icon: Workflow },
    { id: 'knowledge', label: 'Store Knowledge & Rules', icon: Database },
    { id: 'approvals', label: 'Action Approvals', icon: ShieldAlert, count: pendingApprovalsCount }
  ];

  return (
    <aside className="w-64 lunor-sidebar flex flex-col justify-between p-4 shrink-0 h-screen sticky top-0 z-40 select-none text-xs">
      
      {/* Upper Navigation Container */}
      <div className="space-y-4">
        
        {/* 1. Store Profile Pill */}
        <div 
          onClick={onOpenSettings}
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1B20] border border-white/[0.07] hover:border-blue-500/30 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/logo.png" alt="ActionMate Logo" className="w-7 h-7 rounded-lg shadow-sm object-contain" />
            <div className="min-w-0">
              <span className="font-semibold text-white tracking-tight block truncate">
                {activeMerchant?.name || 'Athees Café'}
              </span>
              <span className="text-[10px] text-zinc-400 block truncate">
                {activeMerchant?.ownerName || 'Merchant Partner'} • Online
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition shrink-0 ml-1" />
        </div>

        {/* 2. Main Navigation Links */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Workspace
          </div>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition ${
                  isActive
                    ? 'lunor-nav-active text-white'
                    : 'lunor-nav-inactive text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {item.badge}
                    </span>
                  )}
                  {item.count > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 animate-pulse">
                      {item.count}
                    </span>
                  )}
                  {item.dot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Quick Links Section */}
        <div className="space-y-1 pt-2 border-t border-white/[0.05]">
          <div className="px-2 pb-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Store Automations
          </div>
          
          <button
            onClick={() => setActiveTab('workflow')}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-zinc-400 hover:text-white hover:bg-white/[0.03] transition"
          >
            <span className="truncate">Patron Re-engagement</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-zinc-400 hover:text-white hover:bg-white/[0.03] transition"
          >
            <span className="truncate">Discount & Margin Rules</span>
            <span className="text-[10px] text-zinc-500">3 Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-zinc-400 hover:text-white hover:bg-white/[0.03] transition"
          >
            <span className="truncate">Activity & Audit Timeline</span>
            <span className="text-[10px] text-zinc-500">Live</span>
          </button>
        </div>

      </div>

      {/* Lower Hardware & Settings Footer */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        
        {/* Hardware Status Tile */}
        <div className="p-2.5 rounded-xl bg-[#16171B] border border-white/[0.05] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-white flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              Paytm Soundbox 3.0 Pro
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-[10px] text-zinc-400 flex items-center justify-between">
            <span>4G Dual SIM • Battery 96%</span>
            <button 
              onClick={onPlayChime}
              className="text-blue-400 hover:underline font-medium"
            >
              Test Chime
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onOpenSettings}
            className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] flex items-center justify-center gap-1.5 transition text-[11px] font-medium"
          >
            <Settings className="w-3 h-3 text-zinc-400" />
            <span>Store Info</span>
          </button>

          <button
            onClick={onLogout}
            className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/10 text-zinc-300 hover:text-red-300 border border-white/[0.06] hover:border-red-500/20 flex items-center justify-center gap-1.5 transition text-[11px] font-medium"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>

        <button
          onClick={onExitToLanding}
          className="w-full py-1.5 text-center text-[10px] text-zinc-500 hover:text-zinc-300 transition block"
        >
          ← Return to Marketing Portal
        </button>

      </div>

    </aside>
  );
}
