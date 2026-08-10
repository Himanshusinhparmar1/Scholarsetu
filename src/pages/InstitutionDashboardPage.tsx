import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Application } from '../types';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatusBadge } from '../components/StatusBadge';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import { Modal } from '../components/Modal';
import {
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Eye,
  ShieldCheck,
  Award,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export const InstitutionDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected Doc Modal
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; name: string } | null>(null);

  // Verification Action Modal
  const [verifyModalApp, setVerifyModalApp] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState('Enrollment and Bonafide status verified successfully from institutional records.');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = () => {
    setLoading(true);
    api
      .getInstitutionApplications()
      .then((res) => {
        if (res.success) {
          setApplications(res.applications || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleVerifySubmit = async (status: 'VERIFIED' | 'REJECTED') => {
    if (!verifyModalApp) return;
    setActionLoading(true);
    try {
      const res = await api.verifyInstitutionApplication(verifyModalApp.id, status, remarks);
      if (res.success) {
        fetchApplications();
        setVerifyModalApp(null);
      }
    } catch (err: any) {
      alert(err.message || 'Error processing verification');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingApps = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Institution Verification Pending'
  );
  const verifiedApps = applications.filter(
    (a) => a.status === 'Institution Verified' || a.status === 'Government Approved' || a.status === 'Sanctioned'
  );

  const filteredApps = applications.filter((app) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      app.studentName.toLowerCase().includes(query) ||
      app.applicationNumber.toLowerCase().includes(query) ||
      app.homeState.toLowerCase().includes(query) ||
      app.schemeName.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout title="Institution Verifications Desk">
      {/* HEADER BANNER */}
      <section className="bg-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900 border border-indigo-700 text-amber-300 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Out-of-State Educational Institution Desk • Zero Partner Fee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.institutionName || 'XYZ Institute of Technology, Pune'}
          </h1>
          <p className="text-indigo-200 text-xs max-w-xl">
            Verify student enrollment and bonafide credentials for out-of-state students seeking home-state scholarships.
          </p>
        </div>

        <div className="bg-indigo-900/80 border border-indigo-700/80 p-4 rounded-xl text-center shrink-0">
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Institution Partner Fee</p>
          <p className="text-xl font-black text-emerald-400">₹0 Free</p>
        </div>
      </section>

      {/* STATS CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Verification Requests</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{applications.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingApps.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Students</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{verifiedApps.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned State Depts</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">Gujarat, RJ, KA</p>
        </div>
      </section>

      {/* SEARCH AND APPLICATIONS LIST */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Verification Queue</h2>
            <p className="text-xs text-slate-500">
              Inspect student bonafide documents and approve enrollment status for scholarship dispatch.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, scheme or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading verification queue...</div>
        ) : filteredApps.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No verification requests found matching search.</div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded">
                      #{app.applicationNumber}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">{app.studentName}</h3>
                    <p className="text-xs text-slate-600">
                      Roll No: <strong className="text-slate-800">{app.rollNumber || '2023-BT-092'}</strong> • Course:{' '}
                      <strong className="text-slate-800">{app.course}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Home State</span>
                    <span className="font-bold text-indigo-900">{app.homeState}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Scholarship Scheme</span>
                    <span className="font-bold text-slate-800 truncate block">{app.schemeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Application Fee</span>
                    <span className="font-bold text-emerald-700">₹150 (Paid)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Applied Date</span>
                    <span className="font-bold text-slate-700">{new Date(app.appliedDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                {/* Documents & Action Bar */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500">Vault Documents:</span>
                    {app.documents.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDoc({ id: doc.documentId || 'DOC-101', name: doc.documentType })}
                        className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-300 text-indigo-950 font-bold text-[11px] rounded-md flex items-center gap-1 shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-indigo-600" />
                        <span>{doc.documentType}</span>
                        <Eye className="w-3 h-3 text-slate-400 ml-1" />
                      </button>
                    ))}
                  </div>

                  {app.status === 'Institution Verification Pending' || app.status === 'Submitted' ? (
                    <button
                      onClick={() => setVerifyModalApp(app)}
                      className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Review & Verify Student</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verification Completed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* VERIFY ACTION MODAL */}
      <Modal
        isOpen={!!verifyModalApp}
        onClose={() => setVerifyModalApp(null)}
        title={`Verify Student: ${verifyModalApp?.studentName || ''}`}
      >
        <div className="space-y-4 text-xs font-medium">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 leading-relaxed">
            <strong>Cross-State Protocol:</strong> As the authorized Nodal Officer of{' '}
            <strong>{verifyModalApp?.institutionName}</strong>, confirm that this student is genuinely enrolled in your institution.
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Verification Nodal Remarks</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              disabled={actionLoading}
              onClick={() => handleVerifySubmit('REJECTED')}
              className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg transition-colors"
            >
              Reject / Flag Application
            </button>
            <button
              disabled={actionLoading}
              onClick={() => handleVerifySubmit('VERIFIED')}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Bonafide Enrollment</span>
            </button>
          </div>
        </div>
      </Modal>

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
