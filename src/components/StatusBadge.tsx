import React from 'react';
import { ApplicationStatus, VerificationStepStatus, PaymentStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus | VerificationStepStatus | PaymentStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let colorStyle = 'bg-slate-100 text-slate-800 border-slate-200';
  let dotColor = 'bg-slate-500';

  const normalized = String(status).toLowerCase();

  if (normalized.includes('approved') || normalized.includes('verified') || normalized.includes('paid')) {
    colorStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (normalized.includes('pending') || normalized.includes('submitted')) {
    colorStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500 animate-pulse';
  } else if (normalized.includes('rejected') || normalized.includes('failed')) {
    colorStyle = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (normalized.includes('correction') || normalized.includes('info')) {
    colorStyle = 'bg-blue-50 text-blue-800 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (normalized.includes('withdrawn')) {
    colorStyle = 'bg-slate-100 text-slate-600 border-slate-300';
    dotColor = 'bg-slate-400';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorStyle} ${sizeClasses[size]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
