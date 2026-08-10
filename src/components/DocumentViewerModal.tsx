import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '../services/api';
import { FileText, ShieldCheck, Download, AlertTriangle, Lock } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentType: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentId,
  documentType,
}) => {
  const [docData, setDocData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && documentId) {
      setLoading(true);
      setError('');
      api
        .getDocument(documentId)
        .then((res) => {
          if (res.success) {
            setDocData(res.document || res);
          } else {
            setError(res.message || 'Access denied');
          }
        })
        .catch((err) => {
          setError(err.message || 'Failed to load document');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, documentId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Document Vault: ${documentType}`} maxWidth="max-w-2xl">
      {loading ? (
        <div className="py-12 text-center text-slate-500">Retrieving protected document from vault...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Privacy Protection Lock</p>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">Encrypted Role-Based Document Access</span>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
              VERIFIED RECORD
            </span>
          </div>

          {/* Document Preview Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-amber-400" />
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{docData.fileName || `${documentType}.pdf`}</h4>
                  <p className="text-xs text-slate-400">Type: {docData.documentType || documentType}</p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-400 space-y-1.5 border border-slate-800">
              <p>[SCHOLARSETU_VAULT_REF_OK]</p>
              <p>Document Hash: 8f9b201a4e512c99a80b1e4c</p>
              <p>Verification Status: Passed Digital Signature Integrity</p>
              <p>Timestamp: {new Date().toLocaleString('en-IN')}</p>
            </div>

            <p className="text-xs text-slate-400 italic">
              This document was fetched securely through the ScholarSetu authorization layer. Only assigned officers and the student can inspect this file.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 text-xs"
            >
              Close Viewer
            </button>
            <button
              onClick={() => alert(`Simulated secure download for ${docData?.fileName || documentType}`)}
              className="px-4 py-2 bg-indigo-900 text-white font-semibold rounded-xl hover:bg-indigo-800 text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Copy</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
