import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Check,
  Server,
  ArrowRight,
  ExternalLink,
  Repeat,
} from 'lucide-react';
import { ParentPanelConfig, ServiceMetricRouting } from '../../types/smm';

interface MetricServiceRoutingProps {
  panels: ParentPanelConfig[];
  routing: ServiceMetricRouting;
  updateRouting: (newRouting: ServiceMetricRouting) => void;
  onNavigateToPanels: () => void;
  onOpenAddPanelModal: () => void;
}

export const MetricServiceRouting: React.FC<MetricServiceRoutingProps> = ({
  panels,
  routing,
  updateRouting,
  onNavigateToPanels,
  onOpenAddPanelModal,
}) => {
  const [localRouting, setLocalRouting] = useState<ServiceMetricRouting>(routing);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const metricsConfig = [
    {
      key: 'views' as const,
      title: 'Views Service Routing • SMMVault #11465',
      subtitle: 'Instagram Reel / Video views delivery (SMMVault)',
      icon: Eye,
      iconColor: 'text-emerald-600',
      activeId: localRouting.views?.serviceId || '11465',
      panelId: localRouting.views?.panelId || 'smmvault',
    },
    {
      key: 'microLikes' as const,
      title: 'Micro Likes Routing (5 – 9 Likes) • JAP #1778',
      subtitle: 'Just Another Panel Service ID 1778 (Account: ashu1155)',
      icon: Heart,
      iconColor: 'text-amber-500',
      activeId: localRouting.microLikes?.serviceId || '1778',
      panelId: localRouting.microLikes?.panelId || 'jap',
    },
    {
      key: 'macroLikes' as const,
      title: 'Macro Likes Routing (10+ Likes) • ReliableSMM #7147',
      subtitle: 'Higher-batch likes for 10+ likes threshold (ReliableSMM)',
      icon: Heart,
      iconColor: 'text-rose-600',
      activeId: localRouting.macroLikes?.serviceId || '7147',
      panelId: localRouting.macroLikes?.panelId || 'reliablesmm',
    },
    {
      key: 'saves' as const,
      title: 'Saves / Bookmarks Routing (Starts from 1) • ReliableSMM #7841',
      subtitle: 'Instagram Saves signal starting from 1 (ReliableSMM)',
      icon: Bookmark,
      iconColor: 'text-violet-500',
      activeId: localRouting.saves?.serviceId || '7841',
      panelId: localRouting.saves?.panelId || 'reliablesmm',
    },
    {
      key: 'reposts' as const,
      title: 'Reposts Routing (Starts from 1) • ReliableSMM #7842',
      subtitle: 'Instagram Reposts signal starting from 1 (ReliableSMM)',
      icon: Repeat,
      iconColor: 'text-cyan-600',
      activeId: localRouting.reposts?.serviceId || '7842',
      panelId: localRouting.reposts?.panelId || 'reliablesmm',
    },
    {
      key: 'shares' as const,
      title: 'Shares Routing (Starts from 10) • ReliableSMM #2060',
      subtitle: 'Instagram Shares signal starting from 10 (ReliableSMM)',
      icon: Share2,
      iconColor: 'text-emerald-500',
      activeId: localRouting.shares?.serviceId || '2060',
      panelId: localRouting.shares?.panelId || 'reliablesmm',
    },
    {
      key: 'comments' as const,
      title: 'Comments Service Routing',
      subtitle: 'Contextual human-like comments (0.15% ratio)',
      icon: MessageSquare,
      iconColor: 'text-blue-500',
      activeId: localRouting.comments?.serviceId || '6477',
      panelId: localRouting.comments?.panelId || 'smmvault',
    },
  ];

  const handleUpdateMetric = (
    metricKey: keyof ServiceMetricRouting,
    panelId: string,
    serviceId: string
  ) => {
    const updated = {
      ...localRouting,
      [metricKey]: {
        ...localRouting[metricKey],
        panelId,
        serviceId,
      },
    };
    setLocalRouting(updated);
    updateRouting(updated);
    setSavedFeedback(metricKey);
    setTimeout(() => setSavedFeedback(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              ADDON HUB
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Metric-Level Router
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Specific Engagement Metric Service Routing
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Assign which Parent Provider Panel and specific Service ID handles each metric. All connected panels are shown below — select the panel and Service ID for each engagement signal.
          </p>
        </div>

        <button
          onClick={onNavigateToPanels}
          className="mt-3 sm:mt-0 flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
        >
          <Server className="w-3.5 h-3.5" />
          <span>Manage SMM Panels & Services</span>
        </button>
      </div>

      {/* Connected Panels Pill Row */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mr-1">
            CONNECTED PANELS:
          </span>
          {panels.map((p) => (
            <div
              key={p.id}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold">{p.name}</span>
              <span className="text-[10px] text-slate-400">
                {p.apiUrl.replace('https://', '').split('/')[0]}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onOpenAddPanelModal}
          className="flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition"
        >
          <Plus className="w-3 h-3" />
          <span>Add Panel</span>
        </button>
      </div>

      {/* 6 Metric Routers Grid */}
      <div className="space-y-4">
        {metricsConfig.map((metric) => {
          const Icon = metric.icon;
          const assignedPanel =
            panels.find((p) => p.id === metric.panelId) || panels[0];

          return (
            <div
              key={metric.key}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3"
            >
              {/* Metric Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-1.5 rounded-lg bg-slate-50 ${metric.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{metric.title}</h3>
                    <p className="text-[11px] text-slate-500">{metric.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    Active: <strong className="text-slate-900">{metric.activeId || 'None'}</strong>
                  </span>
                  {savedFeedback === metric.key && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-in fade-in">
                      Saved
                    </span>
                  )}
                </div>
              </div>

              {/* Connected Panels Mapping Cards for this Metric */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {panels.map((panel) => {
                  const isCurrentSelected = metric.panelId === panel.id;
                  const currentServiceId = isCurrentSelected
                    ? metric.activeId
                    : '';

                  return (
                    <div
                      key={panel.id}
                      className={`p-3.5 rounded-xl border-2 transition ${
                        isCurrentSelected
                          ? 'border-indigo-600 bg-indigo-50/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-xs text-slate-900 block truncate">
                            {panel.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {panel.apiUrl.replace('https://', '').split('/')[0]}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                            isCurrentSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isCurrentSelected ? 'ACTIVE' : 'STANDBY'}
                        </span>
                      </div>

                      {/* Service ID Input and Select Button */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">
                          Service ID
                        </label>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="text"
                            defaultValue={currentServiceId}
                            onBlur={(e) =>
                              handleUpdateMetric(metric.key, panel.id, e.target.value)
                            }
                            placeholder="e.g. 3528"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() =>
                              handleUpdateMetric(metric.key, panel.id, String(currentServiceId || '101'))
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                              isCurrentSelected
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isCurrentSelected ? '✓ Selected' : 'Use Panel'}
                          </button>
                        </div>
                      </div>

                      {/* Panel Details Footer */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>API Key: ****{panel.apiKey.slice(-4)}</span>
                        <span className="font-bold text-slate-700">
                          ₹{panel.currency === 'INR' ? panel.balance.toFixed(2) : (panel.balance * 83.5).toFixed(2)} INR
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
