import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getMe as apiGetMe, checkHealth } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(true);

  // Periodic health check
  const verifyBackendHealth = useCallback(async () => {
    try {
      const res = await checkHealth();
      setBackendOnline(res?.status === 'ok');
    } catch {
      setBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    verifyBackendHealth();
    const interval = setInterval(verifyBackendHealth, 30000);
    return () => clearInterval(interval);
  }, [verifyBackendHealth]);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await apiGetMe();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    if (data?.access_token) {
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      try {
        const profile = await apiGetMe();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch {
        setUser({ email });
      }
      return data;
    }
    throw new Error('Authentication failed');
  };

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        backendOnline,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        verifyBackendHealth,
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
