export type AssetId = 'BTC' | 'ETH' | 'USDC' | 'USDT';

export interface CryptoAsset {
  id: AssetId;
  name: string;
  symbol: string;
  priceUSD: number;
  change24h: number;
  walletBalance: number; // user's demo wallet balance
  collateralDeposited: number; // locked in Coinlend vault
  maxLTV: number; // e.g. 0.65 for 65%
  liquidationLTV: number; // e.g. 0.85 for 85%
  iconBg: string;
  decimals: number;
}

export type LoanStatus = 'active' | 'repaid' | 'at_risk';

export interface RepaymentTransaction {
  id: string;
  date: string;
  amountUSD: number;
  type: 'principal' | 'interest' | 'full';
  method: string;
  txHash: string;
}

export interface Loan {
  id: string;
  borrowCurrency: 'USDC' | 'USDT' | 'USD';
  principalUSD: number;
  collateralAssetId: AssetId;
  collateralQuantity: number;
  collateralValueUSDAtStart: number;
  aprPercent: number;
  durationDays: number;
  startDate: string; // ISO string
  dueDate: string; // ISO string
  status: LoanStatus;
  totalRepaymentDueUSD: number;
  totalRepaidUSD: number;
  outstandingBalanceUSD: number;
  repaymentHistory: RepaymentTransaction[];
  liquidationPriceUSD: number;
}

export interface ActivityItem {
  id: string;
  type: 'loan_disbursed' | 'repayment' | 'collateral_deposit' | 'collateral_withdraw' | 'kyc_verified';
  title: string;
  amount: string;
  date: string;
  status: 'completed' | 'processing';
  assetSymbol?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  kycLevel: 1 | 2;
  kycStatus: 'unverified' | 'pending' | 'verified';
  walletAddress: string;
  cashBalanceUSD: number;
  twoFactorEnabled: boolean;
  biometricsEnabled: boolean;
  notificationsEnabled: boolean;
}
