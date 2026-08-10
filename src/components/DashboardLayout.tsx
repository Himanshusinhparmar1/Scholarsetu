import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationDrawer } from './NotificationDrawer';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Building2,
  Landmark,
  ShieldAlert,
  LogOut,
  Bell,
  Search,
  User,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (user?.role === 'student') {
      return [
        { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Apply Scheme', path: '/scholarships', icon: FileText },
        { label: 'College Directory', path: '/colleges', icon: Building2 },
        { label: 'Track Application', path: '/track', icon: Search },
      ];
    } else if (user?.role === 'institution') {
      return [
        { label: 'Verifications Desk', path: '/institution/dashboard', icon: LayoutDashboard },
        { label: 'Student Directory', path: '/colleges', icon: Building2 },
        { label: 'Institutional Profile', path: '/colleges?action=onboard', icon: ExternalLink },
      ];
    } else if (user?.role === 'government') {
      return [
        { label: 'State Sanctions Desk', path: '/government/dashboard', icon: LayoutDashboard },
        { label: 'Schemes Manager', path: '/scholarships', icon: Landmark },
        { label: 'Out-of-State Colleges', path: '/colleges', icon: Building2 },
      ];
    } else if (user?.role === 'admin') {
      return [
        { label: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'All Scholarships', path: '/scholarships', icon: Landmark },
        { label: 'All Colleges', path: '/colleges', icon: Building2 },
        { label: 'Audit Logs', path: '/admin/dashboard?tab=logs', icon: ShieldAlert },
      ];
    }
    return [];
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* GEOMETRIC BALANCE SIDEBAR */}
      <aside className="w-64 bg-indigo-950 text-white flex flex-col border-r border-slate-200 shrink-0 hidden md:flex">
        {/* Brand Header */}
        <div className="p-6 border-b border-indigo-900/50 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold text-lg text-white">
            S
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">ScholarSetu</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {getNavLinks().map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-900/50 text-white font-bold border-l-4 border-indigo-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 opacity-80" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Badge Footer */}
        <div className="p-4 border-t border-indigo-900/50">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-indigo-950 font-bold text-sm">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="flex flex-col max-w-[110px]">
                <span className="text-sm font-semibold truncate text-white">{user?.name}</span>
                <span className="text-xs text-indigo-300 capitalize">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* GEOMETRIC BALANCE TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 hidden sm:inline">
              Cross-State Student Verification Network
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Network</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Drawer */}
            <NotificationDrawer />

            {/* Quick action button */}
            {user?.role === 'student' && (
              <Link
                to="/scholarships"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                + Apply New Scheme
              </Link>
            )}

            {/* Logout Mobile */}
            <button
              onClick={handleLogout}
              className="md:hidden text-xs text-slate-500 hover:text-rose-600 font-bold"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
