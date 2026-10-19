import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  FileText,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLoan } from '../context/LoanContext';

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({ isOpen, onClose }) => {
  const { user, completeKyc } = useLoan();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [docType, setDocType] = useState<'passport' | 'id_card' | 'drivers_license'>('passport');
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep(3);
    }, 1200);
  };

  const handleCompleteSelfie = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      completeKyc(2);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Identity Verification</h2>
              <p className="text-[11px] text-slate-500">Tier 2 Lending Authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UserCheck className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Verify for Higher Borrowing Limits</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Complete simulated verification to unlock up to $100,000 in instant crypto borrowing limits.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Legal Name</span>
                  <span className="font-semibold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Email</span>
                  <span className="font-semibold text-slate-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Tier</span>
                  <span className="font-semibold text-emerald-700">Tier 1 ($25,000 limit)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Upgrade</span>
                  <span className="font-bold text-blue-900">Tier 2 ($100,000 limit)</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Select Government ID Document</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Choose Document Type
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'passport', title: 'Passport', desc: 'International travel passport' },
                    { id: 'id_card', title: 'National Identity Card', desc: 'Government issued photo ID' },
                    { id: 'drivers_license', title: "Driver's License", desc: 'State motor vehicle license' },
                  ].map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setDocType(doc.id as any)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        docType === doc.id
                          ? 'border-blue-900 bg-blue-50/60 shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-900" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{doc.title}</p>
                          <p className="text-[10px] text-slate-500">{doc.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          docType === doc.id ? 'border-blue-900 bg-blue-900 text-white' : 'border-slate-300'
                        }`}
                      >
                        {docType === doc.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                <strong>Simulated Privacy Notice:</strong> No real identity files or personal photos will be uploaded or transmitted.
              </div>

              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className="w-full h-11 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                {isScanning ? (
                  <span>Simulating ID Capture & OCR...</span>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Simulate Document Scan</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-blue-400 flex items-center justify-center mx-auto bg-blue-50">
                <Camera className="w-8 h-8 text-blue-800" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">Simulated Liveness Check</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Position your face in the oval and hold still for 2 seconds.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                Document data verified: <span className="font-semibold text-slate-900">Alex Vance &middot; US Pass: #E849201</span>
              </div>

              <button
                onClick={handleCompleteSelfie}
                disabled={isScanning}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                {isScanning ? (
                  <span>Verifying Biometric Liveness...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Verification</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Verification Approved
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Tier 2 Activated</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Your borrowing limit has been upgraded to $100,000 USD equivalent.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
              >
                Done & Return to App
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
