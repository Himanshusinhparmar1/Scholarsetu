import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Lock, Phone, Mail, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 text-xs border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-amber-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">ScholarSetu</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Centralized platform enabling institution-level verification of students studying outside their home State to eliminate scholarship denial barriers.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Role-Based & Privacy Protected</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider">Quick Access</p>
            <ul className="space-y-2">
              <li>
                <Link to="/scholarships" className="hover:text-indigo-400 transition-colors">
                  Scholarships Directory
                </Link>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-indigo-400 transition-colors">
                  Indian College Directory
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-indigo-400 transition-colors">
                  Track Application Status
                </Link>
              </li>
              <li>
                <Link to="/colleges?action=onboard" className="hover:text-indigo-400 transition-colors">
                  Register College (Free ₹0)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider">Governance & Trust</p>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Privacy Policy ("Your Data Belongs to You")</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-400 transition-colors">
                  Terms & Application Fee Details (₹150)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">
                  System Architecture
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">
                  State Nodal Officers Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider">Helpdesk & Support</p>
            <p className="text-slate-400">National Scholarship Verification Desk</p>
            <div className="space-y-1.5 text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Toll Free: 1800-SETU-2026 (1800-7388-2026)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@scholarsetu.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>New Delhi • All Indian States & UTs</span>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="border-t border-slate-800/80 pt-6 mt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>
            © 2026 ScholarSetu National Portal. Centralized platform for cross-state educational verification.
          </p>
          <div className="flex items-center gap-3">
            <span>Student Application Fee: ₹150</span>
            <span>•</span>
            <span>Institutions: ₹0 Fee</span>
            <span>•</span>
            <span>State Departments: ₹0 Fee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
