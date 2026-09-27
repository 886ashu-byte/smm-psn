import React, { useState } from 'react';
import {
  Server,
  Plus,
  RefreshCw,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Ban,
  Check,
  ChevronDown,
  ChevronUp,
  Terminal,
  Edit2,
  Key,
  ExternalLink,
  ShieldCheck,
  Send,
  Layers,
} from 'lucide-react';
import { CatalogServiceItem, ParentPanelConfig, ServiceMetricRouting } from '../../types/smm';
import { executePanelApiAction, MOCK_CATALOG_SERVICES } from '../../services/smmClient';
import { AddPanelModal } from '../modals/AddPanelModal';

interface LivePanelManagerProps {
  panels: ParentPanelConfig[];
  activePanel: ParentPanelConfig;
  setActivePanel: (panel: ParentPanelConfig) => void;
  onUpdatePanels: (panels: ParentPanelConfig[]) => void;
  serviceRouting: ServiceMetricRouting;
  onAssignServiceId: (metricKey: keyof ServiceMetricRouting, serviceId: string, serviceName: string) => void;
  onOpenAddPanelModal: () => void;
}

export const LivePanelManager: React.FC<LivePanelManagerProps> = ({
  panels,
  activePanel,
  setActivePanel,
  onUpdatePanels,
  serviceRouting,
  onAssignServiceId,
  onOpenAddPanelModal,
}) => {
  const [showServicesCatalog, setShowServicesCatalog] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [panelToDelete, setPanelToDelete] = useState<ParentPanelConfig | null>(null);
  const [editingPanel, setEditingPanel] = useState<ParentPanelConfig | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetchingServices, setIsFetchingServices] = useState(false);
  const [servicesFetchNotification, setServicesFetchNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [apiConnectionStatus, setApiConnectionStatus] = useState<string>(
    activePanel.status === 'connected' ? 'Connected (SMM v2 API)' : 'Ready for test'
  );

  // Test Console State
  const [consoleAction, setConsoleAction] = useState<'balance' | 'services' | 'add' | 'status' | 'refill' | 'cancel'>('balance');
  const [testOrderId, setTestOrderId] = useState('486450');
  const [testServiceId, setTestServiceId] = useState('3528');
  const [testTargetLink, setTestTargetLink] = useState('https://instagram.com/reel/C8kP9a-xL21/');
  const [testQuantity, setTestQuantity] = useState('100');
  const [isExecutingConsole, setIsExecutingConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>(
    `Ready to execute SMM v2 API actions against:\nPOST ${activePanel.apiUrl}\nAPI Key: ${activePanel.apiKey.slice(0, 4)}****\n\nClick any action above to test live endpoint.`
  );

  // Assign dropdown state
  const [activeAssignDropdown, setActiveAssignDropdown] = useState<string | number | null>(null);

  // Real Sync Balance
  const handleSyncBalance = async (panel: ParentPanelConfig) => {
    setIsSyncing(true);
    setServicesFetchNotification(null);
    const res = await executePanelApiAction(panel, 'balance');
    setConsoleOutput(res.rawOutput);

    if (res.success && res.data) {
      const balanceNum = typeof res.data.balance === 'number' 
        ? res.data.balance 
        : parseFloat(res.data.balance) || 0;
      const currency = res.data.currency || panel.currency;

      setApiConnectionStatus(`Connected 200 OK — Balance: ${balanceNum} ${currency}`);
      
      const updated = panels.map((p) =>
        p.id === panel.id 
          ? { ...p, balance: balanceNum, balanceCurrency: currency, lastSynced: 'Just now', status: 'connected' as const } 
          : p
      );
      onUpdatePanels(updated);
      if (activePanel.id === panel.id) {
        setActivePanel({ ...activePanel, balance: balanceNum, balanceCurrency: currency, lastSynced: 'Just now', status: 'connected' });
      }
      setServicesFetchNotification({
        type: 'success',
        message: `Live balance synced: ${balanceNum} ${currency} from ${panel.name}`,
      });
    } else {
      setApiConnectionStatus(`Failed: ${res.error || 'Connection error'}`);
      setServicesFetchNotification({
        type: 'error',
        message: `Balance Check Error: ${res.error || 'Check your API Key and Endpoint URL'}`,
      });
    }
    setIsSyncing(false);
  };

  // Real Fetch Live Services from Panel API ('action: services')
  const handleFetchLiveServices = async (panel: ParentPanelConfig) => {
    setIsFetchingServices(true);
    setServicesFetchNotification(null);
    setShowServicesCatalog(true);

    const res = await executePanelApiAction(panel, 'services');
    setConsoleOutput(res.rawOutput);

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const formattedServices: CatalogServiceItem[] = res.data.map((s: any) => ({
        service: s.service || s.id || Math.floor(Math.random() * 10000),
        name: s.name || 'Unnamed Service',
        category: s.category || 'General',
        rate: s.rate !== undefined ? s.rate : '0.00',
        min: s.min || 10,
        max: s.max || 1000000,
        type: s.type || 'Default',
        dripfeed: Boolean(s.dripfeed),
        refill: Boolean(s.refill),
        cancel: Boolean(s.cancel),
        panelId: panel.id,
      }));

      const updated = panels.map((p) =>
        p.id === panel.id
          ? { ...p, servicesList: formattedServices, lastServicesFetched: 'Just now' }
          : p
      );
      onUpdatePanels(updated);
      if (activePanel.id === panel.id) {
        setActivePanel({ ...activePanel, servicesList: formattedServices, lastServicesFetched: 'Just now' });
      }

      setServicesFetchNotification({
        type: 'success',
        message: `Successfully loaded ${formattedServices.length} live services directly from ${panel.name}!`,
      });
    } else {
      const err = res.error || (res.data?.error ? res.data.error : 'Parent API returned invalid or empty services format');
      setServicesFetchNotification({
        type: 'error',
        message: `Failed to fetch live services: ${err}. Check provider API credentials.`,
      });
    }
    setIsFetchingServices(false);
  };

  // Load Sample Services fallback
  const handleLoadSampleServices = () => {
    const updated = panels.map((p) =>
      p.id === activePanel.id
        ? { ...p, servicesList: MOCK_CATALOG_SERVICES, lastServicesFetched: 'Sample Template' }
        : p
    );
    onUpdatePanels(updated);
    setActivePanel({ ...activePanel, servicesList: MOCK_CATALOG_SERVICES, lastServicesFetched: 'Sample Template' });
    setServicesFetchNotification({
      type: 'success',
      message: `Loaded ${MOCK_CATALOG_SERVICES.length} sample template services for metric routing preview.`,
    });
  };

  // Run Test Action in Console
  const handleRunConsoleTest = async (action: 'balance' | 'services' | 'add' | 'status' | 'refill' | 'cancel') => {
    setConsoleAction(action);
    setIsExecutingConsole(true);

    let params: Record<string, any> = {};
    if (action === 'status' || action === 'refill' || action === 'cancel') {
      params = { order: testOrderId.trim() };
    } else if (action === 'add') {
      params = {
        service: testServiceId.trim(),
        link: testTargetLink.trim(),
        quantity: parseInt(testQuantity) || 100,
      };
    }

    const res = await executePanelApiAction(activePanel, action, params);
    setConsoleOutput(res.rawOutput);
    setIsExecutingConsole(false);
  };

  // Confirm delete panel
  const handleConfirmDelete = () => {
    if (!panelToDelete) return;
    if (panels.length <= 1) {
      alert('You must have at least one parent SMM panel configured.');
      setPanelToDelete(null);
      return;
    }
    const filtered = panels.filter((p) => p.id !== panelToDelete.id);
    onUpdatePanels(filtered);
    if (activePanel.id === panelToDelete.id) {
      setActivePanel(filtered[0]);
    }
    setPanelToDelete(null);
  };

  // Determine which services to display: real fetched services if available, else curated catalog
  const currentServicesList: CatalogServiceItem[] = 
    activePanel.servicesList && activePanel.servicesList.length > 0 
      ? activePanel.servicesList 
      : MOCK_CATALOG_SERVICES.filter((s) => s.panelId === activePanel.id || !s.panelId || activePanel.id === 'jap');

  const isUsingLiveServices = Boolean(activePanel.servicesList && activePanel.servicesList.length > 0 && activePanel.lastServicesFetched !== 'Sample Template');

  // Extract unique categories dynamically
  const uniqueCategories = ['All', ...Array.from(new Set(currentServicesList.map((s) => s.category).filter(Boolean)))];

  const filteredServices = currentServicesList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.service).includes(searchQuery);
    const matchesCategory =
      categoryFilter === 'All' || s.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              API ENGINE V2
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Real SMM API Integration & Services Catalog
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Live Panel API Manager & Services Inspector
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test live actions ('action: balance', 'services', 'add', 'status'), inspect provider service IDs, and map services directly to circadian metrics.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-slate-400">Target Endpoint:</span>
          <span className="font-bold text-indigo-700">{activePanel.apiUrl}</span>
        </div>
      </div>

      {/* Notification Banner */}
      {servicesFetchNotification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
            servicesFetchNotification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {servicesFetchNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{servicesFetchNotification.message}</span>
          </div>
          <button
            onClick={() => setServicesFetchNotification(null)}
            className="text-xs opacity-60 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Target SMM Panel Selector & Actions Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Panel Dropdown */}
            <div className="min-w-[220px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Active Target SMM Panel
              </label>
              <select
                value={activePanel.id}
                onChange={(e) => {
                  const p = panels.find((x) => x.id === e.target.value);
                  if (p) setActivePanel(p);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
              >
                {panels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.apiUrl.replace('https://', '')})
                  </option>
                ))}
              </select>
            </div>

            {/* API Key Masked Preview & Edit */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  API Key Secret
                </label>
                <button
                  onClick={() => setEditingPanel(activePanel)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Key / URL</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="password"
                  readOnly
                  value={activePanel.apiKey}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 select-all cursor-pointer"
                  onClick={() => setEditingPanel(activePanel)}
                  title="Click to edit API Key"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0 pt-1 lg:pt-4">
            <button
              onClick={() => handleSyncBalance(activePanel)}
              disabled={isSyncing}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Checking...' : 'Sync Real Balance'}</span>
            </button>

            <button
              onClick={() => handleFetchLiveServices(activePanel)}
              disabled={isFetchingServices}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50"
            >
              <Server className={`w-3.5 h-3.5 ${isFetchingServices ? 'animate-spin' : ''}`} />
              <span>{isFetchingServices ? 'Fetching...' : 'Fetch Live Services (API)'}</span>
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                activePanel.status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
            <span>API Status:</span>
            <span
              className={`font-bold ${
                activePanel.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {apiConnectionStatus}
            </span>
          </div>

          <div>
            <span>Live Balance: </span>
            <strong className="text-emerald-400 text-sm">
              ₹
              {activePanel.currency === 'INR'
                ? activePanel.balance.toFixed(2)
                : (activePanel.balance * 83.5).toFixed(2)}{' '}
              INR
            </strong>
            <span className="text-slate-400 text-[11px] ml-1">
              ($
              {activePanel.currency === 'USD'
                ? activePanel.balance.toFixed(2)
                : (activePanel.balance / 83.5).toFixed(2)}{' '}
              USD)
            </span>
          </div>
        </div>
      </div>

      {/* Connected Parent SMM Provider APIs & Live Balances */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Configured Parent SMM Provider APIs
            </h3>
            <p className="text-[11px] text-slate-500">
              Manage your provider API credentials, sync balances, and inspect service catalogs.
            </p>
          </div>

          <button
            onClick={onOpenAddPanelModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add SMM Panel</span>
          </button>
        </div>

        {/* Panel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {panels.map((panel) => {
            const isTarget = activePanel.id === panel.id;
            return (
              <div
                key={panel.id}
                className={`p-4 rounded-xl border-2 transition ${
                  isTarget
                    ? 'border-indigo-600 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{panel.name}</span>
                    {isTarget && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                      panel.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {panel.status === 'connected' ? 'Connected' : 'Offline'}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-500 space-y-0.5">
                  <p className="truncate" title={panel.apiUrl}>{panel.apiUrl}</p>
                  <p>Key: {panel.apiKey ? `${panel.apiKey.slice(0, 4)}...${panel.apiKey.slice(-4)}` : 'Not set'}</p>
                  {panel.id === 'jap' && (
                    <div className="text-[10px] text-indigo-700 bg-indigo-50/90 p-1.5 rounded-lg border border-indigo-200 mt-1 font-sans">
                      <span className="font-bold">Account: ashu1155</span> • Total Orders: 634 • Micro Likes: <strong>Service #1778</strong>
                    </div>
                  )}
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    Live API Balance
                  </span>
                  <span className="font-bold font-mono text-slate-900 text-xs">
                    ₹
                    {panel.currency === 'INR'
                      ? panel.balance.toFixed(2)
                      : (panel.balance * 83.5).toFixed(2)}{' '}
                    INR
                  </span>
                </div>

                <div className="mt-3 flex items-center space-x-2">
                  <button
                    onClick={() => handleSyncBalance(panel)}
                    disabled={isSyncing}
                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePanel(panel);
                      handleFetchLiveServices(panel);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition"
                  >
                    <Server className="w-3 h-3" />
                    <span>Services</span>
                  </button>

                  <button
                    onClick={() => setEditingPanel(panel)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Edit Credentials"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setPanelToDelete(panel)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete panel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Services Catalog Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Services Catalog — {activePanel.name}
              </h3>
              {isUsingLiveServices ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  LIVE API DATA ({currentServicesList.length} services)
                </span>
              ) : currentServicesList.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  SAMPLE TEMPLATE ({currentServicesList.length} services)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  NOT FETCHED YET
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              API Endpoint: {activePanel.apiUrl} · Map any service directly into Circadian Metric Routing.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleFetchLiveServices(activePanel)}
              disabled={isFetchingServices}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isFetchingServices ? 'animate-spin' : ''}`} />
              <span>Fetch from API</span>
            </button>

            <button
              onClick={handleLoadSampleServices}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              title="Load demo catalog template"
            >
              Load Sample Catalog
            </button>

            <button
              onClick={() => setShowServicesCatalog(!showServicesCatalog)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>{showServicesCatalog ? 'Hide' : 'Show'}</span>
              {showServicesCatalog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {showServicesCatalog && (
          <div className="space-y-3">
            {currentServicesList.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <Server className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-sm text-slate-800">No Services Loaded for {activePanel.name}</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click <strong>"Fetch from API"</strong> to query <code className="font-mono">action: services</code> on your parent panel, or load sample template services.
                </p>
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    onClick={() => handleFetchLiveServices(activePanel)}
                    disabled={isFetchingServices}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                  >
                    Fetch Live Services from API
                  </button>
                  <button
                    onClick={handleLoadSampleServices}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
                  >
                    Load Sample Catalog Template
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Search and Category Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search service name or ID..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white max-w-xs truncate"
                  >
                    {uniqueCategories.map((c) => (
                      <option key={c} value={c}>
                        Category: {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[420px] overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase sticky top-0 z-10 shadow-2xs">
                      <tr>
                        <th className="py-2.5 px-3">Service ID</th>
                        <th className="py-2.5 px-3">Service Name & Category</th>
                        <th className="py-2.5 px-3">Rate / 1k</th>
                        <th className="py-2.5 px-3">Min / Max</th>
                        <th className="py-2.5 px-3">Features</th>
                        <th className="py-2.5 px-3 text-right">Routing Mapping</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredServices.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                            No services match your search query.
                          </td>
                        </tr>
                      ) : (
                        filteredServices.map((service) => {
                          const sIdStr = String(service.service);
                          // Check if mapped
                          const mappedMetricKey = (
                            Object.keys(serviceRouting) as (keyof ServiceMetricRouting)[]
                          ).find((k) => String(serviceRouting[k]?.serviceId) === sIdStr);

                          return (
                            <tr key={service.service} className="hover:bg-slate-50/80 transition">
                              <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                                #{service.service}
                              </td>

                              <td className="py-2.5 px-3 max-w-md">
                                <div className="font-semibold text-slate-800 line-clamp-2">
                                  {service.name}
                                </div>
                                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                                  {service.category}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                                ₹{service.rate}
                              </td>

                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                                {Number(service.min).toLocaleString()} / {Number(service.max).toLocaleString()}
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="flex items-center space-x-1 text-[10px]">
                                  {service.dripfeed && (
                                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold">
                                      DRIP
                                    </span>
                                  )}
                                  {service.refill && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">
                                      REFILL
                                    </span>
                                  )}
                                  {service.cancel && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold">
                                      CANCEL
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-3 text-right relative">
                                {mappedMetricKey ? (
                                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="capitalize">{mappedMetricKey}</span>
                                  </div>
                                ) : (
                                  <div className="relative inline-block text-left">
                                    <button
                                      onClick={() =>
                                        setActiveAssignDropdown(
                                          activeAssignDropdown === service.service ? null : service.service
                                        )
                                      }
                                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition inline-flex items-center space-x-1"
                                    >
                                      <span>Map Metric</span>
                                      <ChevronDown className="w-3 h-3" />
                                    </button>

                                    {activeAssignDropdown === service.service && (
                                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 text-left text-xs">
                                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                                          Assign Service #{service.service} to:
                                        </div>
                                        <button
                                          onClick={() => {
                                            onAssignServiceId('views', String(service.service), service.name);
                                            setActiveAssignDropdown(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
                                        >
                                          Views (Base Stream)
                                        </button>
                                        <button
                                          onClick={() => {
                                            onAssignServiceId('microLikes', String(service.service), service.name);
                                            setActiveAssignDropdown(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
                                        >
                                          Micro Likes (5-9 batch)
                                        </button>
                                        <button
                                          onClick={() => {
                                            onAssignServiceId('macroLikes', String(service.service), service.name);
                                            setActiveAssignDropdown(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
                                        >
                                          Macro Likes (10+ batch)
                                        </button>
                                        <button
                                          onClick={() => {
                                            onAssignServiceId('comments', String(service.service), service.name);
                                            setActiveAssignDropdown(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
                                        >
                                          Custom Comments
                                        </button>
                                        <button
                                          onClick={() => {
                                            onAssignServiceId('shares', String(service.service), service.name);
                                            setActiveAssignDropdown(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
                                        >
                                          Viral Shares / DMs
                                        </button>
                                        <button
                                          onClick={() => {
                                            onAssignServiceId('saves', String(service.service), service.name);
                                            setActiveAssignDropdown(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
                                        >
                                          Retention Saves / Bookmarks
                                        </button>
                                        <button
                                          onClick={() => {
                                            onAssignServiceId('reposts', String(service.service), service.name);
                                            setActiveAssignDropdown(null);
                                          }}
                                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
                                        >
                                          Reposts (Starts from 1)
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Live Interactive SMM v2 API Test Console */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Parent Panel API Test Console (Execute Live Actions)
            </h3>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Target: {activePanel.name} ({activePanel.apiUrl})
          </span>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => handleRunConsoleTest('balance')}
            disabled={isExecutingConsole}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              consoleAction === 'balance'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>action: balance</span>
          </button>

          <button
            onClick={() => handleRunConsoleTest('services')}
            disabled={isExecutingConsole}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              consoleAction === 'services'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Server className="w-3 h-3" />
            <span>action: services</span>
          </button>

          <button
            onClick={() => handleRunConsoleTest('add')}
            disabled={isExecutingConsole}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              consoleAction === 'add'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>action: add</span>
          </button>

          <button
            onClick={() => handleRunConsoleTest('status')}
            disabled={isExecutingConsole}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              consoleAction === 'status'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>action: status</span>
          </button>

          <button
            onClick={() => handleRunConsoleTest('refill')}
            disabled={isExecutingConsole}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              consoleAction === 'refill'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>action: refill</span>
          </button>

          <button
            onClick={() => handleRunConsoleTest('cancel')}
            disabled={isExecutingConsole}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              consoleAction === 'cancel'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Ban className="w-3 h-3" />
            <span>action: cancel</span>
          </button>
        </div>

        {/* Parameters input for 'add' or 'status' */}
        {consoleAction === 'add' && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                service ID
              </label>
              <input
                type="text"
                value={testServiceId}
                onChange={(e) => setTestServiceId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Target Link
              </label>
              <input
                type="url"
                value={testTargetLink}
                onChange={(e) => setTestTargetLink(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                Quantity
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  value={testQuantity}
                  onChange={(e) => setTestQuantity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                />
                <button
                  onClick={() => handleRunConsoleTest('add')}
                  disabled={isExecutingConsole}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-white shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {(consoleAction === 'status' || consoleAction === 'refill' || consoleAction === 'cancel') && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center space-x-2 text-xs">
            <span className="text-[11px] text-slate-400 font-bold uppercase shrink-0">
              Order ID:
            </span>
            <input
              type="text"
              value={testOrderId}
              onChange={(e) => setTestOrderId(e.target.value)}
              placeholder="e.g. 486450"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs w-48"
            />
            <button
              onClick={() => handleRunConsoleTest(consoleAction)}
              disabled={isExecutingConsole}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-xs"
            >
              Execute {consoleAction}
            </button>
          </div>
        )}

        {/* Console Terminal Screen */}
        <pre className="p-3 rounded-xl bg-black/80 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56 whitespace-pre-wrap leading-relaxed">
          {consoleOutput}
        </pre>
      </div>

      {/* Delete Confirmation Modal */}
      {panelToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-xl">
            <h4 className="font-bold text-sm text-slate-900">Delete SMM Panel?</h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong>{panelToDelete.name}</strong> from your connected providers?
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setPanelToDelete(null)}
                className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Panel Modal */}
      {editingPanel && (
        <AddPanelModal
          isOpen={true}
          onClose={() => setEditingPanel(null)}
          editingPanel={editingPanel}
          onAddPanel={(updatedPanel) => {
            const updated = panels.map((p) => (p.id === updatedPanel.id ? updatedPanel : p));
            onUpdatePanels(updated);
            if (activePanel.id === updatedPanel.id) {
              setActivePanel(updatedPanel);
            }
            setEditingPanel(null);
          }}
        />
      )}
    </div>
  );
};
