import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, Institution } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  institution: Institution | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  demoLogin: (role: string, state?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('scholarsetu_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMe = async () => {
    if (!localStorage.getItem('scholarsetu_token')) {
      setUser(null);
      setProfile(null);
      setInstitution(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile || null);
        setInstitution(data.institution || null);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Session expired or error fetching me:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, [token]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password: pass });
      localStorage.setItem('scholarsetu_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await fetchMe();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      localStorage.setItem('scholarsetu_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await fetchMe();
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role: string, state?: string) => {
    setLoading(true);
    try {
      const res = await api.demoLogin(role, state);
      localStorage.setItem('scholarsetu_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await fetchMe();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('scholarsetu_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setInstitution(null);
  };

  const refreshUser = async () => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        institution,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
