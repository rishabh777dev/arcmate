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
import ArcMateLogo from '../common/ArcMateLogo';
import ThemeToggle from '../common/ThemeToggle';

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
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#1e1c18]/80 border border-[rgba(242,235,216,0.1)] hover:border-[#ed6f5c]/40 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <ArcMateLogo size={28} className="w-7 h-7 rounded-lg shadow-sm shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-[#f2ebd8] tracking-tight block truncate font-sans">
                {activeMerchant?.name || 'Athees Café'}
              </span>
              <span className="text-[10px] text-[#9a9382] block truncate font-mono">
                {activeMerchant?.ownerName || 'Merchant Partner'} • Online
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6e6860] group-hover:text-[#ed6f5c] transition shrink-0 ml-1" />
        </div>

        {/* 2. Main Navigation Links */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-mono tracking-widest text-[#6e6860] uppercase">
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
                    ? 'lunor-nav-active'
                    : 'lunor-nav-inactive'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ed6f5c]' : 'text-[#9a9382]'}`} />
                  <span className="font-sans">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ed6f5c]/15 text-[#ed6f5c] border border-[#ed6f5c]/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#e9b94a]/20 text-[#e9b94a] border border-[#e9b94a]/30 animate-pulse">
                      {item.count}
                    </span>
                  )}
                  {item.dot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ed6f5c]"></span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Quick Links Section */}
        <div className="space-y-1 pt-2 border-t border-[rgba(242,235,216,0.06)]">
          <div className="px-2 pb-1 text-[10px] font-mono tracking-widest text-[#6e6860] uppercase">
            Store Automations
          </div>
          
          <button
            onClick={() => setActiveTab('workflow')}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-[#9a9382] hover:text-[#f2ebd8] hover:bg-[rgba(242,235,216,0.03)] transition text-xs"
          >
            <span className="truncate">Patron Re-engagement</span>
            <span className="text-[9px] font-mono text-[#6e7448] bg-[#6e7448]/15 border border-[#6e7448]/30 px-1.5 py-0.5 rounded">Active</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-[#9a9382] hover:text-[#f2ebd8] hover:bg-[rgba(242,235,216,0.03)] transition text-xs"
          >
            <span className="truncate">Discount & Margin Rules</span>
            <span className="text-[9px] font-mono text-[#6e6860]">3 Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-[#9a9382] hover:text-[#f2ebd8] hover:bg-[rgba(242,235,216,0.03)] transition text-xs"
          >
            <span className="truncate">Activity & Audit Timeline</span>
            <span className="text-[9px] font-mono text-[#6e6860]">Live</span>
          </button>
        </div>

      </div>

      {/* Lower Hardware & Settings Footer */}
      <div className="space-y-2 pt-3 border-t border-[rgba(242,235,216,0.06)]">
        
        {/* Hardware Status Tile */}
        <div className="p-2.5 rounded-xl bg-[#1e1c18]/70 border border-[rgba(242,235,216,0.08)] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#f2ebd8] flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#ed6f5c]" />
              Countertop Soundbox Pro
            </span>
            <span className="pulse-dot"></span>
          </div>
          <div className="text-[10px] text-[#9a9382] flex items-center justify-between font-mono">
            <span>4G Dual SIM • 96%</span>
            <button 
              onClick={onPlayChime}
              className="text-[#ed6f5c] hover:underline font-semibold"
            >
              Test Chime
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-1.5">
          <ThemeToggle variant="sidebar" />

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onOpenSettings}
              className="py-2 px-2.5 rounded-xl bg-[#1e1c18]/80 hover:bg-[rgba(242,235,216,0.08)] text-[#c8c0a8] hover:text-white border border-[rgba(242,235,216,0.08)] flex items-center justify-center gap-1.5 transition text-[11px] font-medium"
            >
              <Settings className="w-3 h-3 text-[#9a9382]" />
              <span>Store Info</span>
            </button>

            <button
              onClick={onLogout}
              className="py-2 px-2.5 rounded-xl bg-[#1e1c18]/80 hover:bg-[#ed6f5c]/10 text-[#c8c0a8] hover:text-[#ed6f5c] border border-[rgba(242,235,216,0.08)] hover:border-[#ed6f5c]/20 flex items-center justify-center gap-1.5 transition text-[11px] font-medium"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <button
          onClick={onExitToLanding}
          className="w-full py-1.5 text-center text-[10px] text-[#6e6860] hover:text-[#ed6f5c] transition block font-mono"
        >
          ← Return to Landing Page
        </button>

      </div>

    </aside>
  );
}
