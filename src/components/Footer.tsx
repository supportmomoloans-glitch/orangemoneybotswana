import Logo from './Logo';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-black border-t border-gray-800 py-12 px-4 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-xl font-black tracking-tight">
                <span className="text-[#ff7900]">Orange</span> <span className="text-white">Loans</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fast, secure and affordable loans for individuals and entrepreneurs across Botswana. Powered by Orange Money Botswana technology.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#ff7900] font-bold bg-[#ff7900]/10 px-3 py-1.5 rounded w-fit border border-[#ff7900]/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Licensed & Regulated in Botswana</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#ff7900] text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Orange Money Loans</span>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Business Expansion Credit</span>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Salary Advance</span>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Emergency Cash Assistance</span>
              </li>
              <li className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#ff7900] inline-block"></span>
                <span>Store Locator Botswana</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#ff7900] text-sm uppercase tracking-wider">Compliance</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Data Protection Act Botswana</li>
              <li className="hover:text-white transition-colors cursor-pointer">Responsible Lending Code</li>
              <li className="hover:text-white transition-colors cursor-pointer">Security Center</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#ff7900] text-sm uppercase tracking-wider">Contact & Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#ff7900] shrink-0" />
                <span>+267 72 000 123 / 123 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#ff7900] shrink-0" />
                <span>loans.support@orange.co.bw</span>
              </li>
              <li className="flex items-center gap-2.5 hover:text-white transition-colors">
                <MapPin className="w-4 h-4 text-[#ff7900] shrink-0" />
                <span>Plot 166, Kgale View, Gaborone, Botswana</span>
              </li>
              <li className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Clock className="w-4 h-4 text-[#ff7900] shrink-0" />
                <span>Mon - Fri: 8:00 AM - 5:00 PM CAT</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-400 space-y-2">
          <p>Orange Loans Botswana is operated in partnership with licensed credit providers regulated by NBFIRA & Bank of Botswana.</p>
          <p>Minimum Tenure: 30 days · Maximum Tenure: 12 months · Representative Example: P 5,000 for 6 months at 2.5% monthly interest.</p>
          <p className="text-gray-500 font-medium">© {new Date().getFullYear()} Orange Botswana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
