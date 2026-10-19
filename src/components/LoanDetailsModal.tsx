import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Clock,
} from 'lucide-react';
import { useLoan } from '../context/LoanContext';
import { Loan } from '../types';

interface LoanDetailsModalProps {
  loan: Loan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LoanDetailsModal: React.FC<LoanDetailsModalProps> = ({ loan, isOpen, onClose }) => {
  const { assets, repayLoan, user } = useLoan();
  const [repayType, setRepayType] = useState<'custom' | 'full' | 'interest'>('custom');
  const [customAmountStr, setCustomAmountStr] = useState<string>('500');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !loan) return null;

  const collateralAsset = assets.find((a) => a.id === loan.collateralAssetId);
  const currentCollateralVal = collateralAsset
    ? loan.collateralQuantity * collateralAsset.priceUSD
    : loan.collateralValueUSDAtStart;

  const currentLTV =
    currentCollateralVal > 0 ? (loan.outstandingBalanceUSD / currentCollateralVal) * 100 : 0;

  const isHealthy = currentLTV <= (collateralAsset?.maxLTV ?? 0.65) * 100;
  const isAtRisk = currentLTV >= (collateralAsset?.liquidationLTV ?? 0.85) * 100;

  const numericRepay =
    repayType === 'full'
      ? loan.outstandingBalanceUSD
      : repayType === 'interest'
      ? Math.min(loan.outstandingBalanceUSD, Math.max(50, Math.round(loan.principalUSD * (loan.aprPercent / 100) * (30 / 365))))
      : parseFloat(customAmountStr) || 0;

  const handleRepaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (numericRepay <= 0) {
      setStatusMessage({ type: 'error', text: 'Repayment amount must be greater than zero.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = repayLoan(loan.id, numericRepay, repayType === 'full' ? 'full' : 'principal');
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        if (repayType === 'full' || numericRepay >= loan.outstandingBalanceUSD) {
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Loan #{loan.id}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    loan.status === 'repaid'
                      ? 'bg-slate-100 text-slate-600'
                      : isHealthy
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {loan.status === 'repaid' ? 'Settled' : 'Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pledged: {loan.collateralQuantity} {loan.collateralAssetId}
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Balance Spotlight Card */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-medium">Outstanding Balance</span>
                <p className="text-2xl font-extrabold tracking-tight mt-0.5 tabular-nums">
                  ${loan.outstandingBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} {loan.borrowCurrency}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium">Original Principal</span>
                <p className="text-sm font-bold text-slate-200 tabular-nums">
                  ${loan.principalUSD.toLocaleString()} {loan.borrowCurrency}
                </p>
              </div>
            </div>

            {/* Health Meter */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Current Loan-to-Value (LTV)</span>
                <span
                  className={`font-semibold tabular-nums ${
                    isHealthy ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {currentLTV.toFixed(1)}% ({isHealthy ? 'Healthy' : 'Caution'})
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isAtRisk ? 'bg-red-500' : isHealthy ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, currentLTV)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500">Locked Collateral</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                {loan.collateralQuantity} {loan.collateralAssetId}
              </p>
              <p className="text-[10px] text-slate-400 tabular-nums">
                Market: ${currentCollateralVal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500">Maturity Date</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {new Date(loan.dueDate).toLocaleDateString()}
              </p>
              <p className="text-[10px] text-slate-400">
                {loan.durationDays} day agreement ({loan.aprPercent}% APR)
              </p>
            </div>
          </div>

          {/* Repayment Drawer (If loan is active) */}
          {loan.status === 'active' && (
            <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Make a Repayment
                </h3>
                <span className="text-[11px] text-slate-500 tabular-nums">
                  Demo Balance: ${user.cashBalanceUSD.toLocaleString()}
                </span>
              </div>

              {/* Repay Presets */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRepayType('custom')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    repayType === 'custom'
                      ? 'border-brand bg-brand-light text-brand font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Custom
                </button>
                <button
                  type="button"
                  onClick={() => setRepayType('interest')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    repayType === 'interest'
                      ? 'border-brand bg-brand-light text-brand font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Pay Interest
                </button>
                <button
                  type="button"
                  onClick={() => setRepayType('full')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    repayType === 'full'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Pay Full Balance
                </button>
              </div>

              {repayType === 'custom' && (
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="50"
                      min="1"
                      max={loan.outstandingBalanceUSD}
                      value={customAmountStr}
                      onChange={(e) => setCustomAmountStr(e.target.value)}
                      className="w-full pl-7 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 tabular-nums"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-500">
                      {loan.borrowCurrency}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {[100, 500, 1000, 2500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCustomAmountStr(Math.min(loan.outstandingBalanceUSD, preset).toString())}
                        className="flex-1 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg tabular-nums"
                      >
                        +${preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Payment</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ${numericRepay.toLocaleString('en-US', { minimumFractionDigits: 2 })} {loan.borrowCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Remaining after payment</span>
                  <span className="font-semibold text-blue-900 tabular-nums">
                    ${Math.max(0, loan.outstandingBalanceUSD - numericRepay).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}{' '}
                    {loan.borrowCurrency}
                  </span>
                </div>
                {numericRepay >= loan.outstandingBalanceUSD && (
                  <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                    Paying off in full will immediately release {loan.collateralQuantity} {loan.collateralAssetId} back to your wallet!
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={isSubmitting || numericRepay <= 0}
                onClick={handleRepaymentSubmit}
                className="w-full h-11 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-brand/25 transition-all"
              >
                {isSubmitting ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Repayment</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Repayment History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900">Repayment Records</h4>
            {loan.repaymentHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No repayments recorded yet.</p>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                {loan.repaymentHistory.map((tx) => (
                  <div key={tx.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {tx.type === 'full' ? 'Full Settlement' : 'Principal Repayment'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(tx.date).toLocaleDateString()} &middot; Hash: {tx.txHash}
                      </p>
                    </div>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      -${tx.amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
