import React from 'react';
import {
  Shield,
  Zap,
  Lock,
  Activity,
  CheckCircle2,
  Coins,
  RefreshCw,
  Layers,
  ArrowDownLeft,
} from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="mt-12 mb-20 pt-8 pb-10 border-t border-slate-200 bg-white/70 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 1. Protocol Feature Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-slate-100">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Instant Automated Disbursal</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Funds deposited to your balance in under 3 minutes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Cold Multi-Sig Custody</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Collateral segregated 1:1 in secure institutional vaults
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Zero Credit Checks</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Borrow against crypto equity with zero credit score impact
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Live Oracle Price Feeds</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Transparent real-time valuation & LTV monitoring
              </p>
            </div>
          </div>
        </div>

        {/* 2. Supported Collateral Assets Strip with Icons */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-brand" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Supported Collateral & Currencies:
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-xl font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Bitcoin (BTC)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200/80 rounded-xl font-bold">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Ethereum (ETH)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200/80 rounded-xl font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Solana (SOL)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200/80 rounded-xl font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              USD Coin (USDC)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-xl font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Tether (USDT)
            </span>
          </div>
        </div>

        {/* 3. Bottom Disclaimer & Status */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulated Lending Protocol &middot; All Systems Operational</span>
          </div>
          <p>© {new Date().getFullYear()} Instant Crypto Lending. Fixed APR, transparent terms.</p>
        </div>
      </div>
    </footer>
  );
};
