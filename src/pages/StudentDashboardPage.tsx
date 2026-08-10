import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Application } from '../types';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatusBadge } from '../components/StatusBadge';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import {
  CheckCircle,
  Clock,
  Building2,
  FileText,
  IndianRupee,
  ShieldCheck,
  AlertCircle,
  Eye,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Doc for modal
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    api
      .getStudentApplications()
      .then((res) => {
        if (res.success) {
          setApplications(res.applications || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeApp = applications.length > 0 ? applications[0] : null;

  return (
    <DashboardLayout title="Student Verification Dashboard">
      {/* HERO WELCOME SECTION */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Student'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Monitor your cross-state scholarship verification, fee status, and institution approvals in real time.
          </p>
        </div>
        <div className="text-left sm:text-right bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Session</span>
          <p className="text-base font-mono font-medium text-indigo-950">AY 2025-26</p>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Application</p>
          <p className="text-xl font-bold text-slate-800 mt-1 uppercase truncate">
            {activeApp ? activeApp.schemeName : 'Post-Matric'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">
            {activeApp?.paymentStatus === 'PAID' ? '₹150 Paid' : '₹150 Pending'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Home State</p>
          <p className="text-xl font-bold text-slate-800 mt-1">
            {activeApp?.homeState || user?.homeState || 'Gujarat'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study State</p>
          <p className="text-xl font-bold text-slate-800 mt-1">
            {activeApp?.studyState || user?.studyState || 'Maharashtra'}
          </p>
        </div>
      </section>

      {/* APPLICATION TRACKER CARD */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
          Fetching application record...
        </div>
      ) : activeApp ? (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
            <h2 className="font-bold text-slate-800 uppercase text-xs sm:text-sm tracking-wider">
              Current Application: #{activeApp.applicationNumber}
            </h2>
            <StatusBadge status={activeApp.status} />
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* TRACKING TIMELINE */}
            <div className="flex justify-between items-start relative max-w-3xl mx-auto">
              <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-200 z-0" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-indigo-600 z-0 transition-all duration-500"
                style={{
                  width:
                    activeApp.status === 'Submitted'
                      ? '25%'
                      : activeApp.status === 'Institution Verification Pending'
                      ? '50%'
                      : activeApp.status === 'Government Approved' || activeApp.status === 'Sanctioned'
                      ? '100%'
                      : '50%',
                }}
              />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-2 shadow-md ring-4 ring-white text-xs">
                  ✓
                </div>
                <span className="text-xs font-bold text-slate-800">Application Submitted</span>
                <span className="text-[10px] text-slate-400 mt-0.5 uppercase">
                  {new Date(activeApp.appliedDate).toLocaleDateString('en-IN')}
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-2 shadow-md ring-4 ring-white text-xs">
                  ✓
                </div>
                <span className="text-xs font-bold text-slate-800">Fee Paid (₹150)</span>
                <span className="text-[10px] text-slate-400 mt-0.5 uppercase">
                  Ref: {activeApp.paymentTransactionId || 'TXN-998811'}
                </span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mb-2 shadow-md ring-4 ring-white text-xs ${
                    activeApp.status === 'Institution Verification Pending'
                      ? 'bg-amber-500 text-white animate-pulse'
                      : activeApp.status === 'Institution Verified' || activeApp.status === 'Government Approved'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {activeApp.status === 'Institution Verified' || activeApp.status === 'Government Approved'
                    ? '✓'
                    : '3'}
                </div>
                <span
                  className={`text-xs font-bold ${
                    activeApp.status === 'Institution Verification Pending' ? 'text-amber-600' : 'text-slate-800'
                  }`}
                >
                  Institution Verification
                </span>
                <span className="text-[10px] text-amber-500 mt-0.5 uppercase font-semibold">
                  {activeApp.status === 'Institution Verification Pending' ? 'IN PROGRESS' : 'VERIFIED'}
                </span>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center text-center w-1/4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mb-2 ring-4 ring-white text-xs ${
                    activeApp.status === 'Government Approved' || activeApp.status === 'Sanctioned'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {activeApp.status === 'Government Approved' || activeApp.status === 'Sanctioned' ? '✓' : '4'}
                </div>
                <span className="text-xs font-bold text-slate-700">Govt Sanction</span>
                <span className="text-[10px] text-slate-400 mt-0.5 uppercase">
                  {activeApp.status === 'Government Approved' ? 'SANCTIONED' : 'PENDING'}
                </span>
              </div>
            </div>

            {/* INSTITUTION DETAILS AND DOCUMENT VAULT */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Assigned Out-of-State Institution
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                    🏫
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800 text-sm">{activeApp.institutionName}</p>
                    <p className="text-xs text-slate-500 uppercase">
                      Affiliated Institution • Study State: {activeApp.studyState}
                    </p>
                    <p className="text-xs text-indigo-600 font-semibold pt-1">
                      Verification Officer: Out-of-State College Nodal Officer
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Uploaded Document Vault
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {activeApp.documents && activeApp.documents.length > 0 ? (
                    activeApp.documents.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDoc({ id: doc.documentId || 'DOC-123', name: doc.documentType })}
                        className="px-3 py-1.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold border border-slate-300 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{doc.documentType}</span>
                        <Eye className="w-3 h-3 text-slate-400" />
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No documents attached</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-4">
          <p className="text-base font-bold text-slate-800">No active scholarship applications found.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Browse active state and central schemes to submit your cross-state verification request. Processing fee is ₹150.
          </p>
          <Link
            to="/scholarships"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 transition-colors"
          >
            <span>Explore Active Scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ALERTS / NOTICE BANNER */}
      <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
          ℹ️
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-indigo-900">Note regarding Cross-State Verification</p>
          <p className="text-xs text-indigo-700 opacity-80">
            Since you are studying outside your Home State ({activeApp?.homeState || 'Gujarat'} →{' '}
            {activeApp?.studyState || 'Maharashtra'}), your institution will verify your bonafide enrollment before your Home State government department disburses scholarship funds.
          </p>
        </div>
        <Link to="/about" className="text-xs font-bold text-indigo-600 hover:underline shrink-0">
          Read Flow FAQ
        </Link>
      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {selectedDoc && (
        <DocumentViewerModal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          documentId={selectedDoc.id}
          documentType={selectedDoc.name}
        />
      )}
    </DashboardLayout>
  );
};
