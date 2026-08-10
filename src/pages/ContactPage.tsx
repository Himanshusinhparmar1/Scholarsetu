import React from 'react';
import { Phone, Mail, Globe, Landmark, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-extrabold text-indigo-950">State Nodal Officers Contact Desk</h1>
            <p className="text-xs text-slate-500">National Scholarship Verification Support Network</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="font-bold text-indigo-950 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                <span>Gujarat State Nodal Desk</span>
              </p>
              <p className="text-slate-600">Directorate of Higher Education, Block 12, Sachivalaya, Gandhinagar</p>
              <p className="text-slate-500">Email: nodalofficer@gujarat.gov.in</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="font-bold text-indigo-950 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                <span>Maharashtra State Nodal Desk</span>
              </p>
              <p className="text-slate-600">MahaDBT Verification Wing, Mantralaya, Mumbai</p>
              <p className="text-slate-500">Email: verification@maharashtra.gov.in</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="font-bold text-indigo-950 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                <span>Rajasthan State Nodal Desk</span>
              </p>
              <p className="text-slate-600">Social Justice & Empowerment Dept, Jaipur</p>
              <p className="text-slate-500">Email: scholarship@rajasthan.gov.in</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="font-bold text-indigo-950 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600" />
                <span>Karnataka State Nodal Desk</span>
              </p>
              <p className="text-slate-600">State Scholarship Portal (SSP) Cell, Bengaluru</p>
              <p className="text-slate-500">Email: ssp.support@karnataka.gov.in</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-950 text-white rounded-2xl flex items-center justify-between text-xs">
            <div className="space-y-1">
              <p className="font-bold text-amber-300">National Toll-Free Helpline</p>
              <p className="text-indigo-200">1800-SETU-2026 (1800-7388-2026) • 24x7 Support</p>
            </div>
            <Mail className="w-6 h-6 text-indigo-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
