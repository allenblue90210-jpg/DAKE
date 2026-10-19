import React, { useState } from 'react';
import { X, ShieldCheck, ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLoan } from '../context/LoanContext';
import { AssetId } from '../types';

interface CollateralModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAssetId?: AssetId;
  defaultAction?: 'deposit' | 'withdraw';
}

export const CollateralModal: React.FC<CollateralModalProps> = ({
  isOpen,
  onClose,
  defaultAssetId = 'BTC',
  defaultAction = 'deposit',
}) => {
  const { assets, depositCollateral, withdrawCollateral } = useLoan();
  const [selectedAssetId, setSelectedAssetId] = useState<AssetId>(defaultAssetId);
  const [action, setAction] = useState<'deposit' | 'withdraw'>(defaultAction);
  const [amountStr, setAmountStr] = useState<string>('0.10');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const currentAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const maxAvailable =
    action === 'deposit' ? currentAsset.walletBalance : currentAsset.collateralDeposited;

  const numericAmount = parseFloat(amountStr) || 0;
  const estimatedUSD = numericAmount * currentAsset.priceUSD;
  const borrowCapacityGain = estimatedUSD * currentAsset.maxLTV;

  const handlePercentageClick = (pct: number) => {
    const calculated = (maxAvailable * pct).toFixed(
      currentAsset.id === 'USDC' || currentAsset.id === 'USDT' ? 2 : 4
    );
    setAmountStr(calculated);
    setStatusMessage(null);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseFloat(e.target.value) / 100;
    const calculated = (maxAvailable * pct).toFixed(
      currentAsset.id === 'USDC' || currentAsset.id === 'USDT' ? 2 : 4
    );
    setAmountStr(calculated);
    setStatusMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (numericAmount <= 0) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid amount greater than 0.' });
      return;
    }

    if (action === 'deposit') {
      const res = depositCollateral(selectedAssetId, numericAmount);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } else {
      const res = withdrawCollateral(selectedAssetId, numericAmount);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-100" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {action === 'deposit' ? 'Deposit Collateral Vault' : 'Withdraw Collateral'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {action === 'deposit'
                  ? 'Increases your borrowing eligibility instantly'
                  : 'Reclaims collateral back to your wallet'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {/* Action Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => {
                setAction('deposit');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                action === 'deposit'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Deposit Collateral</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAction('withdraw');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                action === 'withdraw'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
              <span>Withdraw to Wallet</span>
            </button>
          </div>

          {statusMessage && (
            <div
              className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-xs ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Asset Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Collateral Asset
              </label>
              <div className="grid grid-cols-4 gap-2">
                {assets.map((asset) => {
                  const isSelected = asset.id === selectedAssetId;
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAssetId(asset.id);
                        setStatusMessage(null);
                      }}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-brand bg-brand-light/70 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{asset.symbol}</div>
                      <div className="text-[10px] text-slate-500 tabular-nums">
                        ${asset.priceUSD >= 10 ? asset.priceUSD.toLocaleString() : asset.priceUSD.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Balances info */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500">
                  {action === 'deposit' ? 'Wallet Available:' : 'Vault Deposited:'}
                </span>
                <span className="font-semibold text-slate-900 ml-1.5 tabular-nums">
                  {maxAvailable} {currentAsset.symbol}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500 tabular-nums">
                ≈ ${(maxAvailable * currentAsset.priceUSD).toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Amount</label>
                <span className="text-[11px] text-slate-500 tabular-nums">
                  USD Value: ${estimatedUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  max={maxAvailable}
                  value={amountStr}
                  onChange={(e) => {
                    setAmountStr(e.target.value);
                    setStatusMessage(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white tabular-nums"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  {currentAsset.symbol}
                </span>
              </div>
            </div>

            {/* Percentage shortcuts */}
            <div className="flex gap-2">
              {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentageClick(pct)}
                  className="flex-1 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  {pct === 1.0 ? 'MAX' : `${pct * 100}%`}
                </button>
              ))}
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="0"
                max="100"
                value={maxAvailable > 0 ? Math.min(100, Math.round((numericAmount / maxAvailable) * 100)) : 0}
                onChange={handleSliderChange}
                className="w-full accent-blue-900 cursor-pointer"
              />
            </div>

            {/* Impact details */}
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Maximum Asset LTV</span>
                <span className="font-semibold text-slate-900">
                  {(currentAsset.maxLTV * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>
                  {action === 'deposit' ? 'Borrowing Capacity Added' : 'Borrowing Capacity Reduced'}
                </span>
                <span className="font-semibold text-blue-900 tabular-nums">
                  {action === 'deposit' ? '+' : '-'}${borrowCapacityGain.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 bg-brand hover:bg-brand-hover text-white font-semibold text-xs rounded-xl shadow-md shadow-brand/25 active:scale-[0.98] transition-all min-h-[48px] flex items-center justify-center"
              >
                {action === 'deposit'
                  ? `Deposit ${numericAmount || 0} ${currentAsset.symbol} to Vault`
                  : `Withdraw ${numericAmount || 0} ${currentAsset.symbol} to Wallet`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
