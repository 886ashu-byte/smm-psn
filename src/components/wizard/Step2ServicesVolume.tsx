import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Copy,
  Check,
  Settings2,
  AlertTriangle,
  BarChart2,
  Bookmark,
  Share2,
  Heart,
  MessageSquare,
  Users,
  Repeat,
  Flame,
  Zap,
  Info,
} from 'lucide-react';
import {
  CampaignConfig,
  DeliveryDuration,
  ServiceMetricRouting,
} from '../../types/smm';
import {
  analyzeAlgorithmDetectionTriggers,
  generateContextualComments,
  getPlatformBenchmarks,
} from '../../utils/smmEngine';

interface Step2ServicesVolumeProps {
  config: CampaignConfig;
  updateConfig: (partial: Partial<CampaignConfig>) => void;
  serviceRouting: ServiceMetricRouting;
  onNavigateToRouting: () => void;
  onNext: () => void;
  onBack: () => void;
  onOpenOrganicModeModal?: () => void;
}

export const Step2ServicesVolume: React.FC<Step2ServicesVolumeProps> = ({
  config,
  updateConfig,
  onNavigateToRouting,
  onNext,
  onBack,
  onOpenOrganicModeModal,
}) => {
  const [showWhopBanner, setShowWhopBanner] = useState(true);
  const [copiedComments, setCopiedComments] = useState(false);
  const [isGeneratingComments, setIsGeneratingComments] = useState(false);
  const [customHours, setCustomHours] = useState<number>(config.customDurationHours || 36);

  const durationHours =
    config.duration === 'custom'
      ? customHours
      : config.duration === '6h'
      ? 6
      : config.duration === '12h'
      ? 12
      : config.duration === '24h'
      ? 24
      : config.duration === '48h'
      ? 48
      : config.duration === '3d'
      ? 72
      : config.duration === '7d'
      ? 168
      : 336;

  // Real-time detection analysis
  const detectionAnalysis = analyzeAlgorithmDetectionTriggers(
    config.baseViews,
    config.likes,
    config.comments,
    config.shares,
    config.saves,
    config.platform,
    durationHours,
    config.jitterIntensity
  );

  // Benchmarks for platform
  const normalBenchmark = getPlatformBenchmarks(config.baseViews, config.platform, 'normal');
  const viralBenchmark = getPlatformBenchmarks(config.baseViews, config.platform, 'viral');

  const likesPct = config.baseViews > 0 ? (config.likes / config.baseViews) * 100 : 0;
  const commentsPct = config.baseViews > 0 ? (config.comments / config.baseViews) * 100 : 0;
  const sharesPct = config.baseViews > 0 ? (config.shares / config.baseViews) * 100 : 0;
  const savesPct = config.baseViews > 0 ? (config.saves / config.baseViews) * 100 : 0;

  const durationWindows: { id: DeliveryDuration; label: string; sub: string }[] = [
    { id: '6h', label: '6 Hours', sub: 'Flash Delivery' },
    { id: '12h', label: '12 Hours', sub: 'Quick Boost' },
    { id: '24h', label: '24 Hours', sub: 'Standard - Recommended' },
    { id: '48h', label: '48 Hours', sub: 'Balanced' },
    { id: '3d', label: '3 Days', sub: 'Organic Spread' },
    { id: '7d', label: '7 Days', sub: 'Maximum Organic' },
    { id: '14d', label: '14 Days', sub: 'Slow Burn' },
    { id: 'custom', label: 'Custom Duration', sub: 'Flexible Window' },
  ];

  // Helper to calculate auto engagement as per views: ~1.5% likes (1%-2%), ~0.15% comments, 0.8% shares, 0.5% saves
  const calculateAutoEngagementForViews = (views: number) => {
    const safeViews = Math.max(100, views);
    const targetLikes = Math.max(5, Math.round(safeViews * 0.015)); // ~1.5% (range ~1%–2%)
    const targetComments = Math.max(1, Math.round(safeViews * 0.0015)); // ~0.15%
    const targetShares = Math.max(1, Math.round(safeViews * 0.008)); // 0.8%
    const targetSaves = Math.max(1, Math.round(safeViews * 0.005)); // 0.5%
    return {
      likes: targetLikes,
      comments: targetComments,
      shares: targetShares,
      saves: targetSaves,
      reposts: 0,
      followers: 0,
    };
  };

  // Base views change auto-updates dependent engagement automatically
  const handleViewsChange = (val: number) => {
    const views = Math.max(100, val);
    const autoEng = calculateAutoEngagementForViews(views);
    updateConfig({
      baseViews: views,
      ...autoEng,
      approvedComments: generateContextualComments(config.commentNiche, autoEng.comments),
    });
  };

  // Apply Benchmark Preset
  const handleApplyBenchmarkPreset = (style: 'normal' | 'viral') => {
    const target = getPlatformBenchmarks(config.baseViews, config.platform, style);
    const newComments = generateContextualComments(config.commentNiche, target.targetComments);
    updateConfig({
      likes: target.targetLikes,
      comments: target.targetComments,
      shares: target.targetShares,
      saves: target.targetSaves,
      reposts: target.targetReposts,
      followers: target.targetFollowers,
      approvedComments: newComments,
    });
  };

  // Generate contextual comments
  const handleGenerateComments = async () => {
    setIsGeneratingComments(true);
    try {
      const resp = await fetch('/api/ai/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: config.commentNiche,
          count: config.comments,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.comments && Array.isArray(data.comments)) {
          updateConfig({ approvedComments: data.comments });
          setIsGeneratingComments(false);
          return;
        }
      }
    } catch (e) {
      console.warn('AI comments generator falling back to internal bank', e);
    }

    const comments = generateContextualComments(config.commentNiche, config.comments);
    updateConfig({ approvedComments: comments });
    setIsGeneratingComments(false);
  };

  const handleCopyComments = () => {
    navigator.clipboard.writeText(config.approvedComments.join('\n'));
    setCopiedComments(true);
    setTimeout(() => setCopiedComments(false), 2000);
  };

  const isLikesMacro = config.likes >= 10;
  const isLikesMicro = config.likes >= 5 && config.likes < 10;

  return (
    <div className="space-y-6">
      {/* Header & Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Step 02
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {config.platform === 'tiktok' ? 'TikTok FYP' : 'Instagram Reels'} Engagement Matrix
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Algorithm-Calibrated Volume & Engagement Ratios
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-synced organic matrix: ~1%–2% Likes, ~0.15% Comments, 0.8% Shares, and 0.5% Saves per views volume.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2.5">
          {/* Whop Bounty Mode Toggle */}
          <button
            onClick={() => updateConfig({ whopBountyMode: !config.whopBountyMode })}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              config.whopBountyMode
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Whop Anti-Fraud {config.whopBountyMode ? '(Active)' : '(Off)'}</span>
          </button>

          {/* Quick Auto Sync */}
          <button
            onClick={() => handleViewsChange(config.baseViews)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-600/20 transition"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Auto Ratio Sync</span>
          </button>
        </div>
      </div>

      {/* AI Organic Mode Spotlight Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center text-slate-950 shrink-0">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-extrabold text-sm text-slate-900">
                AI Organic Mode
              </h4>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  config.organicMode
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {config.organicMode ? 'Active (Recommended)' : 'Standard Mechanical Drop'}
              </span>
              <span className="text-[10px] font-bold text-indigo-700 font-mono">
                FYP Multiplier: Up to 4.8x
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              When enabled, all your new orders will automatically use <strong>AI-generated delivery patterns</strong>. This creates unique growth curves for every order to look 100% natural to social algorithms.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={onOpenOrganicModeModal}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline underline-offset-2 flex items-center space-x-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>What is Organic Mode?</span>
          </button>

          <button
            type="button"
            onClick={() => updateConfig({ organicMode: !config.organicMode })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs ${
              config.organicMode
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{config.organicMode ? 'Organic Mode: ON' : 'Turn Organic Mode ON'}</span>
          </button>
        </div>
      </div>

      {/* Whop Bounty Anti-Fraud Active Banner */}
      {config.whopBountyMode && showWhopBanner && (
        <div className="relative bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-start justify-between text-xs text-emerald-950">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-emerald-900">Algorithm Safe Ratio Engine Enabled</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 font-semibold text-[10px]">
                  Safety Score: {detectionAnalysis.overallSafetyPercent}%
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                  {config.platform === 'tiktok' ? 'TikTok Algorithm Guard' : 'Instagram Reels Guard'}
                </span>
              </div>
              <p className="mt-1 text-emerald-800 leading-relaxed text-[11px]">
                Enforcing authentic engagement distribution: ~1%–2% Likes, ~0.15% Comments, 0.8% Shares, and 0.5% Saves with non-round delivery salt and smooth spline pacing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowWhopBanner(false)}
            className="text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-100/50 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preset Engagement Ratio Profiles Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              Algorithm Baseline Templates
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Engagement Ratio Benchmark (~1%–2% Likes · 0.15% Comments · 0.8% Shares · 0.5% Saves)
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">
              {config.platform === 'tiktok' ? 'TikTok FYP Multiplier:' : 'Reels Explore Multiplier:'}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/30">
              {detectionAnalysis.fypBoostScore}/100 Boost
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
          <button
            type="button"
            onClick={() => handleApplyBenchmarkPreset('normal')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition hover:border-indigo-400"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">
                Standard Organic Ratio
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">Recommended</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              ~1.5% Likes | 0.15% Comments | 0.8% Shares | 0.5% Saves
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleApplyBenchmarkPreset('viral')}
            className="p-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 text-left transition hover:border-indigo-400"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-200 flex items-center space-x-1">
                <span>🔥</span>
                <span>Viral Explore Boost</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">Viral</span>
            </div>
            <p className="text-[10px] text-indigo-300/80 mt-1">
              2.0% Likes | 0.20% Comments | 1.2% Shares | 0.8% Saves
            </p>
          </button>

          <div
            onClick={() => {
              updateConfig({ pageTier: 'chota' });
              handleViewsChange(config.baseViews);
            }}
            className={`p-3 rounded-xl border text-left cursor-pointer transition ${
              config.pageTier === 'chota'
                ? 'bg-slate-800 border-indigo-500'
                : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200">Organic Calibration</span>
              {config.pageTier === 'chota' && <Check className="w-3 h-3 text-indigo-400" />}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Auto-calculated strictly as per views
            </p>
          </div>

          <div
            onClick={() => {
              updateConfig({ pageTier: 'bda' });
              handleApplyBenchmarkPreset('viral');
            }}
            className={`p-3 rounded-xl border text-left cursor-pointer transition ${
              config.pageTier === 'bda'
                ? 'bg-slate-800 border-indigo-500'
                : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200">High-Velocity Curve</span>
              {config.pageTier === 'bda' && <Check className="w-3 h-3 text-indigo-400" />}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Higher share-to-save ratio for rapid propagation
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Duration Window Selection (8 Modes) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-800 uppercase tracking-wider">
            Delivery Window Options
          </label>
          <span className="text-slate-500">
            Selected: <span className="font-bold text-indigo-600">{durationHours} Hours</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {durationWindows.map((win) => {
            const isSelected = config.duration === win.id;
            return (
              <button
                key={win.id}
                type="button"
                onClick={() => updateConfig({ duration: win.id })}
                className={`p-2.5 rounded-xl text-left transition border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold leading-tight">{win.label}</span>
                <span
                  className={`text-[9px] mt-1 truncate ${
                    isSelected ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {win.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Duration Input */}
        {config.duration === 'custom' && (
          <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between text-xs mt-2">
            <span className="font-semibold text-indigo-900">Custom Campaign Duration (Hours):</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={3}
                max={720}
                value={customHours}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  setCustomHours(val);
                  updateConfig({ customDurationHours: val });
                }}
                className="w-24 px-3 py-1.5 rounded-lg border border-indigo-300 bg-white text-indigo-950 font-bold font-mono text-center focus:outline-none"
              />
              <span className="text-indigo-800 font-bold">Hours ({ (customHours / 24).toFixed(1) } days)</span>
            </div>
          </div>
        )}
      </div>

      {/* Base Views Input with Validation (Auto-Calculates Dependent Engagement) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <span>Base Views (Required)</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              Primary Driver · Auto-adjusts signals
            </span>
          </label>
          <span className="text-xs font-semibold text-emerald-600">
            ✓ Auto-Calculated Ratios Active
          </span>
        </div>

        <input
          type="number"
          min={100}
          step={500}
          value={config.baseViews}
          onChange={(e) => handleViewsChange(Number(e.target.value))}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-mono text-base font-bold focus:bg-white focus:border-indigo-500 focus:outline-none transition"
        />

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>💡 Changing views automatically scales Likes (~1%–2%), Comments (~0.15%), Shares (0.8%), and Saves (0.5%)</span>
          <div className="flex items-center space-x-1.5">
            {[2500, 5000, 10000, 25000, 50000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleViewsChange(v)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  config.baseViews === v
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {(v / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Signals Grid (Views, Likes, Comments, Shares, Saves/Favorites, Reposts, Followers) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Signals Hierarchy & Volume Config (Auto-Calculated as per Views)
          </label>
          <span className="text-xs text-slate-500">
            {config.platform === 'tiktok' ? 'TikTok FYP Matrix' : 'Instagram Reels Matrix'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Likes (Micro vs Macro) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                <span>Likes (~1%–2%)</span>
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                  {likesPct.toFixed(2)}%
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isLikesMacro
                      ? 'bg-indigo-100 text-indigo-700'
                      : isLikesMicro
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isLikesMacro ? 'Macro (10+)' : isLikesMicro ? 'Micro (5–9)' : 'Min 5'}
                </span>
              </div>
            </div>
            <input
              type="number"
              min={5}
              value={config.likes}
              onChange={(e) => updateConfig({ likes: Math.max(0, Number(e.target.value)) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono font-semibold"
            />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Benchmark target: ~1.5% (1%–2%)</span>
              <span className="font-semibold text-emerald-600">Auto-calculated</span>
            </div>
            <div className="mt-1 text-[10px] text-amber-800 bg-amber-50 rounded px-2 py-0.5 border border-amber-200">
              ⚡ Likes unlock after 300+ views (Batch #3+). Micro Likes (5-9) routed to <strong>JAP #1778</strong>.
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <MessageSquare className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                <span>Comments (~0.15%)</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                {commentsPct.toFixed(2)}%
              </span>
            </div>
            <input
              type="number"
              min={1}
              value={config.comments}
              onChange={(e) => {
                const count = Math.max(0, Number(e.target.value));
                updateConfig({
                  comments: count,
                  approvedComments: generateContextualComments(config.commentNiche, count),
                });
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono font-semibold"
            />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Benchmark target: ~0.15% discussions</span>
              <span className="font-semibold text-emerald-600">Auto-calculated</span>
            </div>
          </div>

          {/* Shares (Highest algorithmic weight) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <Share2 className="w-4 h-4 text-emerald-500" />
                <span>Shares (0.8%)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">
                  Top Weight
                </span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                {sharesPct.toFixed(2)}%
              </span>
            </div>
            <input
              type="number"
              min={0}
              value={config.shares}
              onChange={(e) => updateConfig({ shares: Math.max(0, Number(e.target.value)) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono font-semibold"
            />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Explore / FYP viral recommendation</span>
              <span className="font-semibold text-emerald-600">Auto-calculated</span>
            </div>
          </div>

          {/* Saves / Bookmarks (Favorites on TikTok) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <Bookmark className="w-4 h-4 text-violet-500 fill-violet-500/20" />
                <span>{config.platform === 'tiktok' ? 'Favorites (0.5%)' : 'Saves (0.5%)'}</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                {savesPct.toFixed(2)}%
              </span>
            </div>
            <input
              type="number"
              min={0}
              value={config.saves}
              onChange={(e) => updateConfig({ saves: Math.max(0, Number(e.target.value)) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono font-semibold"
            />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Retention signal priority</span>
              <span className="font-semibold text-emerald-600">Auto-calculated</span>
            </div>
          </div>

          {/* Reposts (Optional) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <Repeat className="w-4 h-4 text-amber-500" />
                <span>Reposts (Optional)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">TikTok FYP Spread</span>
            </div>
            <input
              type="number"
              min={0}
              value={config.reposts}
              onChange={(e) => updateConfig({ reposts: Math.max(0, Number(e.target.value)) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono font-semibold"
            />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Optional multiplier</span>
              <span className="text-slate-400 font-mono">0.00%</span>
            </div>
          </div>

          {/* Followers (Optional) */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <Users className="w-4 h-4 text-cyan-600" />
                <span>Followers (Optional)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Account Gain</span>
            </div>
            <input
              type="number"
              min={0}
              value={config.followers}
              onChange={(e) => updateConfig({ followers: Math.max(0, Number(e.target.value)) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono font-semibold"
            />
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Profile conversion</span>
              <span className="text-slate-400 font-mono">0.00%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Engagement Ratio Dashboard & Algorithm Detection Triggers */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Live Engagement Ratio Validation & Forensic Triggers
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Calculated dynamically against 2026 Instagram & TikTok anti-bot filter heuristics.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Heuristic Safety:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                detectionAnalysis.overallSafetyPercent >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : detectionAnalysis.overallSafetyPercent >= 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {detectionAnalysis.overallSafetyPercent}% Safe
            </span>
          </div>
        </div>

        {/* Dynamic Ratio Progress Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-600 mb-1">
              <span className="font-semibold">Like / View Ratio</span>
              <span className="font-mono font-bold text-slate-900">{likesPct.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  likesPct > 15 ? 'bg-rose-500' : likesPct < 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, likesPct * 25)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Target: ~1% – 2%</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-600 mb-1">
              <span className="font-semibold">Comments / Views</span>
              <span className="font-mono font-bold text-slate-900">{commentsPct.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  commentsPct > 1.5 ? 'bg-rose-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(100, commentsPct * 250)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Target: ~0.15%</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-600 mb-1">
              <span className="font-semibold">Shares / Views</span>
              <span className="font-mono font-bold text-slate-900">{sharesPct.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min(100, sharesPct * 80)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Target: 0.8%</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-600 mb-1">
              <span className="font-semibold">Saves / Views</span>
              <span className="font-mono font-bold text-slate-900">{savesPct.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all"
                style={{ width: `${Math.min(100, savesPct * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Target: 0.5%</span>
          </div>
        </div>

        {/* Algorithm Detection Triggers List */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Algorithm Detection Triggers Status:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {detectionAnalysis.triggers.map((trigger) => (
              <div
                key={trigger.id}
                className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                  trigger.status === 'PASS'
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : trigger.status === 'WARN'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {trigger.status === 'PASS' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{trigger.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        trigger.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : trigger.status === 'WARN'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {trigger.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {trigger.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contextual Comments Generator [Human-Like Discussions] */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-1">
                <span>💬 Contextual Comments Generator</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                Human Discussions
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Zero bot emojis. Contextual organic discussions tailored to your content niche.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={config.commentNiche}
              onChange={(e) => {
                const niche = e.target.value;
                updateConfig({
                  commentNiche: niche,
                  approvedComments: generateContextualComments(niche, config.comments),
                });
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="General">Niche: General Viral</option>
              <option value="tech-ai">Niche: Tech & AI</option>
              <option value="gaming">Niche: Gaming & Clips</option>
              <option value="fitness">Niche: Fitness & Gym</option>
              <option value="comedy">Niche: Comedy & Relatable</option>
              <option value="vlog">Niche: Aesthetic & Vlog</option>
              <option value="motivation">Niche: Motivation & Mindset</option>
            </select>

            <button
              type="button"
              onClick={handleGenerateComments}
              disabled={isGeneratingComments}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingComments ? 'Generating...' : 'Re-Generate'}</span>
            </button>
          </div>
        </div>

        {/* Comments Preview Box */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
            <span>Approved Comments Bank ({config.approvedComments.length} ready):</span>
            <button
              type="button"
              onClick={handleCopyComments}
              className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition"
            >
              {copiedComments ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedComments ? 'Copied!' : 'Copy Bank'}</span>
            </button>
          </div>
          <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
            {config.approvedComments.slice(0, 10).map((cmt, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-sans flex items-center justify-between"
              >
                <span>&ldquo;{cmt}&rdquo;</span>
                <span className="text-[10px] text-slate-400">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SMM Service Mapping Quick Link Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Parent Provider Integration
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
              Autonomous Dispatch Ready
            </span>
          </div>
          <p className="text-xs text-slate-300">
            All sub-orders automatically map to your designated service IDs and dispatch seamlessly along your circadian curve.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToRouting}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Map SMM Services</span>
        </button>
      </div>

      {/* Stepper Navigation Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Target Link</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto min-h-[48px] flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-[0.98]"
        >
          <span>Continue to Audience Curve</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
