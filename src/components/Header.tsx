import React from 'react';
import {
  Menu,
  Sparkles,
  Layers,
  Activity,
  SlidersHorizontal,
  Server,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { NavigationTab } from '../types/smm';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentStep?: number;
  connectedPanelsCount?: number;
  activeCampaignsCount: number;
  organicMode: boolean;
  onOpenOrganicModeModal: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentStep = 1,
  connectedPanelsCount = 3,
  activeCampaignsCount,
  organicMode,
  onOpenOrganicModeModal,
  onOpenMobileMenu,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'wizard':
        return {
          title: 'Campaign Wizard',
          subtitle: `Step 0${currentStep} of 5 · ${
            currentStep === 1
              ? 'Platform & Target URL'
              : currentStep === 2
              ? 'Signals & Volume Matrix'
              : currentStep === 3
              ? 'Audience & Curve Pacing'
              : currentStep === 4
              ? 'Jitter & Algorithm Safety'
              : 'Review & Dispatch'
          }`,
        };
      case 'tracker':
        return {
          title: 'Order Tracker & 24/7 Operations',
          subtitle: `${activeCampaignsCount} Active Algorithmic Campaign${
            activeCampaignsCount === 1 ? '' : 's'
          } Running`,
        };
      case 'matrix':
        return {
          title: 'Synthetic Delivery Engine & Matrix Lab',
          subtitle: 'Cumulative Ratio Targets & Granular Hourly Allocation Generator',
        };
      case 'routing':
        return {
          title: 'Metric-Level Service Routing',
          subtitle: 'Specific Provider Panel & Service ID Dispatch Gateway',
        };
      case 'panels':
        return {
          title: 'Connected Parent SMM Panels',
          subtitle: `${connectedPanelsCount} Provider APIs Synced & Verified`,
        };
      default:
        return { title: 'Studio', subtitle: 'Algorithmic Pacing' };
    }
  };

  const currentInfo = getTabTitle();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between min-h-[56px] sm:min-h-[64px]">
          {/* Left: Mobile Menu Trigger & Context Breadcrumb */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition active:scale-95 touch-manipulation min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Icon (when sidebar is closed) */}
            <div
              onClick={() => setActiveTab('wizard')}
              className="lg:hidden flex items-center space-x-1.5 cursor-pointer shrink-0"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 hidden sm:inline">
                PulseFlow
              </span>
            </div>

            {/* Desktop / Tablet Breadcrumbs & Active Title */}
            <div className="min-w-0 pl-1">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <span className="font-semibold text-slate-700 hidden sm:inline">Studio</span>
                <ChevronRight className="w-3 h-3 text-slate-300 hidden sm:inline" />
                <span className="font-bold text-slate-900 truncate">
                  {currentInfo.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-xs sm:max-w-md lg:max-w-lg hidden xs:block">
                {currentInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Anti-Detection Verified Badge (Desktop) */}
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Anti-Detection Verified</span>
            </div>

            {/* Organic Mode Interactive Pill */}
            <button
              type="button"
              onClick={onOpenOrganicModeModal}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-2xs group min-h-[36px] active:scale-95 touch-manipulation ${
                organicMode
                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100/70'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              }`}
              title="Click to learn about AI Organic Mode & view algorithmic delivery patterns"
            >
              <Sparkles
                className={`w-3.5 h-3.5 ${
                  organicMode ? 'text-emerald-600 group-hover:rotate-12' : 'text-rose-500'
                } transition-transform shrink-0`}
              />
              <span className="hidden sm:inline">Organic Mode:</span>
              <span className="sm:hidden font-bold">Organic</span>
              <span
                className={`font-extrabold uppercase ml-0.5 ${
                  organicMode ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {organicMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Connected Panel Status Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('panels')}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium hover:bg-emerald-100/70 transition min-h-[36px] active:scale-95 touch-manipulation"
              title="Click to manage parent API panels"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold">
                {connectedPanelsCount} <span className="hidden sm:inline">Panels</span>
              </span>
            </button>
          </div>
        </div>

        {/* Wizard Step Breadcrumb Bar (Visible on mobile/desktop when Campaign Wizard is active) */}
        {activeTab === 'wizard' && (
          <div className="px-3 sm:px-6 py-1.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs overflow-x-auto touch-scroll">
            <div className="flex items-center space-x-1.5 text-slate-500 shrink-0">
              <span className="font-semibold text-slate-700">Studio</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                Step 0{currentStep}
              </span>
              <span className="font-medium text-slate-600 text-[11px] truncate max-w-[200px] sm:max-w-none">
                {currentStep === 1 && 'Platform & Target URL'}
                {currentStep === 2 && 'Signals & Volume Matrix'}
                {currentStep === 3 && 'Audience & Curve Pacing'}
                {currentStep === 4 && 'Jitter & Algorithm Safety'}
                {currentStep === 5 && 'Review & Dispatch'}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold text-[10px] bg-emerald-50/70 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Anti-Detection: Active</span>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (Thumb Zone Optimized for iOS & Android) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-safe shadow-lg select-none">
        <div className="grid grid-cols-5 items-center h-14">
          <button
            type="button"
            onClick={() => setActiveTab('wizard')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] active:scale-90 transition-transform duration-100 touch-manipulation relative ${
              activeTab === 'wizard'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Wizard</span>
            {activeTab === 'wizard' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] active:scale-90 transition-transform duration-100 touch-manipulation relative ${
              activeTab === 'tracker'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Activity className="w-5 h-5 mb-0.5" />
              {activeCampaignsCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[8px] font-extrabold rounded-full bg-indigo-600 text-white leading-none">
                  {activeCampaignsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight">Tracker</span>
            {activeTab === 'tracker' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] active:scale-90 transition-transform duration-100 touch-manipulation relative ${
              activeTab === 'matrix'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5 text-emerald-500" />
            <span className="text-[10px] leading-tight">Matrix</span>
            {activeTab === 'matrix' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('routing')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] active:scale-90 transition-transform duration-100 touch-manipulation relative ${
              activeTab === 'routing'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Routing</span>
            {activeTab === 'routing' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('panels')}
            className={`flex flex-col items-center justify-center h-full min-h-[48px] active:scale-90 transition-transform duration-100 touch-manipulation relative ${
              activeTab === 'panels'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Server className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Panels</span>
            {activeTab === 'panels' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
