import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Copy,
  Check,
  QrCode,
  Lock,
  Bell,
  Fingerprint,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { useLoan } from '../context/LoanContext';

interface AccountScreenProps {
  onOpenKyc: () => void;
  onLogOut: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onOpenKyc, onLogOut }) => {
  const { user, updateUser, resetDemoData } = useLoan();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCopyWallet = () => {
    navigator.clipboard?.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'How do crypto-backed loans work?',
      a: 'You deposit cryptocurrency (Bitcoin or Ethereum) into a secure simulated vault as collateral. Based on your collateral value, you can immediately borrow stablecoins (USDC/USDT) up to 65% LTV without selling your crypto or losing market appreciation.',
    },
    {
      q: 'What is Loan-to-Value (LTV) and liquidation?',
      a: 'LTV is the ratio of your loan debt to the market value of your collateral. If the crypto market drops and your LTV approaches 85%, an alert is issued. You can add collateral or repay part of the loan to restore a safe LTV ratio.',
    },
    {
      q: 'When do I get my crypto collateral back?',
      a: 'The moment your loan is paid off in full (or as you make principal payments), collateral is automatically unlocked and transferred back to your wallet.',
    },
    {
      q: 'Are there prepayment penalties or credit checks?',
      a: 'No! There are zero credit checks, zero prepayment penalties, and zero hidden origination fees. You can pay back anytime.',
    },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. Profile Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center text-xl font-bold shadow-md shadow-brand/25">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 truncate">{user.name}</h2>
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Tier {user.kycLevel} Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <p className="text-xs text-slate-500">{user.phone}</p>
          </div>
        </div>

        {/* KYC Status & Limit Banner */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Borrowing Limit Tier</span>
            <span className="font-bold text-slate-900">
              {user.kycLevel === 2 ? 'Tier 2 ($100,000 USD)' : 'Tier 1 ($25,000 USD)'}
            </span>
          </div>
          {user.kycLevel < 2 && (
            <button
              onClick={onOpenKyc}
              className="px-3.5 py-1.5 bg-brand text-white font-semibold rounded-lg text-xs hover:bg-brand-hover shadow-sm shadow-brand/20 transition-colors"
            >
              Upgrade Limit
            </button>
          )}
        </div>
      </div>

      {/* 2. Connected Simulated Wallet Address */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Connected Demo Wallet
          </span>
          <span className="text-[10px] text-slate-400">Ethereum Mainnet</span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs">
          <span className="text-slate-700 font-medium truncate max-w-[200px]">
            {user.walletAddress}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopyWallet}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              title="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowQr(!showQr)}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              title="Show QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showQr && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-2 animate-in fade-in duration-150">
            <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto shadow-sm border border-slate-200 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">{user.walletAddress}</p>
          </div>
        )}
      </div>

      {/* 3. Security & Preferences */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Security Settings
        </span>

        <div className="divide-y divide-slate-100 text-xs">
          {/* 2FA */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-slate-500" />
              <div>
                <p className="font-semibold text-slate-800">Two-Factor Authentication (2FA)</p>
                <p className="text-[10px] text-slate-400">Protects loan disbursements</p>
              </div>
            </div>
            <button
              onClick={() => updateUser({ twoFactorEnabled: !user.twoFactorEnabled })}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                user.twoFactorEnabled ? 'bg-brand' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  user.twoFactorEnabled ? 'transform translate-x-4' : ''
                }`}
              />
            </button>
          </div>

          {/* Biometrics */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-4 h-4 text-slate-500" />
              <div>
                <p className="font-semibold text-slate-800">Biometric Authentication</p>
                <p className="text-[10px] text-slate-400">FaceID / TouchID unlock</p>
              </div>
            </div>
            <button
              onClick={() => updateUser({ biometricsEnabled: !user.biometricsEnabled })}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                user.biometricsEnabled ? 'bg-brand' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  user.biometricsEnabled ? 'transform translate-x-4' : ''
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-500" />
              <div>
                <p className="font-semibold text-slate-800">LTV Alerts & Reminders</p>
                <p className="text-[10px] text-slate-400">SMS & Email due-date warnings</p>
              </div>
            </div>
            <button
              onClick={() => updateUser({ notificationsEnabled: !user.notificationsEnabled })}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                user.notificationsEnabled ? 'bg-brand' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 left-1 ${
                  user.notificationsEnabled ? 'transform translate-x-4' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Help & Support FAQ Accordion */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-900" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Lending FAQ & Guidance
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-2.5">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 hover:text-blue-950"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-blue-900' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Legal & Reset Actions */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <button className="hover:underline">Terms of Service</button>
          <span>&middot;</span>
          <button className="hover:underline">Privacy Policy</button>
          <span>&middot;</span>
          <button className="hover:underline">Lending Disclosure</button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={resetDemoData}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={onLogOut}
            className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
