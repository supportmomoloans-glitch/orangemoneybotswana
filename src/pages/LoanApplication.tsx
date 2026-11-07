import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import PageLoader from '../components/PageLoader';
import { ChevronDown, ArrowLeft, Building2, Calculator, ArrowRight } from 'lucide-react';

const loanPurposes = [
  'Business Expansion',
  'Working Capital',
  'Equipment Purchase',
  'Agriculture & Livestock',
  'Trade & Commerce',
  'Transport & Logistics',
  'Education & Training',
  'Other',
];

const loanTypes = [
  'Orange Business Loan',
  'SME Working Capital',
  'Salary Advance',
  'Emergency Commercial Credit',
];

const repaymentPeriods = [
  '1 Month',
  '3 Months',
  '6 Months',
  '12 Months',
];

const amounts = [
  'P 1,000',
  'P 2,500',
  'P 5,000',
  'P 10,000',
  'P 20,000',
  'P 35,000',
  'P 50,000',
  'P 100,000',
];

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
        <span>{label} *</span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border-2 border-gray-300 focus:border-[#ff7900] rounded-lg px-4 py-3.5 text-sm sm:text-base font-bold text-black outline-none bg-white pr-10 shadow-xs transition"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

export default function LoanApplication() {
  const navigate = useNavigate();
  const [amountInput, setAmountInput] = useState('0');
  const [purpose, setPurpose] = useState('Business Expansion');
  const [type, setType] = useState('Orange Business Loan');
  const [repayment, setRepayment] = useState('6 Months');

  const numAmount = parseFloat(amountInput) || 0;
  const formattedAmount = `P ${numAmount.toLocaleString()}`;
  const valid = numAmount > 0 && purpose && type && repayment;

  return (
    <PageLoader>
      <div className="min-h-screen bg-white text-black flex flex-col font-sans">
        {/* Header */}
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
                Step 1 of 2: Loan Terms
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 container mx-auto max-w-lg px-4 py-8 sm:py-12">
          <div className="bg-white rounded-lg p-6 sm:p-8 text-black border border-gray-300 shadow-sm">
            <button
              id="loan-app-back-btn"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-gray-600 hover:text-black text-xs font-bold uppercase tracking-wider mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4 text-[#ff7900]" />
              <span>Back to Home</span>
            </button>

            <div className="text-left mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff7900] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 bg-[#ff7900]"></span>
                <span>Botswana Mobile Money Loan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Configure Your Loan
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Enter any loan amount you want in Botswana Pula (P) and choose repayment tenure
              </p>
            </div>

            {/* Editable Loan Amount Box - Zero by Default */}
            <div className="mb-5">
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Loan Amount (Pula) *</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-black text-lg text-[#ff7900] select-none pointer-events-none">
                  P
                </span>
                <input
                  id="input-loan-amount"
                  type="number"
                  min="0"
                  step="100"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0"
                  className="w-full border-2 border-gray-300 focus:border-[#ff7900] rounded-lg pl-10 pr-4 py-3.5 text-base font-black text-black outline-none shadow-xs transition bg-white"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Enter your desired loan amount.
              </p>
            </div>

            <SelectField
              id="select-loan-purpose"
              label="Purpose of Loan"
              value={purpose}
              onChange={setPurpose}
              options={loanPurposes}
            />
            <SelectField
              id="select-loan-type"
              label="Type of Credit"
              value={type}
              onChange={setType}
              options={loanTypes}
            />
            <SelectField
              id="select-repayment-period"
              label="Repayment Tenure"
              value={repayment}
              onChange={setRepayment}
              options={repaymentPeriods}
            />

            {/* Quick Summary Box */}
            {numAmount > 0 && (
              <div className="bg-[#f6f6f6] rounded-lg p-4 border border-gray-300 mb-6">
                <div className="flex items-center gap-2 text-xs font-black text-black uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
                  <Calculator className="w-4 h-4 text-[#ff7900]" />
                  <span>Selected Terms Overview</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">Principal:</span>{' '}
                    <span className="font-black text-[#ff7900] text-sm">{formattedAmount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Repayment:</span>{' '}
                    <span className="font-bold text-black">{repayment}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Category:</span>{' '}
                    <span className="font-bold text-black">{type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Disbursement:</span>{' '}
                    <span className="font-bold text-black">Instant Orange Money</span>
                  </div>
                </div>
              </div>
            )}

            <button
              id="loan-app-next-btn"
              onClick={() =>
                valid &&
                navigate('/personal-details', {
                  state: { amount: formattedAmount, purpose, type, repayment },
                })
              }
              disabled={!valid}
              className="w-full py-4 rounded bg-[#ff7900] text-white font-black text-sm uppercase tracking-wide hover:bg-[#e06b00] disabled:opacity-40 transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>Next: Personal Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </PageLoader>
  );
}
