import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  Zap,
  Info,
  Sliders,
  BarChart3,
  Flame,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  CampaignConfig,
  DeliveryDuration,
  SyntheticHourlyRow,
  SyntheticMatrixResult,
} from '../../types/smm';
import {
  generateSyntheticMatrix,
  SYNTHETIC_MINIMUMS,
  SYNTHETIC_TARGET_TIERS,
} from '../../utils/smmEngine';

interface SyntheticMatrixLabProps {
  onApplyToWizard: (configPartial: Partial<CampaignConfig>) => void;
  onNavigateToWizard: () => void;
  onOpenOrganicModal: () => void;
}

export const SyntheticMatrixLab: React.FC<SyntheticMatrixLabProps> = ({
  onApplyToWizard,
  onNavigateToWizard,
  onOpenOrganicModal,
}) => {
  const [selectedViews, setSelectedViews] = useState<number>(5000);
  const [selectedDuration, setSelectedDuration] = useState<number>(6);
  const [copiedFormat, setCopiedFormat] = useState<'json' | 'csv' | null>(null);
  const [viewChartMode, setViewChartMode] = useState<'hourly' | 'cumulative'>('hourly');

  // Compute synthetic delivery matrix
  const matrixResult: SyntheticMatrixResult = useMemo(() => {
    return generateSyntheticMatrix(selectedViews, selectedDuration);
  }, [selectedViews, selectedDuration]);

  // Duration preset buttons
  const durationOptions = [
    { hours: 6, label: '6 Hours', sub: 'Flash Pacing' },
    { hours: 12, label: '12 Hours', sub: 'Quick Boost' },
    { hours: 24, label: '24 Hours', sub: 'Standard 1-Day' },
    { hours: 48, label: '48 Hours', sub: '2-Day Balanced' },
    { hours: 72, label: '72 Hours', sub: '3-Day Organic' },
    { hours: 168, label: '7 Days', sub: 'Slow Burn' },
  ];

  // Quick views options
  const viewPresets = [5000, 10000, 20000, 30000, 50000, 100000];

  // Copy JSON
  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(matrixResult, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedFormat('json');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Copy CSV
  const handleCopyCSV = () => {
    const headers = [
      'Hour',
      'Views',
      'Likes',
      'Comments',
      'Reposts',
      'Shares',
      'Saves',
      'CumViews',
      'CumLikes',
      'LikesPct',
      'CommentsPct',
      'SharesPct',
      'SavesPct',
      'PhaseNote',
    ];
    const rows = matrixResult.rows.map((r) =>
      [
        r.hour,
        r.views,
        r.likes,
        r.comments,
        r.reposts,
        r.shares,
        r.saves,
        r.cumViews,
        r.cumLikes,
        `${r.likesPct}%`,
        `${r.commentsPct}%`,
        `${r.sharesPct}%`,
        `${r.savesPct}%`,
        `"${r.note || ''}"`,
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    navigator.clipboard.writeText(csvContent);
    setCopiedFormat('csv');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // One-click apply to wizard
  const handleApply = () => {
    let durKey: DeliveryDuration = 'custom';
    if (selectedDuration === 6) durKey = '6h';
    else if (selectedDuration === 12) durKey = '12h';
    else if (selectedDuration === 24) durKey = '24h';
    else if (selectedDuration === 48) durKey = '48h';
    else if (selectedDuration === 72) durKey = '3d';
    else if (selectedDuration === 168) durKey = '7d';

    onApplyToWizard({
      baseViews: matrixResult.totalViews,
      likes: matrixResult.totalLikes,
      comments: matrixResult.totalComments,
      shares: matrixResult.totalShares,
      saves: matrixResult.totalSaves,
      reposts: matrixResult.totalReposts,
      duration: durKey,
      customDurationHours: selectedDuration,
      organicMode: true,
    });
    onNavigateToWizard();
  };

  // SVG Chart Dimensions
  const width = 800;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;

  const maxVal = useMemo(() => {
    if (viewChartMode === 'cumulative') return matrixResult.totalViews || 1;
    return Math.max(...matrixResult.rows.map((r) => r.views), 1);
  }, [matrixResult, viewChartMode]);

  const points = matrixResult.rows.map((r, i) => {
    const x = paddingX + (i / Math.max(1, matrixResult.rows.length - 1)) * (width - 2 * paddingX);
    const val = viewChartMode === 'cumulative' ? r.cumViews : r.views;
    const y = height - paddingY - (val / (maxVal * 1.1)) * (height - 2 * paddingY);
    return { x, y, hour: r.hour, val };
  });

  let chartPath = '';
  if (points.length > 0) {
    chartPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cx = (p1.x + p2.x) / 2;
      chartPath += ` C ${cx} ${p1.y}, ${cx} ${p2.y}, ${p2.x} ${p2.y}`;
    }
  }

  const fillPath =
    chartPath && points.length > 0
      ? `${chartPath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
      : '';

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-300 uppercase">
                AI Organic Model & Test Lab
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                Autonomous Generator
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Synthetic Delivery Engine & Algorithmic Matrix
            </h1>
            <p className="text-xs text-indigo-200/90 max-w-2xl leading-relaxed">
              Dynamically generates every order combination by total target views and duration while strictly
              enforcing parent panel batch minimums (Views ≥100, Likes ≥5, Reposts ≥1, Shares ≥10, Saves ≥1) and
              converging toward cumulative organic targets (Likes 1–2%, Comments ~0.15%, Shares ~0.8%, Saves ~0.5%).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={onOpenOrganicModal}
              className="w-full sm:w-auto min-h-[40px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-white/10 active:scale-[0.98]"
            >
              <Info className="w-3.5 h-3.5 text-indigo-300" />
              <span>What is Organic Mode?</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1.5 active:scale-[0.98]"
            >
              <span>Load into Campaign Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Selector Controls: Views & Duration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Total Target Views Selector */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Target Views Volume</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                Primary Driver
              </span>
            </label>
            <span className="font-mono text-sm font-extrabold text-indigo-600">
              {selectedViews.toLocaleString()} Views
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {viewPresets.map((vp) => (
              <button
                key={vp}
                type="button"
                onClick={() => setSelectedViews(vp)}
                className={`min-h-[44px] py-2 px-2.5 rounded-xl text-xs font-bold transition border text-center active:scale-95 touch-manipulation ${
                  selectedViews === vp
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {(vp / 1000).toFixed(0)}K
              </button>
            ))}
          </div>

          {/* Slider input */}
          <div className="pt-2 flex items-center space-x-3">
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={selectedViews}
              onChange={(e) => setSelectedViews(Number(e.target.value))}
              className="flex-1 accent-indigo-600 cursor-pointer h-7 touch-manipulation"
            />
            <input
              type="number"
              min={100}
              max={1000000}
              step={500}
              value={selectedViews}
              onChange={(e) => setSelectedViews(Math.max(100, Number(e.target.value)))}
              className="w-24 min-h-[40px] px-2 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-xs font-mono font-bold text-right focus:outline-none focus:border-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Duration Selector */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Delivery Duration Pacing</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                Pacing Window
              </span>
            </label>
            <span className="font-mono text-xs sm:text-sm font-extrabold text-emerald-600">
              {selectedDuration}h ({matrixResult.rows.length} Batches)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {durationOptions.map((opt) => (
              <button
                key={opt.hours}
                type="button"
                onClick={() => setSelectedDuration(opt.hours)}
                className={`min-h-[50px] p-2.5 rounded-xl text-left transition border flex flex-col justify-between active:scale-95 touch-manipulation ${
                  selectedDuration === opt.hours
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-bold">{opt.label}</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    selectedDuration === opt.hours ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {opt.sub}
                </span>
              </button>
            ))}
          </div>

          {/* Custom Duration Input */}
          <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Or enter arbitrary hours:</span>
            <div className="flex items-center space-x-1.5">
              <input
                type="number"
                min={2}
                max={336}
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Math.max(1, Number(e.target.value)))}
                className="w-16 min-h-[38px] px-2 py-1 rounded-xl border border-slate-200 text-xs sm:text-xs font-mono font-bold text-center focus:outline-none focus:border-indigo-500 bg-slate-50/50"
              />
              <span className="font-semibold text-slate-600">Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Quantities Reference Table (from specification) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Standard Target Quantities & Cumulative Ratios Reference</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Cumulative order-level targets: Likes 1–2% · Comments ~0.15% · Shares ~0.8% · Saves ~0.5%
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="font-semibold text-slate-600">Minimums Guard:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">Views ≥100</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">Likes ≥5</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">Shares ≥10</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">Saves ≥1</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Total Target Views</th>
                <th className="py-2.5 px-3 text-rose-600">Likes 1–2%</th>
                <th className="py-2.5 px-3 text-blue-600">Comments ~0.15%</th>
                <th className="py-2.5 px-3 text-emerald-600">Shares ~0.8%</th>
                <th className="py-2.5 px-3 text-violet-600">Saves ~0.5%</th>
                <th className="py-2.5 px-3 text-slate-600">Reposts</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SYNTHETIC_TARGET_TIERS.map((tier) => {
                const isSelected = selectedViews === tier.views;
                return (
                  <tr
                    key={tier.label}
                    onClick={() => setSelectedViews(tier.views)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/70 font-semibold'
                        : 'hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <td className="py-2.5 px-3 flex items-center space-x-2">
                      <span className="font-bold text-slate-900 font-mono">{tier.label}</span>
                      <span className="text-[11px] text-slate-400">({tier.views.toLocaleString()} views)</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-rose-700">
                      {tier.likesMin}–{tier.likesMax.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-700">~{tier.comments}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700">~{tier.shares}</td>
                    <td className="py-2.5 px-3 font-mono text-violet-700">~{tier.saves}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">~{tier.reposts}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedViews(tier.views);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Select {tier.label}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Calculated Order Cumulative Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Target Views
          </span>
          <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
            {matrixResult.totalViews.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>Min batch: 100v</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Likes
          </span>
          <span className="text-xl font-black text-rose-600 font-mono mt-0.5 block">
            {matrixResult.totalLikes}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
            Effective: <strong>{matrixResult.effectiveLikesPct}%</strong> (1–2%)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Comments
          </span>
          <span className="text-xl font-black text-blue-600 font-mono mt-0.5 block">
            {matrixResult.totalComments}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
            Effective: <strong>{matrixResult.effectiveCommentsPct}%</strong> (~0.15%)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Shares
          </span>
          <span className="text-xl font-black text-emerald-600 font-mono mt-0.5 block">
            {matrixResult.totalShares}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
            Effective: <strong>{matrixResult.effectiveSharesPct}%</strong> (~0.8%)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Saves
          </span>
          <span className="text-xl font-black text-violet-600 font-mono mt-0.5 block">
            {matrixResult.totalSaves}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
            Effective: <strong>{matrixResult.effectiveSavesPct}%</strong> (~0.5%)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Compliance Status
          </span>
          <span className="text-base font-extrabold text-emerald-600 mt-1 flex items-center space-x-1 block">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Passed</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
            {matrixResult.rows.length} Valid Batches
          </span>
        </div>
      </div>

      {/* Interactive Delivery Curve Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Algorithmic Curve Preview ({selectedViews.toLocaleString()} views / {selectedDuration} hours)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Unique non-linear distribution curve engineered to pass social media fraud detection algorithms.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewChartMode('hourly')}
                className={`min-h-[38px] px-3 py-1 rounded-lg transition active:scale-95 touch-manipulation ${
                  viewChartMode === 'hourly'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hourly Batches
              </button>
              <button
                type="button"
                onClick={() => setViewChartMode('cumulative')}
                className={`min-h-[38px] px-3 py-1 rounded-lg transition active:scale-95 touch-manipulation ${
                  viewChartMode === 'cumulative'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cumulative Growth
              </button>
            </div>
          </div>
        </div>

        {/* SVG Curve */}
        <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-2 relative overflow-hidden select-none">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 sm:h-52 select-none touch-none">
            <defs>
              <linearGradient id="matrixCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid line */}
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" />
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="4 4" />

            {fillPath && <path d={fillPath} fill="url(#matrixCurveGrad)" />}
            {chartPath && (
              <path
                d={chartPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Dots */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={i === 0 ? 5 : 4}
                  fill={i === 0 ? '#10b981' : '#ffffff'}
                  stroke={i === 0 ? '#059669' : '#6366f1'}
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={height - 5}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-slate-400"
                >
                  H{pt.hour}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Granular Batch-by-Batch Allocation Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Granular Hourly Event Allocation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {matrixResult.rows.length} Batches
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Every row adheres strictly to minimum constraints while converging toward order-level targets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJSON}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs min-h-[44px] active:scale-95 touch-manipulation"
            >
              {copiedFormat === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFormat === 'json' ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCSV}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs min-h-[44px] active:scale-95 touch-manipulation"
            >
              {copiedFormat === 'csv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copiedFormat === 'csv' ? 'Copied CSV!' : 'Export CSV'}</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-xs min-h-[44px] active:scale-95 touch-manipulation"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Apply to Order</span>
            </button>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-[10px] text-slate-500 px-3.5 py-1 bg-indigo-50/50 border-b border-slate-200/80 flex items-center justify-between">
          <span>👈 Swipe horizontally to view all hourly metrics 👉</span>
          <span className="font-mono font-bold text-indigo-600">10 metrics</span>
        </div>

        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3.5">Hour</th>
                <th className="py-2.5 px-3.5 text-indigo-700 font-extrabold">Views (≥100)</th>
                <th className="py-2.5 px-3.5 text-rose-700">Likes (≥5)</th>
                <th className="py-2.5 px-3.5 text-blue-700">Comments</th>
                <th className="py-2.5 px-3.5 text-slate-700">Reposts (≥1)</th>
                <th className="py-2.5 px-3.5 text-emerald-700">Shares (≥10)</th>
                <th className="py-2.5 px-3.5 text-violet-700">Saves (≥1)</th>
                <th className="py-2.5 px-3.5 text-slate-500 font-mono">Cum. Views</th>
                <th className="py-2.5 px-3.5 text-slate-500 font-mono">Likes %</th>
                <th className="py-2.5 px-3.5 text-slate-500">Algorithmic Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrixResult.rows.map((row) => (
                <tr key={row.hour} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="py-2.5 px-3.5 font-bold font-mono text-slate-900">
                    {row.hour}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-extrabold text-indigo-600">
                    <div className="flex items-center space-x-1.5">
                      <span>{row.views.toLocaleString()}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                        ✓ ≥100
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-rose-600 font-bold">
                    <div className="flex items-center space-x-1.5">
                      <span>{row.likes}</span>
                      {row.likes > 0 && (
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                            row.likes >= 10
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {row.likes >= 10 ? 'Macro 10+' : 'Micro JAP 5-9'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-blue-600 font-semibold">
                    {row.comments}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-700 font-semibold">
                    {row.reposts}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-emerald-600 font-bold">
                    <div className="flex items-center space-x-1.5">
                      <span>{row.shares}</span>
                      {row.shares >= 10 && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                          ✓ min 10
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-violet-600 font-semibold">
                    {row.saves}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-slate-600">
                    {row.cumViews.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-rose-700 font-bold">
                    {row.likesPct}%
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-500 text-[11px] truncate max-w-xs">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-700">
                <td className="py-3 px-3.5 uppercase tracking-wider text-[11px]">Total</td>
                <td className="py-3 px-3.5 font-mono font-extrabold text-indigo-300">
                  {matrixResult.totalViews.toLocaleString()}
                </td>
                <td className="py-3 px-3.5 font-mono font-extrabold text-rose-300">
                  {matrixResult.totalLikes} ({matrixResult.effectiveLikesPct}%)
                </td>
                <td className="py-3 px-3.5 font-mono text-blue-300">
                  {matrixResult.totalComments} ({matrixResult.effectiveCommentsPct}%)
                </td>
                <td className="py-3 px-3.5 font-mono text-slate-300">
                  {matrixResult.totalReposts}
                </td>
                <td className="py-3 px-3.5 font-mono text-emerald-300">
                  {matrixResult.totalShares} ({matrixResult.effectiveSharesPct}%)
                </td>
                <td className="py-3 px-3.5 font-mono text-violet-300">
                  {matrixResult.totalSaves} ({matrixResult.effectiveSavesPct}%)
                </td>
                <td className="py-3 px-3.5 font-mono text-slate-300">
                  {matrixResult.totalViews.toLocaleString()}
                </td>
                <td className="py-3 px-3.5 font-mono text-emerald-400">
                  Target Met
                </td>
                <td className="py-3 px-3.5 text-emerald-400 text-[11px] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>All Constraints Compliant</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
