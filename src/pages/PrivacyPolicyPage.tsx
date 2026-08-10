import React from 'react';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-indigo-950">Privacy Policy</h1>
              <p className="text-xs text-slate-500">"Your Data Belongs to You" • ScholarSetu Trust Architecture</p>
            </div>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-indigo-950">1. Data Ownership Principle</h2>
              <p>
                ScholarSetu respects student privacy. Student documents and personal information submitted on the platform are used strictly for scholarship eligibility and college enrollment verification.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-indigo-950">2. Role-Based & State Access Control (RBAC)</h2>
              <p>
                State Government administrators can only view application data for students holding domicile in their assigned State jurisdiction. Out-of-state educational institutions can only access bonafide verification documents for students enrolled in their institution.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-indigo-950">3. Encryption & Audit Log</h2>
              <p>
                All document vault references are stored securely with cryptographic hashes. Every data access, document view, and verification approval generates an immutable audit trail entry logged for compliance.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
