import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';
import Confetti from '../components/Confetti';
import { clearSession, clearApplication, getApplication } from '../lib/session';
import { CheckCircle2, Home, LogOut, FileCheck, Smartphone } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();
  const application = getApplication();

  const handleLogout = () => {
    clearSession();
    clearApplication();
    navigate('/');
  };

  return (
    <PageLoader>
      <div className="min-h-screen bg-white text-black flex flex-col font-sans relative overflow-x-hidden">
        <Confetti />

        {/* Top Header */}
        <header className="bg-black text-white py-3 px-4 shadow-sm border-b border-gray-800 sticky top-0 z-40">
          <div className="container mx-auto max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Logo size="sm" />
              <span className="font-black text-lg sm:text-xl tracking-tight">
                <span className="text-[#ff7900]">Orange</span> <span className="text-white">Loans</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ff7900]"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Application Approved
              </span>
            </div>
          </div>
        </header>

        {/* Main Success Container */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="bg-white rounded-lg p-8 sm:p-10 text-center max-w-md w-full shadow-sm text-black border-2 border-black relative z-10">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-black">
              Loan Application Confirmed!
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
              Your Orange Money business loan has been verified and approved. Funds are being prepared for immediate transfer to your registered Orange Money Botswana wallet.
            </p>

            {application && (
              <div className="bg-[#f6f6f6] rounded-lg p-4 border border-gray-300 mb-6 text-left text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-black text-black pb-2 border-b border-gray-300">
                  <FileCheck className="w-4 h-4 text-[#ff7900]" />
                  <span className="uppercase tracking-wider">Disbursement Details</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Applicant:</span>
                  <span className="font-bold text-black">{application.firstName} {application.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Approved Amount:</span>
                  <span className="font-black text-[#ff7900] text-sm">{application.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Repayment Tenure:</span>
                  <span className="font-bold text-black">{application.repayment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Credit Purpose:</span>
                  <span className="font-bold text-black">{application.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Destination:</span>
                  <span className="font-bold text-green-700">Orange Money Wallet</span>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-[#ff7900]/40 rounded-lg p-3.5 mb-6 text-xs text-gray-800 flex items-center gap-2.5 text-left">
              <Smartphone className="w-5 h-5 text-[#ff7900] shrink-0" />
              <span>You will receive an official Orange Money SMS confirmation when the funds credit your balance.</span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                id="success-home-btn"
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded bg-[#ff7900] text-white font-black text-sm uppercase tracking-wide hover:bg-[#e06b00] transition shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
              <button
                id="success-logout-btn"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded border border-gray-300 text-black font-bold text-sm uppercase tracking-wide transition hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageLoader>
  );
}
