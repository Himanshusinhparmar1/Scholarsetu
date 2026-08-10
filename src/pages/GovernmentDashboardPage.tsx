import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Application } from '../types';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatusBadge } from '../components/StatusBadge';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import { Modal } from '../components/Modal';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Search,
  Eye,
  Building2,
  Lock,
  IndianRupee,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const GovernmentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected Doc
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; name: string } | null>(null);

  // Sanction Modal State
  const [sanctionModalApp, setSanctionModalApp] = useState<Application | null>(null);
  const [sanctionNote, setSanctionNote] = useState('Sanctioned by State Directorate of Higher Education.');
  const [actionLoading, setActionLoading] = useState(false);

  const stateJurisdiction = user?.stateJurisdiction || 'Gujarat';

  const fetchGovernmentApplications = () => {
    setLoading(true);
    api
      .getGovernmentApplications()
      .then((res) => {
        if (res.success) {
          setApplications(res.applications || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGovernmentApplications();
  }, []);

  const handleSanctionSubmit = async () => {
    if (!sanctionModalApp) return;
    setActionLoading(true);
    try {
      const res = await api.approveGovernmentApplication(sanctionModalApp.id, sanctionNote);
      if (res.success) {
        fetchGovernmentApplications();
        setSanctionModalApp(null);
      }
    } catch (err: any) {
      alert(err.message || 'Error sanctioning scholarship');
    } finally {
      setActionLoading(false);
    }
  };

  const verifiedQueue = applications.filter((a) => a.status === 'Institution Verified');
  const sanctionedList = applications.filter(
    (a) => a.status === 'Government Approved' || a.status === 'Sanctioned'
  );

  const totalSanctionedAmount = sanctionedList.reduce((acc, curr) => acc + (curr.amount || 50000), 0);

  const filteredApps = applications.filter((app) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      app.studentName.toLowerCase().includes(query) ||
      app.institutionName.toLowerCase().includes(query) ||
      app.schemeName.toLowerCase().includes(query) ||
      app.applicationNumber.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout title="State Government Sanction Portal">
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-indigo-950 text-xs font-black">
            <Landmark className="w-3.5 h-3.5" />
            <span>{stateJurisdiction} State Department Jurisdiction</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cross-State Scholarship Sanction Desk
          </h1>
          <p className="text-indigo-200 text-xs max-w-xl">
            Review institution-verified applications for students belonging to {stateJurisdiction} studying in out-of-state universities.
          </p>
        </div>

        <div className="bg-indigo-900/80 border border-indigo-700 p-4 rounded-xl text-center shrink-0">
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Sanctioned Disbursal</p>
          <p className="text-xl font-black text-amber-400">
            ₹{(totalSanctionedAmount / 100000).toFixed(2)} Lakhs
          </p>
        </div>
      </section>

      {/* STATS CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">State Domicile Students</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{applications.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready for Sanction</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{verifiedQueue.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sanctioned & Disbursed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{sanctionedList.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Privacy Isolation</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">Strict RBAC Active</p>
        </div>
      </section>

      {/* APPLICATIONS QUEUE */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">State Student Applications Desk</h2>
            <p className="text-xs text-slate-500">
              Only displaying students with domicile in <strong>{stateJurisdiction}</strong>.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search student, college or scheme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading state application records...</div>
        ) : filteredApps.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No student application records found.</div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded">
                        #{app.applicationNumber}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        Study State: {app.studyState}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">{app.studentName}</h3>
                    <p className="text-xs text-slate-600">
                      Enrolled Institution: <strong className="text-indigo-900">{app.institutionName}</strong>
                    </p>
                  </div>

                  <StatusBadge status={app.status} />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Scheme</span>
                    <span className="font-bold text-slate-800 truncate block">{app.schemeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Scholarship Amount</span>
                    <span className="font-bold text-indigo-900">₹{(app.amount || 50000).toLocaleString('en-IN')} / year</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Institution Verification</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>VERIFIED BY COLLEGE</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Applied Date</span>
                    <span className="font-bold text-slate-700">{new Date(app.appliedDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                {/* Documents & Sanction Bar */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500">Document Vault:</span>
                    {app.documents.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDoc({ id: doc.documentId || 'DOC-202', name: doc.documentType })}
                        className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-300 text-indigo-950 font-bold text-[11px] rounded-md flex items-center gap-1 shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-indigo-600" />
                        <span>{doc.documentType}</span>
                        <Eye className="w-3 h-3 text-slate-400 ml-1" />
                      </button>
                    ))}
                  </div>

                  {app.status === 'Institution Verified' ? (
                    <button
                      onClick={() => setSanctionModalApp(app)}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-indigo-950 font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Landmark className="w-4 h-4 text-indigo-950" />
                      <span>Sanction & Disburse Funds</span>
                    </button>
                  ) : app.status === 'Government Approved' || app.status === 'Sanctioned' ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sanctioned (DBT Ready)</span>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-800 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      Awaiting College Bonafide Verification
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SANCTION MODAL */}
      <Modal
        isOpen={!!sanctionModalApp}
        onClose={() => setSanctionModalApp(null)}
        title={`Sanction Funds: ${sanctionModalApp?.studentName || ''}`}
      >
        <div className="space-y-4 text-xs font-medium">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 leading-relaxed">
            <strong>State Sanction Order:</strong> You are approving scholarship disbursal for{' '}
            <strong>{sanctionModalApp?.studentName}</strong> belonging to <strong>{stateJurisdiction}</strong> studying at out-of-state institution <strong>{sanctionModalApp?.institutionName}</strong>.
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">State Department Remarks / Order Ref</label>
            <textarea
              rows={3}
              value={sanctionNote}
              onChange={(e) => setSanctionNote(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              onClick={() => setSanctionModalApp(null)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              disabled={actionLoading}
              onClick={handleSanctionSubmit}
              className="px-5 py-2 bg-indigo-900 hover:bg-indigo-800 text-amber-300 font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Landmark className="w-4 h-4" />
              <span>Issue Sanction Order</span>
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
