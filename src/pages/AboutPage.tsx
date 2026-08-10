import React from 'react';
import { ShieldCheck, BookOpen, Building2, Landmark, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold uppercase tracking-wider">
            National Educational Governance Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-950">
            About ScholarSetu Platform
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Addressing the critical challenge where Indian students studying in institutions outside their home State are denied scholarship benefits due to non-registration of institutions on home State portals.
          </p>
        </div>

        {/* Problem & Solution Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-indigo-950 border-b border-slate-100 pb-3">
            The Problem Statement
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed italic bg-amber-50/80 p-4 rounded-xl border border-amber-200">
            "To develop a technical solution for enabling institution-level verification of students of one State studying in other State/s, who are at present generally denied benefits under scholarship schemes because the institutions in which they are studying are not registered on the portal/s of their home State."
          </p>

          <h3 className="text-lg font-bold text-indigo-950 pt-2">How ScholarSetu Solves This</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-indigo-900">1. Centralized College Directory</p>
              <p className="text-slate-600">
                Maintains a unified database of government and private institutions from all 28 States and 8 Union Territories.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-indigo-900">2. Cross-State Verification Protocol</p>
              <p className="text-slate-600">
                Allows an out-of-state college nodal officer to verify a student's enrollment digitally without needing portal registration in the student's home state.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-indigo-900">3. ₹150 Student Fee & ₹0 Institution Fee</p>
              <p className="text-slate-600">
                Only students pay a minimal application processing fee of ₹150. Colleges and State Departments pay zero fee.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <p className="font-bold text-indigo-900">4. Privacy & Audit Trail</p>
              <p className="text-slate-600">
                Strict Role-Based and State-Based Access Control ensures data is visible only to assigned institutions and state authorities.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture & Stack */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-amber-400">Platform Architecture & Integration Roadmap</h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="font-bold text-indigo-300">Current System Capabilities</p>
              <p className="text-slate-400 leading-relaxed">
                Operates as a self-contained full-stack application built with React, Node.js, Express, MongoDB/Mongoose schemas, JWT Auth, and sandbox payment flow. Includes realistic pre-populated Indian college and scholarship master data.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="font-bold text-emerald-300">Future Production Govt Integration Roadmap</p>
              <p className="text-slate-400 leading-relaxed">
                Can be linked directly with official APIs such as DigiLocker for document verification, National Scholarship Portal (NSP), Razorpay/SBI ePay gateways, and AISHE (All India Survey on Higher Education) college databases.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">ScholarSetu Platform • National Verification Portal</span>
            <Link to="/scholarships" className="text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <span>Explore Scholarships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
