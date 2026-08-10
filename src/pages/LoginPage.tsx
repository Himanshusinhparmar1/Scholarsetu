import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, ShieldCheck, Mail, ArrowRight, UserCheck, Building2, Landmark } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillCredentials = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        if (redirect) {
          navigate(redirect);
        } else if (res.user.role === 'student') {
          navigate('/student/dashboard');
        } else if (res.user.role === 'institution') {
          navigate('/institution/dashboard');
        } else if (res.user.role === 'government') {
          navigate('/government/dashboard');
        } else if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-800 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-amber-400 flex items-center justify-center font-black">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-indigo-950 tracking-tight">ScholarSetu</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">National Verification Portal Login</h1>
          <p className="text-xs text-slate-500">
            Secure single sign-on for Students, Educational Institutions, State Departments, and System Admins.
          </p>
        </div>

        {/* Quick Fill Preset Credentials Helper */}
        <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Quick Select Official Role Account:</span>
            <span className="text-[10px] text-slate-500 font-normal">(Fills form fields)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials('student@scholarsetu.in', 'Student@123')}
              className="p-2 bg-white border border-slate-300 text-slate-800 rounded-lg font-bold text-[11px] hover:bg-slate-50 text-left truncate flex items-center gap-1.5 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Student Account</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('coep.nodal@coep.ac.in', 'Inst@123')}
              className="p-2 bg-white border border-slate-300 text-slate-800 rounded-lg font-bold text-[11px] hover:bg-slate-50 text-left truncate flex items-center gap-1.5 shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>College Nodal</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin.gujarat@scholarships.gov.in', 'Govt@123')}
              className="p-2 bg-white border border-slate-300 text-slate-800 rounded-lg font-bold text-[11px] hover:bg-slate-50 text-left truncate flex items-center gap-1.5 shadow-2xs"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>State Govt Nodal</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@scholarsetu.in', 'Admin@123')}
              className="p-2 bg-white border border-slate-300 text-slate-800 rounded-lg font-bold text-[11px] hover:bg-slate-50 text-left truncate flex items-center gap-1.5 shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>System Admin</span>
            </button>
          </div>
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
              <label className="block text-slate-700 mb-1 font-bold">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@scholarsetu.in"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Register Student Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
