import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Moon,
  Sun,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  BarChart2,
  Sliders,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
} from 'lucide-react';
import { CampaignConfig, HourlyChunkAllocation } from '../../types/smm';
import { REGIONS } from '../../utils/smmEngine';

interface LiveOrganicGrowthPreviewProps {
  config: CampaignConfig;
  allocations: HourlyChunkAllocation[];
  interactive?: boolean;
}

export const LiveOrganicGrowthPreview: React.FC<LiveOrganicGrowthPreviewProps> = ({
  config,
  allocations,
  interactive = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulatedHour, setSimulatedHour] = useState<number>(allocations.length);
  const [chartMode, setChartMode] = useState<'cumulative' | 'velocity'>('cumulative');

  const selectedRegion = REGIONS.find((r) => r.id === config.region) || REGIONS[0];

  // Dynamic calculations based on simulated hour
  const activeAllocations = useMemo(() => {
    return allocations.slice(0, simulatedHour);
  }, [allocations, simulatedHour]);

  const currentViewsDispatched = useMemo(() => {
    return activeAllocations.reduce((sum, c) => sum + c.views, 0);
  }, [activeAllocations]);

  const currentLikesDispatched = useMemo(() => {
    return activeAllocations.reduce((sum, c) => sum + c.likes, 0);
  }, [activeAllocations]);

  const currentCommentsDispatched = useMemo(() => {
    return activeAllocations.reduce((sum, c) => sum + c.comments, 0);
  }, [activeAllocations]);

  const currentSharesDispatched = useMemo(() => {
    return activeAllocations.reduce((sum, c) => sum + c.shares, 0);
  }, [activeAllocations]);

  const currentSavesDispatched = useMemo(() => {
    return activeAllocations.reduce((sum, c) => sum + c.saves, 0);
  }, [activeAllocations]);

  const peakVelocity = useMemo(() => {
    return allocations.reduce((max, c) => Math.max(max, c.views), 0);
  }, [allocations]);

  // Simulation playback loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setSimulatedHour((prev) => {
          if (prev >= allocations.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(timer);
  }, [isPlaying, allocations.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setSimulatedHour(1);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setSimulatedHour(allocations.length);
  };

  // Generate SVG Points for Cumulative or Velocity line
  const width = 800;
  const height = 220;
  const paddingX = 40;
  const paddingY = 25;

  const totalTargetViews = Math.max(1, config.baseViews);

  let cumulativePoints: { x: number; y: number; hour: number; cumViews: number; chunkViews: number }[] = [];
  let cum = 0;

  allocations.forEach((chunk, i) => {
    cum += chunk.views;
    const progressX = paddingX + (i / Math.max(1, allocations.length - 1)) * (width - 2 * paddingX);
    const progressY =
      chartMode === 'cumulative'
        ? height - paddingY - (cum / totalTargetViews) * (height - 2 * paddingY)
        : height - paddingY - (chunk.views / (peakVelocity * 1.15 || 1)) * (height - 2 * paddingY);

    cumulativePoints.push({
      x: progressX,
      y: Math.max(paddingY, Math.min(height - paddingY, progressY)),
      hour: chunk.hour,
      cumViews: cum,
      chunkViews: chunk.views,
    });
  });

  const activePoints = cumulativePoints.slice(0, simulatedHour);

  let pathD = '';
  if (activePoints.length > 0) {
    pathD = `M ${activePoints[0].x} ${activePoints[0].y}`;
    for (let i = 0; i < activePoints.length - 1; i++) {
      const p1 = activePoints[i];
      const p2 = activePoints[i + 1];
      const cx = (p1.x + p2.x) / 2;
      pathD += ` C ${cx} ${p1.y}, ${cx} ${p2.y}, ${p2.x} ${p2.y}`;
    }
  }

  const fillD =
    pathD && activePoints.length > 0
      ? `${pathD} L ${activePoints[activePoints.length - 1].x} ${height - paddingY} L ${
          activePoints[0].x
        } ${height - paddingY} Z`
      : '';

  const progressPercent = Math.min(100, Math.round((currentViewsDispatched / totalTargetViews) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Live Organic Growth Preview & Velocity Simulator
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Unique Curve Guarantee
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Simulate how Instagram / TikTok algorithms observe the non-linear growth trajectory in real time.
          </p>
        </div>

        {/* View toggles & Playback controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setChartMode('cumulative')}
              className={`px-3 py-1 rounded-lg transition ${
                chartMode === 'cumulative'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative Flow
            </button>
            <button
              onClick={() => setChartMode('velocity')}
              className={`px-3 py-1 rounded-lg transition ${
                chartMode === 'velocity'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hourly Velocity
            </button>
          </div>

          {interactive && (
            <div className="flex items-center space-x-1 pl-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center space-x-1 ${
                  isPlaying
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
                }`}
                title={isPlaying ? 'Pause Simulation' : 'Play Live Simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                title="Reset to Hour 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Simulated Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
          <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 uppercase">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>Dispatched Views</span>
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="text-lg font-extrabold text-indigo-900 font-mono mt-0.5">
            {currentViewsDispatched.toLocaleString()}
          </div>
          <div className="text-[10px] text-indigo-600/80">Target: {config.baseViews.toLocaleString()}</div>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
          <div className="flex items-center justify-between text-[10px] font-bold text-rose-700 uppercase">
            <span className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>Likes Active</span>
            </span>
            <span>{((currentLikesDispatched / Math.max(1, config.likes)) * 100).toFixed(0)}%</span>
          </div>
          <div className="text-lg font-extrabold text-rose-900 font-mono mt-0.5">
            {currentLikesDispatched.toLocaleString()}
          </div>
          <div className="text-[10px] text-rose-600/80">Target: {config.likes.toLocaleString()}</div>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
          <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 uppercase">
            <span className="flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>Comments</span>
            </span>
            <span>{((currentCommentsDispatched / Math.max(1, config.comments)) * 100).toFixed(0)}%</span>
          </div>
          <div className="text-lg font-extrabold text-blue-900 font-mono mt-0.5">
            {currentCommentsDispatched.toLocaleString()}
          </div>
          <div className="text-[10px] text-blue-600/80">Target: {config.comments.toLocaleString()}</div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 uppercase">
            <span className="flex items-center space-x-1">
              <Share2 className="w-3 h-3" />
              <span>Shares / Reposts</span>
            </span>
            <span>{((currentSharesDispatched / Math.max(1, config.shares)) * 100).toFixed(0)}%</span>
          </div>
          <div className="text-lg font-extrabold text-emerald-900 font-mono mt-0.5">
            {currentSharesDispatched.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600/80">Target: {config.shares.toLocaleString()}</div>
        </div>

        <div className="p-3 rounded-xl bg-violet-50/60 border border-violet-100 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-violet-700 uppercase">
            <span className="flex items-center space-x-1">
              <Bookmark className="w-3 h-3" />
              <span>Saves (Bookmarks)</span>
            </span>
            <span>{((currentSavesDispatched / Math.max(1, config.saves)) * 100).toFixed(0)}%</span>
          </div>
          <div className="text-lg font-extrabold text-violet-900 font-mono mt-0.5">
            {currentSavesDispatched.toLocaleString()}
          </div>
          <div className="text-[10px] text-violet-600/80">Target: {config.saves.toLocaleString()}</div>
        </div>
      </div>

      {/* SVG Canvas Growth Graph */}
      <div className="relative rounded-2xl bg-slate-900 p-3 overflow-hidden border border-slate-800">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 relative z-10 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="organicGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#334155" strokeDasharray="3 3" opacity="0.6" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#334155" strokeDasharray="3 3" opacity="0.6" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#475569" strokeWidth="1.5" />

          {/* Planned background dashed line */}
          {cumulativePoints.length > 1 && (
            <path
              d={`M ${cumulativePoints[0].x} ${cumulativePoints[0].y} ` +
                cumulativePoints
                  .slice(1)
                  .map((p, idx) => {
                    const prev = cumulativePoints[idx];
                    const cx = (prev.x + p.x) / 2;
                    return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
                  })
                  .join(' ')}
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.7"
            />
          )}

          {/* Filled Area under Curve */}
          {fillD && <path d={fillD} fill="url(#organicGradient)" />}

          {/* Active Dispatched Spline Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Individual Batch Nodes */}
          {activePoints.map((pt, idx) => {
            const chunk = allocations[idx];
            const isLatest = idx === activePoints.length - 1;
            const isSeed = chunk?.isSeed;
            const isSleep = chunk?.isSleepDip;

            return (
              <g key={idx}>
                {isLatest && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill="#10b981"
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isLatest ? 6 : 4}
                  fill={isSeed ? '#10b981' : isSleep ? '#94a3b8' : '#38bdf8'}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              </g>
            );
          })}

          {/* Current Progress Cursor Tag */}
          {activePoints.length > 0 && (
            <g transform={`translate(${activePoints[activePoints.length - 1].x}, ${Math.max(20, activePoints[activePoints.length - 1].y - 20)})`}>
              <rect
                x="-40"
                y="-14"
                width="80"
                height="18"
                rx="6"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="1"
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                fill="#38bdf8"
                className="text-[10px] font-mono font-bold"
              >
                H{allocations[simulatedHour - 1]?.hour || 0}: {currentViewsDispatched}
              </text>
            </g>
          )}

          {/* X Axis Labels */}
          <text x={paddingX} y={height - 8} fill="#94a3b8" className="text-[10px] font-mono">
            H0 (Seed)
          </text>
          <text x={width / 2} y={height - 8} textAnchor="middle" fill="#94a3b8" className="text-[10px] font-mono">
            Midway (Peak Window)
          </text>
          <text x={width - paddingX} y={height - 8} textAnchor="end" fill="#94a3b8" className="text-[10px] font-mono">
            Final Target
          </text>
        </svg>

        {/* Graph Bottom Legend & Progress Bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">Hour 0 Seed Batch</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              <span className="text-slate-300">Prime Surge</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Moon className="w-3 h-3 text-slate-400" />
              <span className="text-slate-300">Sleep Dip ({selectedRegion.badge})</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-mono text-emerald-400 font-bold">
              Simulation: Hour {simulatedHour}/{allocations.length}
            </span>
            {interactive && (
              <input
                type="range"
                min="1"
                max={allocations.length}
                value={simulatedHour}
                onChange={(e) => {
                  setIsPlaying(false);
                  setSimulatedHour(Number(e.target.value));
                }}
                className="w-28 accent-indigo-500 cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
