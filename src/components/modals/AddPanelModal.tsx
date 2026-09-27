import React, { useState, useEffect } from 'react';
import { X, Server, ShieldCheck, AlertCircle, Check, RefreshCw } from 'lucide-react';
import { ParentPanelConfig } from '../../types/smm';
import { executePanelApiAction } from '../../services/smmClient';

interface AddPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPanel: (newPanel: ParentPanelConfig) => void;
  editingPanel?: ParentPanelConfig | null;
}

export const AddPanelModal: React.FC<AddPanelModalProps> = ({
  isOpen,
  onClose,
  onAddPanel,
  editingPanel = null,
}) => {
  const [name, setName] = useState('');
  const [apiUrl, setApiUrl] = useState('https://smmvault.in/api/v2');
  const [apiKey, setApiKey] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiResponseInfo, setApiResponseInfo] = useState<string | null>(null);

  useEffect(() => {
    if (editingPanel) {
      setName(editingPanel.name);
      setApiUrl(editingPanel.apiUrl);
      setApiKey(editingPanel.apiKey);
      setCurrency(editingPanel.currency);
    } else {
      setName('');
      setApiUrl('https://smmvault.in/api/v2');
      setApiKey('');
      setCurrency('INR');
    }
    setErrorMsg(null);
    setApiResponseInfo(null);
    setVerifiedSuccess(false);
  }, [editingPanel, isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent, forceSave = false) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a provider name.');
      return;
    }
    if (!apiUrl.trim().startsWith('http')) {
      setErrorMsg('Please enter a valid API URL (e.g. https://domain.com/api/v2).');
      return;
    }
    if (!apiKey.trim()) {
      setErrorMsg('Please enter your secret API key from your SMM provider.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);
    setApiResponseInfo(null);

    const tempPanel: ParentPanelConfig = {
      id: editingPanel?.id || `panel-${Date.now()}`,
      name: name.trim(),
      apiUrl: apiUrl.trim(),
      apiKey: apiKey.trim(),
      currency,
      balance: editingPanel?.balance || 0,
      balanceCurrency: currency,
      isActive: true,
      lastSynced: 'Just now',
      status: 'testing',
      servicesList: editingPanel?.servicesList,
    };

    if (!forceSave) {
      // Test real connection to parent panel API
      const result = await executePanelApiAction(tempPanel, 'balance');
      setIsVerifying(false);

      if (result.success && result.data) {
        // Parse balance from real API response
        let fetchedBalance = 0;
        if (typeof result.data.balance === 'number') {
          fetchedBalance = result.data.balance;
        } else if (typeof result.data.balance === 'string') {
          fetchedBalance = parseFloat(result.data.balance) || 0;
        }

        const panelCurrency = result.data.currency || currency;

        tempPanel.balance = fetchedBalance;
        tempPanel.balanceCurrency = panelCurrency;
        tempPanel.status = 'connected';
        setVerifiedSuccess(true);
        setApiResponseInfo(`Connection Verified! Balance: ${fetchedBalance} ${panelCurrency}`);

        setTimeout(() => {
          onAddPanel(tempPanel);
          onClose();
        }, 800);
        return;
      } else {
        const errorDetail = result.error || 'Failed to authenticate with panel API';
        setErrorMsg(`API Check Failed: ${errorDetail}`);
        setApiResponseInfo(result.rawOutput);
        return;
      }
    } else {
      // Force save without testing
      setIsVerifying(false);
      tempPanel.status = 'connected';
      onAddPanel(tempPanel);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 pb-safe pt-safe animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative max-h-[92dvh] overflow-y-auto touch-scroll">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {editingPanel ? 'Edit Parent SMM Panel' : 'Add Parent SMM Panel API'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Connect any standard SMM v2 API provider
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleTestAndSave(e, false)} className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Panel / Provider Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SMMVault, JAP, ReliableSMM"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              API Endpoint URL ('/api/v2')
            </label>
            <input
              type="url"
              required
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://smmvault.in/api/v2"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Must be standard SMM v2 endpoint (ending in /api/v2)
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Provider API Key (Secret)
            </label>
            <input
              type="text"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste provider API key from your panel profile"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'INR' | 'USD')}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Current Balance
              </label>
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                {editingPanel ? `${editingPanel.balance} ${editingPanel.currency}` : 'Auto-synced from API'}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              {apiResponseInfo && (
                <pre className="text-[10px] font-mono bg-white/70 p-2 rounded max-h-24 overflow-auto text-slate-800 whitespace-pre-wrap">
                  {apiResponseInfo}
                </pre>
              )}
              <div className="pt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleTestAndSave(null as any, true)}
                  className="text-[11px] text-rose-800 underline font-semibold hover:text-rose-950"
                >
                  Save anyway without API verification →
                </button>
              </div>
            </div>
          )}

          {verifiedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{apiResponseInfo}</span>
            </div>
          )}

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying API...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{editingPanel ? 'Update & Test' : 'Test & Connect'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
