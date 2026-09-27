import {
  CatalogServiceItem,
  LaunchedCampaign,
  ParentPanelConfig,
  ServiceMetricRouting,
} from '../types/smm';

export const DEFAULT_PANELS: ParentPanelConfig[] = [
  {
    id: 'smmvault',
    name: 'SMMVault',
    apiUrl: 'https://smmvault.in/api/v2',
    apiKey: 'dd65c10f356fc57332767b69715ea6c5e8169ef0',
    currency: 'INR',
    balance: 1254.61,
    balanceCurrency: 'INR',
    isActive: true,
    status: 'connected',
    lastSynced: 'Just now',
    totalOrders: 630,
  },
  {
    id: 'jap',
    name: 'Just Another Panel (JAP)',
    apiUrl: 'https://justanotherpanel.com/api/v2',
    apiKey: '11f7c9042fc3cff432cb240ff7929125',
    currency: 'USD',
    balance: 5.43,
    balanceCurrency: '₹',
    isActive: true,
    status: 'connected',
    lastSynced: 'Just now',
    totalOrders: 634,
  },
  {
    id: 'reliablesmm',
    name: 'ReliableSMM',
    apiUrl: 'https://reliablesmm.com/api/v2',
    apiKey: '450f7d97e499c77c7c9eccec9c27dcb3',
    currency: 'USD',
    balance: 100.84,
    balanceCurrency: 'USD',
    isActive: true,
    status: 'connected',
    lastSynced: 'Just now',
    totalOrders: 489,
  },
];

export const DEFAULT_SERVICE_ROUTING: ServiceMetricRouting = {
  views: {
    panelId: 'smmvault',
    serviceId: '11465',
    serviceName: 'Instagram Reel / Video Views [SMMVault • Service 11465]',
  },
  microLikes: {
    panelId: 'jap',
    serviceId: '1778',
    serviceName: 'Micro Likes (5-9) [Just Another Panel • Service 1778]',
  },
  macroLikes: {
    panelId: 'reliablesmm',
    serviceId: '7147',
    serviceName: 'Instagram Likes (Macro 10+) [ReliableSMM • Service 7147]',
  },
  comments: {
    panelId: 'smmvault',
    serviceId: '6477',
    serviceName: 'Instagram Contextual Custom Comments [AI Human]',
  },
  shares: {
    panelId: 'reliablesmm',
    serviceId: '2060',
    serviceName: 'Instagram Share (Min 10) [ReliableSMM • Service 2060]',
  },
  saves: {
    panelId: 'reliablesmm',
    serviceId: '7841',
    serviceName: 'Instagram Saves (Min 1) [ReliableSMM • Service 7841]',
  },
  reposts: {
    panelId: 'reliablesmm',
    serviceId: '7842',
    serviceName: 'Instagram Reposts (Min 1) [ReliableSMM • Service 7842]',
  },
};

// Curated live catalog services simulating SMM provider catalogs
export const MOCK_CATALOG_SERVICES: CatalogServiceItem[] = [
  {
    service: 11465,
    name: 'Instagram Reel / Video Views [High Speed • Instant]',
    category: 'Instagram Views',
    rate: '2.50',
    min: 10,
    max: 1000000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'smmvault',
  },
  {
    service: 1778,
    name: 'Instagram Likes [Micro Batch 5-9 • JAP Service 1778]',
    category: 'Instagram Likes',
    rate: '0.90',
    min: 5,
    max: 10000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'jap',
    type: 'Default',
  },
  {
    service: 7147,
    name: 'Instagram Likes [Macro Batch 10+ • ReliableSMM Service 7147]',
    category: 'Instagram Likes',
    rate: '22.00',
    min: 10,
    max: 100000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'reliablesmm',
  },
  {
    service: 7841,
    name: 'Instagram Saves [Starts from 1 • ReliableSMM Service 7841]',
    category: 'Instagram Saves',
    rate: '8.50',
    min: 1,
    max: 50000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'reliablesmm',
  },
  {
    service: 7842,
    name: 'Instagram Reposts [Starts from 1 • ReliableSMM Service 7842]',
    category: 'Instagram Reposts',
    rate: '12.00',
    min: 1,
    max: 25000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'reliablesmm',
  },
  {
    service: 2060,
    name: 'Instagram Share [Starts from 10 • ReliableSMM Service 2060]',
    category: 'Instagram Shares',
    rate: '14.00',
    min: 10,
    max: 50000,
    dripfeed: true,
    refill: false,
    cancel: false,
    status: 'Active Running',
    panelId: 'reliablesmm',
  },
  {
    service: 104,
    name: 'Instagram Contextual Custom Comments [AI Human]',
    category: 'Instagram Comments',
    rate: '350.00',
    min: 5,
    max: 2000,
    dripfeed: false,
    refill: true,
    cancel: false,
    status: 'Active Running',
    panelId: 'smmvault',
  },
  {
    service: 105,
    name: 'Instagram Viral Shares & DM Sends',
    category: 'Instagram Shares',
    rate: '42.00',
    min: 10,
    max: 50000,
    dripfeed: true,
    refill: false,
    cancel: false,
    status: 'Active Running',
    panelId: 'smmvault',
  },
  {
    service: 106,
    name: 'Instagram Saves & Retention Bookmarks',
    category: 'Instagram Saves',
    rate: '22.00',
    min: 10,
    max: 100000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'smmvault',
  },
  {
    service: 201,
    name: 'TikTok Video Views [FYP Algorithm Seed]',
    category: 'TikTok Views',
    rate: '3.10',
    min: 100,
    max: 2000000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'smmvault',
  },
  {
    service: 202,
    name: 'TikTok Likes [Organic Speed • High Retention]',
    category: 'TikTok Likes',
    rate: '28.00',
    min: 5,
    max: 50000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'smmvault',
  },
  {
    service: 203,
    name: 'TikTok Shares [Direct Link & WhatsApp Repost]',
    category: 'TikTok Shares',
    rate: '38.00',
    min: 10,
    max: 25000,
    dripfeed: true,
    refill: true,
    cancel: false,
    status: 'Active Running',
    panelId: 'smmvault',
  },
  {
    service: 204,
    name: 'TikTok Favorites / Bookmarks [Algorithm Booster]',
    category: 'TikTok Favorites',
    rate: '32.00',
    min: 10,
    max: 50000,
    dripfeed: true,
    refill: true,
    cancel: true,
    status: 'Active Running',
    panelId: 'smmvault',
  },
];

const LOCAL_STORAGE_KEY_PANELS = 'pulseflow_smm_panels';
const LOCAL_STORAGE_KEY_ROUTING = 'pulseflow_service_routing';

export function loadSavedPanels(): ParentPanelConfig[] {
  return loadStoredPanels();
}

export function savePanels(panels: ParentPanelConfig[]): void {
  saveStoredPanels(panels);
}

export function loadSavedRouting(): ServiceMetricRouting {
  return loadStoredRouting();
}

export function saveRouting(routing: ServiceMetricRouting): void {
  saveStoredRouting(routing);
}

// Parent Panel API Client with Real SMM v2 Compliance
export async function executePanelApiAction(
  panel: ParentPanelConfig,
  action: 'balance' | 'services' | 'add' | 'status' | 'refill' | 'cancel',
  params: Record<string, any> = {}
): Promise<{ success: boolean; data: any; rawOutput: string; error?: string }> {
  try {
    const response = await fetch('/api/smm/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiUrl: panel.apiUrl,
        apiKey: panel.apiKey,
        action,
        ...params,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // Check if parent API returned an error object
      if (data && data.error) {
        return {
          success: false,
          data,
          error: typeof data.error === 'string' ? data.error : JSON.stringify(data.error),
          rawOutput: `POST ${panel.apiUrl} [REJECTED BY PARENT PANEL]\nAction: ${action}\nAPI Key: ${panel.apiKey.slice(0, 4)}****\n\nParent API Error:\n${JSON.stringify(data, null, 2)}`,
        };
      }

      return {
        success: true,
        data,
        rawOutput: `POST ${panel.apiUrl} [200 OK]\nAction: ${action}\nParameters: ${JSON.stringify(params)}\n\nParent API Response:\n${JSON.stringify(data, null, 2)}`,
      };
    } else {
      const errData = await response.json().catch(() => ({ error: `HTTP ${response.status} ${response.statusText}` }));
      return {
        success: false,
        data: errData,
        error: errData.error || `HTTP ${response.status}`,
        rawOutput: `POST ${panel.apiUrl} [HTTP ${response.status}]\nError:\n${JSON.stringify(errData, null, 2)}`,
      };
    }
  } catch (err: any) {
    console.error('SMM API Proxy Error:', err);
    return {
      success: false,
      data: { error: err?.message || 'Network connection failed' },
      error: err?.message || 'Network connection failed',
      rawOutput: `POST ${panel.apiUrl} [NETWORK EXCEPTION]\nCould not contact parent panel server.\nReason: ${err?.message || 'Connection error'}`,
    };
  }
}

// Real Sub-Order Placement Helper
export async function dispatchRealSubOrder(
  panel: ParentPanelConfig,
  serviceId: string | number,
  link: string,
  quantity: number,
  extraParams: Record<string, any> = {}
): Promise<{ success: boolean; orderId?: number | string; error?: string; rawOutput: string; data?: any }> {
  const result = await executePanelApiAction(panel, 'add', {
    service: serviceId,
    link,
    quantity,
    ...extraParams,
  });

  if (result.success && result.data && (result.data.order || result.data.order_id)) {
    const orderId = result.data.order || result.data.order_id;
    return {
      success: true,
      orderId,
      rawOutput: result.rawOutput,
      data: result.data,
    };
  }

  return {
    success: false,
    error: result.error || (result.data?.error ? result.data.error : 'Failed to dispatch order to parent panel'),
    rawOutput: result.rawOutput,
    data: result.data,
  };
}

export const INITIAL_MOCK_CAMPAIGNS: LaunchedCampaign[] = [
  {
    id: 'CMP-9821',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    platform: 'instagram',
    targetUrl: 'https://instagram.com/reel/C8kP9a-xL21/',
    creatorHandle: 'alex.creator',
    baseViews: 5000,
    totalLikes: 124,
    totalComments: 32,
    totalShares: 52,
    totalSaves: 78,
    durationLabel: '24 Hours (Standard)',
    durationHours: 24,
    progressPercent: 62,
    status: 'running',
    dispatchedViews: 3100,
    dispatchedLikes: 78,
    dispatchedComments: 18,
    dispatchedShares: 32,
    dispatchedSaves: 48,
    chunks: [
      {
        chunkIndex: 0,
        hour: 0,
        timeLabel: 'H0 – H1',
        views: 108,
        likes: 0,
        likeType: 'none',
        comments: 1,
        shares: 1,
        saves: 2,
        isSleepDip: true,
        isSeed: true,
        humanBehaviorNote: 'organic seed test',
        safetyTag: 'Ultra Safe',
        parentSubOrderViewsId: 'SUB-9821-0',
      },
      {
        chunkIndex: 1,
        hour: 1,
        timeLabel: 'H1 – H2',
        views: 128,
        likes: 0,
        likeType: 'none',
        comments: 1,
        shares: 1,
        saves: 2,
        isSleepDip: true,
        isSeed: false,
        humanBehaviorNote: 'natural nocturnal dip',
        safetyTag: 'Ultra Safe',
        parentSubOrderViewsId: 'SUB-9821-1',
      },
      {
        chunkIndex: 2,
        hour: 2,
        timeLabel: 'H2 – H3',
        views: 133,
        likes: 5,
        likeType: 'micro',
        comments: 1,
        shares: 1,
        saves: 2,
        isSleepDip: true,
        isSeed: false,
        humanBehaviorNote: 'natural nocturnal dip',
        safetyTag: 'Ultra Safe',
        parentSubOrderViewsId: 'SUB-9821-2',
      },
      {
        chunkIndex: 3,
        hour: 3,
        timeLabel: 'H3 – H4',
        views: 140,
        likes: 0,
        likeType: 'none',
        comments: 1,
        shares: 1,
        saves: 2,
        isSleepDip: true,
        isSeed: false,
        humanBehaviorNote: 'natural nocturnal dip',
        safetyTag: 'Ultra Safe',
        parentSubOrderViewsId: 'SUB-9821-3',
      },
      {
        chunkIndex: 4,
        hour: 4,
        timeLabel: 'H4 – H5',
        views: 116,
        likes: 5,
        likeType: 'micro',
        comments: 1,
        shares: 1,
        saves: 2,
        isSleepDip: true,
        isSeed: false,
        humanBehaviorNote: 'natural nocturnal dip',
        safetyTag: 'Ultra Safe',
        parentSubOrderViewsId: 'SUB-9821-4',
      },
    ],
    estimatedCompletion: 'In ~9 Hours',
    routingSnapshot: DEFAULT_SERVICE_ROUTING,
    totalCost: 35.5,
  },
  {
    id: 'CMP-9740',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    platform: 'tiktok',
    targetUrl: 'https://tiktok.com/@growthpulse/video/7391823901923',
    creatorHandle: 'growthpulse',
    baseViews: 10000,
    totalLikes: 250,
    totalComments: 60,
    totalShares: 110,
    totalSaves: 160,
    durationLabel: '48 Hours (Extended)',
    durationHours: 48,
    progressPercent: 38,
    status: 'running',
    dispatchedViews: 3800,
    dispatchedLikes: 95,
    dispatchedComments: 22,
    dispatchedShares: 41,
    dispatchedSaves: 60,
    chunks: [],
    estimatedCompletion: 'In ~30 Hours',
    routingSnapshot: DEFAULT_SERVICE_ROUTING,
    totalCost: 75.0,
  },
];

// LocalStorage helpers
// LocalStorage helpers with automatic credentials migration
export function loadStoredPanels(): ParentPanelConfig[] {
  try {
    const raw = localStorage.getItem('pulseflow_smm_panels');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let japFound = false;
        let smmvaultFound = false;
        let reliableFound = false;

        const migrated = parsed.map((p: ParentPanelConfig) => {
          if (p.id === 'jap') {
            japFound = true;
            return {
              ...p,
              name: 'Just Another Panel (JAP)',
              apiUrl: 'https://justanotherpanel.com/api/v2',
              apiKey: '11f7c9042fc3cff432cb240ff7929125',
              isActive: true,
              status: 'connected' as const,
              totalOrders: p.totalOrders || 634,
              balance: p.balance || 5.43,
              balanceCurrency: p.balanceCurrency || '₹',
            };
          }
          if (p.id === 'smmvault') {
            smmvaultFound = true;
            return {
              ...p,
              name: 'SMMVault',
              apiUrl: 'https://smmvault.in/api/v2',
              apiKey: 'dd65c10f356fc57332767b69715ea6c5e8169ef0',
              isActive: true,
              status: 'connected' as const,
            };
          }
          if (p.id === 'reliablesmm') {
            reliableFound = true;
            return {
              ...p,
              name: 'ReliableSMM',
              apiUrl: 'https://reliablesmm.com/api/v2',
              apiKey: '450f7d97e499c77c7c9eccec9c27dcb3',
              isActive: true,
              status: 'connected' as const,
              currency: 'USD' as const,
            };
          }
          return p;
        });

        if (!japFound) migrated.push(DEFAULT_PANELS[1]);
        if (!smmvaultFound) migrated.push(DEFAULT_PANELS[0]);
        if (!reliableFound) migrated.push(DEFAULT_PANELS[2]);
        return migrated;
      }
    }
  } catch (e) {
    console.warn('Error loading stored panels', e);
  }
  return DEFAULT_PANELS;
}

export function saveStoredPanels(panels: ParentPanelConfig[]) {
  try {
    localStorage.setItem('pulseflow_smm_panels', JSON.stringify(panels));
  } catch (e) {
    console.warn('Error saving panels', e);
  }
}

export function loadStoredRouting(): ServiceMetricRouting {
  try {
    const raw = localStorage.getItem('pulseflow_service_routing');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        // Enforce user's configuration for micro likes on JAP with service 1778
        if (!parsed.microLikes || parsed.microLikes.serviceId !== '1778' || parsed.microLikes.panelId !== 'jap') {
          parsed.microLikes = DEFAULT_SERVICE_ROUTING.microLikes;
        }
        // Enforce SMMVault for views with service 11465
        if (!parsed.views || parsed.views.serviceId !== '11465' || parsed.views.panelId !== 'smmvault') {
          parsed.views = DEFAULT_SERVICE_ROUTING.views;
        }
        // Enforce ReliableSMM for macro likes with service 7147
        if (!parsed.macroLikes || parsed.macroLikes.serviceId !== '7147' || parsed.macroLikes.panelId !== 'reliablesmm') {
          parsed.macroLikes = DEFAULT_SERVICE_ROUTING.macroLikes;
        }
        // Enforce ReliableSMM for saves with service 7841
        if (!parsed.saves || parsed.saves.serviceId !== '7841' || parsed.saves.panelId !== 'reliablesmm') {
          parsed.saves = DEFAULT_SERVICE_ROUTING.saves;
        }
        // Enforce ReliableSMM for reposts with service 7842
        if (!parsed.reposts || parsed.reposts.serviceId !== '7842' || parsed.reposts.panelId !== 'reliablesmm') {
          parsed.reposts = DEFAULT_SERVICE_ROUTING.reposts;
        }
        // Enforce ReliableSMM for shares with service 2060
        if (!parsed.shares || parsed.shares.serviceId !== '2060' || parsed.shares.panelId !== 'reliablesmm') {
          parsed.shares = DEFAULT_SERVICE_ROUTING.shares;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading routing', e);
  }
  return DEFAULT_SERVICE_ROUTING;
}

export function saveStoredRouting(routing: ServiceMetricRouting) {
  try {
    localStorage.setItem('pulseflow_service_routing', JSON.stringify(routing));
  } catch (e) {
    console.warn('Error saving routing', e);
  }
}

export function loadStoredCampaigns(): LaunchedCampaign[] {
  try {
    const raw = localStorage.getItem('pulseflow_campaigns');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error loading campaigns', e);
  }
  return [];
}

export function saveStoredCampaigns(campaigns: LaunchedCampaign[]) {
  try {
    localStorage.setItem('pulseflow_campaigns', JSON.stringify(campaigns));
  } catch (e) {
    console.warn('Error saving campaigns', e);
  }
}

// 24/7 Server-Side Autonomous Scheduler API Helpers
export async function fetchServerCampaigns(): Promise<LaunchedCampaign[] | null> {
  try {
    const res = await fetch('/api/campaigns');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.campaigns)) {
        return data.campaigns;
      }
    }
  } catch (e) {
    console.warn('Server campaigns fetch error:', e);
  }
  return null;
}

export async function saveServerCampaign(campaign: LaunchedCampaign): Promise<boolean> {
  try {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaign }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Server campaign save error:', e);
    return false;
  }
}

export async function deleteServerCampaign(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/campaigns/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    console.warn('Server campaign delete error:', e);
    return false;
  }
}

export async function togglePauseServerCampaign(id: string): Promise<{ success: boolean; status?: string }> {
  try {
    const res = await fetch(`/api/campaigns/${id}/toggle-pause`, {
      method: 'POST',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Server campaign pause error:', e);
  }
  return { success: false };
}

export async function triggerCronDispatchTick(): Promise<{
  success: boolean;
  message?: string;
  dispatchedCount?: number;
  results?: any[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/cron/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Network error triggering cron' };
  }
}

export async function fetchSchedulerStatus(): Promise<{
  active: boolean;
  runningCampaignsCount: number;
  totalCampaignsCount: number;
  nextScheduledChunk?: {
    campaignId: string;
    targetUrl: string;
    chunkIndex: number;
    scheduledAt: string;
    minutesUntil: number;
    views: number;
    likes: number;
  } | null;
  lastTickAt?: string;
  uptime?: number;
  executionLogs?: any[];
} | null> {
  try {
    const res = await fetch('/api/scheduler/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Fetch scheduler status error:', e);
  }
  return null;
}

export async function updateCampaignSpeed(
  id: string,
  interval: 'hourly' | 'turbo_1m' | 'turbo_2m' | 'rapid_30s'
): Promise<{ success: boolean; campaign?: LaunchedCampaign }> {
  try {
    const res = await fetch(`/api/campaigns/${id}/speed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interval }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Update campaign speed error:', e);
  }
  return { success: false };
}

export async function dispatchNextDueChunk(
  id: string
): Promise<{ success: boolean; campaign?: LaunchedCampaign; message?: string }> {
  try {
    const res = await fetch(`/api/campaigns/${id}/dispatch-next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Dispatch next due chunk error:', e);
  }
  return { success: false };
}


