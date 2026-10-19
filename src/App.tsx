import React, { useState } from 'react';
import { LoanProvider, useLoan } from './context/LoanContext';
import { Navbar, NavTabKey } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { LoanApplication } from './components/LoanApplication';
import { MyLoans } from './components/MyLoans';
import { AccountScreen } from './components/AccountScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthModal } from './components/AuthModal';
import { CollateralModal } from './components/CollateralModal';
import { LoanDetailsModal } from './components/LoanDetailsModal';
import { KycVerificationModal } from './components/KycVerificationModal';
import { AssetId, Loan } from './types';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, logout, loans } = useLoan();

  // Navigation: Full web application tab state
  const [currentTab, setCurrentTab] = useState<NavTabKey>('dashboard');
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('login');
  const [isCollateralOpen, setIsCollateralOpen] = useState<boolean>(false);
  const [collateralAsset, setCollateralAsset] = useState<AssetId>('BTC');
  const [collateralAction, setCollateralAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isKycOpen, setIsKycOpen] = useState<boolean>(false);

  const handleOpenCollateral = (assetId: AssetId = 'BTC', action: 'deposit' | 'withdraw' = 'deposit') => {
    setCollateralAsset(assetId);
    setCollateralAction(action);
    setIsCollateralOpen(true);
  };

  const handleLoanCreatedSuccess = (loanId: string) => {
    setCurrentTab('my-loans');
    const newlyCreated = loans.find((l) => l.id === loanId);
    if (newlyCreated) {
      setSelectedLoan(newlyCreated);
    }
  };

  // If user is not authenticated or explicitly logged out
  if (!isAuthenticated || showWelcome) {
    return (
      <div className="min-h-screen bg-slate-50">
        <WelcomeScreen
          onGetStarted={() => {
            setShowWelcome(false);
            setAuthDefaultMode('register');
            setIsAuthOpen(true);
          }}
          onLogIn={() => {
            setShowWelcome(false);
            setAuthDefaultMode('login');
            setIsAuthOpen(true);
          }}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          defaultMode={authDefaultMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans">
      {/* Top Web Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'collateral') {
            handleOpenCollateral();
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCollateral={() => handleOpenCollateral()}
      />

      {/* Main Full-Viewport Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <HomeDashboard
            onStartLoan={() => setCurrentTab('loan')}
            onOpenCollateral={handleOpenCollateral}
            onSelectLoan={(loan) => setSelectedLoan(loan)}
            onOpenKyc={() => setIsKycOpen(true)}
          />
        )}

        {currentTab === 'loan' && (
          <LoanApplication
            onSuccess={handleLoanCreatedSuccess}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'my-loans' && (
          <MyLoans
            onSelectLoan={(loan) => setSelectedLoan(loan)}
            onApplyNewLoan={() => setCurrentTab('loan')}
          />
        )}

        {currentTab === 'account' && (
          <AccountScreen
            onOpenKyc={() => setIsKycOpen(true)}
            onLogOut={() => {
              logout();
              setShowWelcome(true);
            }}
          />
        )}
      </main>

      {/* Interactive Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authDefaultMode}
      />

      <CollateralModal
        isOpen={isCollateralOpen}
        onClose={() => setIsCollateralOpen(false)}
        defaultAssetId={collateralAsset}
        defaultAction={collateralAction}
      />

      <LoanDetailsModal
        isOpen={selectedLoan !== null}
        loan={selectedLoan}
        onClose={() => setSelectedLoan(null)}
      />

      <KycVerificationModal isOpen={isKycOpen} onClose={() => setIsKycOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <LoanProvider>
      <MainAppContent />
    </LoanProvider>
  );
}
