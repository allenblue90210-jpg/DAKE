import React from 'react';
import { ShieldCheck, Zap, Lock, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogIn: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onLogIn }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/tanmi_2ee482b1.png"
                alt="DAKE Tanmi Icon"
                className="w-full h-full object-contain drop-shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/tanmi.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                DAKE
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                Safe & Instant Loans
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogIn}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={onGetStarted}
              className="text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-blue-700" />
              <span>Instant Crypto Lending Protocol &middot; 0% Origination Fee</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Unlock the Value of <br />
              <span className="text-blue-900">Your Crypto Assets.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Borrow instant cash or stablecoins against your Bitcoin and Ethereum without selling.
              Maintain full ownership, keep upside price appreciation, and borrow with transparent fixed APR.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="h-13 px-7 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
              >
                <span>Apply for Instant Loan</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLogIn}
                className="h-13 px-6 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 flex items-center justify-center active:scale-[0.98] transition-all shadow-sm"
              >
                <span>Launch Interactive Demo</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-left">
              <div>
                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">5.9%</p>
                <p className="text-xs text-slate-500 font-medium">Fixed APR starting rate</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">Up to 65%</p>
                <p className="text-xs text-slate-500 font-medium">Safe borrowing LTV</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">&lt; 3 mins</p>
                <p className="text-xs text-slate-500 font-medium">Instant automated funding</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <img
                src="/src/assets/images/coinlend_crypto_vault_1792427732745.jpg"
                alt="DAKE Secure Crypto Vault"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover object-center"
              />
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Institutional Cold Vault Custody</p>
                  <p className="text-[11px] text-slate-500">Assets backed 1:1 in multi-sig segregation</p>
                </div>
                <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200">
                  Protected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 pt-10 border-t border-slate-200">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Credit Score Checks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Loans are 100% asset-backed. No credit bureau pulls, no lengthy employment paperwork, and no impact on credit history.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Keep Your Market Upside</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If Bitcoin or Ethereum prices double while your loan is active, that profit is 100% yours. All collateral is returned upon settlement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Flexible Repayment Terms</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Repay in 30, 60, 90, 180, or 365 days. Make partial principal payments anytime with zero prepayment penalty fees.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="max-w-4xl mx-auto px-4">
          DAKE Prototype Platform &middot; Simulated Environment &middot; All balances, crypto transfers, loan contracts, and
          repayments are simulated for testing and demonstration purposes.
        </p>
      </footer>
    </div>
  );
};
