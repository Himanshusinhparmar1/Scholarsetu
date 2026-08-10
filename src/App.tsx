import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ScholarshipDirectoryPage } from './pages/ScholarshipDirectoryPage';
import { ScholarshipDetailsPage } from './pages/ScholarshipDetailsPage';
import { CollegeDirectoryPage } from './pages/CollegeDirectoryPage';
import { ApplicationFormPage } from './pages/ApplicationFormPage';
import { TrackStatusPage } from './pages/TrackStatusPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Dashboards
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { InstitutionDashboardPage } from './pages/InstitutionDashboardPage';
import { GovernmentDashboardPage } from './pages/GovernmentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent: React.FC = () => {
  const location = useLocation();

  // Hide standard Navbar and Footer inside dashboard views so DashboardLayout takes over cleanly
  const isDashboardRoute =
    location.pathname.startsWith('/student/') ||
    location.pathname.startsWith('/institution/') ||
    location.pathname.startsWith('/government/') ||
    location.pathname.startsWith('/admin/');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {!isDashboardRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/scholarships" element={<ScholarshipDirectoryPage />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />
          <Route path="/apply/:scholarshipId" element={<ApplicationFormPage />} />
          <Route path="/apply" element={<ApplicationFormPage />} />
          <Route path="/colleges" element={<CollegeDirectoryPage />} />
          <Route path="/track" element={<TrackStatusPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Role Dashboards */}
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/institution/dashboard" element={<InstitutionDashboardPage />} />
          <Route path="/government/dashboard" element={<GovernmentDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </div>

      {!isDashboardRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
