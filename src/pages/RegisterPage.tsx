import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight } from 'lucide-react';

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

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: 'Rahul Patel',
    email: 'student@scholarsetu.in',
    password: 'password123',
    homeState: 'Gujarat',
    studyState: 'Maharashtra',
    aadhaarNumber: '9988-7766-5544',
    course: 'B.Tech Computer Engineering',
    institutionName: 'COEP Technological University, Pune',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await register({
        ...form,
        role: 'student',
      });
      if (res.success) {
        navigate('/student/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-800 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-amber-400 flex items-center justify-center font-black">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-indigo-950 tracking-tight">ScholarSetu</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Student Account Registration</h1>
          <p className="text-xs text-slate-500">
            Register your cross-state verification profile to apply for home-state scholarship schemes.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Full Name (As per Aadhaar/Marksheet) *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Password *</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Home (Domicile) State *</label>
                <select
                  value={form.homeState}
                  onChange={(e) => setForm({ ...form, homeState: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Study State *</label>
                <select
                  value={form.studyState}
                  onChange={(e) => setForm({ ...form, studyState: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Enrolled Out-of-State College Name</label>
              <input
                type="text"
                value={form.institutionName}
                onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Register & Continue'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
