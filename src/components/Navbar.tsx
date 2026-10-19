import React from 'react';
import {
  Shield,
  Sparkles,
  User,
  RefreshCw,
  PlusCircle,
  ArrowDownLeft,
  CreditCard,
  Wallet,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { useLoan } from '../context/LoanContext';

export type NavTabKey = 'dashboard' | 'loan' | 'my-loans' | 'collateral' | 'account';

interface NavbarProps {
  currentTab: NavTabKey;
  onTabChange: (tab: NavTabKey) => void;
  onOpenAuth: () => void;
  onOpenCollateral: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAuth,
  onOpenCollateral,
}) => {
  const { user, isAuthenticated, resetDemoData, totalCollateralValueUSD, availableBorrowLimit, loans } = useLoan();
  const activeLoansCount = loans.filter((l) => l.status === 'active').length;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Main Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/aistudio/tam_2_b2487d86.png"
                alt="DAKE Logo"
                className="w-full h-full object-contain drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/tam_2.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                DAKE
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                Instant Crypto Loans
              </span>
            </div>
          </button>
        </div>

        {/* Quick Collateral & Limit Strip in Top Bar */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-slate-500">Vault:</span>
            <span className="font-bold text-slate-900 tabular-nums">
              ${totalCollateralValueUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-xl">
            <span className="text-blue-700 font-medium">Borrow Limit:</span>
            <span className="font-extrabold text-blue-950 tabular-nums">
              ${availableBorrowLimit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Right Actions: User Profile & Auth */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={resetDemoData}
            title="Reset demo data"
            className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => onTabChange('account')}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold">Verified Tier 2</p>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-900 rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* 2. Below-Header Navigation & Action Buttons Bar (Always Visible Across All Devices) */}
      <div className="border-t border-slate-200 bg-slate-100/90 backdrop-blur-sm py-2 px-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between gap-2 overflow-x-auto">
          {/* Main Destination Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                currentTab === 'dashboard'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('loan')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm ${
                currentTab === 'loan'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-900 text-white hover:bg-blue-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Get a Loan</span>
            </button>

            <button
              onClick={() => onTabChange('my-loans')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                currentTab === 'my-loans'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>My Loans</span>
              {activeLoansCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {activeLoansCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCollateral}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300 shadow-sm transition-all"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Collateral</span>
            </button>

            <button
              onClick={() => onTabChange('account')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                currentTab === 'account'
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Account & KYC</span>
            </button>
          </div>

          {/* Quick Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => onTabChange('loan')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Instant Loan</span>
            </button>
            <button
              onClick={onOpenCollateral}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5 text-blue-700" />
              <span>Vault Deposit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
