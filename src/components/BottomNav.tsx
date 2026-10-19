import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  PlusCircle,
  Wallet,
  ShieldCheck,
  ArrowDownLeft,
} from 'lucide-react';
import { NavTabKey } from './Navbar';
import { useLoan } from '../context/LoanContext';

interface BottomNavProps {
  currentTab: NavTabKey;
  onTabChange: (tab: NavTabKey) => void;
  onOpenCollateral: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenCollateral,
}) => {
  const { loans } = useLoan();
  const activeLoansCount = loans.filter((l) => l.status === 'active').length;

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-4 h-16 flex items-center justify-around">
        {/* Dashboard */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
            currentTab === 'dashboard'
              ? 'text-brand font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {currentTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Dashboard</span>
        </button>

        {/* My Loans */}
        <button
          onClick={() => onTabChange('my-loans')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
            currentTab === 'my-loans'
              ? 'text-brand font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <CreditCard className="w-5 h-5" />
            {activeLoansCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {activeLoansCount}
              </span>
            )}
            {currentTab === 'my-loans' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">My Loans</span>
        </button>

        {/* Center Primary Action: Get Loan */}
        <button
          onClick={() => onTabChange('loan')}
          className="flex flex-col items-center justify-center -mt-5 mx-2 group"
          title="Apply for a new loan"
        >
          <div className="w-13 h-13 rounded-full bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/35 group-hover:scale-105 group-active:scale-95 transition-all ring-4 ring-white">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-extrabold text-brand mt-0.5 tracking-tight">
            Get Loan
          </span>
        </button>

        {/* Add Collateral / Vault */}
        <button
          onClick={onOpenCollateral}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 text-slate-500 hover:text-brand transition-all"
        >
          <div className="relative">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Vault</span>
        </button>

        {/* Account & KYC */}
        <button
          onClick={() => onTabChange('account')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
            currentTab === 'account'
              ? 'text-brand font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ShieldCheck className="w-5 h-5" />
            {currentTab === 'account' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Account</span>
        </button>
      </div>
    </nav>
  );
};
