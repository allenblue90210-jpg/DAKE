import React from 'react';
import { Shield, Sparkles, User, RefreshCw, PlusCircle, ArrowDownLeft, FileText, Wallet } from 'lucide-react';
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
  const { user, isAuthenticated, resetDemoData, totalCollateralValueUSD, loans } = useLoan();
  const activeLoansCount = loans.filter((l) => l.status === 'active').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-sm shadow-blue-900/20 group-hover:bg-blue-800 transition-colors">
              <Shield className="w-5 h-5 text-blue-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                DAKE
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                Crypto Lending
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Primary Web Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-blue-50 text-blue-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => onTabChange('loan')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'loan'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Apply for Loan</span>
          </button>

          <button
            onClick={() => onTabChange('my-loans')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'my-loans'
                ? 'bg-blue-50 text-blue-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>My Loans</span>
            {activeLoansCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {activeLoansCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenCollateral}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Deposit Collateral</span>
          </button>

          <button
            onClick={() => onTabChange('account')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              currentTab === 'account'
                ? 'bg-blue-50 text-blue-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Account & Security
          </button>
        </nav>

        {/* Zone 3: Portfolio Pill, Demo Reset & User Menu */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Collateral indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
            <Wallet className="w-3.5 h-3.5 text-blue-700" />
            <span className="text-slate-500">Vault:</span>
            <span className="font-bold text-slate-900 tabular-nums">
              ${totalCollateralValueUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={resetDemoData}
            title="Reset demo data to initial state"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4" />
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
                <p className="text-[10px] text-emerald-600 font-semibold">Tier 2 Verified</p>
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

      {/* Mobile sub-navigation bar for small screens */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto bg-slate-50/50">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            currentTab === 'dashboard' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onTabChange('loan')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            currentTab === 'loan' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          Apply Loan
        </button>
        <button
          onClick={() => onTabChange('my-loans')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            currentTab === 'my-loans' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          My Loans ({activeLoansCount})
        </button>
        <button
          onClick={() => onTabChange('account')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            currentTab === 'account' ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
        >
          Account
        </button>
      </div>
    </header>
  );
};
