import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CampaignWizard } from './components/CampaignWizard';
import { MetricServiceRouting } from './components/routing/MetricServiceRouting';
import { LivePanelManager } from './components/panel/LivePanelManager';
import { ActiveCampaignsTracker } from './components/campaigns/ActiveCampaignsTracker';
import { SyntheticMatrixLab } from './components/matrix/SyntheticMatrixLab';
import { AddPanelModal } from './components/modals/AddPanelModal';
import { PasswordGate } from './components/auth/PasswordGate';
import {
  CampaignConfig,
  HourlyChunkAllocation,
  LaunchedCampaign,
  NavigationTab,
  ParentPanelConfig,
  ServiceMetricRouting,
} from './types/smm';
import {
  DEFAULT_CAMPAIGN_CONFIG,
  DURATION_LABELS,
  GROWTH_PRESETS,
} from './utils/smmEngine';
import { OrganicModeModal } from './components/modals/OrganicModeModal';
import {
  DEFAULT_PANELS,
  INITIAL_MOCK_CAMPAIGNS,
  loadStoredCampaigns,
  loadStoredPanels,
  loadStoredRouting,
  saveStoredCampaigns,
  saveStoredPanels,
  saveStoredRouting,
  dispatchRealSubOrder,
  executePanelApiAction,
  fetchServerCampaigns,
  saveServerCampaign,
  deleteServerCampaign,
  togglePauseServerCampaign,
  triggerCronDispatchTick,
  fetchSchedulerStatus,
  updateCampaignSpeed,
} from './services/smmClient';

export default function App() {
  // Authentication State (Protected by password "ashu")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('pulseflow_auth_session') === 'authenticated';
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('wizard');
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Panels & Routing State
  const [panels, setPanels] = useState<ParentPanelConfig[]>(() => loadStoredPanels());
  const [activePanel, setActivePanel] = useState<ParentPanelConfig>(() => panels[0] || DEFAULT_PANELS[0]);
  const [serviceRouting, setServiceRouting] = useState<ServiceMetricRouting>(() => loadStoredRouting());

  // Campaigns State
  const [campaigns, setCampaigns] = useState<LaunchedCampaign[]>(() => {
    const stored = loadStoredCampaigns();
    return stored.length > 0 ? stored : INITIAL_MOCK_CAMPAIGNS;
  });

  // Wizard Configuration State
  const [campaignConfig, setCampaignConfig] = useState<CampaignConfig>(DEFAULT_CAMPAIGN_CONFIG);

  // Modals
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [isOrganicModalOpen, setIsOrganicModalOpen] = useState(false);

  // 1. Initial Load & Sync from 24/7 Server Engine
  useEffect(() => {
    fetchServerCampaigns().then((serverCamps) => {
      if (serverCamps && serverCamps.length > 0) {
        setCampaigns(serverCamps);
      } else {
        // If server is empty, seed with current campaigns so 24/7 scheduler has them
        const local = loadStoredCampaigns();
        const initial = local.length > 0 ? local : INITIAL_MOCK_CAMPAIGNS;
        initial.forEach((c) => saveServerCampaign(c));
      }
    });
  }, []);

  // 2. Poll server every 3.5 seconds to sync 24/7 background worker executions & pulse scheduled batches
  useEffect(() => {
    const interval = setInterval(() => {
      fetchServerCampaigns().then((serverCamps) => {
        if (serverCamps && serverCamps.length > 0) {
          setCampaigns(serverCamps);
        }
      });

      // Pulse background tick if any campaigns are actively running
      const hasRunning = campaigns.some((c) => c.status === 'running');
      if (hasRunning) {
        triggerCronDispatchTick().catch((e) => console.warn('Pacing tick pulse note:', e));
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [campaigns]);

  // Sync to local storage
  useEffect(() => {
    saveStoredPanels(panels);
  }, [panels]);

  useEffect(() => {
    saveStoredRouting(serviceRouting);
  }, [serviceRouting]);

  useEffect(() => {
    saveStoredCampaigns(campaigns);
  }, [campaigns]);

  // Update Config helper
  const updateCampaignConfig = (partial: Partial<CampaignConfig>) => {
    setCampaignConfig((prev) => ({ ...prev, ...partial }));
  };

  // Update Service Routing helper
  const updateServiceRoutingPartial = (partial: Partial<ServiceMetricRouting>) => {
    setServiceRouting((prev) => ({ ...prev, ...partial }));
  };

  // Adjust schedule speed dynamically (e.g. 30s Rapid, 1m Turbo, Hourly)
  const handleUpdateCampaignSpeed = async (
    campaignId: string,
    interval: 'hourly' | 'turbo_1m' | 'turbo_2m' | 'rapid_30s'
  ) => {
    const res = await updateCampaignSpeed(campaignId, interval);
    if (res.success && res.campaign) {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? res.campaign! : c))
      );
    }
  };

  // Launch Campaign: Save to Local and Persist to 24/7 Server Autonomous Engine to automatically send per schedule
  const handleLaunchCampaign = async (allocations: HourlyChunkAllocation[]) => {
    const campaignId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCampaign: LaunchedCampaign = {
      id: campaignId,
      platform: campaignConfig.platform,
      targetUrl: campaignConfig.targetUrl || 'https://instagram.com/reel/C8kP9a-xL21/',
      creatorHandle: campaignConfig.creatorHandle,
      organicMode: campaignConfig.organicMode !== false,
      autoDispatchInterval: campaignConfig.autoDispatchInterval || 'rapid_30s',
      baseViews: campaignConfig.baseViews,
      totalLikes: campaignConfig.likes,
      totalComments: campaignConfig.comments,
      totalShares: campaignConfig.shares,
      totalSaves: campaignConfig.saves,
      totalReposts: campaignConfig.reposts || 0,
      dispatchedViews: 0,
      dispatchedLikes: 0,
      dispatchedComments: 0,
      dispatchedShares: 0,
      dispatchedSaves: 0,
      dispatchedReposts: 0,
      durationLabel: DURATION_LABELS[campaignConfig.duration],
      durationHours: campaignConfig.customDurationHours || 24,
      progressPercent: 0,
      status: 'running',
      chunks: allocations,
      createdAt: new Date().toISOString(),
      estimatedCompletion: campaignConfig.autoDispatchInterval === 'rapid_30s'
        ? `~${Math.round(allocations.length * 0.5)} mins (Rapid Auto)`
        : campaignConfig.autoDispatchInterval === 'turbo_1m'
        ? `~${allocations.length} mins (Turbo Auto)`
        : campaignConfig.autoDispatchInterval === 'turbo_2m'
        ? `~${allocations.length * 2} mins`
        : DURATION_LABELS[campaignConfig.duration],
      routingSnapshot: serviceRouting,
    };

    // 1. Immediately update local state & route to tracker
    setCampaigns((prev) => [newCampaign, ...prev]);
    setActiveTab('tracker');

    // 2. Persist to 24/7 Server Autonomous Scheduler
    await saveServerCampaign(newCampaign);

    // 3. Immediately trigger autonomous cron dispatch tick so Batch #1 seed views starts sending right now!
    await triggerCronDispatchTick();

    // 4. Fetch updated campaigns with Batch #1 dispatched and active schedule running
    const serverCamps = await fetchServerCampaigns();
    if (serverCamps && serverCamps.length > 0) {
      setCampaigns(serverCamps);
    }
  };

  // Dispatch individual sub-chunk on demand (with JAP Micro Likes 1778 support)
  const handleDispatchSubChunk = async (
    campaignId: string,
    chunkIndex: number
  ): Promise<{ success: boolean; orderId?: any; error?: string; rawOutput?: string }> => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return { success: false, error: 'Campaign not found' };

    const chunk = camp.chunks[chunkIndex];
    if (!chunk) return { success: false, error: 'Chunk not found' };

    // 1. Dispatch Views via SMMVault (Service 11465)
    const targetServiceId = camp.routingSnapshot?.views?.serviceId || serviceRouting.views?.serviceId || '11465';
    const panelId = camp.routingSnapshot?.views?.panelId || serviceRouting.views?.panelId || 'smmvault';
    const panel = panels.find((p) => p.id === panelId) || panels.find((p) => p.id === 'smmvault') || activePanel;

    const res = await dispatchRealSubOrder(
      panel,
      targetServiceId,
      camp.targetUrl,
      Math.max(10, chunk.views)
    );

    // 2. Dispatch Engagement if unlocked (c >= 2)
    let likesOrderId: any = undefined;
    let savesOrderId: any = undefined;
    let repostsOrderId: any = undefined;
    let sharesOrderId: any = undefined;

    const reliablePanel = panels.find((p) => p.id === 'reliablesmm') || {
      id: 'reliablesmm',
      name: 'ReliableSMM',
      apiUrl: 'https://reliablesmm.com/api/v2',
      apiKey: '450f7d97e499c77c7c9eccec9c27dcb3',
      currency: 'USD' as const,
      balance: 100.84,
      balanceCurrency: 'USD',
      isActive: true,
      status: 'connected' as const,
    };

    if (chunkIndex >= 2) {
      // 2a. Likes
      if (chunk.likes >= 5) {
        if (chunk.likes <= 9) {
          // Micro Likes: Dispatch to Just Another Panel (JAP) Service 1778
          const japPanel = panels.find((p) => p.id === 'jap') || {
            id: 'jap',
            name: 'Just Another Panel (JAP)',
            apiUrl: 'https://justanotherpanel.com/api/v2',
            apiKey: '11f7c9042fc3cff432cb240ff7929125',
            currency: 'USD' as const,
            balance: 5.43,
            balanceCurrency: '₹',
            isActive: true,
            status: 'connected' as const,
          };
          const japRes = await dispatchRealSubOrder(
            japPanel,
            '1778',
            camp.targetUrl,
            chunk.likes
          );
          if (japRes.success && japRes.orderId) {
            likesOrderId = japRes.orderId;
          }
        } else {
          // Macro Likes: ReliableSMM Service 7147 (10+ likes)
          const macroServiceId = camp.routingSnapshot?.macroLikes?.serviceId || serviceRouting.macroLikes?.serviceId || '7147';
          const macroRes = await dispatchRealSubOrder(
            reliablePanel,
            macroServiceId,
            camp.targetUrl,
            chunk.likes
          );
          if (macroRes.success && macroRes.orderId) {
            likesOrderId = macroRes.orderId;
          }
        }
      }

      // 2b. Saves: ReliableSMM Service 7841 (starts from 1)
      if (chunk.saves >= 1) {
        const savesServiceId = camp.routingSnapshot?.saves?.serviceId || serviceRouting.saves?.serviceId || '7841';
        const savesRes = await dispatchRealSubOrder(
          reliablePanel,
          savesServiceId,
          camp.targetUrl,
          chunk.saves
        );
        if (savesRes.success && savesRes.orderId) {
          savesOrderId = savesRes.orderId;
        }
      }

      // 2c. Reposts: ReliableSMM Service 7842 (starts from 1)
      if ((chunk.reposts || 0) >= 1) {
        const repostsServiceId = camp.routingSnapshot?.reposts?.serviceId || serviceRouting.reposts?.serviceId || '7842';
        const repostsRes = await dispatchRealSubOrder(
          reliablePanel,
          repostsServiceId,
          camp.targetUrl,
          chunk.reposts!
        );
        if (repostsRes.success && repostsRes.orderId) {
          repostsOrderId = repostsRes.orderId;
        }
      }

      // 2d. Shares: ReliableSMM Service 2060 (starts from 10)
      if (chunk.shares >= 10) {
        const sharesServiceId = camp.routingSnapshot?.shares?.serviceId || serviceRouting.shares?.serviceId || '2060';
        const sharesRes = await dispatchRealSubOrder(
          reliablePanel,
          sharesServiceId,
          camp.targetUrl,
          chunk.shares
        );
        if (sharesRes.success && sharesRes.orderId) {
          sharesOrderId = sharesRes.orderId;
        }
      }
    }

    if (res.success && res.orderId) {
      const updatedCampaign = {
        ...camp,
        chunks: camp.chunks.map((chk, idx) =>
          idx === chunkIndex
            ? {
                ...chk,
                realParentOrderId: res.orderId,
                likesOrderId,
                savesOrderId,
                repostsOrderId,
                sharesOrderId,
                dispatchStatus: 'dispatched' as const,
                status: 'dispatched' as const,
                dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : chk
        ),
        dispatchedViews: camp.dispatchedViews + (chunk.realParentOrderId ? 0 : chunk.views),
        dispatchedLikes: camp.dispatchedLikes + (chunk.likesOrderId ? 0 : chunk.likes),
        dispatchedSaves: (camp.dispatchedSaves || 0) + (chunk.savesOrderId ? 0 : chunk.saves),
        dispatchedShares: (camp.dispatchedShares || 0) + (chunk.sharesOrderId ? 0 : chunk.shares),
        dispatchedReposts: (camp.dispatchedReposts || 0) + (chunk.repostsOrderId ? 0 : (chunk.reposts || 0)),
      };

      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? updatedCampaign : c))
      );
      saveServerCampaign(updatedCampaign);

      return { success: true, orderId: res.orderId, rawOutput: res.rawOutput };
    }

    return { success: false, error: res.error, rawOutput: res.rawOutput };
  };

  // Check sub-chunk order status on parent panel API
  const handleCheckSubChunkStatus = async (
    campaignId: string,
    chunkIndex: number
  ): Promise<{ success: boolean; data?: any; error?: string; rawOutput?: string }> => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return { success: false, error: 'Campaign not found' };

    const chunk = camp.chunks[chunkIndex];
    if (!chunk || !chunk.realParentOrderId) return { success: false, error: 'No order ID recorded on this chunk' };

    const panelId = camp.routingSnapshot?.views?.panelId || serviceRouting.views?.panelId || activePanel.id;
    const panel = panels.find((p) => p.id === panelId) || activePanel;

    const res = await executePanelApiAction(panel, 'status', { order: chunk.realParentOrderId });
    return res;
  };

  // Clear all campaigns
  const handleClearAllCampaigns = () => {
    campaigns.forEach((c) => deleteServerCampaign(c.id));
    setCampaigns([]);
    localStorage.removeItem('pulseflow_campaigns');
  };

  // Load demo campaigns preview
  const handleLoadDemoCampaigns = () => {
    setCampaigns(INITIAL_MOCK_CAMPAIGNS);
    saveStoredCampaigns(INITIAL_MOCK_CAMPAIGNS);
    INITIAL_MOCK_CAMPAIGNS.forEach((c) => saveServerCampaign(c));
  };

  // Campaign Pause / Resume
  const handleTogglePause = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'running' ? 'paused' : 'running' }
          : c
      )
    );
    togglePauseServerCampaign(id);
  };

  // Campaign Cancel
  const handleCancelCampaign = (id: string) => {
    deleteServerCampaign(id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  // Assign service ID directly from catalog to routing
  const handleAssignServiceId = (
    metricKey: keyof ServiceMetricRouting,
    serviceId: string,
    serviceName: string
  ) => {
    setServiceRouting((prev) => ({
      ...prev,
      [metricKey]: {
        panelId: activePanel.id,
        serviceId,
        serviceName,
      },
    }));
    setActiveTab('routing');
  };

  // Add new Panel
  const handleAddPanel = (newPanel: ParentPanelConfig) => {
    setPanels((prev) => [...prev, newPanel]);
    setActivePanel(newPanel);
  };

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-row">
      {/* Sidebar Navigation (Desktop Fixed + Mobile Off-Canvas Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentStep={wizardStep}
        connectedPanelsCount={panels.length}
        activeCampaignsCount={campaigns.filter((c) => c.status === 'running').length}
        organicMode={campaignConfig.organicMode !== false}
        onToggleOrganicMode={(enabled) => updateCampaignConfig({ organicMode: enabled })}
        onOpenOrganicModeModal={() => setIsOrganicModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => {
          localStorage.removeItem('pulseflow_auth_session');
          setIsAuthenticated(false);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header with Breadcrumbs, Organic Mode Pill & Panel Status */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentStep={wizardStep}
          connectedPanelsCount={panels.length}
          activeCampaignsCount={campaigns.filter((c) => c.status === 'running').length}
          organicMode={campaignConfig.organicMode !== false}
          onOpenOrganicModeModal={() => setIsOrganicModalOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 py-3.5 sm:py-5 md:py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,20px))] lg:pb-8 touch-scroll">
        {activeTab === 'wizard' && (
          <CampaignWizard
            currentStep={wizardStep}
            setCurrentStep={setWizardStep}
            config={campaignConfig}
            updateConfig={updateCampaignConfig}
            serviceRouting={serviceRouting}
            updateServiceRouting={updateServiceRoutingPartial}
            onNavigateToRouting={() => setActiveTab('routing')}
            onLaunchCampaign={handleLaunchCampaign}
            onOpenOrganicModeModal={() => setIsOrganicModalOpen(true)}
          />
        )}

        {activeTab === 'tracker' && (
          <ActiveCampaignsTracker
            campaigns={campaigns}
            onRefreshStatuses={() => {
              triggerCronDispatchTick().then(() => {
                fetchServerCampaigns().then((serverCamps) => {
                  if (serverCamps && serverCamps.length > 0) {
                    setCampaigns(serverCamps);
                  }
                });
              });
            }}
            onNavigateToWizard={() => {
              setActiveTab('wizard');
              setWizardStep(1);
            }}
            onTogglePauseCampaign={handleTogglePause}
            onCancelCampaign={handleCancelCampaign}
            onClearAllCampaigns={handleClearAllCampaigns}
            onLoadDemoCampaigns={handleLoadDemoCampaigns}
            onDispatchSubChunk={handleDispatchSubChunk}
            onCheckSubChunkStatus={handleCheckSubChunkStatus}
            onUpdateCampaignSpeed={handleUpdateCampaignSpeed}
          />
        )}

        {activeTab === 'matrix' && (
          <SyntheticMatrixLab
            onApplyToWizard={(partial) => {
              updateCampaignConfig(partial);
            }}
            onNavigateToWizard={() => {
              setActiveTab('wizard');
              setWizardStep(2);
            }}
            onOpenOrganicModal={() => setIsOrganicModalOpen(true)}
          />
        )}

        {activeTab === 'routing' && (
          <MetricServiceRouting
            panels={panels}
            routing={serviceRouting}
            updateRouting={(newR) => setServiceRouting(newR)}
            onNavigateToPanels={() => setActiveTab('panels')}
            onOpenAddPanelModal={() => setIsAddPanelOpen(true)}
          />
        )}

        {activeTab === 'panels' && (
          <LivePanelManager
            panels={panels}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            onUpdatePanels={setPanels}
            serviceRouting={serviceRouting}
            onAssignServiceId={handleAssignServiceId}
            onOpenAddPanelModal={() => setIsAddPanelOpen(true)}
          />
        )}
      </main>

      {/* Add Panel Modal */}
      <AddPanelModal
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
        onAddPanel={handleAddPanel}
      />

      {/* Organic Mode Explainer & Settings Modal */}
      <OrganicModeModal
        isOpen={isOrganicModalOpen}
        onClose={() => setIsOrganicModalOpen(false)}
        organicMode={campaignConfig.organicMode !== false}
        onToggleOrganicMode={(enabled) => updateCampaignConfig({ organicMode: enabled })}
        activePresetKey={campaignConfig.growthPreset}
        onSelectPreset={(p) => {
          const presetObj = GROWTH_PRESETS.find((x) => x.id === p);
          updateCampaignConfig({
            growthPreset: p,
            curvePoints: presetObj ? [...presetObj.points] : campaignConfig.curvePoints,
          });
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 mb-16 md:mb-0 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">PulseFlow SMM Engine</span>
            <span>•</span>
            <span>Precision Multi-Provider Gateway & Anti-Detection Pacer</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>Parent SMM Min: ≥100 views & ≥5 likes</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">Circadian Drip-Feed Anti-Detection</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
