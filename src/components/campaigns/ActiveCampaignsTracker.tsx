import React, { useState, useEffect } from 'react';
import {
  Activity,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ShieldCheck,
  Pause,
  Play,
  RotateCcw,
  X,
  Moon,
  Trash2,
  Send,
  AlertCircle,
  FileText,
  Zap,
  Globe,
  Server,
  Check,
  Terminal,
  Radio,
  Copy,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CampaignConfig, LaunchedCampaign } from '../../types/smm';
import {
  fetchSchedulerStatus,
  triggerCronDispatchTick,
  updateCampaignSpeed,
  dispatchNextDueChunk,
} from '../../services/smmClient';
import { LiveOrganicGrowthPreview } from '../organic/LiveOrganicGrowthPreview';
import { PerTypeOrganicDeliveryPreview } from '../organic/PerTypeOrganicDeliveryPreview';

interface ActiveCampaignsTrackerProps {
  campaigns: LaunchedCampaign[];
  onRefreshStatuses: () => void;
  onNavigateToWizard: () => void;
  onTogglePauseCampaign: (id: string) => void;
  onCancelCampaign: (id: string) => void;
  onClearAllCampaigns?: () => void;
  onLoadDemoCampaigns?: () => void;
  onDispatchSubChunk?: (campaignId: string, chunkIndex: number) => Promise<{ success: boolean; orderId?: any; error?: string; rawOutput?: string }>;
  onCheckSubChunkStatus?: (campaignId: string, chunkIndex: number) => Promise<{ success: boolean; data?: any; error?: string; rawOutput?: string }>;
  onUpdateCampaignSpeed?: (id: string, interval: 'hourly' | 'turbo_1m' | 'turbo_2m' | 'rapid_30s') => void;
}

export const ActiveCampaignsTracker: React.FC<ActiveCampaignsTrackerProps> = ({
  campaigns,
  onRefreshStatuses,
  onNavigateToWizard,
  onTogglePauseCampaign,
  onCancelCampaign,
  onClearAllCampaigns,
  onLoadDemoCampaigns,
  onDispatchSubChunk,
  onCheckSubChunkStatus,
  onUpdateCampaignSpeed,
}) => {
  const [selectedCampaignForModal, setSelectedCampaignForModal] = useState<LaunchedCampaign | null>(null);
  const [modalTab, setModalTab] = useState<'batches' | 'curve' | 'perType'>('batches');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dispatchingChunkIndex, setDispatchingChunkIndex] = useState<number | null>(null);
  const [chunkStatusResult, setChunkStatusResult] = useState<{
    chunkIndex: number;
    text: string;
    isError?: boolean;
  } | null>(null);

  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // 24/7 Scheduler & Vercel Cron State
  const [schedulerInfo, setSchedulerInfo] = useState<{
    active: boolean;
    uptime?: number;
    lastTickAt?: string;
    nextScheduledChunk?: any;
    executionLogs?: any[];
  } | null>(null);
  const [showCronModal, setShowCronModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [isTriggeringTick, setIsTriggeringTick] = useState(false);
  const [cronFeedback, setCronFeedback] = useState<string | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Load scheduler info periodically
  const loadScheduler = () => {
    fetchSchedulerStatus().then((data) => {
      if (data) setSchedulerInfo(data);
    });
  };

  useEffect(() => {
    loadScheduler();
    const interval = setInterval(loadScheduler, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadScheduler();
    setTimeout(() => {
      onRefreshStatuses();
      setIsRefreshing(false);
    }, 600);
  };

  const handleTriggerTickNow = async () => {
    setIsTriggeringTick(true);
    setCronFeedback(null);
    const result = await triggerCronDispatchTick();
    if (result.success) {
      setCronFeedback(
        `✓ 24/7 Tick executed! Dispatched: ${result.dispatchedCount ?? 0} scheduled chunk(s).`
      );
      loadScheduler();
      onRefreshStatuses();
    } else {
      setCronFeedback(`Tick note: ${result.error || 'No chunks due yet.'}`);
    }
    setIsTriggeringTick(false);
    setTimeout(() => setCronFeedback(null), 5000);
  };

  const [dispatchingNextCampaignId, setDispatchingNextCampaignId] = useState<string | null>(null);

  const handleDispatchNextBatch = async (campaignId: string) => {
    setDispatchingNextCampaignId(campaignId);
    try {
      const res = await dispatchNextDueChunk(campaignId);
      if (res.success) {
        onRefreshStatuses();
        setCronFeedback(`✓ Dispatched next scheduled batch for ${campaignId}!`);
        setTimeout(() => setCronFeedback(null), 4000);
      } else {
        setCronFeedback(res.message || 'Next batch note: checked.');
      }
    } catch (e) {
      console.warn('Dispatch next batch error:', e);
    } finally {
      setDispatchingNextCampaignId(null);
    }
  };

  // Dispatch individual chunk via API
  const handleDispatchChunk = async (chunkIndex: number) => {
    if (!selectedCampaignForModal || !onDispatchSubChunk) return;
    setDispatchingChunkIndex(chunkIndex);
    setChunkStatusResult(null);

    const result = await onDispatchSubChunk(selectedCampaignForModal.id, chunkIndex);
    if (result.success) {
      setChunkStatusResult({
        chunkIndex,
        text: `✓ Successfully dispatched to Parent Panel! Order ID: #${result.orderId}`,
        isError: false,
      });
      // update local modal view
      const updatedChunks = selectedCampaignForModal.chunks.map((chk, idx) =>
        idx === chunkIndex
          ? {
              ...chk,
              realParentOrderId: result.orderId,
              dispatchStatus: 'dispatched' as const,
              status: 'dispatched' as const,
              dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : chk
      );
      setSelectedCampaignForModal({
        ...selectedCampaignForModal,
        chunks: updatedChunks,
      });
    } else {
      setChunkStatusResult({
        chunkIndex,
        text: `✗ Dispatch Failed: ${result.error || 'Parent panel rejected order. Check balance/API key.'}`,
        isError: true,
      });
    }
    setDispatchingChunkIndex(null);
  };

  // Check individual chunk status via API
  const handleCheckChunkStatus = async (chunkIndex: number) => {
    if (!selectedCampaignForModal || !onCheckSubChunkStatus) return;
    setDispatchingChunkIndex(chunkIndex);
    setChunkStatusResult(null);

    const result = await onCheckSubChunkStatus(selectedCampaignForModal.id, chunkIndex);
    if (result.success && result.data) {
      const d = result.data;
      setChunkStatusResult({
        chunkIndex,
        text: `Parent API Status: ${d.status || 'Active'} | Remains: ${d.remains ?? 'N/A'} | Start: ${d.start_count ?? 'N/A'} | Charge: ${d.charge ?? 'N/A'}`,
        isError: false,
      });
    } else {
      setChunkStatusResult({
        chunkIndex,
        text: `Status Check Failed: ${result.error || 'Could not query order'}`,
        isError: true,
      });
    }
    setDispatchingChunkIndex(null);
  };

  // Compute aggregate numbers
  const runningCount = campaigns.filter((c) => c.status === 'running').length;
  const totalViewsDispatched = campaigns.reduce((acc, c) => acc + c.dispatchedViews, 0);
  const totalEngagementsDelivered = campaigns.reduce(
    (acc, c) => acc + c.dispatchedLikes + c.dispatchedComments + c.dispatchedShares + c.dispatchedSaves,
    0
  );

  const cronUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/cron/dispatch` : '/api/cron/dispatch';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              LIVE MONITOR
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              24/7 Campaign Execution & Sub-Order Hub
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Active Campaigns & Engagement Delivery Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Autonomous 24/7 background scheduler dispatches views, micro likes (via JAP #1778), and engagement at scheduled intervals without website downtime.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex flex-wrap items-center gap-2">
          {campaigns.length > 0 && onClearAllCampaigns && (
            showConfirmClear ? (
              <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-rose-50 border border-rose-300 text-xs">
                <span className="text-rose-900 font-bold px-1.5">Clear all?</span>
                <button
                  onClick={() => {
                    onClearAllCampaigns();
                    setShowConfirmClear(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 text-[11px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
                title="Delete all campaigns to start fresh"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Campaigns</span>
              </button>
            )
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Live Status</span>
          </button>

          <button
            onClick={onNavigateToWizard}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition hover:translate-x-0.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 24/7 Autonomous Background Scheduler Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 text-white shadow-md border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-xs tracking-wide text-emerald-400 uppercase">
                24/7 Autonomous Background Engine: ACTIVE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold">
                Vercel Cron Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              <strong>Continuous 24/7 Operation:</strong> Even after you close this browser tab, shut down your computer, or host on Vercel, the server background worker continuously executes scheduled batches on time, sending views and micro likes (via JAP #1778).
            </p>
            {schedulerInfo?.nextScheduledChunk && (
              <div className="flex items-center space-x-2 text-[11px] text-amber-300 font-mono pt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Next upcoming batch: <strong>Batch #{schedulerInfo.nextScheduledChunk.batchNumber}</strong> ({schedulerInfo.nextScheduledChunk.views} views, {schedulerInfo.nextScheduledChunk.likes} likes) at {schedulerInfo.nextScheduledChunk.scheduledAt} (in ~{schedulerInfo.nextScheduledChunk.minutesUntil}m)
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerTickNow}
              disabled={isTriggeringTick}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-sm transition flex items-center space-x-1.5 disabled:opacity-50"
              title="Test the 24/7 background scheduler by manually triggering a tick"
            >
              <Zap className={`w-3.5 h-3.5 ${isTriggeringTick ? 'animate-bounce' : ''}`} />
              <span>{isTriggeringTick ? 'Executing Tick...' : 'Trigger Dispatch Tick Now'}</span>
            </button>

            <button
              onClick={() => setShowCronModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition flex items-center space-x-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-300" />
              <span>Vercel Cron Setup</span>
            </button>

            <button
              onClick={() => setShowLogsModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition flex items-center space-x-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-300" />
              <span>Execution Logs ({schedulerInfo?.executionLogs?.length || 0})</span>
            </button>
          </div>
        </div>

        {cronFeedback && (
          <div className="mt-3 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{cronFeedback}</span>
          </div>
        )}
      </div>

      {/* Aggregate Statistics Overview Banner */}
      <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Active Campaigns</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <strong className="text-lg font-black text-indigo-700">{runningCount} Running</strong>
              <span className="text-[11px] text-slate-500">24/7 server pacing</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Total Views Dispatched</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <strong className="text-lg font-black text-slate-900 font-mono">
                {totalViewsDispatched.toLocaleString()}
              </strong>
              <span className="text-[11px] text-slate-500">Across all batches</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Total Engagements Delivered</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <strong className="text-lg font-black text-rose-600 font-mono">
                {totalEngagementsDelivered.toLocaleString()} Signals
              </strong>
              <span className="text-[11px] text-slate-500">Likes, Comments, Shares, Saves</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Cold-Start & JAP Rules</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="text-xs font-bold text-emerald-700">300+ Views Threshold Enforced</span>
              <span className="text-[10px] text-slate-400">• JAP #1778 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State or Campaigns Table */}
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No Active Campaigns — Workspace Clean
            </h3>
            <p className="text-xs text-slate-500">
              Create a campaign to automatically dispatch views, micro likes via Just Another Panel (#1778), and engagement as per your scheduled timeline with 24/7 uptime.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={onNavigateToWizard}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition hover:translate-x-0.5 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Launch First Real Campaign</span>
            </button>

            {onLoadDemoCampaigns && (
              <button
                onClick={onLoadDemoCampaigns}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
              >
                Load Sample Demo Campaign
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 uppercase tracking-wider">
              Launched Campaigns Queue ({campaigns.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Click any campaign row to inspect granular hourly dispatches & parent API sub-orders
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Campaign ID</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Target Content Link</th>
                  <th className="py-2.5 px-3">Base Views</th>
                  <th className="py-2.5 px-3">Likes (JAP #1778)</th>
                  <th className="py-2.5 px-3">C / S / Sv</th>
                  <th className="py-2.5 px-3">Pacing Window</th>
                  <th className="py-2.5 px-3">Live Progress</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    onClick={() => setSelectedCampaignForModal(camp)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {camp.id}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-indigo-50 text-indigo-700 uppercase">
                        {camp.platform}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600 max-w-xs truncate">
                      <a
                        href={camp.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-indigo-600 hover:underline flex items-center space-x-1"
                      >
                        <span className="truncate">{camp.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <strong className="text-slate-900">{camp.dispatchedViews.toLocaleString()}</strong>
                      <span className="text-slate-400"> / {camp.baseViews.toLocaleString()}</span>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      <strong className="text-rose-600">{camp.dispatchedLikes}</strong>
                      <span className="text-slate-400"> / {camp.totalLikes}</span>
                      <span className="text-[9px] block text-emerald-600 font-bold">Starts @ 300+ views</span>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {camp.dispatchedComments}/{camp.dispatchedShares}/{camp.dispatchedSaves}
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-medium">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 text-[11px] block">{camp.durationLabel}</span>
                        <div className="flex items-center space-x-1">
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded font-bold text-[9px] bg-amber-50 text-amber-900 border border-amber-200">
                            <Zap className="w-2.5 h-2.5 text-amber-600" />
                            <span>
                              {camp.autoDispatchInterval === 'rapid_30s' || !camp.autoDispatchInterval
                                ? '30s Auto'
                                : camp.autoDispatchInterval === 'turbo_1m'
                                ? '1m Auto'
                                : camp.autoDispatchInterval === 'turbo_2m'
                                ? '2m Auto'
                                : '1h Auto'}
                            </span>
                          </span>
                          {onUpdateCampaignSpeed && camp.status === 'running' && (
                            <select
                              value={camp.autoDispatchInterval || 'rapid_30s'}
                              onChange={(e) => {
                                e.stopPropagation();
                                onUpdateCampaignSpeed(camp.id, e.target.value as any);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[9px] font-bold bg-white border border-slate-200 rounded px-1 py-0.5 text-slate-700 cursor-pointer hover:border-amber-400"
                              title="Change auto-dispatch speed"
                            >
                              <option value="rapid_30s">30s Rapid</option>
                              <option value="turbo_1m">1m Turbo</option>
                              <option value="turbo_2m">2m Steady</option>
                              <option value="hourly">1h Hourly</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-700">{camp.progressPercent}%</span>
                          <span className="text-slate-400">{camp.estimatedCompletion}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${camp.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {camp.status === 'running' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>24/7 Running</span>
                        </span>
                      )}
                      {camp.status === 'completed' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                          <span>Completed</span>
                        </span>
                      )}
                      {camp.status === 'paused' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                          <span>Paused</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {camp.status === 'running' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDispatchNextBatch(camp.id);
                            }}
                            disabled={dispatchingNextCampaignId === camp.id}
                            className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition flex items-center space-x-1 shadow-2xs disabled:opacity-50"
                            title="Dispatch next scheduled batch immediately"
                          >
                            <Zap className={`w-3 h-3 text-amber-600 ${dispatchingNextCampaignId === camp.id ? 'animate-bounce' : ''}`} />
                            <span>{dispatchingNextCampaignId === camp.id ? 'Sending...' : 'Auto-Send Next'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCampaignForModal(camp);
                            setModalTab('curve');
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center space-x-1 shadow-2xs"
                          title="Inspect AI Organic Delivery Curve"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Curve</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCampaignForModal(camp);
                            setModalTab('batches');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                        >
                          Inspect Batches
                        </button>
                        <button
                          onClick={() => onCancelCampaign(camp.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Cancel and remove campaign"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Chunks Modal */}
      {selectedCampaignForModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 pb-safe pt-safe animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-5xl w-full max-h-[92dvh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono font-bold text-sm text-indigo-700">
                    {selectedCampaignForModal.id}
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {selectedCampaignForModal.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-xs sm:max-w-xl">
                  {selectedCampaignForModal.targetUrl}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCampaignForModal(null);
                  setChunkStatusResult(null);
                }}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition active:scale-95"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-4 overflow-y-auto touch-scroll space-y-4">
              {/* Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Target</span>
                  <span className="text-sm font-extrabold text-slate-900 font-mono block">
                    {selectedCampaignForModal.baseViews.toLocaleString()} Views
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Delivered Views</span>
                  <span className="text-sm font-extrabold text-indigo-600 font-mono block">
                    {selectedCampaignForModal.dispatchedViews.toLocaleString()} Views
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Micro Likes Provider</span>
                  <span className="text-sm font-extrabold text-rose-600 block">
                    JAP #1778 (Micro)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Est. Completion</span>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    {selectedCampaignForModal.estimatedCompletion}
                  </span>
                </div>
              </div>

              {/* Sequencing Protocol Reminder */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Verified Multi-Panel Scheduling Protocol</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  • <strong>Batches #1 & #2:</strong> Strictly cold-start views only via <strong>SMMVault #11465</strong> (zero likes, zero other engagement).<br />
                  • <strong>Batch #3+:</strong> Likes and other engagement unlock automatically once <strong>300+ cumulative views</strong> have been delivered.<br />
                  • <strong>Micro Likes (5–9):</strong> Dispatched to <strong>Just Another Panel #1778</strong>.<br />
                  • <strong>Macro Likes (10+):</strong> Dispatched to <strong>ReliableSMM #7147</strong>.<br />
                  • <strong>Saves (starts from 1):</strong> Dispatched to <strong>ReliableSMM #7841</strong>.<br />
                  • <strong>Reposts (starts from 1):</strong> Dispatched to <strong>ReliableSMM #7842</strong>.<br />
                  • <strong>Shares (starts from 10):</strong> Dispatched to <strong>ReliableSMM #2060</strong>.
                </p>
              </div>

              {/* Modal View Tabs */}
              <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setModalTab('batches')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    modalTab === 'batches' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Batches & Sub-Orders ({selectedCampaignForModal.chunks.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('curve')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    modalTab === 'curve' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Live Organic Growth Curve</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('perType')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
                    modalTab === 'perType' ? 'bg-white text-violet-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-violet-500" />
                  <span>Per-Type Phased Organic Delivery</span>
                </button>
              </div>

              {/* Live Organic Growth Curve View */}
              {modalTab === 'curve' && (
                <LiveOrganicGrowthPreview
                  config={{
                    platform: selectedCampaignForModal.platform,
                    targetUrl: selectedCampaignForModal.targetUrl,
                    creatorHandle: selectedCampaignForModal.creatorHandle,
                    pageTier: 'chota',
                    whopBountyMode: true,
                    organicMode: true,
                    duration: '24h',
                    baseViews: selectedCampaignForModal.baseViews,
                    likes: selectedCampaignForModal.totalLikes,
                    comments: selectedCampaignForModal.totalComments,
                    shares: selectedCampaignForModal.totalShares,
                    saves: selectedCampaignForModal.totalSaves,
                    reposts: selectedCampaignForModal.totalReposts || 0,
                    followers: 0,
                    commentNiche: 'General',
                    approvedComments: [],
                    region: 'india',
                    growthPreset: 'explore_push',
                    curvePoints: [],
                    jitterIntensity: 'balanced',
                    reRollAntiBotVariance: true,
                  }}
                  allocations={selectedCampaignForModal.chunks}
                  interactive={true}
                />
              )}

              {/* Per-Type Phased Delivery View */}
              {modalTab === 'perType' && (
                <PerTypeOrganicDeliveryPreview
                  config={{
                    platform: selectedCampaignForModal.platform,
                    targetUrl: selectedCampaignForModal.targetUrl,
                    creatorHandle: selectedCampaignForModal.creatorHandle,
                    pageTier: 'chota',
                    whopBountyMode: true,
                    organicMode: true,
                    duration: '24h',
                    baseViews: selectedCampaignForModal.baseViews,
                    likes: selectedCampaignForModal.totalLikes,
                    comments: selectedCampaignForModal.totalComments,
                    shares: selectedCampaignForModal.totalShares,
                    saves: selectedCampaignForModal.totalSaves,
                    reposts: selectedCampaignForModal.totalReposts || 0,
                    followers: 0,
                    commentNiche: 'General',
                    approvedComments: [],
                    region: 'india',
                    growthPreset: 'explore_push',
                    curvePoints: [],
                    jitterIntensity: 'balanced',
                    reRollAntiBotVariance: true,
                  }}
                  allocations={selectedCampaignForModal.chunks}
                />
              )}

              {modalTab === 'batches' && (
                <>
                  {/* Status Message Banner if any */}
              {chunkStatusResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between animate-in fade-in ${
                    chunkStatusResult.isError
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {chunkStatusResult.isError ? (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    )}
                    <span className="font-semibold">{chunkStatusResult.text}</span>
                  </div>
                  <button
                    onClick={() => setChunkStatusResult(null)}
                    className="text-xs font-bold opacity-60 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Live Automated Schedule & Pacing Control Bar */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" />
                      <span>Auto-Schedule Mode:</span>
                      <strong className="text-amber-800">
                        {selectedCampaignForModal.autoDispatchInterval === 'rapid_30s' || !selectedCampaignForModal.autoDispatchInterval
                          ? '⚡ 30s Rapid'
                          : selectedCampaignForModal.autoDispatchInterval === 'turbo_1m'
                          ? '🚀 1m Turbo'
                          : selectedCampaignForModal.autoDispatchInterval === 'turbo_2m'
                          ? '⏱️ 2m Steady'
                          : '🕒 Hourly Circadian'}
                      </strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Batches auto-send views, micro likes (via JAP #1778) & engagement according to this pacing interval.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {onUpdateCampaignSpeed && selectedCampaignForModal.status === 'running' && (
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-200">
                      {[
                        { id: 'rapid_30s', label: '30s' },
                        { id: 'turbo_1m', label: '1m' },
                        { id: 'turbo_2m', label: '2m' },
                        { id: 'hourly', label: '1h' },
                      ].map((spd) => (
                        <button
                          key={spd.id}
                          type="button"
                          onClick={() => {
                            onUpdateCampaignSpeed(selectedCampaignForModal.id, spd.id as any);
                            setSelectedCampaignForModal({
                              ...selectedCampaignForModal,
                              autoDispatchInterval: spd.id as any,
                            });
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                            (selectedCampaignForModal.autoDispatchInterval || 'rapid_30s') === spd.id
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {spd.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedCampaignForModal.status === 'running' && (
                    <button
                      type="button"
                      onClick={() => handleDispatchNextBatch(selectedCampaignForModal.id)}
                      disabled={dispatchingNextCampaignId === selectedCampaignForModal.id}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-2xs transition flex items-center space-x-1 disabled:opacity-50"
                    >
                      <Zap className={`w-3.5 h-3.5 ${dispatchingNextCampaignId === selectedCampaignForModal.id ? 'animate-bounce' : ''}`} />
                      <span>{dispatchingNextCampaignId === selectedCampaignForModal.id ? 'Sending...' : 'Send Next Batch Now'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chunks List Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider block">
                    Scheduled Batches Timeline ({selectedCampaignForModal.chunks.length} Chunks)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Auto-dispatched 24/7 or trigger manually
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Batch</th>
                        <th className="py-2 px-3">Scheduled Time</th>
                        <th className="py-2 px-3">Views</th>
                        <th className="py-2 px-3">Likes</th>
                        <th className="py-2 px-3">C / S / Sv</th>
                        <th className="py-2 px-3">Protocol Status & Order IDs</th>
                        <th className="py-2 px-3 text-right">API Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {selectedCampaignForModal.chunks.map((chk, idx) => {
                        const isDispatched = chk.dispatchStatus === 'dispatched' || chk.status === 'dispatched';
                        const isDispatchingThis = dispatchingChunkIndex === chk.chunkIndex;
                        const isFirstTwo = idx < 2;

                        return (
                          <tr key={chk.chunkIndex} className={isDispatched ? 'bg-emerald-50/30' : 'hover:bg-slate-50/50'}>
                            <td className="py-2.5 px-3 font-bold text-slate-800">
                              #{chk.batchNumber || idx + 1}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              <div className="flex items-center space-x-1">
                                <span>{chk.timeLabel}</span>
                                {chk.isSleepDip && <Moon className="w-2.5 h-2.5 text-indigo-400" />}
                              </div>
                              <span className="text-[10px] text-slate-400 block font-sans">
                                {chk.dispatchedAt ? `Sent at ${chk.dispatchedAt}` : chk.scheduledTimeFormatted ? `Scheduled ${chk.scheduledTimeFormatted}` : 'Scheduled'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-bold text-indigo-700">{chk.views}</td>
                            <td className="py-2.5 px-3 font-semibold">
                              {chk.likes > 0 ? (
                                <div>
                                  <span className="text-rose-600 font-bold">{chk.likes} Likes</span>
                                  {chk.likeType === 'micro' && (
                                    <span className="text-[9px] block text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 mt-0.5">
                                      JAP #1778
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 font-sans text-[10px]">
                                  {isFirstTwo ? '0 (Cold Start)' : '0'}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {isFirstTwo ? (
                                <span className="text-slate-400 font-sans text-[10px]">0/0/0 (Wait 300+ views)</span>
                              ) : (
                                `${chk.comments}/${chk.shares}/${chk.saves}`
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="space-y-1">
                                {isDispatched ? (
                                  <div className="flex flex-wrap items-center gap-1">
                                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                                      Views: #{chk.realParentOrderId}
                                    </span>
                                    {chk.likesOrderId && (
                                      <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                                        Likes: #{chk.likesOrderId}
                                      </span>
                                    )}
                                    {chk.savesOrderId && (
                                      <span className="font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200 text-[10px]">
                                        Saves: #{chk.savesOrderId}
                                      </span>
                                    )}
                                    {chk.repostsOrderId && (
                                      <span className="font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200 text-[10px]">
                                        Reposts: #{chk.repostsOrderId}
                                      </span>
                                    )}
                                    {chk.sharesOrderId && (
                                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                                        Shares: #{chk.sharesOrderId}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {isFirstTwo ? 'Cold-Start Seed (Views Only)' : '300+ Views Threshold Pacing'}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 font-sans block truncate max-w-xs">
                                  {chk.humanBehaviorNote}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {isDispatched ? (
                                <button
                                  onClick={() => handleCheckChunkStatus(chk.chunkIndex)}
                                  disabled={isDispatchingThis}
                                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition disabled:opacity-50"
                                >
                                  {isDispatchingThis ? 'Checking...' : 'Check Status'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDispatchChunk(chk.chunkIndex)}
                                  disabled={isDispatchingThis}
                                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition flex items-center space-x-1 ml-auto disabled:opacity-50"
                                >
                                  <Send className="w-2.5 h-2.5" />
                                  <span>{isDispatchingThis ? 'Sending...' : 'Dispatch Now'}</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  onCancelCampaign(selectedCampaignForModal.id);
                  setSelectedCampaignForModal(null);
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
              >
                Cancel Campaign (100% Pro-Rata Refund)
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onTogglePauseCampaign(selectedCampaignForModal.id)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center space-x-1"
                >
                  {selectedCampaignForModal.status === 'running' ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pause 24/7 Pacing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Resume 24/7 Pacing</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedCampaignForModal(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vercel 24/7 Cron Setup Modal */}
      {showCronModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Vercel 24/7 Background Hosting & Cron Setup
                </h3>
              </div>
              <button
                onClick={() => setShowCronModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                When hosted on Vercel, the applet includes <strong>vercel.json</strong> preconfigured with a 1-minute Cron job pointing to your autonomous dispatch endpoint.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Autonomous Cron Webhook URL:
                </span>
                <div className="flex items-center space-x-2 font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                  <span className="truncate flex-1 text-indigo-700">{cronUrl}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cronUrl);
                      setCopiedWebhook(true);
                      setTimeout(() => setCopiedWebhook(false), 2000);
                    }}
                    className="p-1 text-slate-500 hover:text-slate-800"
                    title="Copy URL"
                  >
                    {copiedWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1 text-indigo-950">
                <strong className="block font-bold">How 24/7 Works Without Downtime:</strong>
                <p className="text-[11px]">
                  1. The server stores all campaign chunks and scheduled timestamps in persistent JSON storage.<br />
                  2. A background worker ticks every 30 seconds to dispatch due batches.<br />
                  3. If hosted on serverless Vercel, Vercel Cron automatically triggers <code>/api/cron/dispatch</code> every minute.<br />
                  4. Even when your laptop is turned off or website is closed, orders are placed automatically.
                </p>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">vercel.json configuration:</span>
                <pre>{`{
  "crons": [
    {
      "path": "/api/cron/dispatch",
      "schedule": "* * * * *"
    }
  ]
}`}</pre>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleTriggerTickNow}
                disabled={isTriggeringTick}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isTriggeringTick ? 'Testing Tick...' : 'Test Cron Tick Now'}</span>
              </button>

              <button
                onClick={() => setShowCronModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Execution Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  24/7 Autonomous Server Execution Audit Log
                </h3>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {(!schedulerInfo?.executionLogs || schedulerInfo.executionLogs.length === 0) ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No automated dispatches recorded yet. Launch a campaign or click &quot;Trigger Dispatch Tick Now&quot; to test.
                </div>
              ) : (
                schedulerInfo.executionLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.campaignId} • Batch #{log.batchNumber}</span>
                      <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex flex-wrap gap-2">
                      <span>Views: {log.viewsDispatched} (Order: #{log.viewsOrderId || 'Simulated'})</span>
                      {log.likesDispatched > 0 && (
                        <span className="text-rose-600 font-bold">
                          Likes: {log.likesDispatched} (JAP #{log.likesServiceId || '1778'} Order: #{log.likesOrderId || 'None'})
                        </span>
                      )}
                    </div>
                    {log.error && (
                      <div className="text-[10px] text-rose-600">{log.error}</div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <button
                onClick={loadScheduler}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-semibold"
              >
                Refresh Logs
              </button>
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
