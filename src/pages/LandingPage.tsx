import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Search,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Globe2,
  Lock,
  FileCheck2,
  ChevronRight,
  HelpCircle,
  CreditCard,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 1240,
    totalInstitutions: 48,
    totalScholarships: 12,
    totalApplications: 310,
    applicationsVerified: 285,
    statesCovered: 36,
  });

  const [scholarshipCount, setScholarshipCount] = useState(5);
  const [collegeCount, setCollegeCount] = useState(10);

  useEffect(() => {
    // Fetch live statistics
    api
      .getScholarships()
      .then((res) => {
        if (res.success) setScholarshipCount(res.total || 5);
      })
      .catch(() => {});

    api
      .getInstitutions()
      .then((res) => {
        if (res.success) setCollegeCount(res.total || 10);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Subtle Accent Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-800/80 border border-indigo-700/60 text-xs font-semibold text-amber-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>National Student Portal • Inter-State Educational Verification System</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            One Nation. One Verification. <br />
            <span className="text-amber-400">Equal Scholarship Access.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto font-medium leading-relaxed">
            ScholarSetu enables secure institution-level verification for students studying outside their home State, helping remove institutional registration barriers in scholarship applications.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/scholarships"
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Find Scholarships</span>
            </Link>

            <Link
              to="/colleges"
              className="px-6 py-3.5 bg-indigo-800/80 hover:bg-indigo-700 text-white font-bold rounded-xl border border-indigo-600 transition-all flex items-center gap-2 text-sm"
            >
              <Building2 className="w-4 h-4 text-indigo-300" />
              <span>Find Your Institution</span>
            </Link>

            <Link
              to="/register"
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-indigo-950 font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Apply Now</span>
            </Link>

            <Link
              to="/login"
              className="px-5 py-3.5 text-indigo-200 hover:text-white font-semibold rounded-xl hover:bg-indigo-900/50 transition-colors text-sm"
            >
              Portal Login →
            </Link>
          </div>

          {/* Dynamic Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-5xl mx-auto">
            <div className="p-4 rounded-2xl bg-indigo-900/60 border border-indigo-800/80 backdrop-blur-xs text-center">
              <p className="text-3xl font-black text-amber-400">{scholarshipCount}</p>
              <p className="text-xs font-medium text-indigo-200 mt-1">Active Scholarships</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-900/60 border border-indigo-800/80 backdrop-blur-xs text-center">
              <p className="text-3xl font-black text-white">{collegeCount}+</p>
              <p className="text-xs font-medium text-indigo-200 mt-1">Registered Institutions</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-900/60 border border-indigo-800/80 backdrop-blur-xs text-center">
              <p className="text-3xl font-black text-amber-400">36</p>
              <p className="text-xs font-medium text-indigo-200 mt-1">States & UTs Covered</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-900/60 border border-indigo-800/80 backdrop-blur-xs text-center">
              <p className="text-3xl font-black text-emerald-400">285+</p>
              <p className="text-xs font-medium text-indigo-200 mt-1">Applications Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-indigo-950">How Cross-State Verification Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            ScholarSetu bridges the gap between students, out-of-state colleges, and home State scholarship departments in 7 clear steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {[
            { step: '1', title: 'Register', desc: 'Student registers with home State details' },
            { step: '2', title: 'Select States', desc: 'Pick Home State & Study State' },
            { step: '3', title: 'Select College', desc: 'Find college from central database' },
            { step: '4', title: 'Apply Scheme', desc: 'Choose eligible scholarship scheme' },
            { step: '5', title: 'College Verifies', desc: 'Out-of-state college confirms enrollment' },
            { step: '6', title: 'Govt Approves', desc: 'Home State admin reviews & sanctions' },
            { step: '7', title: 'Track Status', desc: 'Real-time progress updates on dashboard' },
          ].map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-center relative"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-900 text-amber-400 font-extrabold text-xs flex items-center justify-center mx-auto mb-3">
                {s.step}
              </div>
              <h3 className="font-bold text-sm text-indigo-950">{s.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE PLATFORM BENEFITS */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-900 text-amber-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-indigo-950">For Students</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nominal processing fee of <strong>₹150 ONLY</strong>. No need to physically visit home state departments or get paper signatures from out-of-state colleges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">For Educational Institutions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>₹0 Fee Charged</strong>. Institutions can verify student enrollment in 1-click without needing cumbersome portal registrations in 28 different states.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-amber-950">For State Government Depts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Zero Fee</strong>. Access authenticated enrollment verification logs from out-of-state colleges with strict state-based privacy isolation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY & AUDIT CALLOUT */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy First Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              "Your Data Belongs to You."
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ScholarSetu implements strict Role-Based Access Control (RBAC) and State Jurisdiction authorization. State administrators cannot access students of unrelated states, institutions only view assigned student verifications, and all system actions generate audit logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/privacy"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs text-center transition-colors"
            >
              Read Privacy Policy
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs text-center border border-slate-700 transition-colors"
            >
              View System Architecture
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
