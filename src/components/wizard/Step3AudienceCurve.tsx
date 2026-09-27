import React, { useState, useRef, useEffect } from 'react';
import {
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Info,
  Clock,
  Layers,
  BarChart3,
  Calendar,
  Zap,
  Rocket,
} from 'lucide-react';
import {
  CampaignConfig,
  CircadianRegion,
  GrowthPresetKey,
  HourlyChunkAllocation,
} from '../../types/smm';
import {
  DURATION_HOURS,
  GROWTH_PRESETS,
  REGIONS,
} from '../../utils/smmEngine';
import { LiveOrganicGrowthPreview } from '../organic/LiveOrganicGrowthPreview';
import { PerTypeOrganicDeliveryPreview } from '../organic/PerTypeOrganicDeliveryPreview';

interface Step3AudienceCurveProps {
  config: CampaignConfig;
  updateConfig: (partial: Partial<CampaignConfig>) => void;
  allocations: HourlyChunkAllocation[];
  onNext: () => void;
  onBack: () => void;
}

export const Step3AudienceCurve: React.FC<Step3AudienceCurveProps> = ({
  config,
  updateConfig,
  allocations,
  onNext,
  onBack,
}) => {
  const [selectedBarChunk, setSelectedBarChunk] = useState<HourlyChunkAllocation | null>(null);
  const [viewMode, setViewMode] = useState<'hourly' | 'daily'>('hourly');
  const [syncLayers, setSyncLayers] = useState(true);
  const [previewTab, setPreviewTab] = useState<'simulator' | 'perType' | 'chunks'>('simulator');

  // SVG Canvas Drag State
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectedRegion = REGIONS.find((r) => r.id === config.region) || REGIONS[0];
  const selectedPreset = GROWTH_PRESETS.find((p) => p.id === config.growthPreset) || GROWTH_PRESETS[0];

  // Calculate Peak Velocity
  const peakVelocity = allocations.reduce((max, chunk) => Math.max(max, chunk.views), 0);
  const peakChunk = allocations.find((c) => c.views === peakVelocity);
  const peakHour = peakChunk ? peakChunk.hour : 11;

  // Cold Start Warning Check (Hour 0 velocity > 30% of peak or > 180)
  const hour0 = allocations[0]?.views || 0;
  const isColdStartWarning = hour0 > 180 || (peakVelocity > 0 && hour0 / peakVelocity > 0.45);

  // Handle Preset selection
  const handleSelectPreset = (presetKey: GrowthPresetKey) => {
    const preset = GROWTH_PRESETS.find((p) => p.id === presetKey);
    if (!preset) return;
    updateConfig({
      growthPreset: presetKey,
      curvePoints: [...preset.points],
    });
  };

  // Gaussian Auto-Smooth curve points
  const handleAutoSmooth = () => {
    const pts = [...config.curvePoints];
    if (pts.length < 3) return;

    const smoothed = pts.map((p, idx) => {
      if (idx === 0 || idx === pts.length - 1) return p;
      const prev = pts[idx - 1].velocity;
      const curr = p.velocity;
      const next = pts[idx + 1].velocity;
      const smoothVal = Math.round(0.25 * prev + 0.5 * curr + 0.25 * next);
      return { ...p, velocity: smoothVal };
    });

    updateConfig({ curvePoints: smoothed });
  };

  const handleResetPoints = () => {
    updateConfig({ curvePoints: [...selectedPreset.points] });
  };

  const handleAddPoint = () => {
    if (config.curvePoints.length >= 10) return;
    const sorted = [...config.curvePoints].sort((a, b) => a.hour - b.hour);
    // Find biggest gap
    let maxGap = 0;
    let gapIdx = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].hour - sorted[i].hour;
      if (gap > maxGap) {
        maxGap = gap;
        gapIdx = i;
      }
    }
    const newHour = Math.round((sorted[gapIdx].hour + sorted[gapIdx + 1].hour) / 2);
    const newVel = Math.round((sorted[gapIdx].velocity + sorted[gapIdx + 1].velocity) / 2);

    const updated = [...sorted, { hour: newHour, velocity: newVel }].sort((a, b) => a.hour - b.hour);
    updateConfig({ curvePoints: updated });
  };

  // SVG Mouse & Touch handlers for dragging points
  const handleMouseDown = (index: number) => {
    setDraggingIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingIndex === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const svgHeight = rect.height;
    const clampedY = Math.max(20, Math.min(220, (y / svgHeight) * 240));
    const velocity = Math.round(((220 - clampedY) / 200) * 100);

    const newPoints = [...config.curvePoints];
    newPoints[draggingIndex] = {
      ...newPoints[draggingIndex],
      velocity: Math.max(5, Math.min(100, velocity)),
    };

    updateConfig({ curvePoints: newPoints });
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  const handleTouchStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (draggingIndex === null || !svgRef.current || !e.touches[0]) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const y = touch.clientY - rect.top;

    const svgHeight = rect.height;
    const clampedY = Math.max(20, Math.min(220, (y / svgHeight) * 240));
    const velocity = Math.round(((220 - clampedY) / 200) * 100);

    const newPoints = [...config.curvePoints];
    newPoints[draggingIndex] = {
      ...newPoints[draggingIndex],
      velocity: Math.max(5, Math.min(100, velocity)),
    };

    updateConfig({ curvePoints: newPoints });
  };

  const handleTouchEnd = () => {
    setDraggingIndex(null);
  };

  useEffect(() => {
    const handleGlobalEnd = () => setDraggingIndex(null);
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, []);

  // Compute SVG Path
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 20;

  const pointsSorted = [...config.curvePoints].sort((a, b) => a.hour - b.hour);

  const getSvgX = (h: number) => paddingX + (h / 24) * (width - 2 * paddingX);
  const getSvgY = (v: number) => height - paddingY - (v / 100) * (height - 2 * paddingY);

  // Generate cubic bezier path through points
  let pathD = '';
  if (pointsSorted.length > 0) {
    pathD = `M ${getSvgX(pointsSorted[0].hour)} ${getSvgY(pointsSorted[0].velocity)}`;
    for (let i = 0; i < pointsSorted.length - 1; i++) {
      const p1 = pointsSorted[i];
      const p2 = pointsSorted[i + 1];
      const x1 = getSvgX(p1.hour);
      const y1 = getSvgY(p1.velocity);
      const x2 = getSvgX(p2.hour);
      const y2 = getSvgY(p2.velocity);

      const cx1 = x1 + (x2 - x1) / 2;
      const cy1 = y1;
      const cx2 = x1 + (x2 - x1) / 2;
      const cy2 = y2;

      pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
    }
  }

  const fillD = pathD
    ? `${pathD} L ${getSvgX(pointsSorted[pointsSorted.length - 1].hour)} ${height - paddingY} L ${getSvgX(
        pointsSorted[0].hour
      )} ${height - paddingY} Z`
    : '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Step 03
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Audience Behavior & Spline Pacing
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Audience Activity & Algorithmic Curve Pacing
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrate timezone peaks, nocturnal sleep dips, and interactive velocity curves.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200 font-mono">
            Peak Velocity: <strong className="text-indigo-600">{peakVelocity} views/chunk</strong>
          </span>
          <span className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
            Region: {selectedRegion.badge}
          </span>
        </div>
      </div>

      {/* Circadian Regional Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-800 uppercase tracking-wider">
            Circadian Audience & Regional Presets
          </label>
          <span className="text-slate-500 font-medium">
            Calibrates prime viewing hours, algorithm preference & nocturnal dips
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {REGIONS.map((reg) => {
            const isSelected = config.region === reg.id;
            return (
              <div
                key={reg.id}
                onClick={() => updateConfig({ region: reg.id })}
                className={`p-3 rounded-xl border-2 cursor-pointer transition text-left relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{reg.name}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      reg.badge.includes('RECOMMENDED') ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {reg.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{reg.subtext}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] space-y-1 text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">Peak: {reg.peakHours}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Moon className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate">Sleep: {reg.sleepHours}</span>
                  </div>
                  <div className="text-[9px] text-indigo-600 font-medium truncate pt-0.5">
                    {reg.algorithmNote}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Growth Velocity Profiles (Presets) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Growth Strategy Presets (5 Signature Modes)</span>
          </label>
          <span className="text-slate-500 font-medium">Gentle seed at Hour 0 prevents cold burst flags</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {GROWTH_PRESETS.slice(0, 5).map((preset) => {
            const isSelected = config.growthPreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{preset.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        preset.badge.includes('RECOMMENDED')
                          ? 'bg-indigo-100 text-indigo-700'
                          : preset.riskLevel === 'VERY LOW' || preset.riskLevel === 'ULTRA-LOW'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] space-y-1 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Algorithm:</span>
                    <span className="font-semibold text-slate-800">{preset.algorithmPreference}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery:</span>
                    <span className="font-mono text-slate-700">{preset.deliveryRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Risk Level:</span>
                    <span className={`font-bold ${
                      preset.riskLevel === 'VERY LOW' || preset.riskLevel === 'ULTRA-LOW'
                        ? 'text-emerald-600'
                        : preset.riskLevel === 'LOW'
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    }`}>
                      {preset.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Velocity Jitter:</span>
                    <span className="font-mono text-slate-700">{preset.velocityJitter}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 pt-1 italic truncate">
                    Use Case: {preset.useCase}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cold-Start Seed Defense & Parent Panel Compliance Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 flex items-start space-x-3 text-xs text-emerald-950">
        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-emerald-900">
              Cold-Start Seed Defense & Parent SMM Panel Compliance:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              0% Burst Flags
            </span>
          </div>
          <p className="mt-1 text-emerald-800 leading-relaxed text-[11px]">
            Algorithms scan video performance hourly. Starting cold with high volume triggers instantaneous velocity filters. Every preset enforces a <strong>Gentle Seed Phase at Hour 0</strong> and guarantees sub-orders satisfy <strong>JAP Parent Panel minimums (min 100 views & min 5 likes)</strong>.
          </p>
        </div>
      </div>

      {/* Automated Delivery Schedule & Dispatch Intervals */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <label className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Automated Schedule & Auto-Dispatch Interval</span>
            </label>
            <p className="text-[11px] text-slate-500">
              PulseFlow will start sending views, likes (via JAP #1778) and engagements automatically as per this schedule.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 self-start sm:self-auto">
            ⚡ 24/7 Autonomous Dispatch Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => updateConfig({ autoDispatchInterval: 'rapid_30s' })}
            className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between ${
              config.autoDispatchInterval === 'rapid_30s' || !config.autoDispatchInterval
                ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-2 ring-amber-200/50'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900 flex items-center space-x-1">
                  <span>⚡ Rapid 30s</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Auto-sends batch every <strong>30 seconds</strong>. Perfect for live demonstrations & fast delivery.
              </p>
            </div>
            <span className="text-[9px] font-mono text-amber-700 font-bold mt-2 pt-1 border-t border-amber-200/60">
              ~{Math.round(allocations.length * 0.5)} mins total delivery
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateConfig({ autoDispatchInterval: 'turbo_1m' })}
            className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between ${
              config.autoDispatchInterval === 'turbo_1m'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-200/50'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900 flex items-center space-x-1">
                  <span>🚀 Turbo 1m</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800">
                  FAST DRIP
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Auto-sends batch every <strong>60 seconds</strong>. Smooth accelerated organic pacing.
              </p>
            </div>
            <span className="text-[9px] font-mono text-indigo-700 font-bold mt-2 pt-1 border-t border-indigo-200/60">
              ~{allocations.length} mins total delivery
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateConfig({ autoDispatchInterval: 'turbo_2m' })}
            className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between ${
              config.autoDispatchInterval === 'turbo_2m'
                ? 'border-violet-600 bg-violet-50/50 shadow-xs ring-2 ring-violet-200/50'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900 flex items-center space-x-1">
                  <span>⏱️ Steady 2m</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-violet-100 text-violet-800">
                  BALANCED
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Auto-sends batch every <strong>2 minutes</strong>. High safety with natural interval jitter.
              </p>
            </div>
            <span className="text-[9px] font-mono text-violet-700 font-bold mt-2 pt-1 border-t border-violet-200/60">
              ~{allocations.length * 2} mins total delivery
            </span>
          </button>

          <button
            type="button"
            onClick={() => updateConfig({ autoDispatchInterval: 'hourly' })}
            className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between ${
              config.autoDispatchInterval === 'hourly'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-200/50'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900 flex items-center space-x-1">
                  <span>🕒 Hourly</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  CIRCADIAN
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Auto-sends batch every <strong>1 hour</strong>. Full 24-hour diurnal delivery cycle.
              </p>
            </div>
            <span className="text-[9px] font-mono text-emerald-700 font-bold mt-2 pt-1 border-t border-emerald-200/60">
              24 Hours standard window
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Pacing Curve Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Interactive Pacing Curve Canvas
            </h3>
            <p className="text-[11px] text-slate-500">
              Drag handles to adjust hourly velocity distribution
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAutoSmooth}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Auto-Smooth</span>
            </button>

            <button
              onClick={handleAddPoint}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <span>+ Add Point</span>
            </button>

            <button
              onClick={handleResetPoints}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Cold-Start Warning if Hour 0 is high */}
        {isColdStartWarning && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Cold-Start Warning:</strong> Hour 0 velocity is high ({hour0}v). Keep Hour 0 velocity ≤ 150v to prevent detection filters on initial video launch.
            </span>
          </div>
        )}

        {/* SVG Drawing Canvas */}
        <div className="relative bg-slate-50/70 rounded-xl border border-slate-200/80 overflow-hidden select-none">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-56 cursor-crosshair touch-none select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" />

            {/* Sleep window indicator bands */}
            {selectedRegion.sleepHourIndices.map((sh) => {
              const rx = getSvgX(sh);
              const rw = (width - 2 * paddingX) / 24;
              return (
                <rect
                  key={sh}
                  x={rx}
                  y={paddingY}
                  width={rw}
                  height={height - 2 * paddingY}
                  fill="#818cf8"
                  fillOpacity="0.07"
                />
              );
            })}

            {/* Area Fill */}
            {fillD && <path d={fillD} fill="url(#curveGradient)" />}

            {/* Spline Path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Control Point Handles */}
            {pointsSorted.map((p, idx) => {
              const cx = getSvgX(p.hour);
              const cy = getSvgY(p.velocity);
              const isSeed = p.hour === 0;

              return (
                <g key={idx} className="group cursor-grab active:cursor-grabbing">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSeed ? 7 : 6}
                    fill={isSeed ? '#10b981' : '#ffffff'}
                    stroke={isSeed ? '#059669' : '#6366f1'}
                    strokeWidth={isSeed ? '3' : '2.5'}
                    onMouseDown={() => handleMouseDown(idx)}
                    onTouchStart={() => handleTouchStart(idx)}
                    className="hover:scale-125 transition-transform"
                  />
                  {/* Coordinate Label */}
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-slate-700 pointer-events-none"
                  >
                    {isSeed ? `Seed: ${hour0} v/h` : `${Math.round(p.velocity * 3.5)} v/h`}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            <text x={getSvgX(0)} y={height - 5} textAnchor="start" className="text-[10px] font-mono fill-slate-400">
              0h (Seed)
            </text>
            <text x={getSvgX(12)} y={height - 5} textAnchor="middle" className="text-[10px] font-mono fill-slate-400">
              12h
            </text>
            <text x={getSvgX(24)} y={height - 5} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
              24h
            </text>
          </svg>

          {/* Canvas Legend */}
          <div className="flex flex-wrap items-center justify-between p-2.5 bg-white border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-700">Hour 0 Seed</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="font-semibold text-slate-700">Velocity Curve</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-200"></span>
                <span className="font-semibold text-slate-700">Sleep Dip Window</span>
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              Min Constraint: ≥100 views & ≥5 likes per chunk
            </div>
          </div>
        </div>
      </div>

      {/* Multi-View Organic Projection Selector */}
      <div className="flex items-center justify-between p-1 bg-slate-100 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setPreviewTab('simulator')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              previewTab === 'simulator'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Live Organic Growth Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('perType')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              previewTab === 'perType'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Per-Type Phased Organic Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewTab('chunks')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              previewTab === 'chunks'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
            <span>Granular Hourly Chunk Inspector</span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {previewTab === 'simulator' && (
        <LiveOrganicGrowthPreview config={config} allocations={allocations} interactive={true} />
      )}

      {previewTab === 'perType' && (
        <PerTypeOrganicDeliveryPreview config={config} allocations={allocations} />
      )}

      {previewTab === 'chunks' && (
        /* Live Delivery Projection & Chunk Inspector */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Step 03
                </span>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Live Delivery Projection & Chunk Inspector
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Per-hour chunk allocation breakdown with synchronized engagement ratios, Hour 0 seed tag, and nocturnal dip awareness.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'hourly' ? 'daily' : 'hourly')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{viewMode === 'hourly' ? 'Hourly View' : 'Daily View'}</span>
              </button>

              <button
                onClick={() => setSyncLayers(!syncLayers)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                  syncLayers
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Engagement Layer Sync</span>
              </button>
            </div>
          </div>

        {/* 6 Projection Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Delivery
            </span>
            <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
              {config.baseViews.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">Base views target</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Peak Velocity
            </span>
            <span className="text-base font-extrabold text-indigo-600 font-mono mt-0.5 block">
              {peakVelocity} views
            </span>
            <span className="text-[10px] text-slate-500">Highest single chunk</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Estimated Peak Time
            </span>
            <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
              Hour {peakHour}
            </span>
            <span className="text-[10px] text-slate-500">Algorithmic momentum</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Circadian Mode
            </span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
              {selectedRegion.badge}
            </span>
            <span className="text-[10px] text-slate-500">Nocturnal dip active</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Pacing Windows
            </span>
            <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
              {allocations.length} Chunks
            </span>
            <span className="text-[10px] text-slate-500">Staggered sub-batches</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Status
            </span>
            <span className="text-base font-extrabold text-emerald-600 mt-0.5 block flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimal Pattern</span>
            </span>
            <span className="text-[10px] text-slate-500">Zero velocity anomaly</span>
          </div>
        </div>

        {/* Stacked Bar Graph */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              Hourly Chunk Delivery Distribution ·{' '}
              <span className="font-normal text-slate-400">Click any bar to inspect forensic payload</span>
            </span>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span>
                <span>Views</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span>
                <span>Likes</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500"></span>
                <span>Comments</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>
                <span>Shares</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-violet-400"></span>
                <span>Saves</span>
              </span>
              <span className="flex items-center space-x-1">
                <Moon className="w-3 h-3 text-slate-400" />
                <span>Sleep Dip</span>
              </span>
            </div>
          </div>

          {/* Bars */}
          <div className="h-48 flex items-end gap-1.5 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 overflow-x-auto">
            {allocations.map((chunk) => {
              const maxV = peakVelocity || 1;
              const barHeightPercent = Math.max(15, (chunk.views / maxV) * 95);
              const isSelected = selectedBarChunk?.chunkIndex === chunk.chunkIndex;

              return (
                <div
                  key={chunk.chunkIndex}
                  onClick={() => setSelectedBarChunk(chunk)}
                  className={`flex-1 min-w-[28px] h-full flex flex-col justify-end items-center cursor-pointer group transition-all ${
                    isSelected ? 'scale-105' : 'hover:opacity-90'
                  }`}
                >
                  {/* Top icons / badges */}
                  <div className="mb-1 flex flex-col items-center">
                    {chunk.isSeed && (
                      <span className="text-[9px] font-extrabold text-emerald-600 flex items-center">
                        🌱 Seed
                      </span>
                    )}
                    {chunk.isSleepDip && !chunk.isSeed && (
                      <Moon className="w-2.5 h-2.5 text-slate-400" />
                    )}
                  </div>

                  {/* The bar */}
                  <div
                    style={{ height: `${barHeightPercent}%` }}
                    className={`w-full rounded-t-md transition-all flex flex-col justify-end overflow-hidden ${
                      chunk.isSleepDip
                        ? 'bg-slate-300'
                        : isSelected
                        ? 'bg-indigo-700 ring-2 ring-indigo-400'
                        : 'bg-indigo-600'
                    }`}
                  >
                    {syncLayers && chunk.likes > 0 && (
                      <div
                        style={{ height: `${Math.min(30, (chunk.likes / chunk.views) * 100 * 3)}%` }}
                        className="w-full bg-rose-500"
                        title={`${chunk.likes} Likes`}
                      />
                    )}
                  </div>

                  {/* Hour label */}
                  <span className="text-[9px] font-mono text-slate-400 mt-1">
                    H{chunk.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Chunk Payload Inspector (When a bar is clicked) */}
        {selectedBarChunk && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-indigo-400">
                  Chunk #{selectedBarChunk.chunkIndex + 1} ({selectedBarChunk.timeLabel})
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] bg-indigo-900 text-indigo-200">
                  {selectedBarChunk.safetyTag}
                </span>
                {selectedBarChunk.isSeed && (
                  <span className="px-2 py-0.2 rounded text-[10px] bg-emerald-900 text-emerald-200">
                    🌱 Hour 0 Cold-Start Seed
                  </span>
                )}
                {selectedBarChunk.isSleepDip && (
                  <span className="px-2 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                    🌙 Sleep Window Active
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px]">
                Payload: {selectedBarChunk.views} Views | {selectedBarChunk.likes} Likes ({selectedBarChunk.likeType === 'micro' ? 'Micro 5-9' : selectedBarChunk.likeType === 'macro' ? 'Macro 10+' : 'None'}) | {selectedBarChunk.comments} Comments | {selectedBarChunk.shares} Shares | {selectedBarChunk.saves} Saves
              </p>
              <p className="text-slate-500 text-[10px]">
                Parent Sub-order ID: {selectedBarChunk.parentSubOrderViewsId} · Behavior: {selectedBarChunk.humanBehaviorNote}
              </p>
            </div>

            <button
              onClick={() => setSelectedBarChunk(null)}
              className="text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded text-xs shrink-0"
            >
              Close Inspector
            </button>
          </div>
        )}
      </div>
      )}

      {/* Navigation Footer */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto min-h-[48px] flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          <span>Jitter & Risk Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
