import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';
import { getSession, getApplication, clearSession, clearApplication, MoMoSession, LoanApplication } from '../lib/session';
import {
  LogOut,
  FileText,
  Clock,
  ArrowRight,
  Search,
  ChevronDown,
  Building2,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

const setswanaProverbs = [
  { setswana: 'Kgetsi ya tsie e kgonwa ke go tshwaraganelwa', english: 'Success in enterprise is achieved through collective effort and partnership.' },
  { setswana: 'Lore lo ojwa lo sa le metsi', english: 'Invest early in your business to shape a resilient commercial future.' },
  { setswana: 'Motho ke motho ka batho', english: 'A business flourishes when it serves and uplifts its community.' },
  { setswana: 'Sedibana se nkgo ha se tlhoke motlhodi', english: 'A good opportunity and prudent credit need no boast.' },
  { setswana: 'Matlo go sha mabapi', english: 'Support your fellow entrepreneurs and build mutual prosperity.' },
];

function LoggedInHome({
  session,
  application,
  onLogout,
}: {
  session: MoMoSession;
  application: LoanApplication | null;
  onLogout: () => void;
}) {
  const navigate = useNavigate();
  const [proverbIndex, setProverbIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProverbIndex((i) => (i + 1) % setswanaProverbs.length);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const proverb = setswanaProverbs[proverbIndex];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      {/* Top Utility Bar */}
      <div className="bg-black text-white text-xs py-2 px-4 border-b border-gray-800">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#ff7900]">
              <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
              <span>Personal</span>
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer font-bold text-[#ff7900]">
              <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
              <span>Business</span>
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#ff7900] hidden sm:inline-flex">
              <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
              <span>Store Locator Botswana</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-medium">Orange Money: {session.countryCode} {session.phone}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-[#ff7900] text-black px-2.5 py-1 rounded text-xs font-bold hover:bg-[#e06b00] transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 py-3.5 px-4 sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
            <span className="font-black text-xl sm:text-2xl tracking-tight">
              <span className="text-[#ff7900]">Orange</span> <span className="text-black">Loans</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!application && (
              <button
                onClick={() => navigate('/apply')}
                className="bg-[#ff7900] text-white px-5 py-2.5 rounded font-black text-xs sm:text-sm uppercase tracking-wide hover:bg-[#e06b00] transition shadow-sm"
              >
                Apply for Loan
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-8">
        <div className="bg-[#f6f6f6] border border-gray-200 rounded-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff7900] uppercase mb-1">
                <span className="w-2 h-2 bg-[#ff7900]"></span>
                <span>Active Orange Money Account · Botswana</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black">
                Welcome back
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Verified Mobile: <span className="font-bold text-black">{session.countryCode} {session.phone}</span>
              </p>
            </div>
            {!application && (
              <button
                onClick={() => navigate('/apply')}
                className="bg-[#ff7900] text-white px-6 py-3 rounded font-black text-sm uppercase tracking-wide hover:bg-[#e06b00] transition flex items-center gap-2"
              >
                <span>Apply for Loan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {application ? (
          <div className="bg-white border-2 border-black rounded-lg p-6 sm:p-8 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ff7900] text-white flex items-center justify-center rounded shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-black">Your Loan Application</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Submitted on {new Date(application.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#ff7900]/15 text-[#ff7900] px-3 py-1.5 rounded font-black text-xs uppercase tracking-wider w-fit">
                <span className="w-2 h-2 bg-[#ff7900]"></span>
                <span>Status: Under Fast Review</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#f6f6f6] p-4 rounded border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Requested Amount</p>
                <p className="font-black text-lg text-[#ff7900]">{application.amount}</p>
              </div>
              <div className="bg-[#f6f6f6] p-4 rounded border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tenure</p>
                <p className="font-bold text-sm text-black">{application.repayment}</p>
              </div>
              <div className="bg-[#f6f6f6] p-4 rounded border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Purpose</p>
                <p className="font-bold text-sm text-black truncate">{application.purpose}</p>
              </div>
              <div className="bg-[#f6f6f6] p-4 rounded border border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Applicant</p>
                <p className="font-bold text-sm text-black truncate">{application.firstName} {application.lastName}</p>
              </div>
            </div>

            <div className="bg-[#f6f6f6] p-4 rounded border border-gray-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5 text-xs text-gray-700">
                <Clock className="w-4 h-4 text-[#ff7900] shrink-0" />
                <span>Our automated credit engine is assessing your application. Funds are paid directly to your Orange Money wallet.</span>
              </div>
              <button
                onClick={() => navigate('/apply')}
                className="text-xs font-bold text-[#ff7900] hover:underline"
              >
                Submit another application
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-black rounded-lg p-8 text-center mb-8">
            <div className="w-14 h-14 bg-[#ff7900] text-white flex items-center justify-center mx-auto mb-4 rounded">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-black">Instant Orange Loans in Botswana</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
              Get an instant Orange Money loan up to P 50,000 disbursed directly to your mobile wallet within minutes.
            </p>
            <button
              onClick={() => navigate('/apply')}
              className="px-8 py-3.5 bg-[#ff7900] text-white font-black text-sm uppercase tracking-wide hover:bg-[#e06b00] transition inline-flex items-center gap-2 rounded"
            >
              <span>Apply for Loan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Setswana Wisdom */}
        <div className="bg-[#f6f6f6] border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff7900] uppercase mb-2">
            <span className="w-2 h-2 bg-[#ff7900]"></span>
            <span>Botswana Business Wisdom</span>
          </div>
          <p className="text-lg font-black text-black italic">
            "{proverb.setswana}"
          </p>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            — {proverb.english}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [session, setSessionState] = useState<MoMoSession | null>(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setSessionState(getSession());
  }, []);

  const handleLogout = () => {
    clearSession();
    clearApplication();
    setSessionState(null);
  };

  if (session?.loggedIn) {
    return (
      <PageLoader>
        <LoggedInHome session={session} application={getApplication()} onLogout={handleLogout} />
      </PageLoader>
    );
  }

  // Handle CTA: Users apply for loan first thing before sign in
  const handleProceedToLoan = () => {
    navigate('/apply');
  };

  return (
    <PageLoader>
      <div className="min-h-screen bg-white text-black flex flex-col font-sans antialiased">
        {/* Top Utility Header - Matching Orange Screenshot */}
        <div className="border-b border-gray-200 text-xs bg-white py-2 px-4">
          <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3">
            {/* Top items with orange square bullets */}
            <div className="flex items-center gap-4 sm:gap-6 text-black font-semibold">
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#ff7900] transition">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Personal</span>
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#ff7900] transition">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Business</span>
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#ff7900] transition hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Store Locator</span>
              </span>
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#ff7900] transition hidden md:inline-flex">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Confort +</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Brand & Navigation Bar - Matching Screenshot */}
        <header className="border-b border-gray-200 py-3 px-4 bg-white sticky top-0 z-40">
          <div className="container mx-auto max-w-6xl flex items-center justify-between">
            {/* Brand Logo & Title with "Orange" in orange */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Logo size="md" />
              <div className="flex flex-col">
                <span className="font-black text-2xl sm:text-3xl tracking-tight leading-none">
                  <span className="text-[#ff7900]">Orange</span> <span className="text-black">Loans</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-0.5">
                  Botswana
                </span>
              </div>
            </div>

            {/* Menu Items with Orange square bullet markers */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-black">
              <span className="flex items-center gap-1.5 hover:text-[#ff7900] cursor-pointer">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Mobile</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#ff7900] cursor-pointer">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Home Internet</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </span>
              <span className="flex items-center gap-1.5 text-[#ff7900] cursor-pointer">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Orange Money</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#ff7900]" />
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#ff7900] cursor-pointer">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Support</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#ff7900] cursor-pointer">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Store Locator</span>
              </span>
            </nav>

            {/* Sign in quick action */}
            <div className="flex items-center gap-2">
              <button
                id="top-signin-btn"
                onClick={handleProceedToLoan}
                className="border border-black text-black px-4 py-2 rounded text-xs sm:text-sm font-bold hover:bg-black hover:text-white transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-1 container mx-auto max-w-4xl px-4 py-12 sm:py-16 flex flex-col items-center text-center">
          {/* Subtitle kicker with orange square */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f6f6f6] border border-gray-300 text-xs font-bold text-black mb-6">
            <span className="w-2 h-2 bg-[#ff7900] inline-block"></span>
            <span>Orange Money Financing · Botswana</span>
          </div>

          {/* Logo in center */}
          <Logo size="xl" className="mb-6" />

          {/* Headline: Orange in orange color */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-black max-w-3xl leading-tight mb-6">
            Empower Your Business with Instant <span className="text-[#ff7900]">Orange Loans</span>
          </h1>

          <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
            Get instant mobile money business loans directly to your Orange Money wallet in Botswana. Quick disbursements in Botswana Pula (P), transparent terms, and zero paperwork.
          </p>

          {/* Primary Action Button: "Apply now" */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 w-full max-w-md">
            <button
              id="hero-signup-btn"
              onClick={handleProceedToLoan}
              className="w-full py-4 px-8 rounded bg-[#ff7900] text-white font-black text-base sm:text-lg hover:bg-[#e06b00] transition shadow-md flex items-center justify-center gap-2.5 uppercase tracking-wide group"
            >
              <span>Apply now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-xs text-gray-500 font-semibold">
            Apply for your loan first in 2 simple steps, then sign in with Orange Money to withdraw your funds immediately.
          </p>
        </section>
      </div>
    </PageLoader>
  );
}
