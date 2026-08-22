import React, { useEffect, useState } from 'react';
import { getDashboardStats, getHistory } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getHistory()])
      .then(([statsData, historyData]) => {
        setStats(statsData);
        setHistory(historyData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Total Analyses</div>
          <div className="text-3xl font-bold mt-1">{stats?.total_analyses || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Fake Predictions</div>
          <div className="text-3xl font-bold mt-1 text-red-600">{stats?.fake_predictions || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Real Predictions</div>
          <div className="text-3xl font-bold mt-1 text-green-600">{stats?.real_predictions || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Uncertain</div>
          <div className="text-3xl font-bold mt-1 text-yellow-600">{stats?.uncertain_predictions || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Average Confidence</div>
          <div className="text-3xl font-bold mt-1">{stats?.average_confidence || 0}%</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Average Credibility</div>
          <div className="text-3xl font-bold mt-1">{stats?.average_credibility || 0}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-bold mb-4">Recent History</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">Article</th>
              <th className="py-2">Prediction</th>
              <th className="py-2">Confidence</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 10).map(h => (
              <tr key={h.id} className="border-b">
                <td className="py-3">{h.article_title}</td>
                <td className="py-3 font-semibold">{h.prediction}</td>
                <td className="py-3">{h.confidence.toFixed(1)}%</td>
                <td className="py-3 text-sm text-gray-500">{new Date(h.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr><td colSpan="4" className="py-4 text-center text-gray-500">No history yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
