import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CryptoAsset, Loan, ActivityItem, UserProfile, AssetId } from '../types';
import { INITIAL_ASSETS, INITIAL_USER, INITIAL_LOANS, INITIAL_ACTIVITIES } from '../data/mockData';

interface LoanContextType {
  assets: CryptoAsset[];
  user: UserProfile;
  loans: Loan[];
  activities: ActivityItem[];
  isAuthenticated: boolean;
  totalCollateralValueUSD: number;
  totalOutstandingLoanUSD: number;
  maxBorrowCapacityUSD: number;
  availableBorrowLimit: number;
  overallLTV: number;
  // Actions
  login: (emailOrPhone: string) => void;
  logout: () => void;
  depositCollateral: (assetId: AssetId, amount: number) => { success: boolean; message: string };
  withdrawCollateral: (assetId: AssetId, amount: number) => { success: boolean; message: string };
  applyForLoan: (params: {
    collateralAssetId: AssetId;
    collateralQuantity: number;
    borrowCurrency: 'USDC' | 'USDT' | 'USD';
    principalUSD: number;
    durationDays: number;
    aprPercent: number;
  }) => { success: boolean; loanId?: string; message: string };
  repayLoan: (
    loanId: string,
    amountUSD: number,
    repaymentType: 'principal' | 'interest' | 'full'
  ) => { success: boolean; message: string };
  completeKyc: (tier: 1 | 2) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'dake_state_v1';

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [assets, setAssets] = useState<CryptoAsset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_loans');
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_activities', JSON.stringify(activities));
  }, [activities]);

  // Aggregate calculations
  const totalCollateralValueUSD = assets.reduce(
    (sum, asset) => sum + asset.collateralDeposited * asset.priceUSD,
    0
  );

  const activeLoans = loans.filter((l) => l.status === 'active');

  const totalOutstandingLoanUSD = activeLoans.reduce(
    (sum, loan) => sum + loan.outstandingBalanceUSD,
    0
  );

  const maxBorrowCapacityUSD = assets.reduce(
    (sum, asset) => sum + asset.collateralDeposited * asset.priceUSD * asset.maxLTV,
    0
  );

  const availableBorrowLimit = Math.max(0, maxBorrowCapacityUSD - totalOutstandingLoanUSD);

  const overallLTV =
    totalCollateralValueUSD > 0
      ? (totalOutstandingLoanUSD / totalCollateralValueUSD) * 100
      : 0;

  const login = (emailOrPhone: string) => {
    setIsAuthenticated(true);
    setUser((prev) => ({
      ...prev,
      email: emailOrPhone.includes('@') ? emailOrPhone : prev.email,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : prev.phone,
    }));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const depositCollateral = (assetId: AssetId, amount: number) => {
    if (amount <= 0) {
      return { success: false, message: 'Deposit amount must be greater than zero.' };
    }
    const targetAsset = assets.find((a) => a.id === assetId);
    if (!targetAsset) {
      return { success: false, message: 'Asset not found.' };
    }
    if (amount > targetAsset.walletBalance) {
      return { success: false, message: `Insufficient ${targetAsset.symbol} in demo wallet.` };
    }

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          return {
            ...a,
            walletBalance: a.walletBalance - amount,
            collateralDeposited: a.collateralDeposited + amount,
          };
        }
        return a;
      })
    );

    const usdVal = (amount * targetAsset.priceUSD).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });

    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now().toString().slice(-4),
        type: 'collateral_deposit',
        title: `Collateral Vault Deposit`,
        amount: `+${amount} ${targetAsset.symbol} ($${usdVal})`,
        date: 'Just now',
        status: 'completed',
        assetSymbol: targetAsset.symbol,
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Successfully locked ${amount} ${targetAsset.symbol} as collateral!`,
    };
  };

  const withdrawCollateral = (assetId: AssetId, amount: number) => {
    if (amount <= 0) {
      return { success: false, message: 'Withdrawal amount must be greater than zero.' };
    }
    const targetAsset = assets.find((a) => a.id === assetId);
    if (!targetAsset) {
      return { success: false, message: 'Asset not found.' };
    }
    if (amount > targetAsset.collateralDeposited) {
      return {
        success: false,
        message: `Cannot withdraw more than deposited collateral (${targetAsset.collateralDeposited} ${targetAsset.symbol}).`,
      };
    }

    // Safety check: ensure remaining collateral still covers outstanding loans
    const remainingDeposited = targetAsset.collateralDeposited - amount;
    const remainingCapacity = assets.reduce((sum, a) => {
      const dep = a.id === assetId ? remainingDeposited : a.collateralDeposited;
      return sum + dep * a.priceUSD * a.maxLTV;
    }, 0);

    if (remainingCapacity < totalOutstandingLoanUSD) {
      return {
        success: false,
        message: `Withdrawal rejected: Outstanding loans require this collateral to avoid liquidation.`,
      };
    }

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          return {
            ...a,
            walletBalance: a.walletBalance + amount,
            collateralDeposited: a.collateralDeposited - amount,
          };
        }
        return a;
      })
    );

    const usdVal = (amount * targetAsset.priceUSD).toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });

    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now().toString().slice(-4),
        type: 'collateral_withdraw',
        title: `Collateral Vault Withdrawal`,
        amount: `-${amount} ${targetAsset.symbol} ($${usdVal})`,
        date: 'Just now',
        status: 'completed',
        assetSymbol: targetAsset.symbol,
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Released ${amount} ${targetAsset.symbol} back to your wallet!`,
    };
  };

  const applyForLoan = (params: {
    collateralAssetId: AssetId;
    collateralQuantity: number;
    borrowCurrency: 'USDC' | 'USDT' | 'USD';
    principalUSD: number;
    durationDays: number;
    aprPercent: number;
  }) => {
    const {
      collateralAssetId,
      collateralQuantity,
      borrowCurrency,
      principalUSD,
      durationDays,
      aprPercent,
    } = params;

    const targetAsset = assets.find((a) => a.id === collateralAssetId);
    if (!targetAsset) {
      return { success: false, message: 'Collateral asset not recognized.' };
    }

    const collateralValueUSD = collateralQuantity * targetAsset.priceUSD;
    const maxLoanForAsset = collateralValueUSD * targetAsset.maxLTV;

    if (principalUSD > maxLoanForAsset) {
      return {
        success: false,
        message: `Loan exceeds maximum LTV of ${(targetAsset.maxLTV * 100).toFixed(0)}% ($${maxLoanForAsset.toFixed(2)}).`,
      };
    }

    // Ensure user has enough in wallet if they are allocating fresh collateral
    if (collateralQuantity > targetAsset.walletBalance + targetAsset.collateralDeposited) {
      return {
        success: false,
        message: `Insufficient ${targetAsset.symbol} available to back this loan.`,
      };
    }

    // Deduct from wallet & put into collateralDeposited if needed
    const additionalCollateralNeeded = Math.max(0, collateralQuantity - targetAsset.collateralDeposited);
    if (additionalCollateralNeeded > 0) {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id === collateralAssetId) {
            return {
              ...a,
              walletBalance: a.walletBalance - additionalCollateralNeeded,
              collateralDeposited: a.collateralDeposited + additionalCollateralNeeded,
            };
          }
          return a;
        })
      );
    }

    // Calculations
    const interestUSD = principalUSD * (aprPercent / 100) * (durationDays / 365);
    const totalRepaymentDueUSD = Number((principalUSD + interestUSD).toFixed(2));
    const liquidationPriceUSD = Number(
      (principalUSD / (targetAsset.liquidationLTV * collateralQuantity)).toFixed(2)
    );

    const loanId = 'LN-' + Math.floor(10000 + Math.random() * 90000);
    const startDate = new Date().toISOString();
    const dueDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const newLoan: Loan = {
      id: loanId,
      borrowCurrency,
      principalUSD,
      collateralAssetId,
      collateralQuantity,
      collateralValueUSDAtStart: collateralValueUSD,
      aprPercent,
      durationDays,
      startDate,
      dueDate,
      status: 'active',
      totalRepaymentDueUSD,
      totalRepaidUSD: 0,
      outstandingBalanceUSD: totalRepaymentDueUSD,
      repaymentHistory: [],
      liquidationPriceUSD,
    };

    setLoans((prev) => [newLoan, ...prev]);

    // Update user cash balance
    setUser((prev) => ({
      ...prev,
      cashBalanceUSD: prev.cashBalanceUSD + principalUSD,
    }));

    // Record activity
    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now().toString().slice(-4),
        type: 'loan_disbursed',
        title: `Loan Disbursed (#${loanId})`,
        amount: `+$${principalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${borrowCurrency}`,
        date: 'Just now',
        status: 'completed',
        assetSymbol: borrowCurrency,
      },
      ...prev,
    ]);

    return {
      success: true,
      loanId,
      message: `Your loan #${loanId} of $${principalUSD.toLocaleString()} ${borrowCurrency} has been approved and funded!`,
    };
  };

  const repayLoan = (
    loanId: string,
    amountUSD: number,
    repaymentType: 'principal' | 'interest' | 'full'
  ) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      return { success: false, message: 'Loan not found.' };
    }
    if (loan.status === 'repaid') {
      return { success: false, message: 'This loan has already been settled in full.' };
    }

    const actualPayAmount = Math.min(amountUSD, loan.outstandingBalanceUSD);
    if (actualPayAmount <= 0) {
      return { success: false, message: 'Payment amount must be greater than zero.' };
    }

    const newOutstanding = Number(Math.max(0, loan.outstandingBalanceUSD - actualPayAmount).toFixed(2));
    const newTotalRepaid = Number((loan.totalRepaidUSD + actualPayAmount).toFixed(2));
    const isFullyRepaid = newOutstanding <= 0.05;

    const newTransaction = {
      id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString(),
      amountUSD: actualPayAmount,
      type: isFullyRepaid ? ('full' as const) : repaymentType,
      method: `${loan.borrowCurrency} Balance`,
      txHash: '0x' + Math.random().toString(16).substring(2, 10) + '...f9c',
    };

    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          return {
            ...l,
            outstandingBalanceUSD: isFullyRepaid ? 0 : newOutstanding,
            totalRepaidUSD: newTotalRepaid,
            status: isFullyRepaid ? 'repaid' : 'active',
            repaymentHistory: [newTransaction, ...l.repaymentHistory],
          };
        }
        return l;
      })
    );

    // If fully repaid, release collateral back to user's wallet
    if (isFullyRepaid) {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id === loan.collateralAssetId) {
            return {
              ...a,
              walletBalance: a.walletBalance + loan.collateralQuantity,
              collateralDeposited: Math.max(0, a.collateralDeposited - loan.collateralQuantity),
            };
          }
          return a;
        })
      );
    }

    // Deduct from demo cash balance if available
    setUser((prev) => ({
      ...prev,
      cashBalanceUSD: Math.max(0, prev.cashBalanceUSD - actualPayAmount),
    }));

    // Record activity
    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now().toString().slice(-4),
        type: 'repayment',
        title: isFullyRepaid
          ? `Loan Fully Repaid (#${loanId})`
          : `Loan Payment (#${loanId})`,
        amount: `-$${actualPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${loan.borrowCurrency}`,
        date: 'Just now',
        status: 'completed',
        assetSymbol: loan.borrowCurrency,
      },
      ...prev,
    ]);

    return {
      success: true,
      message: isFullyRepaid
        ? `Loan #${loanId} fully repaid! Collateral of ${loan.collateralQuantity} ${loan.collateralAssetId} has been released to your wallet.`
        : `Successfully paid $${actualPayAmount.toLocaleString()} towards loan #${loanId}. Remaining: $${newOutstanding.toLocaleString()}`,
    };
  };

  const completeKyc = (tier: 1 | 2) => {
    setUser((prev) => ({
      ...prev,
      kycLevel: tier,
      kycStatus: 'verified',
    }));
    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now().toString().slice(-4),
        type: 'kyc_verified',
        title: `Tier ${tier} Identity Verified`,
        amount: tier === 2 ? 'Limit: $100,000' : 'Limit: $25,000',
        date: 'Just now',
        status: 'completed',
      },
      ...prev,
    ]);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const resetDemoData = () => {
    setAssets(INITIAL_ASSETS);
    setUser(INITIAL_USER);
    setLoans(INITIAL_LOANS);
    setActivities(INITIAL_ACTIVITIES);
    setIsAuthenticated(true);
    localStorage.removeItem(STORAGE_KEY + '_assets');
    localStorage.removeItem(STORAGE_KEY + '_user');
    localStorage.removeItem(STORAGE_KEY + '_loans');
    localStorage.removeItem(STORAGE_KEY + '_activities');
    localStorage.removeItem(STORAGE_KEY + '_auth');
  };

  return (
    <LoanContext.Provider
      value={{
        assets,
        user,
        loans,
        activities,
        isAuthenticated,
        totalCollateralValueUSD,
        totalOutstandingLoanUSD,
        maxBorrowCapacityUSD,
        availableBorrowLimit,
        overallLTV,
        login,
        logout,
        depositCollateral,
        withdrawCollateral,
        applyForLoan,
        repayLoan,
        completeKyc,
        updateUser,
        resetDemoData,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};
