import React from 'react';
import {
  Layers,
  Sparkles,
  SlidersHorizontal,
  Activity,
  Server,
  ShieldCheck,
  ChevronRight,
  Zap,
  Info,
  ChevronLeft,
  X,
  LogOut,
  ExternalLink,
  Flame,
  Radio,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { NavigationTab } from '../types/smm';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentStep?: number;
  connectedPanelsCount?: number;
  activeCampaignsCount: number;
  organicMode: boolean;
  onToggleOrganicMode?: (enabled: boolean) => void;
  onOpenOrganicModeModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentStep = 1,
  connectedPanelsCount = 3,
  activeCampaignsCount,
  organicMode,
  onToggleOrganicMode,
  onOpenOrganicModeModal,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onLogout,
}) => {
  const navItems = [
    {
      id: 'wizard' as NavigationTab,
      label: 'Campaign Wizard',
      shortLabel: 'Wizard',
      sublabel: activeTab === 'wizard' ? `Step 0${currentStep} Active` : '5-Step Algo Order',
      icon: Layers,
      badge: null,
    },
    {
      id: 'tracker' as NavigationTab,
      label: 'Order Tracker',
      shortLabel: 'Tracker',
      sublabel: '24/7 Dispatch Engine',
      icon: Activity,
      badge: activeCampaignsCount > 0 ? `${activeCampaignsCount}` : null,
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'matrix' as NavigationTab,
      label: 'Synthetic Matrix Lab',
      shortLabel: 'Matrix Lab',
      sublabel: 'Ratio & Pacing Models',
      icon: Sparkles,
      iconColor: 'text-emerald-500',
      badge: 'Algo',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'routing' as NavigationTab,
      label: 'Service Routing',
      shortLabel: 'Routing',
      sublabel: 'Parent Provider Map',
      icon: SlidersHorizontal,
      badge: null,
    },
    {
      id: 'panels' as NavigationTab,
      label: 'Parent SMM Panels',
      shortLabel: 'Panels',
      sublabel: `${connectedPanelsCount} APIs Connected`,
      icon: Server,
      badge: `${connectedPanelsCount}`,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div
          onClick={() => handleNavClick('wizard')}
          className="flex items-center space-x-3 cursor-pointer group min-w-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  PulseFlow
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/80 shrink-0">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Algorithmic SMM Studio
              </p>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Navigation Group */}
      <div className="flex-1 overflow-y-auto touch-scroll py-4 px-3 space-y-6">
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Core Navigation
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-400">
                v2.4
              </span>
            </div>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'
                  } rounded-xl text-left transition-all relative group touch-manipulation min-h-[44px] ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50/90 to-indigo-50/40 text-indigo-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                >
                  {/* Left Active Accent Pill */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-600" />
                  )}

                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : item.iconColor || 'text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {!isCollapsed && (
                      <div className="min-w-0 text-left">
                        <span className="text-xs font-bold block truncate">
                          {item.label}
                        </span>
                        <span
                          className={`text-[10px] block truncate ${
                            isActive ? 'text-indigo-600/80 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {item.sublabel}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full shrink-0 ${
                        item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Organic Mode Card Widget in Sidebar */}
        {!isCollapsed ? (
          <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-emerald-50/80 rounded-2xl p-4 border border-emerald-200/80 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-950 tracking-tight leading-tight">
                    AI Organic Mode
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                    {organicMode ? 'Active Delivery' : 'Standard Drop'}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              {onToggleOrganicMode && (
                <button
                  type="button"
                  onClick={() => onToggleOrganicMode(!organicMode)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors touch-manipulation cursor-pointer ${
                    organicMode ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  title={organicMode ? 'Disable Organic Mode' : 'Enable Organic Mode'}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      organicMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              )}
            </div>

            <p className="text-[11px] text-emerald-900/90 leading-relaxed font-normal">
              Non-linear circadian delivery curves with micro-batching to pass Explore & FYP algorithms.
            </p>

            <button
              type="button"
              onClick={onOpenOrganicModeModal}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300/80 text-[11px] font-bold transition flex items-center justify-center space-x-1.5 shadow-2xs active:scale-[0.98] touch-manipulation"
            >
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Configure Curves & Presets</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onOpenOrganicModeModal}
              className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition relative"
              title={`Organic Mode: ${organicMode ? 'ON' : 'OFF'}`}
            >
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span
                className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  organicMode ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            </button>
          </div>
        )}

        {/* Connected Parent Panels Status Card */}
        {!isCollapsed && (
          <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {connectedPanelsCount} Provider APIs Synced
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleNavClick('panels')}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-1 font-mono text-[10px] text-slate-500">
              <div className="flex items-center justify-between">
                <span>SMMVault (#11465 Views)</span>
                <span className="text-emerald-600 font-bold">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span>JAP (#1778 Micro Likes)</span>
                <span className="text-emerald-600 font-bold">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ReliableSMM (#7147 Macro)</span>
                <span className="text-emerald-600 font-bold">Online</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer & System Status */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/70">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Anti-Detection Shield Active</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">100% OK</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    ashu1155
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Session Auth
                  </span>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Lock Session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <span title="Shield Active">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </span>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Lock Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP FIXED SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-slate-200/90 bg-white min-h-screen sticky top-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64 xl:w-72'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* MOBILE OFF-CANVAS DRAWER OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
