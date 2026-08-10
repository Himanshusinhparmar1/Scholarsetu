import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Scholarship, Institution } from '../types';
import {
  GraduationCap,
  Building2,
  Landmark,
  FileText,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
  Lock,
} from 'lucide-react';

const INDIAN_STATES = [
  'Gujarat',
  'Maharashtra',
  'Karnataka',
  'Rajasthan',
  'Tamil Nadu',
  'Delhi',
  'Uttar Pradesh',
  'Assam',
  'Bihar',
  'Kerala',
  'Madhya Pradesh',
  'Punjab',
  'West Bengal',
  'Telangana',
];

export const ApplicationFormPage: React.FC = () => {
  const { scholarshipId } = useParams<{ scholarshipId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [step, setStep] = useState(1);
  const [homeState, setHomeState] = useState(user?.homeState || 'Gujarat');
  const [studyState, setStudyState] = useState(user?.studyState || 'Maharashtra');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Engineering');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [rollNumber, setRollNumber] = useState('2023-BT-092');

  // Documents
  const [bonafideFile, setBonafideFile] = useState<File | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);
  const [incomeFile, setIncomeFile] = useState<File | null>(null);
  const [domicileFile, setDomicileFile] = useState<File | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NET_BANKING' | 'CARD'>('UPI');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatedAppNumber, setGeneratedAppNumber] = useState('');

  useEffect(() => {
    if (scholarshipId) {
      api
        .getScholarshipById(scholarshipId)
        .then((res) => {
          if (res.success) setScholarship(res.scholarship);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    api.getInstitutions().then((res) => {
      if (res.success) setInstitutions(res.institutions || []);
    });
  }, [scholarshipId]);

  const filteredInstitutions = institutions.filter((inst) => !studyState || inst.state === studyState);

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      const res = await api.submitApplication({
        scholarshipId: scholarship?.id || scholarshipId || 'sch-1',
        institutionId: selectedInstitutionId || 'inst-1',
        homeState,
        studyState,
        course,
        academicYear,
        rollNumber,
      });

      if (res.success) {
        setGeneratedAppNumber(res.application?.applicationNumber || 'SS-2026-99011');
        setPaymentSuccess(true);
      }
    } catch (err: any) {
      alert(err.message || 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500 text-sm">Preparing application portal...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/scholarships" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scholarships Directory</span>
        </Link>

        {/* APPLICATION CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden space-y-0">
          {/* Header */}
          <div className="bg-indigo-950 text-white p-6 sm:p-8 space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-800 text-amber-300 text-xs font-bold">
              Cross-State Verification Application
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {scholarship?.name || 'Post-Matric Scholarship Scheme'}
            </h1>
            <p className="text-indigo-200 text-xs">
              Provider: {scholarship?.provider || 'Central / State Government Department'}
            </p>
          </div>

          {/* Stepper Header */}
          {!paymentSuccess && (
            <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex justify-between text-xs font-bold text-slate-600">
              <span className={step === 1 ? 'text-indigo-900 font-black' : ''}>1. State & Institution</span>
              <span className={step === 2 ? 'text-indigo-900 font-black' : ''}>2. Upload Documents</span>
              <span className={step === 3 ? 'text-indigo-900 font-black' : ''}>3. Pay ₹150 Fee</span>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {paymentSuccess ? (
              /* SUCCESS STATE */
              <div className="text-center space-y-6 py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-indigo-950">Application Submitted & Fee Paid!</h2>
                  <p className="text-xs text-slate-600">
                    Your cross-state verification request has been dispatched to your institution.
                  </p>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl text-left space-y-3 font-mono text-xs border border-slate-800 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Application Number:</span>
                    <span className="text-amber-400 font-bold">{generatedAppNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className="text-emerald-400 font-bold">₹150 PAID (SUCCESS)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Verification Desk:</span>
                    <span className="text-indigo-300">{institutionName || 'Selected Institution'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Home State:</span>
                    <span className="text-indigo-300">{homeState}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-4">
                  <Link
                    to="/student/dashboard"
                    className="px-6 py-3 bg-indigo-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 transition-colors"
                  >
                    Go to Student Dashboard
                  </Link>
                  <Link
                    to="/track"
                    className="px-6 py-3 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
                  >
                    Track Application
                  </Link>
                </div>
              </div>
            ) : step === 1 ? (
              /* STEP 1: STATE AND COLLEGE SELECT */
              <div className="space-y-6">
                <h3 className="font-bold text-indigo-950 text-base border-b border-slate-100 pb-2">
                  1. Domicile State & Out-of-State College
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Home (Domicile) State *</label>
                    <select
                      value={homeState}
                      onChange={(e) => setHomeState(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">State Where You Are Studying *</label>
                    <select
                      value={studyState}
                      onChange={(e) => setStudyState(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-medium">
                  <label className="block text-slate-700 font-bold">Select Your College / Institution *</label>
                  <select
                    value={selectedInstitutionId}
                    onChange={(e) => {
                      setSelectedInstitutionId(e.target.value);
                      const inst = institutions.find((i) => i.id === e.target.value);
                      if (inst) setInstitutionName(inst.name);
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="">-- Choose Institution from Database --</option>
                    {filteredInstitutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.city}, {inst.state})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500">
                    College not listed?{' '}
                    <Link to="/colleges?action=onboard" className="text-indigo-600 font-bold hover:underline">
                      Ask your College Nodal Officer to Onboard for Free (₹0)
                    </Link>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Course / Specialization</label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">College Roll No / Enrollment ID</label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="e.g. 2023-BT-092"
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!selectedInstitutionId) {
                        alert('Please select your institution from the directory.');
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-6 py-3 bg-indigo-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Upload Documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : step === 2 ? (
              /* STEP 2: UPLOAD DOCUMENTS */
              <div className="space-y-6">
                <h3 className="font-bold text-indigo-950 text-base border-b border-slate-100 pb-2">
                  2. Document Vault Upload
                </h3>
                <p className="text-xs text-slate-600">
                  Upload PDF or JPG documents for institution bonafide verification. Your files are encrypted with role-based privacy.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="font-bold text-slate-800">1. College Bonafide Certificate *</p>
                    <div className="border-2 border-dashed border-slate-300 p-4 rounded-lg text-center bg-white cursor-pointer hover:border-indigo-400">
                      <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {bonafideFile ? bonafideFile.name : 'Click to select bonafide_cert.pdf'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setBonafideFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="font-bold text-slate-800">2. Previous Year Marksheet *</p>
                    <div className="border-2 border-dashed border-slate-300 p-4 rounded-lg text-center bg-white cursor-pointer hover:border-indigo-400">
                      <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {marksheetFile ? marksheetFile.name : 'Click to select marksheet.pdf'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setMarksheetFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="font-bold text-slate-800">3. Income Certificate</p>
                    <div className="border-2 border-dashed border-slate-300 p-4 rounded-lg text-center bg-white cursor-pointer hover:border-indigo-400">
                      <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {incomeFile ? incomeFile.name : 'Click to select income_stmt.pdf'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setIncomeFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="font-bold text-slate-800">4. Domicile Certificate ({homeState})</p>
                    <div className="border-2 border-dashed border-slate-300 p-4 rounded-lg text-center bg-white cursor-pointer hover:border-indigo-400">
                      <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {domicileFile ? domicileFile.name : 'Click to select domicile_cert.pdf'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setDomicileFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-indigo-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Payment (₹150)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 3: PAYMENT OF ₹150 */
              <div className="space-y-6">
                <h3 className="font-bold text-indigo-950 text-base border-b border-slate-100 pb-2">
                  3. Student Application Processing Fee Payment
                </h3>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
                  <CreditCard className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Transparent Fee Breakdown</p>
                    <p className="mt-0.5 text-slate-700">
                      Cross-State Verification Processing Fee: <strong>₹150.00 ONLY</strong>. Zero additional tax or hidden charges. Institutions and State Departments pay ₹0.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs">
                    <span className="text-slate-400">Application Item</span>
                    <span className="text-slate-400">Amount</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">{scholarship?.name} Verification Fee</span>
                    <span className="font-bold">₹150.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black border-t border-slate-800 pt-3 text-amber-400">
                    <span>Total Payable Amount</span>
                    <span>₹150.00</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="block text-slate-700 font-bold">Select Payment Mode (Sandbox Simulated)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                          : 'border-slate-300 bg-slate-50 text-slate-700'
                      }`}
                    >
                      UPI / GPay / PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('NET_BANKING')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        paymentMethod === 'NET_BANKING'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                          : 'border-slate-300 bg-slate-50 text-slate-700'
                      }`}
                    >
                      Net Banking
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        paymentMethod === 'CARD'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                          : 'border-slate-300 bg-slate-50 text-slate-700'
                      }`}
                    >
                      Debit / Credit Card
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    disabled={submitting}
                    onClick={handleSubmitApplication}
                    className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
                  >
                    {submitting ? 'Processing Payment...' : 'Pay ₹150 & Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
