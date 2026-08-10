import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Scholarship } from '../types';
import { useAuth } from '../context/AuthContext';
import { Landmark, Calendar, IndianRupee, FileCheck, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const ScholarshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api
        .getScholarshipById(id)
        .then((res) => {
          if (res.success) setScholarship(res.scholarship);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading scholarship scheme details...</div>;
  }

  if (!scholarship) {
    return <div className="py-20 text-center text-rose-600 font-bold">Scholarship scheme not found.</div>;
  }

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/apply/${scholarship.id}`));
    } else if (user.role === 'student') {
      navigate(`/apply/${scholarship.id}`);
    } else {
      alert(`You are currently logged in as an ${user.role}. Please log in as a Student to apply.`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/scholarships" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scholarships Directory</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 text-xs font-bold border border-indigo-200">
                {scholarship.type}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 pt-2">{scholarship.name}</h1>
              <p className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                <span>{scholarship.provider}</span>
              </p>
            </div>

            <div className="bg-indigo-900 text-white p-4 rounded-2xl text-center min-w-[160px]">
              <p className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold">Scholarship Amount</p>
              <p className="text-2xl font-black text-amber-400">₹{scholarship.amount.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-indigo-200">Per Academic Year</p>
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Application Deadline</p>
              <p className="font-bold text-indigo-950 mt-0.5">{scholarship.deadline}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Max Annual Income</p>
              <p className="font-bold text-indigo-950 mt-0.5">₹{(scholarship.maxIncome / 100000).toFixed(1)} Lakhs</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Home State Eligibility</p>
              <p className="font-bold text-indigo-950 mt-0.5">
                {scholarship.homeStates.length === 0 ? 'All Indian States' : scholarship.homeStates.join(', ')}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Student Application Fee</p>
              <p className="font-bold text-emerald-700 mt-0.5">₹150 Processing Fee</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-950 text-sm">Description & Objectives</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{scholarship.description}</p>
          </div>

          {/* Detailed Eligibility */}
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-950 text-sm">Detailed Eligibility Criteria</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200">
              {scholarship.eligibility}
            </p>
          </div>

          {/* Required Documents Checklist */}
          <div className="space-y-3">
            <h3 className="font-bold text-indigo-950 text-sm">Required Verification Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scholarship.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Banner CTA */}
          <div className="bg-indigo-950 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-amber-300">Ready to Submit Cross-State Application?</h4>
              <p className="text-xs text-indigo-200 mt-0.5">
                Application processing fee of ₹150 applies. Your out-of-state college will be notified instantly for digital verification.
              </p>
            </div>

            <button
              onClick={handleApplyClick}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <span>Apply for Scheme</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
