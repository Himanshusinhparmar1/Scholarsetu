import React, { useEffect, useState } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, X, Server, Layers } from 'lucide-react';
import { api } from '../services/api';

interface DBStatusData {
  success: boolean;
  database: string;
  isMongoConnected: boolean;
  readyState: number;
  readyStateName: string;
  host: string;
  dbName: string;
  mongoUriConfigured: boolean;
}

export const MongoStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<DBStatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getDbHealth();
      setStatus(res);
    } catch (err) {
      console.error('Failed to fetch DB status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shadow-2xs border ${
          status?.isMongoConnected
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
        }`}
        title="Click to check MongoDB Connection Status"
      >
        <Database className={`w-3.5 h-3.5 ${status?.isMongoConnected ? 'text-emerald-600' : 'text-amber-600'}`} />
        <span>{status?.isMongoConnected ? 'MongoDB Connected' : 'In-Memory / MongoDB Ready'}</span>
        {status?.isMongoConnected ? (
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-amber-500" />
        )}
      </button>

      {/* Modal Details */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">MongoDB Integration Status</h3>
                  <p className="text-xs text-slate-500">ScholarSetu Database Connection Info</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500">Checking database connection...</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* Status Callout */}
                <div
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    status?.isMongoConnected
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  {status?.isMongoConnected ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">
                      {status?.isMongoConnected
                        ? 'MongoDB Active & Synchronized'
                        : 'Operating in Dual-Mode (In-Memory Engine Active)'}
                    </p>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      {status?.isMongoConnected
                        ? `Connected via Mongoose ORM to database [${status.dbName}] on host [${status.host}]. All records are saved to MongoDB.`
                        : 'ScholarSetu is running with instant zero-config in-memory database engine. You can connect a live MongoDB instance anytime by passing MONGO_URI in environment variables.'}
                    </p>
                  </div>
                </div>

                {/* Details Table */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Server className="w-3.5 h-3.5 text-slate-400" /> Connection State:
                    </span>
                    <span className="font-bold text-slate-800">{status?.readyStateName || 'Disconnected'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-slate-400" /> Database Name:
                    </span>
                    <span className="font-mono text-slate-800 font-semibold">{status?.dbName || 'scholarsetu'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> Environment Config:
                    </span>
                    <span className="font-mono text-slate-800">
                      {status?.mongoUriConfigured ? 'MONGO_URI specified' : 'Default Local Host'}
                    </span>
                  </div>
                </div>

                {/* Connection String Helper */}
                <div className="bg-slate-900 text-slate-300 rounded-xl p-3 space-y-1 font-mono text-[11px]">
                  <p className="text-amber-400 font-sans text-xs font-bold font-mono">Environment Configuration:</p>
                  <p className="text-slate-400">MONGO_URI="mongodb://localhost:27017/scholarsetu"</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={fetchStatus}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
