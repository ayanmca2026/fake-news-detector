import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { getDashboardStats, getHistory } from '../services/api';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, h] = await Promise.all([
          getDashboardStats().catch(() => null),
          getHistory(0, 50).catch(() => []),
        ]);
        setStats(s);
        setHistoryList(Array.isArray(h) ? h : []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const total =
    (stats?.real_predictions || 0) +
    (stats?.fake_predictions || 0) +
    (stats?.uncertain_predictions || 0);

  const realPct = total > 0 ? Math.round(((stats?.real_predictions || 0) / total) * 100) : 0;
  const fakePct = total > 0 ? Math.round(((stats?.fake_predictions || 0) / total) * 100) : 0;
  const uncertainPct = total > 0 ? Math.round(((stats?.uncertain_predictions || 0) / total) * 100) : 0;

  // Chart: Confidence vs Credibility across recent analyses
  const chartData = historyList
    .slice(0, 10)
    .map((item, idx) => ({
      name: item.article_title ? item.article_title.slice(0, 15) + '...' : `Article #${item.id}`,
      confidence: item.confidence || 0,
      credibility: item.credibility_score || 0,
      verdict: item.prediction,
    }))
    .reverse();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Platform Intelligence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Misinformation Analytics & Velocity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated metrics on detection accuracy, credibility patterns, and assessment volume.
          </p>
        </div>

        <Link
          to="/analyze"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Metric Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Detection Volume</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-slate-100">{total}</div>
            <p className="text-[11px] text-slate-400">Articles evaluated</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Misinformation Ratio</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold text-rose-400">{fakePct}%</div>
            <p className="text-[11px] text-slate-400">{stats?.fake_predictions || 0} flagged articles</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Verified Real Ratio</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{realPct}%</div>
            <p className="text-[11px] text-slate-400">{stats?.real_predictions || 0} authentic articles</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Tree Confidence</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-blue-400">
              {stats?.average_confidence ? `${stats.average_confidence}%` : '—'}
            </div>
            <p className="text-[11px] text-slate-400">Ensemble vote certainty</p>
          </div>
        </div>
      )}

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Verdict Ratio Progress Breakdown */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Verdict Distribution Ratio</span>
            </h3>
          </div>

          {total === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No evaluation data available yet.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Likely Real Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-400">Likely Real</span>
                  <span className="text-slate-300">{stats?.real_predictions || 0} ({realPct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${realPct}%` }} />
                </div>
              </div>

              {/* Potentially Fake Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-rose-400">Potentially Fake</span>
                  <span className="text-slate-300">{stats?.fake_predictions || 0} ({fakePct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${fakePct}%` }} />
                </div>
              </div>

              {/* Uncertain Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-amber-400">Uncertain</span>
                  <span className="text-slate-300">{stats?.uncertain_predictions || 0} ({uncertainPct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${uncertainPct}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Model Note */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-200">Ensemble Calibration:</span>
            <p className="text-[11px] leading-relaxed">
              Confidence reflects the proportion of Random Forest decision trees agreeing on the winning class. Credibility reflects heuristic penalties applied to sensationalist syntax.
            </p>
          </div>
        </div>

        {/* Right: Confidence vs Credibility Comparison Chart */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Confidence & Credibility Across Recent Analyses</span>
            </h3>
          </div>

          {chartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-xs text-slate-500">
              <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
              <span>Perform analyses to generate intelligence timeline charts.</span>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
                            <p className="font-bold text-slate-200">{label}</p>
                            <p className="text-cyan-400">Confidence: {payload[0]?.value}%</p>
                            <p className="text-indigo-400">Credibility: {payload[1]?.value}/100</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="confidence" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Confidence %" />
                  <Bar dataKey="credibility" fill="#6366F1" radius={[4, 4, 0, 0]} name="Credibility Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400" />
              <span>Model Confidence (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-500" />
              <span>Credibility Score (/100)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
