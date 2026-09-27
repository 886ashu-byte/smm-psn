import React, { useState } from 'react';
import {
  Layers,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Info,
} from 'lucide-react';
import { CampaignConfig, HourlyChunkAllocation } from '../../types/smm';
import { getPlatformBenchmarks } from '../../utils/smmEngine';

interface PerTypeOrganicDeliveryPreviewProps {
  config: CampaignConfig;
  allocations: HourlyChunkAllocation[];
}

export type SelectedMetricType = 'all' | 'views' | 'likes' | 'comments' | 'shares' | 'saves' | 'reposts';

export const PerTypeOrganicDeliveryPreview: React.FC<PerTypeOrganicDeliveryPreviewProps> = ({
  config,
  allocations,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<SelectedMetricType>('all');

  const benchmarks = getPlatformBenchmarks(config.baseViews, config.platform, config.pageTier === 'bda' ? 'viral' : 'normal');

  const safeViews = Math.max(1, config.baseViews);
  const likesRatio = (config.likes / safeViews) * 100;
  const commentsRatio = (config.comments / safeViews) * 100;
  const sharesRatio = (config.shares / safeViews) * 100;
  const savesRatio = (config.saves / safeViews) * 100;

  // Max value for the currently selected metric for relative bar height
  const getMetricMax = () => {
    switch (selectedMetric) {
      case 'views':
        return allocations.reduce((max, c) => Math.max(max, c.views), 0) || 1;
      case 'likes':
        return allocations.reduce((max, c) => Math.max(max, c.likes), 0) || 1;
      case 'comments':
        return allocations.reduce((max, c) => Math.max(max, c.comments), 0) || 1;
      case 'shares':
        return allocations.reduce((max, c) => Math.max(max, c.shares), 0) || 1;
      case 'saves':
        return allocations.reduce((max, c) => Math.max(max, c.saves), 0) || 1;
      case 'reposts':
        return allocations.reduce((max, c) => Math.max(max, c.reposts || 0), 0) || 1;
      case 'all':
      default:
        return allocations.reduce((max, c) => Math.max(max, c.views), 0) || 1;
    }
  };

  const metricMax = getMetricMax();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Title & Metric Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-indigo-100 text-indigo-700">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Per-Type Organic Delivery Preview
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Multi-Signal Phased
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Inspect how Views, Likes, Comments, Shares, and Saves are phased across the timeline to simulate organic user engagement.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
          <button
            onClick={() => setSelectedMetric('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
              selectedMetric === 'all'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Combined</span>
          </button>
          <button
            onClick={() => setSelectedMetric('views')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
              selectedMetric === 'views'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Views</span>
          </button>
          <button
            onClick={() => setSelectedMetric('likes')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
              selectedMetric === 'likes'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3 h-3" />
            <span>Likes</span>
          </button>
          <button
            onClick={() => setSelectedMetric('comments')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
              selectedMetric === 'comments'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>Comments</span>
          </button>
          <button
            onClick={() => setSelectedMetric('shares')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
              selectedMetric === 'shares'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3 h-3" />
            <span>Shares</span>
          </button>
          <button
            onClick={() => setSelectedMetric('saves')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
              selectedMetric === 'saves'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>Saves</span>
          </button>
        </div>
      </div>

      {/* Engagement Sweet Spot Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Likes Ratio Card */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center space-x-1">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>Likes Ratio</span>
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                likesRatio >= 1.0 && likesRatio <= 2.5
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {likesRatio >= 1.0 && likesRatio <= 2.5 ? 'Golden' : 'Calibrated'}
            </span>
          </div>
          <div className="text-base font-extrabold text-slate-900 font-mono mt-1">
            {likesRatio.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-500">Benchmark: 1.0% – 2.0%</div>
        </div>

        {/* Comments Ratio Card */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center space-x-1">
              <MessageSquare className="w-3 h-3 text-blue-500" />
              <span>Comments Ratio</span>
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                commentsRatio >= 0.10 && commentsRatio <= 0.35
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {commentsRatio >= 0.10 && commentsRatio <= 0.35 ? 'Golden' : 'Calibrated'}
            </span>
          </div>
          <div className="text-base font-extrabold text-slate-900 font-mono mt-1">
            {commentsRatio.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-500">Benchmark: 0.10% – 0.20%</div>
        </div>

        {/* Shares Ratio Card */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center space-x-1">
              <Share2 className="w-3 h-3 text-emerald-500" />
              <span>Shares Ratio</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
              High Weight
            </span>
          </div>
          <div className="text-base font-extrabold text-slate-900 font-mono mt-1">
            {sharesRatio.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-500">Benchmark: ~0.80%</div>
        </div>

        {/* Saves Ratio Card */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center space-x-1">
              <Bookmark className="w-3 h-3 text-violet-500" />
              <span>Saves Ratio</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
              Retention
            </span>
          </div>
          <div className="text-base font-extrabold text-slate-900 font-mono mt-1">
            {savesRatio.toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-500">Benchmark: ~0.50%</div>
        </div>
      </div>

      {/* Bar Distribution Canvas for Selected Metric */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            {selectedMetric === 'all'
              ? 'Multi-Layer Stacked Distribution (Views + Engagement Layers)'
              : `${selectedMetric.toUpperCase()} Hourly Dispatch Distribution`}
          </span>

          <span className="font-mono text-[11px] text-slate-400">
            Total {selectedMetric === 'all' ? 'Volume' : selectedMetric}:{' '}
            <strong className="text-slate-900">
              {selectedMetric === 'views' || selectedMetric === 'all'
                ? config.baseViews.toLocaleString()
                : selectedMetric === 'likes'
                ? config.likes.toLocaleString()
                : selectedMetric === 'comments'
                ? config.comments.toLocaleString()
                : selectedMetric === 'shares'
                ? config.shares.toLocaleString()
                : config.saves.toLocaleString()}
            </strong>
          </span>
        </div>

        <div className="h-44 flex items-end gap-1.5 p-3 bg-slate-900 rounded-xl overflow-x-auto border border-slate-800">
          {allocations.map((chunk, idx) => {
            let primaryValue = chunk.views;
            let barColor = 'bg-indigo-500';

            if (selectedMetric === 'views') {
              primaryValue = chunk.views;
              barColor = 'bg-indigo-500';
            } else if (selectedMetric === 'likes') {
              primaryValue = chunk.likes;
              barColor = 'bg-rose-500';
            } else if (selectedMetric === 'comments') {
              primaryValue = chunk.comments;
              barColor = 'bg-blue-500';
            } else if (selectedMetric === 'shares') {
              primaryValue = chunk.shares;
              barColor = 'bg-emerald-500';
            } else if (selectedMetric === 'saves') {
              primaryValue = chunk.saves;
              barColor = 'bg-violet-500';
            } else if (selectedMetric === 'all') {
              primaryValue = chunk.views;
              barColor = 'bg-indigo-600';
            }

            const barHeightPct = Math.max(12, (primaryValue / metricMax) * 90);

            return (
              <div
                key={idx}
                className="flex-1 min-w-[28px] h-full flex flex-col justify-end items-center group relative cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                  <div className="px-2 py-1 rounded bg-slate-800 text-white text-[9px] font-mono whitespace-nowrap shadow-md border border-slate-700">
                    <div>Hour {chunk.hour}: {primaryValue}</div>
                    {selectedMetric === 'all' && (
                      <div className="text-slate-400">
                        {chunk.likes}L · {chunk.comments}C · {chunk.shares}S
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-Metric Stack if 'all' is selected */}
                <div
                  style={{ height: `${barHeightPct}%` }}
                  className={`w-full rounded-t-md transition-all flex flex-col justify-end overflow-hidden ${barColor} group-hover:brightness-110`}
                >
                  {selectedMetric === 'all' && chunk.likes > 0 && (
                    <div
                      style={{ height: `${Math.min(35, (chunk.likes / Math.max(1, chunk.views)) * 100 * 4)}%` }}
                      className="w-full bg-rose-500"
                      title={`${chunk.likes} Likes`}
                    />
                  )}
                  {selectedMetric === 'all' && chunk.shares > 0 && (
                    <div
                      style={{ height: `${Math.min(25, (chunk.shares / Math.max(1, chunk.views)) * 100 * 5)}%` }}
                      className="w-full bg-emerald-400"
                      title={`${chunk.shares} Shares`}
                    />
                  )}
                </div>

                <span className="text-[9px] font-mono text-slate-500 mt-1">
                  H{chunk.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
