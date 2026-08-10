import React from 'react';
import { ApplicationStatus } from '../types';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, CreditCard, Building2, Landmark } from 'lucide-react';

interface ProgressTimelineProps {
  status: ApplicationStatus | string;
  paymentStatus: string;
  institutionStatus: string;
  governmentStatus: string;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  status,
  paymentStatus,
  institutionStatus,
  governmentStatus,
}) => {
  const isPaid = paymentStatus === 'Paid';
  const isInstVerified = institutionStatus === 'Verified';
  const isInstRejected = institutionStatus === 'Rejected';
  const isGovtApproved = governmentStatus === 'Approved';
  const isGovtRejected = status === 'Rejected' || governmentStatus === 'Rejected';

  const steps = [
    {
      id: 1,
      name: 'Application Submitted',
      description: 'Fee Payment (₹150)',
      icon: CreditCard,
      status: isPaid ? 'completed' : 'current',
    },
    {
      id: 2,
      name: 'Institution Verification',
      description: 'Enrollment & Bonafide Check',
      icon: Building2,
      status: isInstVerified
        ? 'completed'
        : isInstRejected
        ? 'failed'
        : isPaid
        ? 'current'
        : 'upcoming',
    },
    {
      id: 3,
      name: 'State Government Review',
      description: 'Home State Scholarship Dept',
      icon: Landmark,
      status: isGovtApproved
        ? 'completed'
        : isGovtRejected
        ? 'failed'
        : isInstVerified
        ? 'current'
        : 'upcoming',
    },
    {
      id: 4,
      name: 'Sanction & Disbursement',
      description: 'Direct Benefit Transfer (DBT)',
      icon: ShieldCheck,
      status: isGovtApproved ? 'completed' : 'upcoming',
    },
  ];

  return (
    <div className="w-full py-4">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
        {/* Connector line for desktop */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-200 z-0" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          let circleBg = 'bg-slate-100 text-slate-400 border-slate-300';
          let textColor = 'text-slate-500';

          if (step.status === 'completed') {
            circleBg = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
            textColor = 'text-emerald-900 font-semibold';
          } else if (step.status === 'current') {
            circleBg = 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-4 ring-indigo-100';
            textColor = 'text-indigo-900 font-bold';
          } else if (step.status === 'failed') {
            circleBg = 'bg-rose-600 text-white border-rose-600';
            textColor = 'text-rose-900 font-semibold';
          }

          return (
            <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center w-full md:w-1/4">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${circleBg}`}>
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : step.status === 'failed' ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className={`text-sm ${textColor}`}>{step.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
