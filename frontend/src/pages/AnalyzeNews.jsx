import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  FileText,
  Layers,
  Copy,
  Check,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  Cpu,
  Info,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { analyzeNews } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AnalyzeNews() {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showXai, setShowXai] = useState(true);

  // Preloaded Samples for 1-Click Evaluation
  const samples = {
    real: {
      title: 'NASA Successfully Launches New Earth Observation Satellite For Climate Monitoring',
      content:
        "NASA successfully launched a new Earth observation satellite from Cape Canaveral on Wednesday. The satellite, part of the agency's ongoing international efforts to monitor global climate change, will orbit the planet and collect high-resolution data on atmospheric conditions, sea level fluctuations, and vegetation density patterns. Scientists at NASA's Goddard Space Flight Center affirmed that the mission will provide open-access scientific data for meteorological agencies worldwide over the next decade.",
      url: 'https://nasa.gov/press-release/earth-observation',
    },
    fake: {
      title: 'Scientists Confirm Drinking Hot Water Immediately Makes Humans Immune To Every Disease',
      content:
        "In a shocking discovery, anonymous researchers have confirmed that drinking boiling hot water immediately makes every human being completely immune to every viral infection known to medicine. You won't believe what the pharmaceutical establishment has been hiding from the public for decades! This miracle cure was exposed by underground whistleblowers who claim major corporations suppressed this free natural remedy to protect profits. Must watch and share with everyone immediately!!",
      url: 'https://unverified-conspiracy-rumors.org/miracle-cure',
    },
  };

  const handleApplySample = (type) => {
    const s = samples[type];
    setTitle(s.title);
    setContent(s.content);
    setSourceUrl(s.url);
    setError('');
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
    setSourceUrl('');
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please provide the article content to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    // Dynamic Loading Sequence Simulation
    const steps = [
      'Normalizing text & stripping HTML...',
      'Lemmatizing tokens with NLTK WordNet...',
      'Computing 10,000 TF-IDF n-gram feature weights...',
      'Running 50 Random Forest decision trees...',
      'Evaluating credibility & generating summary...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      setLoadingStep(currentStep);
    }, 450);

    try {
      const data = await analyzeNews(title, content, sourceUrl);
      setResult(data);
      showToast('Analysis completed successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Analysis failed. Please check your connection.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `TruthLens AI Misinformation Assessment
Verdict: ${result.prediction === 'FAKE' ? 'POTENTIALLY FAKE' : result.prediction === 'REAL' ? 'LIKELY REAL' : 'UNCERTAIN'}
Confidence: ${result.confidence}% (${result.confidence_level})
Credibility: ${result.credibility_score}/100
Risk Level: ${result.risk_level}
Model: ${result.model_name}
Keywords: ${result.keywords?.join(', ')}

Summary:
${result.summary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Report summary copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              AI Analysis Workspace
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Evaluate News & Online Claims
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Submit an article to inspect TF-IDF linguistic indicators, credibility heuristics, and machine learning verdicts.
          </p>
        </div>

        {/* Quick Sample Action Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Quick Demo Samples:</span>
          <button
            type="button"
            onClick={() => handleApplySample('real')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
          >
            Load Real News
          </button>
          <button
            type="button"
            onClick={() => handleApplySample('fake')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all"
          >
            Load Fake News
          </button>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl space-y-5">
            {/* Headline Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Article Headline / Title (Recommended)</span>
                <span className="text-[11px] text-slate-500 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NASA Announces Breakthrough in Climate Monitoring..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-sm placeholder-slate-600 outline-none transition-all"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <label className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Full Article Content *</span>
                </label>
                <span className="text-[11px] text-slate-400 font-normal">
                  {wordCount} words | {charCount} chars
                </span>
              </div>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the full text of the news article, social media post, or claim here for analysis..."
                className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-sm placeholder-slate-600 outline-none transition-all resize-y leading-relaxed"
              />
            </div>

            {/* Source URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Source URL</span>
                <span className="text-[11px] text-slate-500 font-normal">Optional</span>
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/news-article"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 text-sm placeholder-slate-600 outline-none transition-all"
              />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Verification</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading || (!title && !content && !sourceUrl && !result)}
                className="px-4 py-3 rounded-xl glass-panel text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all disabled:opacity-40"
                title="Clear inputs"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Loading Step Progress */}
            {loading && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-3 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>
                  {
                    [
                      'Normalizing text & stripping HTML tags...',
                      'Lemmatizing morphological root tokens...',
                      'Mapping 10,000 TF-IDF n-gram feature dimensions...',
                      'Running 50 Random Forest decision trees...',
                      'Synthesizing credibility score & extractive summary...',
                    ][loadingStep]
                  }
                </span>
              </div>
            )}
          </form>

          {/* Model Note */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">How inference is computed:</span>
              <p className="text-[11px] leading-relaxed">
                The input text is cleaned and vectorized against 10,000 TF-IDF features. The Random Forest classifier assesses the feature matrix, and the credibility heuristics engine evaluates title sensationalism, clickbait markers, and article depth.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Analysis Result */}
        <div className="lg:col-span-6 space-y-6">
          {!result && !loading ? (
            /* Idle Placeholder State */
            <div className="glass-panel p-10 rounded-3xl text-center space-y-4 border border-dashed border-slate-800 min-h-[420px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/5">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-200">Ready For Content Evaluation</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Enter an article on the left and click "Run AI Verification" to inspect predictions, confidence gauges, credibility metrics, and extracted keywords.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>TF-IDF + Random Forest Pipeline Active</span>
              </div>
            </div>
          ) : result ? (
            /* Loaded Results Card */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Primary Verdict Hero Card */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border shadow-2xl relative overflow-hidden ${
                  result.prediction === 'FAKE'
                    ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/40 shadow-rose-950/30'
                    : result.prediction === 'REAL'
                    ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40 shadow-emerald-950/30'
                    : 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/40 shadow-amber-950/30'
                }`}
              >
                {/* Header with Badges */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {result.prediction === 'FAKE' ? (
                      <ShieldAlert className="w-5 h-5 text-rose-400" />
                    ) : result.prediction === 'REAL' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Analysis Assessment
                    </span>
                  </div>

                  <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300">
                    {result.model_name || 'TF-IDF + Random Forest'}
                  </span>
                </div>

                {/* Verdict Title & Big Score */}
                <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Algorithmic Verdict
                    </span>
                    <h3
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                        result.prediction === 'FAKE'
                          ? 'text-rose-400'
                          : result.prediction === 'REAL'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {result.prediction === 'FAKE'
                        ? 'POTENTIALLY FAKE'
                        : result.prediction === 'REAL'
                        ? 'LIKELY REAL'
                        : 'UNCERTAIN'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      {result.prediction === 'FAKE'
                        ? 'Features exhibit strong stylistic markers typical of unverified or sensationalized reporting.'
                        : result.prediction === 'REAL'
                        ? 'Features match the linguistic and syntactic patterns of verified journalistic reporting.'
                        : 'Borderline signal distribution; manual verification recommended.'}
                    </p>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="flex flex-col items-center sm:items-end justify-center shrink-0">
                    <div className="text-center sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                        Model Confidence
                      </span>
                      <div className="text-3xl font-extrabold text-slate-100">
                        {result.confidence ? `${result.confidence.toFixed(1)}%` : '—'}
                      </div>
                      <span className="text-[11px] font-semibold text-cyan-400 uppercase">
                        {result.confidence_level} Confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* KPI Sub-Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
                  {/* Credibility Meter */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block mb-1 font-medium">Credibility Score</span>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-2xl font-bold ${
                          (result.credibility_score || 0) >= 70
                            ? 'text-emerald-400'
                            : (result.credibility_score || 0) >= 40
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {result.credibility_score || 0}
                      </span>
                      <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (result.credibility_score || 0) >= 70
                            ? 'bg-emerald-500'
                            : (result.credibility_score || 0) >= 40
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${result.credibility_score || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Misinformation Risk */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block mb-1 font-medium">Misinformation Risk</span>
                    <div
                      className={`text-2xl font-bold ${
                        result.risk_level === 'LOW'
                          ? 'text-emerald-400'
                          : result.risk_level === 'MEDIUM'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {result.risk_level || 'MEDIUM'}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {result.risk_level === 'LOW'
                        ? 'Low deceptive potential'
                        : result.risk_level === 'MEDIUM'
                        ? 'Moderate caution advised'
                        : 'High probability of misinformation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted Keywords Pills */}
              {Array.isArray(result.keywords) && result.keywords.length > 0 && (
                <div className="glass-panel p-5 rounded-3xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Influential Linguistic Tokens (TF-IDF Feature Weights)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold shadow-sm hover:bg-cyan-500/20 transition-colors cursor-default"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Extractive AI Summary */}
              {result.summary && (
                <div className="glass-panel p-5 rounded-3xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span>Extractive AI Summary</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">Sentence-Ranked</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
                    "{result.summary}"
                  </p>
                </div>
              )}

              {/* Explainable AI (XAI) Reasoning Section */}
              <div className="glass-panel p-5 rounded-3xl space-y-3">
                <button
                  type="button"
                  onClick={() => setShowXai(!showXai)}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    <span>Model Reasoning & Explainability</span>
                  </span>
                  {showXai ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showXai && (
                  <div className="pt-2 text-xs text-slate-400 space-y-2 leading-relaxed border-t border-slate-800/80">
                    <p className="whitespace-pre-line bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/60">
                      {result.explanation ||
                        'The decision tree ensemble evaluated semantic frequency patterns in the tokenized text against statistical thresholds established on 44,898 benchmark articles.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-semibold transition-all hover:border-slate-700"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Analysis Dossier'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-3 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-semibold transition-all"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {/* Responsible AI Standard */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 leading-relaxed">
                <span className="font-semibold text-slate-400">Standard AI Assessment Notice:</span> This assessment is generated via statistical pattern evaluation (Random Forest + TF-IDF) and should not be considered definitive factual verification. Always consult accredited journalistic outlets and primary records.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
