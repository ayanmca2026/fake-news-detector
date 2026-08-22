import axios from 'axios';

// Will strictly use the environment variable. Ensure .env is set locally for dev.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const analyzeNews = async (title, content, source_url) => {
  const response = await api.post('/prediction/analyze', { title, content, source_url });
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history/');
  return response.data;
};

export default api;
