import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationDrawer } from './NotificationDrawer';
import { MongoStatusBadge } from './MongoStatusBadge';
import {
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
  UserCheck,
  Search,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  FileText,
  Info,
  Phone,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'institution') return '/institution/dashboard';
    if (user.role === 'government') return '/government/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Govt Disclaimer Ribbon */}
      <div className="bg-indigo-950 text-indigo-100 text-[11px] py-1 px-4 flex flex-wrap justify-between items-center border-b border-indigo-900/50">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>National Inter-State Student Scholarship Verification Portal • Government of India</span>
        </div>
        <div className="flex items-center gap-4 text-indigo-200">
          <MongoStatusBadge />
          <span className="hidden sm:inline">•</span>
          <span>Student Fee: <strong>₹150</strong> (Zero Fee for Colleges & State Govt)</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-900 text-amber-400 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-indigo-950 tracking-tight">
                  Scholar<span className="text-indigo-600">Setu</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  NATIONAL PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                One Nation. One Verification. Equal Scholarship Access.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link
              to="/"
              className={`hover:text-indigo-600 transition-colors ${isActive('/') ? 'text-indigo-600' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/scholarships"
              className={`hover:text-indigo-600 transition-colors ${isActive('/scholarships') ? 'text-indigo-600' : ''}`}
            >
              Scholarships
            </Link>
            <Link
              to="/colleges"
              className={`hover:text-indigo-600 transition-colors ${isActive('/colleges') ? 'text-indigo-600' : ''}`}
            >
              Colleges Directory
            </Link>
            <Link
              to="/track"
              className={`hover:text-indigo-600 transition-colors ${isActive('/track') ? 'text-indigo-600' : ''}`}
            >
              Track Application
            </Link>
            <Link
              to="/about"
              className={`hover:text-indigo-600 transition-colors ${isActive('/about') ? 'text-indigo-600' : ''}`}
            >
              About Platform
            </Link>
          </nav>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {/* User Dashboard / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNotifOpen(true)}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                </button>

                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 bg-indigo-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-indigo-800 transition-colors shadow-xs"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
                  <span className="capitalize text-[10px] bg-indigo-800 text-indigo-200 px-1.5 py-0.5 rounded">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold">
                <Link
                  to="/login"
                  className="px-3 py-2 text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Portal Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-xs"
                >
                  Student Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-3 font-medium text-sm text-slate-800">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-slate-100"
          >
            Home
          </Link>
          <Link
            to="/scholarships"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-slate-100"
          >
            Find Scholarships
          </Link>
          <Link
            to="/colleges"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-slate-100"
          >
            Colleges Directory
          </Link>
          <Link
            to="/track"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-slate-100"
          >
            Track Application Status
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-slate-100"
          >
            About ScholarSetu
          </Link>
          <Link
            to="/privacy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2"
          >
            Privacy & Security Policy
          </Link>
        </div>
      )}

      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </header>
  );
};
