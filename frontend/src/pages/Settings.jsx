import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Shield,
  Server,
  Lock,
  LogOut,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { user, logout, backendOnline } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Configuration & Preferences
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          Account & Platform Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your analyst profile, inspect active server connections, and review security settings.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <User className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">Analyst Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold block">Full Name</span>
            <span className="text-sm font-bold text-slate-200">{user?.name || 'Ayan Ghosh'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold block">Email Address</span>
            <span className="text-sm font-bold text-slate-200">{user?.email || 'analyst@truthlens.ai'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold block">Account Role</span>
            <span className="text-sm font-bold text-cyan-400">Intelligence Analyst (Full Access)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-semibold block">Authentication Method</span>
            <span className="text-sm font-bold text-slate-200">JWT Token (Bearer Auth)</span>
          </div>
        </div>
      </div>

      {/* Platform & Server Connectivity Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Server className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-slate-100">Platform Deployment Status</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Backend API Status</span>
            <span
              className={`font-semibold flex items-center gap-1.5 ${
                backendOnline ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}
              />
              <span>{backendOnline ? 'Operational & Healthy' : 'Offline / Unreachable'}</span>
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Serving Framework</span>
            <span className="font-semibold text-slate-200">FastAPI (Python 3.11/3.13)</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">Frontend Environment</span>
            <span className="font-semibold text-slate-200">Vite + React 19 + Tailwind CSS</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400">GitHub Repository</span>
            <a
              href="https://github.com/ayanmca2026/fake-news-detector"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>ayanmca2026/fake-news-detector</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-200">Sign Out of Platform</h4>
          <p className="text-xs text-slate-500 mt-0.5">End your current analyst session on this device.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
