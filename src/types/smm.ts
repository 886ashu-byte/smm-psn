export type PlatformType = 'instagram' | 'tiktok';

export type PageTier = 'chota' | 'bda';

export type DeliveryDuration = '6h' | '12h' | '24h' | '48h' | '3d' | '7d' | '14d' | 'custom';

export type CircadianRegion = 'us-east' | 'us-west' | 'uk-europe' | 'india' | 'global';

export type GrowthPresetKey = 
  | 'explore_push'
  | 'fyp_waves'
  | 'trend_rocket'
  | 'steady_climb'
  | 'evergreen'
  // Backwards compatibility aliases
  | 'organic_seed' 
  | 'steady_momentum' 
  | 'evergreen_drip' 
  | 'stealth_shield';

export type JitterIntensity = 'subtle' | 'balanced' | 'wild';

export interface AlgorithmDetectionTrigger {
  id: string;
  type: 'velocity_spike' | 'unnatural_ratio' | 'timing_anomaly' | 'duplicate_source' | 'bot_pattern';
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  details: string;
  severity: 'safe' | 'warning' | 'danger';
}

export interface EngagementRatiosSummary {
  views: number;
  likes: number;
  likesPercent: number;
  comments: number;
  commentsPercent: number;
  shares: number;
  sharesPercent: number;
  saves: number;
  savesPercent: number;
  reposts: number;
  followers: number;
  fypBoostMultiplier: number;
  detectionTriggers: AlgorithmDetectionTrigger[];
}

export interface ParentPanelConfig {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  currency: 'INR' | 'USD';
  balance: number;
  balanceCurrency: string;
  isActive: boolean;
  status: 'connected' | 'disconnected' | 'testing';
  lastSynced?: string;
  totalOrders?: number;
  servicesList?: CatalogServiceItem[];
  lastServicesFetched?: string;
}

export interface ServiceMetricRouting {
  views: { panelId: string; serviceId: number | string; serviceName?: string };
  microLikes: { panelId: string; serviceId: number | string; serviceName?: string }; // 5-9 likes
  macroLikes: { panelId: string; serviceId: number | string; serviceName?: string }; // 10+ likes
  comments: { panelId: string; serviceId: number | string; serviceName?: string };
  shares: { panelId: string; serviceId: number | string; serviceName?: string };
  saves: { panelId: string; serviceId: number | string; serviceName?: string };
  reposts?: { panelId: string; serviceId: number | string; serviceName?: string };
  followers?: { panelId: string; serviceId: number | string; serviceName?: string };
}

export interface CatalogServiceItem {
  service: number | string;
  name: string;
  category: string;
  rate: string | number;
  min: number | string;
  max: number | string;
  type?: string;
  dripfeed?: boolean;
  refill?: boolean;
  cancel?: boolean;
  status?: string;
  panelId?: string;
}

export interface HourlyChunkAllocation {
  chunkIndex: number;
  batchNumber?: number; // 1-indexed (Batch 1, Batch 2...)
  hour: number;
  timeLabel: string;
  views: number;
  likes: number;
  likeType: 'none' | 'micro' | 'macro'; // micro (5-9), macro (10+)
  comments: number;
  shares: number;
  saves: number;
  reposts?: number;
  isSeed: boolean;
  isSleepDip: boolean;
  isPeak?: boolean;
  parentSubOrderViewsId?: string;
  parentSubOrderLikesId?: string;
  humanBehaviorNote: string;
  safetyTag: 'Ultra Safe' | 'Calibrated' | 'Monitoring';
  status?: 'pending' | 'dispatched' | 'completed';
  realParentOrderId?: string | number;
  likesOrderId?: string | number;
  commentsOrderId?: string | number;
  sharesOrderId?: string | number;
  savesOrderId?: string | number;
  repostsOrderId?: string | number;
  dispatchStatus?: 'pending' | 'dispatched' | 'failed';
  dispatchError?: string;
  dispatchedAt?: string;
  scheduledTimestamp?: number;
  scheduledTimeFormatted?: string;
  unlockedEngagement?: boolean;
  cumViewsBeforeChunk?: number;
}

export type NavigationTab = 'wizard' | 'tracker' | 'matrix' | 'routing' | 'panels';

export interface SyntheticTargetTier {
  views: number;
  label: string;
  likesMin: number;
  likesMax: number;
  comments: number;
  shares: number;
  saves: number;
  reposts: number;
}

export interface SyntheticHourlyRow {
  hour: number;
  timeLabel: string;
  views: number;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  saves: number;
  cumViews: number;
  cumLikes: number;
  cumComments: number;
  cumShares: number;
  cumSaves: number;
  cumReposts: number;
  likesPct: number;
  commentsPct: number;
  sharesPct: number;
  savesPct: number;
  isViewMinCompliant: boolean;
  isLikesMinCompliant: boolean;
  isSharesMinCompliant: boolean;
  isSavesMinCompliant: boolean;
  isRepostsMinCompliant: boolean;
  note?: string;
}

export interface SyntheticMatrixResult {
  totalViews: number;
  durationHours: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  totalReposts: number;
  effectiveLikesPct: number;
  effectiveCommentsPct: number;
  effectiveSharesPct: number;
  effectiveSavesPct: number;
  effectiveRepostsPct: number;
  rows: SyntheticHourlyRow[];
  allConstraintsPassed: boolean;
}

export type AutoDispatchInterval = 'rapid_30s' | 'turbo_1m' | 'turbo_2m' | 'hourly';

export interface CampaignConfig {
  id?: string;
  platform: PlatformType;
  targetUrl: string;
  creatorHandle?: string;
  pageTier: PageTier;
  whopBountyMode: boolean;
  organicMode: boolean; // Master AI Organic Delivery Mode
  autoDispatchInterval?: AutoDispatchInterval; // 'hourly' (Standard) | 'turbo_1m' (Fast 1m) | 'turbo_2m' (Fast 2m)
  duration: DeliveryDuration;
  customDurationHours?: number;
  baseViews: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number; // or Favorites for TikTok
  reposts: number;
  followers: number;
  commentNiche: string;
  approvedComments: string[];
  region: CircadianRegion;
  growthPreset: GrowthPresetKey;
  curvePoints: { hour: number; velocity: number }[]; // 0 to 100 relative
  jitterIntensity: JitterIntensity;
  reRollAntiBotVariance: boolean;
  createdAt?: string;
}

export interface LaunchedCampaign {
  id: string;
  createdAt: string;
  platform: PlatformType;
  targetUrl: string;
  creatorHandle?: string;
  organicMode?: boolean; // AI delivery pattern active
  autoDispatchInterval?: AutoDispatchInterval;
  baseViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  totalReposts?: number;
  durationLabel: string;
  durationHours: number;
  progressPercent: number;
  status: 'running' | 'completed' | 'paused' | 'cancelled';
  dispatchedViews: number;
  dispatchedLikes: number;
  dispatchedComments: number;
  dispatchedShares: number;
  dispatchedSaves: number;
  dispatchedReposts?: number;
  chunks: HourlyChunkAllocation[];
  estimatedCompletion: string;
  routingSnapshot: ServiceMetricRouting;
  totalCost?: number;
}

export interface ForensicRiskReport {
  overallScore: number; // 0-100 (lower is safer: 0-25 Ultra Safe, 26-50 Safe, 51-75 Medium, 76-100 High)
  grade: 'ULTRA_SAFE' | 'SAFE' | 'MEDIUM_RISK' | 'HIGH_RISK';
  velocityScore: { score: number; max: number; status: 'PASS' | 'WARN' | 'FAIL'; note: string };
  sleepAdherence: { score: number; max: number; status: 'PASS' | 'WARN' | 'FAIL'; note: string };
  roundBreakScore: { score: number; max: number; status: 'PASS' | 'WARN' | 'FAIL'; note: string };
  jitterNoiseScore: { score: number; max: number; status: 'PASS' | 'WARN' | 'FAIL'; note: string };
  ratioAuthenticity: { score: number; max: number; status: 'PASS' | 'WARN' | 'FAIL'; note: string };
  geoConsistency: { score: number; max: number; status: 'PASS' | 'WARN' | 'FAIL'; note: string };
  coldStartIntegrity: { score: number; max: number; status: 'PASS' | 'WARN' | 'FAIL'; note: string };
  parentMinGuard: { score: number; max: number; status: 'PASS' | 'WARN' | 'FAIL'; note: string };
}
