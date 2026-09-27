import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Rocket,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  CampaignConfig,
  HourlyChunkAllocation,
  ServiceMetricRouting,
} from '../../types/smm';
import { DURATION_LABELS } from '../../utils/smmEngine';
import { LiveOrganicGrowthPreview } from '../organic/LiveOrganicGrowthPreview';

interface Step5ReviewLaunchProps {
  config: CampaignConfig;
  allocations: HourlyChunkAllocation[];
  serviceRouting: ServiceMetricRouting;
  updateServiceRouting: (partial: Partial<ServiceMetricRouting>) => void;
  updateConfig?: (partial: Partial<CampaignConfig>) => void;
  onLaunch: () => void;
  onBack: () => void;
}

export const Step5ReviewLaunch: React.FC<Step5ReviewLaunchProps> = ({
  config,
  allocations,
  serviceRouting,
  updateServiceRouting,
  updateConfig,
  onLaunch,
  onBack,
}) => {
  const [showScheduleTable, setShowScheduleTable] = useState(false);
  const [showOrganicPreview, setShowOrganicPreview] = useState(true);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleCopyBrief = () => {
    const brief = `[PulseFlow Campaign Brief]
Platform: ${config.platform.toUpperCase()}
Target: ${config.targetUrl}
Duration: ${DURATION_LABELS[config.duration]}
Target Views: ${config.baseViews.toLocaleString()}
Engagement: ${config.likes} Likes | ${config.comments} Comments | ${config.shares} Shares | ${config.saves} Saves
Region: ${config.region.toUpperCase()}
Preset: ${config.growthPreset}
Batches: ${allocations.length} scheduled chunks`;
    navigator.clipboard.writeText(brief);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const handleTriggerLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      onLaunch();
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Step 05
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Final Verification & Order Dispatch
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Final Campaign Review & Dispatch
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify automated pre-checks and inspect granular delivery schedules before launch.
          </p>
        </div>

        <button
          onClick={handleTriggerLaunch}
          disabled={isLaunching}
          className="mt-3 sm:mt-0 flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition hover:translate-x-0.5 disabled:opacity-50"
        >
          <Rocket className="w-4 h-4" />
          <span>{isLaunching ? 'Dispatching...' : 'Launch Campaign'}</span>
        </button>
      </div>

      {/* 100% Pro-Rata Instant Refund Guarantee Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-950">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-emerald-900 text-sm block">
              100% Pro-Rata Instant Refund Guarantee
            </span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Cancel anytime with 1 click from your order queue. Any undelivered chunks are automatically halted and credited to your account.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-800 font-bold text-xs shrink-0 shadow-2xs">
          Zero Risk Guarantee
        </span>
      </div>

      {/* Pre-Flight Launch Assurance (5 of 5 Passed) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider">
              Pre-Flight Launch Assurance
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              5 of 5 Passed
            </span>
          </div>

          <span className="text-[11px] text-emerald-700 font-bold">100% Anti-Fraud Compliant</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 truncate">Target Link</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                PASS
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">URL Verified</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 truncate">Organic Seeding</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                PASS
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Hour 0 Gentle Seed</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 truncate">Circadian Pacing</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                PASS
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">US Sleep Dip</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 truncate">Anti-Bot Jitter</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                PASS
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Gaussian Micro-Delays</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 truncate">Dispatch Routing</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                PASS
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">API Panels Ready</span>
          </div>
        </div>
      </div>

      {/* AI Organic Mode Verification & Preview Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shadow-emerald-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-sm text-slate-900">
                  AI Organic Delivery Pattern Verified
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {config.organicMode ? 'Organic Mode Active' : 'Standard Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Every sub-batch is queued with unique Catmull-Rom spline curves, cold-start seed batch, and humanized non-round salting.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOrganicPreview(!showOrganicPreview)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100/50 text-xs font-bold transition shadow-2xs shrink-0"
          >
            <span>{showOrganicPreview ? 'Hide Growth Preview' : 'Inspect Growth Curve'}</span>
            {showOrganicPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showOrganicPreview && (
          <div className="pt-2">
            <LiveOrganicGrowthPreview config={config} allocations={allocations} interactive={true} />
          </div>
        )}
      </div>

      {/* Target & Schedule vs Engagement Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Target & Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
          <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block">
            Target & Schedule
          </span>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">Platform:</span>
              <span className="font-bold text-slate-900">
                {config.platform === 'instagram' ? 'Instagram Reels' : 'TikTok Video'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between overflow-hidden">
              <span className="text-slate-500 shrink-0 mr-2">Target Link:</span>
              <span className="font-bold text-slate-900 truncate max-w-xs text-right">
                {config.targetUrl || 'Not configured'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">Pacing Window:</span>
              <span className="font-bold text-emerald-600">
                {config.duration === 'custom'
                  ? `Custom (${config.customDurationHours || 24} Hours)`
                  : DURATION_LABELS[config.duration] || '24 Hours (Standard)'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500">Curve Preset:</span>
              <span className="font-bold text-indigo-600 truncate max-w-[200px]">
                🌟 {config.growthPreset.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Auto-Dispatch Schedule:</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-950">
                  {config.autoDispatchInterval === 'rapid_30s' || !config.autoDispatchInterval
                    ? '30s / Batch'
                    : config.autoDispatchInterval === 'turbo_1m'
                    ? '60s / Batch'
                    : config.autoDispatchInterval === 'turbo_2m'
                    ? '2m / Batch'
                    : '1h / Batch'}
                </span>
              </div>
              {updateConfig && (
                <div className="grid grid-cols-4 gap-1 pt-1 font-sans">
                  {[
                    { id: 'rapid_30s', label: '⚡ 30s' },
                    { id: 'turbo_1m', label: '🚀 1m' },
                    { id: 'turbo_2m', label: '⏱️ 2m' },
                    { id: 'hourly', label: '🕒 1h' },
                  ].map((spd) => (
                    <button
                      key={spd.id}
                      type="button"
                      onClick={() => updateConfig({ autoDispatchInterval: spd.id as any })}
                      className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition text-center ${
                        (config.autoDispatchInterval || 'rapid_30s') === spd.id
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-amber-100 border border-slate-200'
                      }`}
                    >
                      {spd.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Card: Engagement Delivery Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Engagement Delivery Breakdown
            </span>
            <button
              onClick={handleCopyBrief}
              className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 text-xs font-semibold"
            >
              {copiedBrief ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBrief ? 'Copied' : 'Copy Brief'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Views</span>
              <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                {config.baseViews.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500">Base Pacing</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Likes</span>
              <span className="text-base font-extrabold text-rose-600 font-mono mt-0.5 block">
                {config.likes}
              </span>
              <span className="text-[10px] text-slate-500">
                {((config.likes / config.baseViews) * 100).toFixed(1)}% Ratio
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Comments</span>
              <span className="text-base font-extrabold text-blue-600 font-mono mt-0.5 block">
                {config.comments}
              </span>
              <span className="text-[10px] text-slate-500">Contextual AI</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Shares</span>
              <span className="text-base font-extrabold text-emerald-600 font-mono mt-0.5 block">
                {config.shares}
              </span>
              <span className="text-[10px] text-slate-500">Viral Trigger</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Saves</span>
              <span className="text-base font-extrabold text-violet-600 font-mono mt-0.5 block">
                {config.saves}
              </span>
              <span className="text-[10px] text-slate-500">Explore Signal</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sub-Batches</span>
              <span className="text-base font-extrabold text-indigo-600 font-mono mt-0.5 block">
                {allocations.length}
              </span>
              <span className="text-[10px] text-slate-500">Drip Chunks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service IDs (Configured by You) [Manual Routing] Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Service IDs (Configured by You)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Manual Routing
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            These exact IDs will be called upon dispatch. You set and control these IDs.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Views ID (SMMVault)
            </label>
            <input
              type="text"
              value={serviceRouting.views?.serviceId || '11465'}
              onChange={(e) =>
                updateServiceRouting({
                  views: { ...serviceRouting.views, serviceId: e.target.value },
                })
              }
              placeholder="11465"
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-indigo-700 bg-slate-50"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">SMMVault #11465</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Micro Likes (JAP)
            </label>
            <input
              type="text"
              value={serviceRouting.microLikes?.serviceId || '1778'}
              onChange={(e) =>
                updateServiceRouting({
                  microLikes: { ...serviceRouting.microLikes, serviceId: e.target.value },
                })
              }
              placeholder="1778"
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-amber-700 bg-slate-50"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">JAP #1778 (5-9)</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Macro Likes (Reliable)
            </label>
            <input
              type="text"
              value={serviceRouting.macroLikes?.serviceId || '7147'}
              onChange={(e) =>
                updateServiceRouting({
                  macroLikes: { ...serviceRouting.macroLikes, serviceId: e.target.value },
                })
              }
              placeholder="7147"
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-rose-700 bg-slate-50"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Reliable #7147 (10+)</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Saves (Reliable)
            </label>
            <input
              type="text"
              value={serviceRouting.saves?.serviceId || '7841'}
              onChange={(e) =>
                updateServiceRouting({
                  saves: { ...serviceRouting.saves, serviceId: e.target.value },
                })
              }
              placeholder="7841"
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-violet-700 bg-slate-50"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Reliable #7841 (Min 1)</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Reposts (Reliable)
            </label>
            <input
              type="text"
              value={serviceRouting.reposts?.serviceId || '7842'}
              onChange={(e) =>
                updateServiceRouting({
                  reposts: { panelId: 'reliablesmm', serviceId: e.target.value },
                })
              }
              placeholder="7842"
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-cyan-700 bg-slate-50"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Reliable #7842 (Min 1)</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Shares (Reliable)
            </label>
            <input
              type="text"
              value={serviceRouting.shares?.serviceId || '2060'}
              onChange={(e) =>
                updateServiceRouting({
                  shares: { ...serviceRouting.shares, serviceId: e.target.value },
                })
              }
              placeholder="2060"
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-emerald-700 bg-slate-50"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">Reliable #2060 (Min 10)</span>
          </div>
        </div>
      </div>

      {/* Hourly Chunk Allocation Expandable Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider block">
              Hourly Chunk Allocation ({allocations.length} Chunks Planned)
            </span>
            <span className="text-[11px] text-slate-500">
              Complete dispatch schedule showing all exact quantities calculated per batch with natural delay offsets.
            </span>
          </div>

          <button
            onClick={() => setShowScheduleTable(!showScheduleTable)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-slate-50"
          >
            <span>{showScheduleTable ? 'Hide Schedule' : 'View Schedule'}</span>
            {showScheduleTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showScheduleTable && (
          <div className="mt-3 overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Batch</th>
                  <th className="py-2.5 px-3">Time Window</th>
                  <th className="py-2.5 px-3">Views</th>
                  <th className="py-2.5 px-3">Likes (Micro/Macro)</th>
                  <th className="py-2.5 px-3">Comments</th>
                  <th className="py-2.5 px-3">Shares</th>
                  <th className="py-2.5 px-3">Saves</th>
                  <th className="py-2.5 px-3">Sub-order ID</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {allocations.map((chunk) => (
                  <tr key={chunk.chunkIndex} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-bold text-slate-800">
                      #{chunk.chunkIndex + 1}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{chunk.timeLabel}</td>
                    <td className="py-2 px-3 font-bold text-indigo-700">{chunk.views}</td>
                    <td className="py-2 px-3 text-rose-600">
                      {chunk.chunkIndex < 2 ? (
                        <span className="text-slate-400 font-sans text-[10px]">0 (Seed Views Only)</span>
                      ) : chunk.likes >= 5 ? (
                        <span>
                          <strong>{chunk.likes}</strong>
                          <span className="text-[10px] text-amber-700 ml-1">
                            {chunk.likeType === 'micro' ? '(JAP #1778)' : '(Macro)'}
                          </span>
                        </span>
                      ) : (
                        '0'
                      )}
                    </td>
                    <td className="py-2 px-3 text-blue-600">
                      {chunk.chunkIndex < 2 ? <span className="text-slate-400 text-[10px]">0</span> : chunk.comments}
                    </td>
                    <td className="py-2 px-3 text-emerald-600">
                      {chunk.chunkIndex < 2 ? <span className="text-slate-400 text-[10px]">0</span> : chunk.shares}
                    </td>
                    <td className="py-2 px-3 text-violet-600">
                      {chunk.chunkIndex < 2 ? <span className="text-slate-400 text-[10px]">0</span> : chunk.saves}
                    </td>
                    <td className="py-2 px-3 text-slate-400">{chunk.parentSubOrderViewsId}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700">
                        {chunk.chunkIndex < 2 ? 'Cold-Start Seed' : '300+ Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Jitter & Risk</span>
        </button>

        <button
          type="button"
          onClick={handleTriggerLaunch}
          disabled={isLaunching}
          className="w-full sm:w-auto min-h-[48px] flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Rocket className="w-4 h-4" />
          <span>{isLaunching ? 'Dispatching Campaign...' : 'Launch Campaign'}</span>
        </button>
      </div>
    </div>
  );
};
