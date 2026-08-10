import React from 'react';
import { CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-indigo-950">Terms & Application Fee Details</h1>
              <p className="text-xs text-slate-500">ScholarSetu Platform Operating Policies (AY 2025-26)</p>
            </div>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <section className="space-y-2 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950">
              <h2 className="text-sm font-bold">Student Application Fee Structure</h2>
              <p>
                Each cross-state scholarship verification request submitted by a student incurs a nominal processing fee of <strong>₹150.00 ONLY</strong>.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-indigo-950">Zero Fee Policy for Institutions and State Departments</h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Educational Institutions register and verify students for <strong>₹0 (FREE)</strong>.</li>
                <li>State Government Scholarship Departments access the cross-state portal for <strong>₹0 (FREE)</strong>.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-indigo-950">Platform Operating Guidelines</h2>
              <p>
                ScholarSetu operates as a unified national platform for cross-state student educational verification. Payment transactions run via encrypted payment gateways with instant digital verification receipts.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
