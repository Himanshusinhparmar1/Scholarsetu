import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${maxWidth} overflow-hidden transform transition-all`}>
        <div className="px-6 py-4 bg-indigo-950 text-white flex items-center justify-between">
          <h3 className="font-bold text-lg tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-indigo-800 text-indigo-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
