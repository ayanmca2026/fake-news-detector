import axios from 'axios';

// Resolve base URL from env, or default to relative/local for development
const resolvedBaseUrl = import.meta.env.VITE_API_URL || 'https://fake-news-backend-0p9c.onrender.com/api';

const api = axios.create({
  baseURL: resolvedBaseUrl,
  timeout: 60000,
});

// Add auth token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor for 401 Unauthorized handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear and notify
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Prediction / Analysis Services
export const analyzeNews = async (title, content, source_url = '') => {
  const response = await api.post('/prediction/analyze', { 
    title: title || '', 
    content, 
    source_url: source_url || '' 
  });
  return response.data;
};

// Dashboard Services
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// History Services
export const getHistory = async (skip = 0, limit = 100) => {
  const response = await api.get(`/history/?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getHistoryDetail = async (historyId) => {
  const response = await api.get(`/history/${historyId}`);
  return response.data;
};

export const deleteHistory = async (historyId) => {
  const response = await api.delete(`/history/${historyId}`);
  return response.data;
};

// Model Intelligence Services
export const getModelInfo = async () => {
  const response = await api.get('/model/info');
  return response.data;
};

// Health Check
export const checkHealth = async () => {
  // Check health endpoint (handle both with and without /api)
  try {
    const response = await axios.get(
      resolvedBaseUrl.replace(/\/api$/, '') + '/api/health', 
      { timeout: 5000 }
    );
    return response.data;
  } catch {
    return { status: 'offline' };
  }
};

export default api;
