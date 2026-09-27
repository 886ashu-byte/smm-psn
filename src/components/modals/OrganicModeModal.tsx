import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Zap,
  Clock,
  Layers,
  Heart,
  Eye,
  Share2,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Info,
  Sliders,
  Cpu,
} from 'lucide-react';
import { GrowthPresetKey } from '../../types/smm';
import {
  GROWTH_PRESETS,
  SYNTHETIC_MINIMUMS,
  SYNTHETIC_TARGET_TIERS,
} from '../../utils/smmEngine';

interface OrganicModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  organicMode: boolean;
  onToggleOrganicMode: (enabled: boolean) => void;
  activePresetKey?: GrowthPresetKey;
  onSelectPreset?: (preset: GrowthPresetKey) => void;
}

export const OrganicModeModal: React.FC<OrganicModeModalProps> = ({
  isOpen,
  onClose,
  organicMode,
  onToggleOrganicMode,
  activePresetKey = 'explore_push',
  onSelectPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'synthetic' | 'comparison' | 'presets' | 'algorithm'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in pb-safe">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[92dvh] overflow-y-auto touch-scroll shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-t-3xl relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-slate-950 shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                    AI Organic Mode
                  </h2>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Algorithm Engine
                  </span>
                </div>
                <p className="text-xs text-indigo-200/90 mt-0.5 max-w-lg">
                  Automated non-linear delivery patterns engineered to pass Instagram Explore, TikTok FYP, and YouTube Shorts detection filters.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition active:scale-95 shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Toggle Bar inside Header */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-300">Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                  organicMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {organicMode ? 'ENABLED (100% Natural Delivery)' : 'DISABLED (Standard Drop)'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => onToggleOrganicMode(!organicMode)}
                className={`w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-sm active:scale-[0.98] ${
                  organicMode
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{organicMode ? 'Organic Active' : 'Enable AI Organic'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-3 sm:px-6 border-b border-slate-200 bg-slate-50/60 overflow-x-auto touch-scroll select-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 shrink-0 active:scale-95 touch-manipulation ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>What is Organic Mode?</span>
          </button>

          <button
            onClick={() => setActiveTab('synthetic')}
            className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 shrink-0 active:scale-95 touch-manipulation ${
              activeTab === 'synthetic'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Synthetic Test-Data Model</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 shrink-0 active:scale-95 touch-manipulation ${
              activeTab === 'comparison'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Standard vs AI Organic</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 shrink-0 active:scale-95 touch-manipulation ${
              activeTab === 'presets'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Growth Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('algorithm')}
            className={`min-h-[44px] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 shrink-0 active:scale-95 touch-manipulation ${
              activeTab === 'algorithm'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Detection Defense</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Core Definition Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-emerald-50/60 border border-indigo-100/80 shadow-xs space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    The Science Behind Organic Mode
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>When Organic Mode is enabled, all your new orders automatically use AI-generated delivery patterns.</strong> Instead of an instant, mechanical burst that immediately trips social media spam filters, our engine creates <strong>unique, non-linear growth curves</strong> tailored to your post's content and timezone. Every single order receives a mathematically distinct velocity curve, making the engagement appear 100% authentic to social platform recommendation algorithms.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-indigo-300 transition space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    1. Catmull-Rom Spline Interpolation
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Generates smooth S-curves and parabolic arcs rather than linear steps. Avoids the jagged velocity spikes that trigger rate-limit flags.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-emerald-300 transition space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    2. Circadian Sleep-Wake Dips
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Delivers engagement in sync with your target audience's local timezone. Automatically reduces velocity by 50%–65% during nocturnal sleep hours (e.g. 12 AM–7 AM) to reflect real human behavior.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-violet-300 transition space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    3. Cold-Start Seed Cohort (Hour 0)
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Suppresses initial volume to a gentle 100–150 views during Hour 0. Social algorithms inspect the first batch of viewers before expanding distribution; our seed cohort ensures a clean algorithmic pass.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-amber-300 transition space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    4. Anti-Bot Non-Round Salting
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Zero round numbers! While amateur panels send exactly 500 or 1,000 views, our engine injects organic Gaussian entropy, generating natural human numbers (e.g., 107, 243, 519) with staggered sub-batch delays.
                  </p>
                </div>
              </div>

              {/* Engagement Ratios Pill */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Algorithmic Golden Ratio Auto-Balancing</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    FYP Boost Multiplier: Up to 4.8x
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Organic Mode automatically aligns engagement types to the proven viral recipe:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-white/10 text-center">
                    <span className="text-[10px] text-slate-400 block">Likes Ratio</span>
                    <span className="text-xs font-bold text-rose-300">1.0% – 2.0%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 text-center">
                    <span className="text-[10px] text-slate-400 block">Comments Ratio</span>
                    <span className="text-xs font-bold text-blue-300">0.10% – 0.20%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 text-center">
                    <span className="text-[10px] text-slate-400 block">Shares Ratio</span>
                    <span className="text-xs font-bold text-emerald-300">0.6% – 0.8%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 text-center">
                    <span className="text-[10px] text-slate-400 block">Saves Ratio</span>
                    <span className="text-xs font-bold text-violet-300">0.4% – 0.6%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SYNTHETIC TEST-DATA MODEL TAB */}
          {activeTab === 'synthetic' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/70 border border-indigo-100 shadow-xs space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Synthetic Test-Data Model for SMM-Panel Dashboard
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Quantities are structured by <strong>total target views and duration</strong>. Because parent panel batch minimums conflict with small percentage calculations, the percentages below represent <strong>cumulative order-level targets</strong>, while individual hourly sub-events strictly obey your minimum batch constraints.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Likes</span>
                    <span className="text-xs font-bold text-rose-600">1% – 2%</span>
                    <span className="text-[9px] text-slate-500 block">Min batch: ≥5 likes</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Comments</span>
                    <span className="text-xs font-bold text-blue-600">~0.15%</span>
                    <span className="text-[9px] text-slate-500 block">Contextual discussions</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Shares</span>
                    <span className="text-xs font-bold text-emerald-600">~0.8%</span>
                    <span className="text-[9px] text-slate-500 block">Min batch: ≥10 shares</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Saves</span>
                    <span className="text-xs font-bold text-violet-600">~0.5%</span>
                    <span className="text-[9px] text-slate-500 block">Min batch: ≥1 save</span>
                  </div>
                </div>
              </div>

              {/* Total Target Quantities Reference Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Total Target Quantities Matrix
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Convergence Ratios
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="p-2.5">Total Views</th>
                        <th className="p-2.5 text-rose-600">Likes (1–2%)</th>
                        <th className="p-2.5 text-blue-600">Comments (~0.15%)</th>
                        <th className="p-2.5 text-emerald-600">Shares (~0.8%)</th>
                        <th className="p-2.5 text-violet-600">Saves (~0.5%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {SYNTHETIC_TARGET_TIERS.map((tier) => (
                        <tr key={tier.label} className="hover:bg-slate-50/60">
                          <td className="p-2.5 font-bold text-slate-900">{tier.label} ({tier.views.toLocaleString()})</td>
                          <td className="p-2.5 text-rose-600 font-bold">{tier.likesMin}–{tier.likesMax.toLocaleString()}</td>
                          <td className="p-2.5 text-blue-600">~{tier.comments}</td>
                          <td className="p-2.5 text-emerald-600">~{tier.shares}</td>
                          <td className="p-2.5 text-violet-600">~{tier.saves}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Duration Profiles Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="p-1 rounded bg-indigo-50 text-indigo-600 font-bold text-[10px]">6h & 12h</span>
                    <span className="font-bold text-xs text-slate-900">Concentrated Hourly Batches</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    For 6-hour orders (e.g. 5K views), allocations are concentrated into 6 distinct sub-batches (e.g. 650v, 800v, 950v, 900v, 850v, 850v) with likes starting from Hour 1 (7 likes) up to peak hour 3 (15 likes).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="p-1 rounded bg-emerald-50 text-emerald-600 font-bold text-[10px]">24h & 48h</span>
                    <span className="font-bold text-xs text-slate-900">Multi-Period Activity Curves</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Longer orders divide delivery into lower, middle, and higher activity periods (Hours 1–4, 5–8, 9–12, 13–16, 17–20, 21–24) to mirror genuine organic human session traffic.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* COMPARISON TAB */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Standard Drop Card */}
                <div className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      Standard Mechanical SMM Drop
                    </span>
                    <span className="text-xs font-bold text-rose-600">HIGH RISK</span>
                  </div>

                  <div className="h-28 bg-white rounded-xl border border-rose-200 p-2 flex items-end justify-center relative overflow-hidden">
                    {/* Visual flat block */}
                    <div className="absolute top-3 left-4 text-[10px] font-mono text-rose-700 font-bold">
                      Instant Spike (10,000 views at Minute 0) &rarr; Dead Flatline
                    </div>
                    <div className="w-16 h-20 bg-rose-400 rounded-t-lg mx-1 flex items-center justify-center text-[10px] font-bold text-white">
                      10,000
                    </div>
                    <div className="flex-1 h-0.5 bg-rose-200 mx-2 self-end mb-2"></div>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>Instant 1-minute bulk dump alerts fraud detection bots.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>Zero nocturnal sleep dip (delivers 3,000 views at 3:00 AM local time).</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>Predictable round numbers (exact 1,000 likes, 50 comments).</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>Extreme shadowban risk & account reach suppression.</span>
                    </li>
                  </ul>
                </div>

                {/* AI Organic Mode Card */}
                <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>PulseFlow AI Organic Mode</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-700">100% NATURAL</span>
                  </div>

                  <div className="h-28 bg-white rounded-xl border border-emerald-200 p-2 flex items-end justify-between gap-1 relative overflow-hidden">
                    <div className="absolute top-2 left-4 text-[10px] font-mono text-emerald-800 font-bold">
                      Dynamic Non-Linear Growth Curve
                    </div>
                    {/* Simulated Organic Curve Bars */}
                    {[12, 18, 32, 54, 78, 95, 84, 62, 45, 30, 18, 14].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-xs"
                      />
                    ))}
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    <li className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Gentle cold-start seed batch (Hour 0) establishes credibility.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Circadian sleep dips reduce volume naturally during night hours.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Salted non-round batches (e.g. 107, 243, 519) eliminate bot flags.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Triggers platform Explore / FYP recommendation push.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PRESETS TAB */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Choose an AI growth pattern calibrated for your campaign goal:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GROWTH_PRESETS.slice(0, 5).map((preset) => {
                  const isCurrent = activePresetKey === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => onSelectPreset && onSelectPreset(preset.id)}
                      className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition flex flex-col justify-between ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{preset.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {preset.safetyScore}/100 Safe
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">{preset.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Pacing: {preset.deliveryRange}</span>
                        <span className="text-indigo-600 font-bold">{preset.riskLevel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ALGORITHM DEFENSE TAB */}
          {activeTab === 'algorithm' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-xs text-white">
                    5-Point Algorithmic Detection Resistance Suite
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300">
                  Every order placed in Organic Mode passes through our live heuristic checker before dispatch.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    name: 'Velocity Spike Limiter',
                    desc: 'Caps hourly acceleration derivative to <300%/hr to avoid platform throttling.',
                    status: 'Active',
                  },
                  {
                    name: 'Circadian Timezone Pacing',
                    desc: 'Dampens delivery during sleeping hours according to recipient geolocation.',
                    status: 'Active',
                  },
                  {
                    name: 'Golden Engagement Ratio Lock',
                    desc: 'Maintains authentic proportions between Views, Likes, Comments, Shares, and Saves.',
                    status: 'Active',
                  },
                  {
                    name: 'Entropy Round-Number Salter',
                    desc: 'Converts round orders into randomized human values (e.g. 107, 243, 519).',
                    status: 'Active',
                  },
                  {
                    name: 'Micro-Batch Dispatch Randomizer',
                    desc: 'Staggers sub-batch dispatch with randomized micro-delays between 120s and 340s.',
                    status: 'Active',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-safe">
          <div className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Monetization & WHOP Bounty Safe</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition active:scale-95 touch-manipulation"
            >
              Close
            </button>
            <button
              onClick={() => {
                onToggleOrganicMode(true);
                onClose();
              }}
              className="flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition flex items-center justify-center space-x-1.5 active:scale-95 touch-manipulation"
            >
              <span>Apply & Activate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
