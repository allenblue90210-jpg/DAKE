import React from 'react';
import {
  ShieldCheck,
  PlusCircle,
  ArrowDownLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  CreditCard,
  Lock,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useLoan } from '../context/LoanContext';
import { AssetId, Loan } from '../types';

interface HomeDashboardProps {
  onStartLoan: () => void;
  onOpenCollateral: (assetId?: AssetId, action?: 'deposit' | 'withdraw') => void;
  onSelectLoan: (loan: Loan) => void;
  onOpenKyc: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onStartLoan,
  onOpenCollateral,
  onSelectLoan,
  onOpenKyc,
}) => {
  const {
    user,
    assets,
    loans,
    activities,
    totalCollateralValueUSD,
    totalOutstandingLoanUSD,
    availableBorrowLimit,
    overallLTV,
  } = useLoan();

  const activeLoans = loans.filter((l) => l.status === 'active');
  const primaryActiveLoan = activeLoans.length > 0 ? activeLoans[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header greeting & quick action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-light text-brand text-xs font-bold border border-brand/20">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              <span>Vault Protocol</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, <strong className="text-slate-800 font-semibold">{user.name}</strong> &middot; Manage your collateral and instant crypto-backed credit lines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenCollateral()}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-xs transition-all"
          >
            <ArrowDownLeft className="w-4 h-4 text-brand" />
            <span>Deposit Collateral</span>
          </button>

          <button
            onClick={onStartLoan}
            className="px-4 py-2 bg-brand hover:bg-brand-hover text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-brand/25 active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply for Loan</span>
          </button>
        </div>
      </div>

      {/* 2. Below-Header Action Buttons Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onStartLoan}
            className="px-4 py-2.5 bg-brand hover:bg-brand-hover text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand/25 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Get a Loan</span>
          </button>

          <button
            onClick={() => onOpenCollateral()}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-300 shadow-sm flex items-center gap-2 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-700" />
            <span>Add Collateral</span>
          </button>

          <button
            onClick={onOpenKyc}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Upgrade Limit (Tier 2)</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium hidden md:flex items-center gap-2">
          <span>0% Origination Fee</span>
          <span>&middot;</span>
          <span>Max 65% LTV</span>
          <span>&middot;</span>
          <span className="text-emerald-700 font-bold">Instant Disbursal</span>
        </div>
      </div>

      {/* 3. Top Metric Cards Strip (Desktop 3-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Available Borrowing Limit (Primary Deep Blue) */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-5 shadow-lg shadow-blue-950/15 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-blue-200/80 text-xs font-semibold uppercase tracking-wider">
              <span>Available Borrow Limit</span>
              <span className="bg-white/10 text-white px-2 py-0.5 rounded-md text-[10px]">Instant</span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight tabular-nums mt-1">
              ${availableBorrowLimit.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-[11px] text-blue-200/70">
              Maximum allowable instant credit based on 65% LTV
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] text-blue-200">
              <span>Overall LTV: {overallLTV.toFixed(1)}%</span>
              <span className="font-semibold">{overallLTV < 65 ? 'Healthy' : 'High'}</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  overallLTV > 65 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, overallLTV)}%` }}
              />
            </div>

            {/* Restored Primary & Secondary Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-3">
              <button
                onClick={onStartLoan}
                className="h-10 bg-white hover:bg-slate-100 text-blue-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-900" />
                <span>Get a Loan</span>
              </button>

              <button
                onClick={() => onOpenCollateral()}
                className="h-10 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-white/20 active:scale-[0.98] transition-all"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-blue-200" />
                <span>Add Collateral</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Collateral Pledged */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Total Collateral Value</span>
              <Wallet className="w-4 h-4 text-blue-700" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums mt-1">
              ${totalCollateralValueUSD.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              Pledged securely across Bitcoin, Ethereum & Stablecoins
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Active Pledged Assets:</span>
            <div className="flex gap-1.5">
              {assets
                .filter((a) => a.collateralDeposited > 0)
                .map((a) => (
                  <span
                    key={a.id}
                    className="px-2 py-0.5 bg-slate-100 rounded-md font-bold text-slate-700 text-[10px]"
                  >
                    {a.collateralDeposited} {a.symbol}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Metric 3: Outstanding Debt */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Outstanding Debt</span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums mt-1">
              ${totalOutstandingLoanUSD.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              {activeLoans.length} active loan agreement{activeLoans.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Next Due Date:</span>
            <span className="font-bold text-slate-900">
              {primaryActiveLoan
                ? new Date(primaryActiveLoan.dueDate).toLocaleDateString()
                : 'No pending payments'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Split View: (Left: Collateral Table & Active Loan Spotlight | Right: Activity Feed & Verification) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Collateral Assets Table & Active Loan */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Loan Spotlight Banner */}
          {primaryActiveLoan && (
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <CreditCard className="w-5 h-5 text-blue-100" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        Active Loan #{primaryActiveLoan.id}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Good Standing
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pledged: <strong>{primaryActiveLoan.collateralQuantity} {primaryActiveLoan.collateralAssetId}</strong> &middot; Fixed APR: {primaryActiveLoan.aprPercent}%
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectLoan(primaryActiveLoan)}
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white font-bold text-xs rounded-xl shadow-md shadow-brand/25 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Repay / View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-500 block text-[11px]">Outstanding Balance</span>
                  <span className="font-extrabold text-slate-900 tabular-nums">
                    ${primaryActiveLoan.outstandingBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} {primaryActiveLoan.borrowCurrency}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-500 block text-[11px]">Maturity Due Date</span>
                  <span className="font-bold text-slate-900">
                    {new Date(primaryActiveLoan.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-500 block text-[11px]">Liquidation Guard</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    &gt; ${primaryActiveLoan.liquidationPriceUSD.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Crypto Collateral Assets Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Supported Collateral Assets
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time demo market prices and your pledged collateral balances
                </p>
              </div>
              <button
                onClick={() => onOpenCollateral()}
                className="text-xs font-bold text-blue-900 hover:text-blue-700"
              >
                + Manage All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {assets.map((asset) => {
                const depositedUSD = asset.collateralDeposited * asset.priceUSD;
                const walletUSD = asset.walletBalance * asset.priceUSD;

                return (
                  <div
                    key={asset.id}
                    className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl ${asset.iconBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}
                      >
                        {asset.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{asset.name}</span>
                          <span className="text-xs font-bold text-slate-400">{asset.symbol}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            Max LTV: {(asset.maxLTV * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Market Price:{' '}
                          <strong className="text-slate-800 font-bold tabular-nums">
                            ${asset.priceUSD >= 10 ? asset.priceUSD.toLocaleString() : asset.priceUSD.toFixed(2)}
                          </strong>{' '}
                          <span
                            className={`font-semibold ${
                              asset.change24h >= 0 ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            {asset.change24h >= 0 ? '+' : ''}
                            {asset.change24h}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-slate-900 tabular-nums">
                          {asset.collateralDeposited > 0
                            ? `${asset.collateralDeposited} ${asset.symbol} in Vault`
                            : `${asset.walletBalance} ${asset.symbol} in Wallet`}
                        </div>
                        <div className="text-[11px] text-slate-500 tabular-nums">
                          ≈ $
                          {(asset.collateralDeposited > 0 ? depositedUSD : walletUSD).toLocaleString(
                            'en-US',
                            { maximumFractionDigits: 2 }
                          )}{' '}
                          USD
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenCollateral(asset.id, 'deposit')}
                          className="px-3 py-1.5 bg-brand-light hover:bg-brand/15 text-brand font-bold text-xs rounded-lg transition-colors"
                        >
                          Deposit
                        </button>
                        {asset.collateralDeposited > 0 && (
                          <button
                            onClick={() => onOpenCollateral(asset.id, 'withdraw')}
                            className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): User Status & Activity Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Identity & KYC Verification Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Identity & Limit Tier
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Tier {user.kycLevel}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Max Loan Limit</span>
                <span className="font-extrabold text-slate-900">$100,000 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Status</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved</span>
                </span>
              </div>
            </div>

            <button
              onClick={onOpenKyc}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              View Verification Credentials
            </button>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Account Activity
              </h3>
              <span className="text-[11px] text-slate-400">All operations</span>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        act.type === 'loan_disbursed'
                          ? 'bg-blue-50 text-blue-700'
                          : act.type === 'repayment'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {act.type === 'loan_disbursed' ? (
                        <CreditCard className="w-3.5 h-3.5" />
                      ) : act.type === 'repayment' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{act.title}</p>
                      <p className="text-[10px] text-slate-400">{act.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-bold tabular-nums text-xs ${
                      act.amount.startsWith('+') ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                  >
                    {act.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol Notice */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center space-y-1">
            <p className="text-xs font-bold text-slate-800">Lending Protocol Sandbox</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              All transactions, balances, and loans operate in a safe simulated prototype environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
