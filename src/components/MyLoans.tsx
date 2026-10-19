import React, { useState } from 'react';
import {
  CreditCard,
  PlusCircle,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { useLoan } from '../context/LoanContext';
import { Loan } from '../types';

interface MyLoansProps {
  onSelectLoan: (loan: Loan) => void;
  onApplyNewLoan: () => void;
}

export const MyLoans: React.FC<MyLoansProps> = ({ onSelectLoan, onApplyNewLoan }) => {
  const { loans, assets } = useLoan();
  const [filter, setFilter] = useState<'active' | 'repaid'>('active');

  const filteredLoans = loans.filter((l) => l.status === filter);
  const activeCount = loans.filter((l) => l.status === 'active').length;
  const repaidCount = loans.filter((l) => l.status === 'repaid').length;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Title & Filter Tabs */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">My Loans</h1>
          <p className="text-xs text-slate-500">Track balances, repayments & collateral</p>
        </div>
        <button
          onClick={onApplyNewLoan}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors min-h-[44px]"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Loan</span>
        </button>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            filter === 'active'
              ? 'bg-white text-blue-950 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Loans ({activeCount})
        </button>
        <button
          onClick={() => setFilter('repaid')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            filter === 'repaid'
              ? 'bg-white text-blue-950 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Settled History ({repaidCount})
        </button>
      </div>

      {/* List of Loans */}
      {filteredLoans.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              No {filter === 'active' ? 'Active' : 'Completed'} Loans
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {filter === 'active'
                ? 'Borrow instant liquidity against your cryptocurrency with low fixed APR.'
                : 'Any loans you settle in full will appear here as proof of completed contracts.'}
            </p>
          </div>
          {filter === 'active' && (
            <button
              onClick={onApplyNewLoan}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
            >
              Apply for a Loan Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLoans.map((loan) => {
            const asset = assets.find((a) => a.id === loan.collateralAssetId);
            const currentCollateralVal = asset
              ? loan.collateralQuantity * asset.priceUSD
              : loan.collateralValueUSDAtStart;
            const ltv =
              currentCollateralVal > 0 ? (loan.outstandingBalanceUSD / currentCollateralVal) * 100 : 0;
            const isHealthy = ltv <= (asset?.maxLTV ?? 0.65) * 100;

            return (
              <div
                key={loan.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
              >
                {/* Top Row: ID, Currency, Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">#{loan.id}</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      &middot; {loan.borrowCurrency}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      loan.status === 'repaid'
                        ? 'bg-slate-100 text-slate-700'
                        : isHealthy
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {loan.status === 'repaid' ? 'Settled & Released' : isHealthy ? 'Healthy LTV' : 'Attention'}
                  </span>
                </div>

                {/* Middle Grid: Outstanding Balance, Collateral, Interest */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Outstanding Debt</span>
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">
                      ${loan.outstandingBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 block tabular-nums">
                      of ${loan.principalUSD.toLocaleString()} principal
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Locked Collateral</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {loan.collateralQuantity} {loan.collateralAssetId}
                    </span>
                    <span className="text-[10px] text-slate-500 block tabular-nums">
                      ≈ ${currentCollateralVal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Additional Details Strip */}
                <div className="flex justify-between items-center text-xs text-slate-600 px-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Due: <strong>{new Date(loan.dueDate).toLocaleDateString()}</strong>
                    </span>
                  </div>
                  <span>
                    APR: <strong>{loan.aprPercent}%</strong>
                  </span>
                  {loan.status === 'active' && (
                    <span className="text-blue-900 font-semibold tabular-nums">
                      LTV: {ltv.toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onSelectLoan(loan)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors min-h-[44px] flex items-center justify-center"
                  >
                    View Details
                  </button>

                  {loan.status === 'active' ? (
                    <button
                      onClick={() => onSelectLoan(loan)}
                      className="py-2.5 px-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors min-h-[44px] flex items-center justify-center gap-1"
                    >
                      <span>Repay Balance</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectLoan(loan)}
                      className="py-2.5 px-3 bg-emerald-50 text-emerald-800 font-semibold text-xs rounded-xl min-h-[44px] flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
