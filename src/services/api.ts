// API Service Helper for ScholarSetu Backend

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('scholarsetu_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Dedicated API Methods
export const api = {
  // Auth
  login: (credentials: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: (role: string, state?: string) => apiRequest('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role, state }) }),
  getMe: () => apiRequest('/auth/me'),

  // Student Profile
  getProfile: () => apiRequest('/students/profile'),
  updateProfile: (profileData: any) => apiRequest('/students/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Institutions
  getInstitutions: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/institutions${query ? `?${query}` : ''}`);
  },
  getInstitutionById: (id: string) => apiRequest(`/institutions/${id}`),
  registerInstitution: (data: any) => apiRequest('/institutions', { method: 'POST', body: JSON.stringify(data) }),

  // Scholarships
  getScholarships: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/scholarships${query ? `?${query}` : ''}`);
  },
  getScholarshipById: (id: string) => apiRequest(`/scholarships/${id}`),
  createScholarship: (data: any) => apiRequest('/scholarships', { method: 'POST', body: JSON.stringify(data) }),
  updateScholarship: (id: string, data: any) => apiRequest(`/scholarships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteScholarship: (id: string) => apiRequest(`/scholarships/${id}`, { method: 'DELETE' }),

  // Applications
  getApplications: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/applications${query ? `?${query}` : ''}`);
  },
  getStudentApplications: () => apiRequest('/applications'),
  getInstitutionApplications: () => apiRequest('/applications'),
  getGovernmentApplications: () => apiRequest('/applications'),
  getApplicationById: (id: string) => apiRequest(`/applications/${id}`),
  trackApplication: (appNumber: string) => apiRequest(`/applications/track/${appNumber}`),
  createApplication: (data: any) => apiRequest('/applications', { method: 'POST', body: JSON.stringify(data) }),
  submitApplication: (data: any) => apiRequest('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateApplicationStatus: (id: string, data: any) => apiRequest(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  verifyInstitutionApplication: (id: string, status: string, remarks?: string) =>
    apiRequest(`/applications/${id}`, { method: 'PUT', body: JSON.stringify({ status, remarks }) }),
  approveGovernmentApplication: (id: string, remarks?: string) =>
    apiRequest(`/applications/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'Government Approved', remarks }) }),

  // Verifications
  verifyApplication: (data: any) => apiRequest('/verifications', { method: 'POST', body: JSON.stringify(data) }),
  getVerifications: (appId: string) => apiRequest(`/verifications/${appId}`),

  // Payments
  createPaymentOrder: (applicationId: string) => apiRequest('/payments/create', { method: 'POST', body: JSON.stringify({ applicationId }) }),
  verifyPayment: (data: any) => apiRequest('/payments/verify', { method: 'POST', body: JSON.stringify(data) }),
  getPaymentDetails: (appId: string) => apiRequest(`/payments/${appId}`),

  // Admin
  getStatistics: () => apiRequest('/admin/statistics'),
  getAdminStats: () => apiRequest('/admin/statistics'),
  getAdminApplications: () => apiRequest('/admin/applications'),
  getAuditLogs: () => apiRequest('/admin/audit-logs'),
  getFee: () => apiRequest('/admin/fee'),
  updateFee: (fee: number) => apiRequest('/admin/fee', { method: 'PUT', body: JSON.stringify({ fee }) }),
  updateUserStatus: (userId: string, status: string) => apiRequest(`/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getUsers: () => apiRequest('/admin/users'),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  markNotificationRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),

  // Documents
  getDocument: (id: string) => apiRequest(`/documents/${id}`),
};
