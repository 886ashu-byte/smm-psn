import React from 'react';
import {
  Layers,
  Sparkles,
  SlidersHorizontal,
  Activity,
  Server,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { NavigationTab } from '../types/smm';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentStep?: number;
  setCurrentStep?: (step: number) => void;
  connectedPanelsCount?: number;
  activeCampaignsCount: number;
  organicMode?: boolean;
  onOpenOrganicModeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentStep = 1,
  connectedPanelsCount = 3,
  activeCampaignsCount,
  organicMode = true,
  onOpenOrganicModeModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo & Hub Badge */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div
              onClick={() => setActiveTab('wizard')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900">
                    PulseFlow
                  </span>
                  <span className="hidden sm:inline-block text-[9px] md:text-[10px] font-semibold tracking-wide uppercase px-1.5 md:px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    v2.4
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile < md) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'wizard'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Wizard</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'tracker'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Tracker</span>
              {activeCampaignsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  {activeCampaignsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matrix Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('routing')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'routing'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Routing</span>
            </button>

            <button
              onClick={() => setActiveTab('panels')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'panels'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Panels</span>
            </button>
          </nav>

          {/* Right Status Controls */}
          {/* Right Status Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Organic Mode Interactive Pill */}
            <button
              onClick={onOpenOrganicModeModal}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold transition shadow-2xs group min-h-[36px] active:scale-95 touch-manipulation ${
                organicMode
                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100/60'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              }`}
              title="Click to learn about AI Organic Mode & view algorithmic delivery patterns"
            >
              <Sparkles className={`w-3.5 h-3.5 ${organicMode ? 'text-emerald-600 group-hover:rotate-12' : 'text-rose-500'} transition-transform shrink-0`} />
              <span className="hidden sm:inline">Organic Mode:</span>
              <span className="sm:hidden font-bold">Organic</span>
              <span className={`font-extrabold uppercase ml-0.5 ${organicMode ? 'text-emerald-700' : 'text-rose-600'}`}>
                {organicMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Connected Panel Status Pill */}
            <div
              onClick={() => setActiveTab('panels')}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] sm:text-xs font-medium cursor-pointer hover:bg-emerald-100/70 transition min-h-[36px] active:scale-95 touch-manipulation"
              title="Click to manage parent API panels"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold">{connectedPanelsCount} <span className="hidden sm:inline">Panels</span></span>
            </div>
          </div>
        </div>

        {/* Wizard Step Breadcrumb (Visible when Campaign Wizard is active) */}
        {activeTab === 'wizard' && (
          <div className="py-1.5 sm:py-2 border-t border-slate-100 flex items-center justify-between text-xs overflow-x-auto touch-scroll">
            <div className="flex items-center space-x-1.5 text-slate-500 shrink-0">
              <span className="font-semibold text-slate-700">Studio</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
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

            <div className="hidden sm:flex items-center space-x-1.5 text-emerald-600 font-medium text-[10px] bg-emerald-50/70 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
              <ShieldCheck className="w-3 h-3" />
              <span>Anti-Detection: Active</span>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (Thumb Zone Optimized for iOS & Android) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 pb-safe shadow-lg select-none">
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
    </header>
  );
};
