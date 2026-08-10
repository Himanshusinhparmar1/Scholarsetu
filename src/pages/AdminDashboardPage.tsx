import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  ShieldAlert,
  Users,
  Building2,
  Landmark,
  IndianRupee,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Activity,
  Plus,
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 1240,
    totalInstitutions: 48,
    totalScholarships: 12,
    totalApplications: 310,
    applicationsVerified: 285,
    totalFeesCollected: 46500,
  });

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for adding new scheme
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [schemeForm, setSchemeForm] = useState({
    name: '',
    provider: 'Central Government',
    type: 'Central Government',
    amount: 50000,
    maxIncome: 250000,
    description: '',
    eligibility: '',
    deadline: '2026-10-31',
  });

  useEffect(() => {
    api
      .getAdminStats()
      .then((res) => {
        if (res.success) {
          if (res.stats) setStats(res.stats);
          if (res.auditLogs) setAuditLogs(res.auditLogs);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createScholarship({
        ...schemeForm,
        homeStates: [],
        requiredDocuments: ['Aadhaar Card', 'Bonafide Certificate', 'Income Certificate', 'Marksheet'],
      });
      if (res.success) {
        alert('New Scholarship Scheme Published Successfully!');
        setIsSchemeModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create scheme');
    }
  };

  return (
    <DashboardLayout title="System Super-Admin Portal">
      {/* HEADER BANNER */}
      <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900 border border-indigo-700 text-amber-300 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>National Central Monitoring & Audit Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ScholarSetu Platform Administration
          </h1>
          <p className="text-slate-300 text-xs max-w-xl">
            Real-time audit log oversight, fee accounting, scholarship scheme publishing, and cross-state governance.
          </p>
        </div>

        <button
          onClick={() => setIsSchemeModalOpen(true)}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Scheme</span>
        </button>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Students</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalStudents}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partner Colleges (₹0 Fee)</p>
          <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.totalInstitutions}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalApplications}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fee Revenue (₹150/App)</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">₹{stats.totalFeesCollected.toLocaleString('en-IN')}</p>
        </div>
      </section>

      {/* AUDIT LOGS TABLE */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Real-Time Audit Log Trail</span>
            </h2>
            <p className="text-xs text-slate-500">
              Immutable system logs recording user authentication, document access, and cross-state verifications.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            AUDIT ACTIVE
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Fetching security audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User / Actor</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action Executed</th>
                  <th className="p-3">Details / Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="p-3 text-slate-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{log.userName || log.userEmail}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {log.role}
                      </span>
                    </td>
                    <td className="p-3 text-indigo-900 font-bold">{log.action}</td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE SCHEME MODAL */}
      <Modal
        isOpen={isSchemeModalOpen}
        onClose={() => setIsSchemeModalOpen(false)}
        title="Publish New Scholarship Scheme"
      >
        <form onSubmit={handleCreateScheme} className="space-y-4 text-xs font-medium">
          <div>
            <label className="block text-slate-700 mb-1 font-bold">Scheme Name *</label>
            <input
              type="text"
              required
              value={schemeForm.name}
              onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
              placeholder="e.g. National Means-cum-Merit Scholarship Scheme"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Provider / Ministry</label>
              <input
                type="text"
                value={schemeForm.provider}
                onChange={(e) => setSchemeForm({ ...schemeForm, provider: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Scheme Type</label>
              <select
                value={schemeForm.type}
                onChange={(e) => setSchemeForm({ ...schemeForm, type: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Central Government">Central Government</option>
                <option value="State Government">State Government</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Scholarship Amount (₹/year)</label>
              <input
                type="number"
                value={schemeForm.amount}
                onChange={(e) => setSchemeForm({ ...schemeForm, amount: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Max Annual Income Limit (₹)</label>
              <input
                type="number"
                value={schemeForm.maxIncome}
                onChange={(e) => setSchemeForm({ ...schemeForm, maxIncome: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Description</label>
            <textarea
              rows={2}
              value={schemeForm.description}
              onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSchemeModalOpen(false)}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-900 text-amber-300 font-bold rounded-lg hover:bg-indigo-800"
            >
              Publish Scheme
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
