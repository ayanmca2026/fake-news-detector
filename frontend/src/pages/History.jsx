import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Eye,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  X,
  Copy,
  Check,
  Calendar,
  Layers,
  BookOpen,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { getHistory, getHistoryDetail, deleteHistory } from '../services/api';
import { useToast } from '../context/ToastContext';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';

export default function History() {
  const { showToast } = useToast();

  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Detail Modal State
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await getHistory(0, 100);
      setHistoryList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleInspect = async (id) => {
    setModalLoading(true);
    try {
      const detail = await getHistoryDetail(id);
      setSelectedDetail(detail);
    } catch {
      showToast('Failed to load assessment details.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteHistory(deleteTarget.id);
      setHistoryList((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      showToast('Assessment deleted successfully.', 'info');
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete item.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyDetail = () => {
    if (!selectedDetail) return;
    const text = `TruthLens AI Assessment Dossier
Title: ${selectedDetail.article?.title || 'Untitled'}
Verdict: ${selectedDetail.prediction?.prediction}
Confidence: ${selectedDetail.prediction?.confidence}%
Credibility: ${selectedDetail.prediction?.credibility_score}/100
Risk Level: ${selectedDetail.prediction?.risk_level}
Model: ${selectedDetail.prediction?.model_name}

Summary:
${selectedDetail.summary}

Keywords:
${selectedDetail.keywords?.join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Report copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  // Filtered List
  const filteredHistory = historyList.filter((item) => {
    const matchesSearch = (item.article_title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerdict = verdictFilter === 'ALL' || item.prediction === verdictFilter;
    const matchesRisk = riskFilter === 'ALL' || item.risk_level === riskFilter;
    return matchesSearch && matchesVerdict && matchesRisk;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Assessment Archives
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Analysis History Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, and inspect previously evaluated news articles and linguistic verdicts.
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

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evaluation titles or keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Verdict Filter */}
          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Verdicts</option>
            <option value="REAL">Likely Real</option>
            <option value="FAKE">Potentially Fake</option>
            <option value="UNCERTAIN">Uncertain</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>
      </div>

      {/* Table / List View */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : filteredHistory.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-200">No assessments found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {historyList.length === 0
              ? 'You have not performed any evaluations yet. Submit an article to populate your archives.'
              : 'No articles matched your current filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Article Title / Claim</th>
                  <th className="py-3.5 px-4 font-semibold">Verdict</th>
                  <th className="py-3.5 px-4 font-semibold">Confidence</th>
                  <th className="py-3.5 px-4 font-semibold">Credibility</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Level</th>
                  <th className="py-3.5 px-4 font-semibold">Evaluated Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-200 max-w-sm truncate">
                      {item.article_title || 'Untitled Article'}
                    </td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4 font-semibold text-slate-300">
                      {item.confidence ? `${item.confidence.toFixed(1)}%` : '—'}
                    </td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleInspect(item.id)}
                          className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Assessment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900/95 border border-slate-700 max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Assessment Dossier #{selectedDetail.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Title */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Evaluated Headline</span>
              <h3 className="text-lg font-bold text-slate-100 leading-snug">
                {selectedDetail.article?.title || 'Untitled Article'}
              </h3>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Verdict</span>
                <span
                  className={`text-sm font-bold mt-1 block ${
                    selectedDetail.prediction?.prediction === 'FAKE'
                      ? 'text-rose-400'
                      : selectedDetail.prediction?.prediction === 'REAL'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {selectedDetail.prediction?.prediction === 'FAKE'
                    ? 'POTENTIALLY FAKE'
                    : selectedDetail.prediction?.prediction === 'REAL'
                    ? 'LIKELY REAL'
                    : 'UNCERTAIN'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Confidence</span>
                <span className="text-sm font-bold text-slate-100 mt-1 block">
                  {selectedDetail.prediction?.confidence ? `${selectedDetail.prediction.confidence.toFixed(1)}%` : '—'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Credibility</span>
                <span className="text-sm font-bold text-indigo-400 mt-1 block">
                  {selectedDetail.prediction?.credibility_score || 0}/100
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Risk Level</span>
                <span
                  className={`text-sm font-bold mt-1 block ${
                    selectedDetail.prediction?.risk_level === 'LOW'
                      ? 'text-emerald-400'
                      : selectedDetail.prediction?.risk_level === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedDetail.prediction?.risk_level}
                </span>
              </div>
            </div>

            {/* Extractive Summary */}
            {selectedDetail.summary && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500">Extractive Summary</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800">
                  "{selectedDetail.summary}"
                </p>
              </div>
            )}

            {/* Keywords */}
            {Array.isArray(selectedDetail.keywords) && selectedDetail.keywords.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">TF-IDF Linguistic Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetail.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full Content Preview */}
            {selectedDetail.article?.content && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500">Submitted Body Text</span>
                <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/30 p-3.5 rounded-2xl border border-slate-800/80 max-h-36 overflow-y-auto">
                  {selectedDetail.article.content}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">
                Model: {selectedDetail.prediction?.model_name || 'Random Forest'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDetail}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Dossier'}</span>
                </button>

                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">Delete Assessment Record?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete the evaluation record for "{deleteTarget.article_title || 'this article'}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
