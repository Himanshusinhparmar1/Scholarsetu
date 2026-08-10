import React, { useState } from 'react';
import { api } from '../services/api';
import { Application } from '../types';
import { ProgressTimeline } from '../components/ProgressTimeline';
import { StatusBadge } from '../components/StatusBadge';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import { Search, Building2, Landmark, FileText, CheckCircle2, ShieldCheck, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrackStatusPage: React.FC = () => {
  const [appNumberInput, setAppNumberInput] = useState('SS-2026-000123');
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; name: string } | null>(null);

  const handleTrackSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appNumberInput.trim()) return;

    setLoading(true);
    setError('');
    setApplication(null);

    try {
      const res = await api.trackApplication(appNumberInput.trim());
      if (res.success && res.application) {
        setApplication(res.application);
      } else {
        setError(res.message || 'Application Reference Number not found in system.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to track application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-indigo-950 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:underline mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to ScholarSetu Home</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Track Application Status</h1>
          <p className="text-indigo-200 text-xs max-w-xl">
            Enter your ScholarSetu Application Reference Number (e.g. SS-2026-000123) to monitor real-time cross-state verification progress.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <form onSubmit={handleTrackSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Application Reference Number (e.g. SS-2026-000123)..."
                value={appNumberInput}
                onChange={(e) => setAppNumberInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-sm rounded-xl transition-all shadow-md shrink-0"
            >
              Track Status
            </button>
          </form>

          {/* Quick Reference Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-500 font-medium">
            <span>Sample Application Reference Numbers:</span>
            <button
              type="button"
              onClick={() => {
                setAppNumberInput('SS-2026-000123');
              }}
              className="text-indigo-600 font-bold hover:underline bg-indigo-50 px-2 py-0.5 rounded"
            >
              SS-2026-000123 (Gujarat in MH)
            </button>
            <button
              type="button"
              onClick={() => {
                setAppNumberInput('SS-2026-000124');
              }}
              className="text-indigo-600 font-bold hover:underline bg-indigo-50 px-2 py-0.5 rounded"
            >
              SS-2026-000124 (Rajasthan in KA)
            </button>
          </div>
        </div>

        {/* Result Card */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Tracking verification status...</div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-center space-y-2">
            <p className="font-bold text-sm">{error}</p>
            <p className="text-xs text-rose-600">Please verify your Application Ref Number or log in as a student.</p>
          </div>
        ) : application ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full">
                  #{application.applicationNumber}
                </span>
                <h2 className="text-2xl font-extrabold text-indigo-950 pt-2">{application.studentName}</h2>
                <p className="text-xs text-slate-600">
                  Scheme: <strong className="text-slate-800">{application.schemeName}</strong>
                </p>
              </div>

              <StatusBadge status={application.status} />
            </div>

            {/* TIMELINE COMPONENT */}
            <ProgressTimeline currentStatus={application.status} />

            {/* DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-0">
              <div className="space-y-2">
                <p className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">Jurisdiction Details</p>
                <p className="text-slate-600">
                  Home (Domicile) State: <strong className="text-slate-800">{application.homeState}</strong>
                </p>
                <p className="text-slate-600">
                  Study State: <strong className="text-slate-800">{application.studyState}</strong>
                </p>
                <p className="text-slate-600">
                  Institution: <strong className="text-indigo-900">{application.institutionName}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">Fee & Document Vault</p>
                <p className="text-slate-600">
                  Fee Status: <strong className="text-emerald-700">₹150.00 PAID</strong>
                </p>
                <div className="flex gap-2 flex-wrap pt-1">
                  {application.documents.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDoc({ id: doc.documentId || 'DOC-303', name: doc.documentType })}
                      className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-slate-300 text-indigo-950 font-bold text-[11px] rounded-md flex items-center gap-1 shadow-2xs"
                    >
                      <FileText className="w-3 h-3 text-indigo-600" />
                      <span>{doc.documentType}</span>
                      <Eye className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* DOCUMENT VIEWER MODAL */}
        {selectedDoc && (
          <DocumentViewerModal
            isOpen={!!selectedDoc}
            onClose={() => setSelectedDoc(null)}
            documentId={selectedDoc.id}
            documentType={selectedDoc.name}
          />
        )}
      </div>
    </div>
  );
};
