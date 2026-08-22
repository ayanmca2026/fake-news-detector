import React, { useState } from 'react';
import { analyzeNews } from '../services/api';

export default function AnalyzeNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeNews(title, content, url);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-bold mb-4">Analyze News Article</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input type="text" className="w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. BREAKING: Shocking news!" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Article Content *</label>
            <textarea required className="w-full border rounded p-2 h-40" value={content} onChange={e=>setContent(e.target.value)} placeholder="Paste the full article text here..."></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Source URL (Optional)</label>
            <input type="url" className="w-full border rounded p-2" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Analyzing...' : 'Analyze News'}
          </button>
        </form>
        {error && <div className="mt-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>}
      </div>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">PREDICTION</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">Result</div>
              <div className={`text-2xl font-bold ${result.prediction === 'FAKE' ? 'text-red-600' : result.prediction === 'REAL' ? 'text-green-600' : 'text-yellow-600'}`}>
                {result.prediction === 'FAKE' ? 'POTENTIALLY FAKE' : result.prediction}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">Confidence</div>
              <div className="text-2xl font-bold">{result.confidence.toFixed(1)}% ({result.confidence_level})</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">Credibility</div>
              <div className="text-2xl font-bold">{result.credibility_score} / 100</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">Risk</div>
              <div className="text-2xl font-bold">{result.risk_level}</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold text-gray-700">AI Summary</h4>
            <p className="text-gray-600 mt-1">{result.summary}</p>
          </div>
          <div className="mb-4">
            <h4 className="font-bold text-gray-700">Keywords</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.keywords.map(kw => <span key={kw} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{kw}</span>)}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-700">Explanation</h4>
            <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{result.explanation}</p>
          </div>
          <p className="text-xs text-gray-400 mt-6 pt-4 border-t">
            This tool provides an AI-based assessment of news content. AI predictions may be incorrect and should not be treated as absolute proof that information is true or false.
          </p>
        </div>
      )}
    </div>
  );
}
