import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnalyzeNews from './pages/AnalyzeNews';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">AI News Detector</Link>
            <nav className="space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                  <Link to="/analyze" className="text-gray-600 hover:text-gray-900">Analyze</Link>
                  <button 
                    onClick={() => { localStorage.removeItem('token'); window.location.href='/'; }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-grow p-4 md:p-8 bg-gray-50">
          <Routes>
            <Route path="/" element={
              <div className="text-center py-20">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Detect Misinformation.</h1>
                <p className="text-xl text-gray-600 mb-8">An AI-powered fake news analysis platform designed to help students evaluate online information.</p>
                <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700">Get Started</Link>
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/analyze" element={isAuthenticated ? <AnalyzeNews /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
