import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
  Search,
  ArrowRight,
  RefreshCw,
  Clock,
  Eye,
  ChevronRight,
  BarChart2,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts';
import { getDashboardStats, getHistory } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CardSkeleton, TableSkeleton } from '../components/ui/LoadingSkeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        getDashboardStats().catch(() => null),
        getHistory(0, 5).catch(() => []),
      ]);

      setStats(statsData);
      setRecentHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Pie chart data for verdict distribution
  const pieData = stats
    ? [
        { name: 'Likely Real', value: stats.real_predictions || 0, color: '#10B981' },
        { name: 'Potentially Fake', value: stats.fake_predictions || 0, color: '#EF4444' },
        { name: 'Uncertain', value: stats.uncertain_predictions || 0, color: '#F59E0B' },
      ].filter((d) => d.value > 0)
    : [];

  const totalCalculated =
    (stats?.real_predictions || 0) +
    (stats?.fake_predictions || 0) +
    (stats?.uncertain_predictions || 0);

  // Timeline Activity mock data or from history
  const timelineData = recentHistory.map((h, index) => ({
    name: new Date(h.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    confidence: h.confidence || 50,
    credibility: h.credibility_score || 50,
  })).reverse();

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Misinformation Intelligence Overview
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Analyst'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor real-time analysis volume, model verdict distributions, and credibility metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/analyze"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Metric Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <CardSkeleton count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Analyses */}
          <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Evaluated</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {stats?.total_analyses || 0}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Verified claims</span>
            </div>
          </div>

          {/* Card 2: Potentially Fake */}
          <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Flagged Fake
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
              {stats?.fake_predictions || 0}
            </div>
            <div className="text-[11px] text-slate-400">
              {totalCalculated > 0
                ? `${Math.round(((stats?.fake_predictions || 0) / totalCalculated) * 100)}% of total`
                : 'Deceptive markers'}
            </div>
          </div>

          {/* Card 3: Likely Real */}
          <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Likely Real
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {stats?.real_predictions || 0}
            </div>
            <div className="text-[11px] text-slate-400">
              {totalCalculated > 0
                ? `${Math.round(((stats?.real_predictions || 0) / totalCalculated) * 100)}% of total`
                : 'Authentic sources'}
            </div>
          </div>

          {/* Card 4: Uncertain */}
          <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Uncertain
              </span>
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {stats?.uncertain_predictions || 0}
            </div>
            <div className="text-[11px] text-slate-400">Borderline signals</div>
          </div>

          {/* Card 5: Average Confidence */}
          <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Confidence</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">
              {stats?.average_confidence ? `${stats.average_confidence}%` : '—'}
            </div>
            <div className="text-[11px] text-slate-400">Tree vote agreement</div>
          </div>

          {/* Card 6: Average Credibility */}
          <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Credibility</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
              {stats?.average_credibility ? `${stats.average_credibility}/100` : '—'}
            </div>
            <div className="text-[11px] text-slate-400">Heuristic rating</div>
          </div>
        </div>
      )}

      {/* Analytics & Distribution Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Chart Verdict Distribution */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Verdict Distribution</span>
            </h3>
            <span className="text-xs text-slate-400">{totalCalculated} total</span>
          </div>

          {totalCalculated === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No analysis data yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Submit your first news article to generate visual misinformation distribution charts.
              </p>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs">
                            <p className="font-bold text-slate-200">{payload[0].name}</p>
                            <p className="text-slate-400 mt-0.5">
                              {payload[0].value} articles (
                              {Math.round((payload[0].value / totalCalculated) * 100)}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-100">{totalCalculated}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-500">Evaluated</span>
              </div>
            </div>
          )}

          {/* Legend Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 font-semibold block">REAL</span>
              <span className="text-sm font-bold text-slate-100">{stats?.real_predictions || 0}</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-[10px] text-rose-400 font-semibold block">FAKE</span>
              <span className="text-sm font-bold text-slate-100">{stats?.fake_predictions || 0}</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-amber-400 font-semibold block">UNCERTAIN</span>
              <span className="text-sm font-bold text-slate-100">{stats?.uncertain_predictions || 0}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action & Model Banner */}
        <div className="lg:col-span-7 flex flex-col justify-between glass-panel p-6 rounded-3xl relative overflow-hidden space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Model Inference</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              Analyze Any News Article, Tweet, or Claim
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              Paste full content or headlines into the workspace. The engine checks 10,000 TF-IDF features across 50 decision trees to estimate authenticity, credibility, and misinformation risk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                Active Classifier
              </span>
              <div className="text-sm font-bold text-slate-200">Random Forest Ensemble</div>
              <span className="text-xs text-cyan-400 mt-1 block">99.5% Test Accuracy</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                Feature Space
              </span>
              <div className="text-sm font-bold text-slate-200">TF-IDF (1, 2) N-Grams</div>
              <span className="text-xs text-blue-400 mt-1 block">10,000 Vocabulary Weights</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Launch Analysis Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Analyses Table Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Evaluations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Most recent content assessments generated by TruthLens AI</p>
          </div>

          <Link
            to="/history"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>View Full History</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : recentHistory.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No evaluations found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't analyzed any articles yet. Submit an article to populate your assessment log.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
            >
              <span>Analyze an Article Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Article Title / Snippet</th>
                  <th className="py-3 px-3">Verdict</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Credibility</th>
                  <th className="py-3 px-3">Risk</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-slate-200 max-w-xs truncate">
                      {item.article_title || 'Untitled Article'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          item.prediction === 'FAKE'
                            ? 'badge-fake'
                            : item.prediction === 'REAL'
                            ? 'badge-real'
                            : 'badge-uncertain'
                        }`}
                      >
                        {item.prediction === 'FAKE'
                          ? 'POTENTIALLY FAKE'
                          : item.prediction === 'REAL'
                          ? 'LIKELY REAL'
                          : 'UNCERTAIN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-300">
                      {item.confidence ? `${item.confidence.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-semibold ${
                          (item.credibility_score || 0) >= 70
                            ? 'text-emerald-400'
                            : (item.credibility_score || 0) >= 40
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.credibility_score || 0}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[11px] font-bold ${
                          item.risk_level === 'LOW'
                            ? 'text-emerald-400'
                            : item.risk_level === 'MEDIUM'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {item.risk_level || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to="/history"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold p-1 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
