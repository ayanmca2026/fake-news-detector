import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Sparkles,
  ArrowRight,
  Brain,
  Gauge,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Search,
  Lock,
  ChevronRight,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Interactive Hero Preview State
  const [activeDemo, setActiveDemo] = useState('fake');

  const demoData = {
    fake: {
      title: 'Secret Miracle Compound Cures All Known Viral Diseases Overnight',
      verdict: 'POTENTIALLY FAKE',
      confidence: 97.8,
      credibility: 24,
      risk: 'HIGH',
      model: 'TF-IDF + Random Forest',
      signals: ['Clickbait headline syntax', 'Excessive sensationalism', 'Missing scientific citations'],
      keywords: ['miracle', 'secret', 'cure', 'overnight', 'viral'],
    },
    real: {
      title: 'Global Climate Summit Concludes With Historic Clean Energy Accord',
      verdict: 'LIKELY REAL',
      confidence: 94.2,
      credibility: 92,
      risk: 'LOW',
      model: 'TF-IDF + Random Forest',
      signals: ['Neutral journalistic tone', 'Attributed institutional quotes', 'Standard syntactic structure'],
      keywords: ['climate', 'summit', 'accord', 'energy', 'nations'],
    },
  };

  const current = demoData[activeDemo];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-cyan-500/30">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-wide bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                TruthLens AI
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Misinformation Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              Platform Features
            </a>
            <a href="#pipeline" className="hover:text-cyan-400 transition-colors">
              AI Pipeline
            </a>
            <a href="#ethics" className="hover:text-cyan-400 transition-colors">
              Responsible AI
            </a>
            <a
              href="https://github.com/ayanmca2026/fake-news-detector"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background glow flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Machine Learning Misinformation Defense</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Detect Misinformation{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                With Machine Intelligence.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Analyze news articles and online claims using ensemble machine learning, TF-IDF linguistic feature weights, multi-layer heuristic credibility signals, and explainable AI scoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to={isAuthenticated ? '/analyze' : '/register'}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze News Article</span>
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-slate-700 font-semibold text-sm transition-all"
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Explore Intelligence Dashboard</span>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-slate-800/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400">99.5%</div>
                <div className="text-xs text-slate-400 font-medium">Model Accuracy</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-blue-400">44.8K+</div>
                <div className="text-xs text-slate-400 font-medium">Trained Articles</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">Sub-sec</div>
                <div className="text-xs text-slate-400 font-medium">Inference Speed</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Simulation Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl relative">
              {/* Header Selector */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Live Model Simulation
                  </span>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveDemo('fake')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeDemo === 'fake'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sample Fake
                  </button>
                  <button
                    onClick={() => setActiveDemo('real')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      activeDemo === 'real'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sample Real
                  </button>
                </div>
              </div>

              {/* Sample Headline */}
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">
                  Evaluated Headline
                </span>
                <p className="text-sm font-medium text-slate-200 italic leading-snug">"{current.title}"</p>
              </div>

              {/* Verdict Banner */}
              <div className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Model Verdict
                  </span>
                  <div
                    className={`text-lg font-extrabold tracking-wide ${
                      current.verdict === 'LIKELY REAL' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {current.verdict}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Confidence
                  </span>
                  <span className="text-base font-bold text-slate-100">{current.confidence}%</span>
                </div>
              </div>

              {/* Score Meters Grid */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <span className="text-xs text-slate-400 block mb-1">Credibility Score</span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-xl font-bold ${
                        current.credibility >= 70 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {current.credibility}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        current.credibility >= 70 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${current.credibility}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <span className="text-xs text-slate-400 block mb-1">Misinformation Risk</span>
                  <div
                    className={`text-xl font-bold ${
                      current.risk === 'LOW' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {current.risk}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    {current.risk === 'LOW' ? 'Safe to consume' : 'High deception risk'}
                  </span>
                </div>
              </div>

              {/* Key Features / Pills */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-2">
                  Extracted Linguistic Tokens (TF-IDF)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {current.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attribution */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span>Architecture: {current.model}</span>
                <span className="text-cyan-400/80">Status: Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            Enterprise Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            Multi-Layered Misinformation Analysis Engine
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            TruthLens AI combines statistical machine learning algorithms with rule-based heuristics to provide comprehensive content verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Random Forest Classifier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensemble of 50 decision trees trained on 44,898 verified real and fake articles, yielding a 99.5% F1-Score on test benchmarks.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">TF-IDF N-Gram Vectorizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts 10,000 unigram and bigram statistical language weights, mapping semantic phrase patterns and deceptive phrasing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Gauge className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Credibility & Risk Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Heuristic evaluation of title capitalization ratios, clickbait trigger phrases, sensational punctuation, and structural length.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Extractive AI Summarizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated sentence-ranking algorithm produces concise summaries of lengthy claims to save time while highlighting critical assertions.
            </p>
          </div>
        </div>
      </section>

      {/* AI Pipeline Step-by-Step */}
      <section id="pipeline" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            Transparent NLP Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
            How An Article Travels Through TruthLens AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3 relative">
            <div className="text-xs font-bold text-cyan-400">STEP 01</div>
            <h3 className="text-base font-bold text-slate-100">Text Normalization & NLP</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strips formatting, lowercases tokens, removes conversational stopwords, and lemmatizes words to base forms using NLTK WordNet.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 relative">
            <div className="text-xs font-bold text-blue-400">STEP 02</div>
            <h3 className="text-base font-bold text-slate-100">Vectorization & Tree Voting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maps tokens to 10,000 TF-IDF numerical dimensions. 50 decision trees vote independently to compute probability distributions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 relative">
            <div className="text-xs font-bold text-emerald-400">STEP 03</div>
            <h3 className="text-base font-bold text-slate-100">Synthesis & Explainability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combines ML confidence with heuristic indicators, generates extractive summary, and delivers an explainable risk dossier.
            </p>
          </div>
        </div>
      </section>

      {/* Responsible AI Disclaimer Banner */}
      <section id="ethics" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-100">Responsible AI & Verification Standard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              TruthLens AI provides statistical machine learning estimates and heuristic risk scores. AI predictions should never be treated as absolute or definitive factual proof. Always cross-examine claims with primary sources and accredited journalistic outlets.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-200">TruthLens AI</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <Link to="/analyze" className="hover:text-cyan-400 transition-colors">
              Analyze Article
            </Link>
            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
              Overview
            </Link>
            <Link to="/model" className="hover:text-cyan-400 transition-colors">
              Model Intelligence
            </Link>
            <a
              href="https://github.com/ayanmca2026/fake-news-detector"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              GitHub Source Code
            </a>
          </div>

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} TruthLens AI. Built for Misinformation Analysis.
          </div>
        </div>
      </footer>
    </div>
  );
}
