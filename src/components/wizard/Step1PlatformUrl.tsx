import React, { useState } from 'react';
import {
  Instagram,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import { CampaignConfig, PlatformType } from '../../types/smm';

interface Step1PlatformUrlProps {
  config: CampaignConfig;
  updateConfig: (partial: Partial<CampaignConfig>) => void;
  onNext: () => void;
}

export const Step1PlatformUrl: React.FC<Step1PlatformUrlProps> = ({
  config,
  updateConfig,
  onNext,
}) => {
  const [urlError, setUrlError] = useState<string | null>(null);

  // Validate URL matching Instagram or TikTok
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('Target URL is required. Please paste your video or reel link.');
      return false;
    }

    if (config.platform === 'instagram') {
      const igRegex = /(instagram\.com\/(p|reel|tv)\/|instagram\.com\/[a-zA-Z0-9._]+\/(p|reel)\/)/i;
      const genericIg = /instagram\.com/i;
      if (!genericIg.test(url)) {
        setUrlError('Please enter a valid Instagram post or reel link.');
        return false;
      }
    } else {
      const ttRegex = /(tiktok\.com\/@|tiktok\.com\/t\/|vm\.tiktok\.com\/)/i;
      if (!ttRegex.test(url)) {
        setUrlError('Please enter a valid TikTok video or clip link.');
        return false;
      }
    }

    setUrlError(null);
    return true;
  };

  const handleContinue = () => {
    if (validateUrl(config.targetUrl)) {
      onNext();
    }
  };

  const isUrlValid = config.targetUrl.trim().length > 0 && !urlError;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Step 01
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Target Social Environment
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Choose Growth Platform</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your target network and verify the post URL for algorithm signal calibration.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Anti-Detection:</span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active & Calibrated</span>
          </span>
        </div>
      </div>

      {/* Platform Cards (Instagram & TikTok) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instagram Card */}
        <div
          onClick={() => updateConfig({ platform: 'instagram' })}
          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            config.platform === 'instagram'
              ? 'border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  config.platform === 'instagram'
                    ? 'bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 text-white shadow-md shadow-pink-500/20'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Instagram</h3>
                <p className="text-xs font-medium text-slate-500">Reels, Clips & Posts</p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                config.platform === 'instagram'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300'
              }`}
            >
              {config.platform === 'instagram' && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500 font-medium">
            <span>Explore Push • Reels Feed • Views + Saves</span>
          </div>
        </div>

        {/* TikTok Card */}
        <div
          onClick={() => updateConfig({ platform: 'tiktok' })}
          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            config.platform === 'tiktok'
              ? 'border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  config.platform === 'tiktok'
                    ? 'bg-black text-white shadow-md shadow-black/20'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="font-black text-base tracking-tighter">TT</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">TikTok</h3>
                <p className="text-xs font-medium text-slate-500">FYP Algo Wave</p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                config.platform === 'tiktok'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300'
              }`}
            >
              {config.platform === 'tiktok' && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500 font-medium">
            <span>FYP Wave • Sound Sync • Favorites</span>
          </div>
        </div>
      </div>

      {/* Target Content URL Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Target Content URL <span className="text-slate-400 font-normal">· Link to post or clip</span>
            </label>
            {config.targetUrl.trim() && !urlError && (
              <span className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>URL Verified</span>
              </span>
            )}
          </div>

          <div className="mt-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={config.targetUrl}
              onChange={(e) => {
                const val = e.target.value;
                updateConfig({ targetUrl: val });
                if (urlError) setUrlError(null);
              }}
              onBlur={() => {
                if (config.targetUrl.trim()) validateUrl(config.targetUrl);
              }}
              placeholder={
                config.platform === 'instagram'
                  ? 'https://www.instagram.com/reel/C8kP9a-xL21/ or https://instagram.com/p/...'
                  : 'https://www.tiktok.com/@creator/video/728192837192837...'
              }
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono transition-colors focus:outline-none ${
                urlError
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              }`}
            />
          </div>

          {urlError ? (
            <p className="mt-1.5 flex items-center space-x-1.5 text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{urlError}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-[11px] text-slate-400">
              We verify platform endpoints to calibrate payload timing and ensure safe webhook dispatch.
            </p>
          )}
        </div>

        {/* Creator Profile / Handle (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Creator Profile / Handle <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="mt-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-sm">
              @
            </div>
            <input
              type="text"
              value={config.creatorHandle || ''}
              onChange={(e) => updateConfig({ creatorHandle: e.target.value })}
              placeholder="username"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Continue Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto min-h-[48px] flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          <span>Continue to Services</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
