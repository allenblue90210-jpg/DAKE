import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLoan } from '../context/LoanContext';
import { AssetId } from '../types';

interface LoanApplicationProps {
  onSuccess: (loanId: string) => void;
  onCancel: () => void;
}

export const LoanApplication: React.FC<LoanApplicationProps> = ({ onSuccess, onCancel }) => {
  const { assets, applyForLoan } = useLoan();

  // Wizard state: 1: Collateral & Borrow setup -> 2: Review Offer -> 3: Approved
  const [step, setStep] = useState<'configure' | 'offer' | 'approved'>('configure');

  // Inputs
  const [collateralAssetId, setCollateralAssetId] = useState<AssetId>('BTC');
  const [collateralQuantityStr, setCollateralQuantityStr] = useState<string>('0.25');
  const [borrowCurrency, setBorrowCurrency] = useState<'USDC' | 'USDT' | 'USD'>('USDC');
  const [loanAmountUSD, setLoanAmountUSD] = useState<number>(8000);
  const [durationDays, setDurationDays] = useState<number>(90);
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdLoanId, setCreatedLoanId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const currentAsset = assets.find((a) => a.id === collateralAssetId) || assets[0];
  const collateralQuantity = parseFloat(collateralQuantityStr) || 0;
  const collateralValueUSD = collateralQuantity * currentAsset.priceUSD;

  // Maximum loan for this collateral
  const maxAllowableLoan = Math.floor(collateralValueUSD * currentAsset.maxLTV);

  // Interest rate determination based on duration & asset
  const aprPercent = useMemo(() => {
    switch (durationDays) {
      case 30:
        return 5.9;
      case 60:
        return 6.5;
      case 90:
        return 7.2;
      case 180:
        return 8.0;
      case 365:
        return 8.8;
      default:
        return 7.5;
    }
  }, [durationDays]);

  // Current LTV
  const currentLTV = collateralValueUSD > 0 ? (loanAmountUSD / collateralValueUSD) * 100 : 0;
  const isHighLTV = currentLTV > currentAsset.maxLTV * 100 * 0.9; // within 90% of max

  // Calculations
  const totalInterestUSD = (loanAmountUSD * (aprPercent / 100) * (durationDays / 365));
  const totalRepayableUSD = loanAmountUSD + totalInterestUSD;
  const monthlyPaymentEstimate = (totalRepayableUSD / (durationDays / 30));

  // Liquidation calculation
  // Liquidation triggers when loanAmount / (collateralQuantity * liquidationPrice) = liquidationLTV (e.g. 85%)
  // liquidationPrice = loanAmount / (liquidationLTV * collateralQuantity)
  const liquidationPrice =
    collateralQuantity > 0
      ? loanAmountUSD / (currentAsset.liquidationLTV * collateralQuantity)
      : 0;

  const priceDropBufferPercent =
    currentAsset.priceUSD > 0
      ? ((currentAsset.priceUSD - liquidationPrice) / currentAsset.priceUSD) * 100
      : 0;

  const handleAssetSelect = (assetId: AssetId) => {
    setCollateralAssetId(assetId);
    const asset = assets.find((a) => a.id === assetId)!;
    // Set a sensible default quantity
    if (assetId === 'BTC') {
      setCollateralQuantityStr('0.25');
      setLoanAmountUSD(8000);
    } else if (assetId === 'ETH') {
      setCollateralQuantityStr('3.0');
      setLoanAmountUSD(5000);
    } else {
      setCollateralQuantityStr('5000');
      setLoanAmountUSD(3500);
    }
  };

  const handleCollateralChange = (val: string) => {
    setCollateralQuantityStr(val);
    const q = parseFloat(val) || 0;
    const maxBorrow = q * currentAsset.priceUSD * currentAsset.maxLTV;
    if (loanAmountUSD > maxBorrow) {
      setLoanAmountUSD(Math.max(100, Math.floor(maxBorrow * 0.8)));
    }
  };

  const handleProceedToOffer = () => {
    setErrorMessage('');
    if (collateralQuantity <= 0) {
      setErrorMessage('Please enter a valid collateral quantity.');
      return;
    }
    if (loanAmountUSD <= 0) {
      setErrorMessage('Please specify a loan amount.');
      return;
    }
    if (loanAmountUSD > maxAllowableLoan) {
      setErrorMessage(
        `Loan amount exceeds the maximum allowable limit of $${maxAllowableLoan.toLocaleString()} based on your collateral.`
      );
      return;
    }

    setStep('offer');
  };

  const handleConfirmLoan = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = applyForLoan({
        collateralAssetId,
        collateralQuantity,
        borrowCurrency,
        principalUSD: loanAmountUSD,
        durationDays,
        aprPercent,
      });

      setIsSubmitting(false);
      if (res.success && res.loanId) {
        setCreatedLoanId(res.loanId);
        setStep('approved');
      } else {
        setErrorMessage(res.message);
        setStep('configure');
      }
    }, 900);
  };

  return (
    <div className="bg-slate-50 min-h-full pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={step === 'offer' ? () => setStep('configure') : onCancel}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 'offer' ? 'Edit Details' : 'Cancel'}</span>
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">
            {step === 'approved'
              ? 'Loan Disbursed'
              : step === 'offer'
              ? 'Review Loan Offer'
              : 'Apply for Crypto Loan'}
          </h2>
          <p className="text-[10px] text-slate-500">
            {step === 'approved'
              ? 'Funds available instantly'
              : step === 'offer'
              ? 'Step 2 of 2: Confirm terms'
              : 'Step 1 of 2: Configure terms'}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-brand bg-brand-light px-2.5 py-1 rounded-full border border-brand/20">
            Instant Loan
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 'configure' && (
          <>
            {/* Step 1: Select Collateral Asset */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Collateral Asset
                </span>
                <span className="text-[11px] text-slate-500">
                  Wallet: {currentAsset.walletBalance} {currentAsset.symbol}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {assets.map((asset) => {
                  const isSelected = asset.id === collateralAssetId;
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => handleAssetSelect(asset.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-brand bg-brand-light/70 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
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

              {/* Collateral Quantity Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-600">
                    Collateral Amount ({currentAsset.symbol})
                  </label>
                  <span className="text-xs font-semibold text-slate-900 tabular-nums">
                    ≈ ${collateralValueUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={collateralQuantityStr}
                    onChange={(e) => handleCollateralChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white tabular-nums"
                    placeholder="0.00"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleCollateralChange(
                          (currentAsset.walletBalance + currentAsset.collateralDeposited).toString()
                        )
                      }
                      className="text-[10px] font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-md"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Borrow Currency & Amount */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Borrow Currency & Loan Amount
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">
                  Max: ${maxAllowableLoan.toLocaleString()}
                </span>
              </div>

              {/* Currency Selector */}
              <div className="grid grid-cols-3 gap-2">
                {(['USDC', 'USDT', 'USD'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setBorrowCurrency(curr)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      borrowCurrency === curr
                        ? 'border-blue-900 bg-blue-900 text-white shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>

              {/* Loan Amount Input & Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-600">Requested Loan</label>
                  <span className="text-xs font-bold text-blue-950 tabular-nums">
                    LTV: {currentLTV.toFixed(1)}% / {(currentAsset.maxLTV * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    max={maxAllowableLoan}
                    value={loanAmountUSD}
                    onChange={(e) => setLoanAmountUSD(Math.min(maxAllowableLoan, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white tabular-nums"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-500">
                    {borrowCurrency}
                  </span>
                </div>
              </div>

              {/* Loan Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="500"
                  max={Math.max(500, maxAllowableLoan)}
                  step="100"
                  value={loanAmountUSD}
                  onChange={(e) => setLoanAmountUSD(parseFloat(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
                  <span>$500 min</span>
                  <span>50% LTV</span>
                  <span>${maxAllowableLoan.toLocaleString()} max</span>
                </div>
              </div>

              {/* LTV Health Meter Bar */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Borrowing Health</span>
                  <span
                    className={`font-semibold ${
                      currentLTV > 60 ? 'text-amber-600' : 'text-emerald-700'
                    }`}
                  >
                    {currentLTV > 60 ? 'Moderate LTV' : 'Safe & Healthy'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      currentLTV > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, currentLTV)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Repayment Term Selection */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                3. Repayment Duration
              </span>

              <div className="grid grid-cols-5 gap-1.5">
                {[30, 60, 90, 180, 365].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={`py-2 px-1 text-center rounded-xl border transition-all ${
                      durationDays === days
                        ? 'border-brand bg-brand text-white shadow-md shadow-brand/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{days}d</div>
                    <div className="text-[9px] opacity-80">
                      {days === 30 ? '5.9%' : days === 60 ? '6.5%' : days === 90 ? '7.2%' : days === 180 ? '8.0%' : '8.8%'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Live Cost Estimates */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Annual Percentage Rate (APR)</span>
                  <span className="font-semibold text-slate-900">{aprPercent}% Fixed</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Estimated Interest</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    ${totalInterestUSD.toFixed(2)} {borrowCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Origination Fee</span>
                  <span className="font-semibold text-emerald-600">0.00 (Promo)</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900">
                  <span>Total Repayment Due</span>
                  <span className="text-blue-900 tabular-nums">
                    ${totalRepayableUSD.toFixed(2)} {borrowCurrency}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceedToOffer}
                className="w-full h-12 bg-brand hover:bg-brand-hover text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand/25 active:scale-[0.98] transition-all min-h-[48px]"
              >
                <span>Review Loan Offer & Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {step === 'offer' && (
          /* SECTION 3.F: LOAN OFFER BREAKDOWN */
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Official Loan Agreement Offer</h3>
                  <p className="text-[11px] text-slate-500">Review terms before instant funding</p>
                </div>
              </div>

              {/* Big Loan Amount Highlight */}
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-center">
                <span className="text-xs text-blue-900 font-medium">Approved Borrow Amount</span>
                <p className="text-3xl font-extrabold text-blue-950 mt-0.5 tabular-nums">
                  ${loanAmountUSD.toLocaleString()} {borrowCurrency}
                </p>
                <p className="text-[11px] text-blue-700 mt-1">
                  Disburses directly to your demo wallet upon acceptance
                </p>
              </div>

              {/* Specifications Matrix */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Pledged Collateral</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {collateralQuantity} {currentAsset.symbol}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Collateral Market Value</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    ${collateralValueUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Initial Loan-to-Value (LTV)</span>
                  <span className="font-semibold text-blue-900 tabular-nums">
                    {currentLTV.toFixed(1)}% (Max: {(currentAsset.maxLTV * 100).toFixed(0)}%)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Fixed Annual Rate (APR)</span>
                  <span className="font-semibold text-slate-900">{aprPercent}%</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Duration & Term</span>
                  <span className="font-semibold text-slate-900">{durationDays} Calendar Days</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Maturity Repayment Date</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' }
                    )}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Total Interest & Fees</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    ${totalInterestUSD.toFixed(2)} {borrowCurrency}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-900 font-bold">Total Repayment Amount</span>
                  <span className="text-sm font-extrabold text-blue-950 tabular-nums">
                    ${totalRepayableUSD.toFixed(2)} {borrowCurrency}
                  </span>
                </div>
              </div>

              {/* Liquidation Threshold Callout */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Estimated Liquidation Threshold</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  If {currentAsset.symbol} price drops below{' '}
                  <strong className="font-bold tabular-nums">
                    ${liquidationPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </strong>{' '}
                  (a <span className="font-bold tabular-nums">{priceDropBufferPercent.toFixed(1)}%</span> buffer from current ${currentAsset.priceUSD.toLocaleString()}), the LTV reaches {(currentAsset.liquidationLTV * 100).toFixed(0)}% liquidation risk.
                </p>
              </div>

              {/* Repayment Schedule Info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Repayment Flexibility</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  You may repay at any time with zero early payoff penalties. Collateral will be released back to your wallet immediately upon final settlement.
                </p>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-900"
                />
                <span className="text-[11px] text-slate-600">
                  I understand this is a simulated demo loan and agree to pledge{' '}
                  <strong>
                    {collateralQuantity} {currentAsset.symbol}
                  </strong>{' '}
                  as collateral to borrow{' '}
                  <strong>
                    ${loanAmountUSD.toLocaleString()} {borrowCurrency}
                  </strong>
                  .
                </span>
              </label>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={!isTermsAccepted || isSubmitting}
                  onClick={handleConfirmLoan}
                  className="w-full h-12 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-brand/25 active:scale-[0.98] transition-all min-h-[48px]"
                >
                  {isSubmitting ? (
                    <span>Disbursing Funds...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Offer & Disburse Funds</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('configure')}
                  className="w-full py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel & Change Terms
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'approved' && (
          /* SECTION 3.F/SUCCESS: CONFIRMATION */
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Loan Active & Funded
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                ${loanAmountUSD.toLocaleString()} {borrowCurrency}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Loan ID: <strong className="font-mono text-slate-800">{createdLoanId}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursed To</span>
                <span className="font-semibold text-slate-800">Demo Cash Balance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Locked Collateral</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {collateralQuantity} {currentAsset.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">First Due Date</span>
                <span className="font-semibold text-slate-800">
                  {new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => onSuccess(createdLoanId)}
                className="w-full h-12 bg-brand hover:bg-brand-hover text-white font-semibold text-xs rounded-xl shadow-md shadow-brand/25 transition-all flex items-center justify-center gap-1.5 min-h-[48px]"
              >
                <span>View Loan in My Loans</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
