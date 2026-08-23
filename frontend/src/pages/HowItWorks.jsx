import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Brain,
  Layers,
  Gauge,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  Cpu,
  AlertTriangle,
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Technical Methodology & Science
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          How TruthLens AI Evaluates Digital Content
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          A deep dive into the natural language processing, vector space modeling, decision tree ensembles, and heuristic credibility indicators powering our platform.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1 */}
        <div className="glass-panel p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">1. Text Normalization & Morphological Reduction</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Raw article text is stripped of HTML, URLs, and formatting. We apply NLTK's English stopword filters to remove conversational filler words, followed by WordNet Lemmatization to convert grammatical variations into base lemmas (e.g., "running", "ran" → "run").
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">2. TF-IDF Statistical Vectorization (10K Features)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Words and bigrams (e.g., "artificial intelligence", "breaking news") are converted into numerical weight vectors. Term Frequency (TF) measures frequency within the article, while Inverse Document Frequency (IDF) penalizes common universal terms, emphasizing distinctive linguistic indicators.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">3. Random Forest Decision Tree Ensemble</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            An ensemble of 50 randomized decision trees independently evaluates the TF-IDF feature vector. The proportion of trees voting for FAKE vs. REAL directly generates the mathematical confidence probability (e.g., 96% confidence = 48 of 50 trees voted FAKE).
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="glass-panel p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Gauge className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100">4. Heuristic Credibility & Misinformation Risk</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The platform synthesizes the ML confidence with structural heuristics: title capitalization ratios, excessive exclamation marks (!!), sensational clickbait triggers, and article depth to deliver an explainable 0–100 credibility rating and risk label.
          </p>
        </div>
      </div>

      {/* Detailed Methodology Section */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>Understanding Prediction Output Labels</span>
        </h3>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400">LIKELY REAL (Class 0):</span>
            <p className="text-slate-400 leading-relaxed">
              The article contains syntactic structures, vocabulary distributions, and tone characteristic of professional journalism (Reuters, accredited press).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-rose-400">POTENTIALLY FAKE (Class 1):</span>
            <p className="text-slate-400 leading-relaxed">
              The article exhibits linguistic markers, emotional triggers, unverified claims, or sensational framing matching patterns in the Kaggle/ISOT misinformation corpus.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">UNCERTAIN:</span>
            <p className="text-slate-400 leading-relaxed">
              Model decision tree voting is split (confidence below 60%) or the text is too short/ambiguous to provide a statistically sound verdict.
            </p>
          </div>
        </div>
      </div>

      {/* Responsible AI Standard Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-200 block">Responsible AI Policy:</span>
          TruthLens AI is designed to assist humans in critically evaluating digital information. It does not replace independent fact-checking or journalistic investigation.
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Try An Analysis In The Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
