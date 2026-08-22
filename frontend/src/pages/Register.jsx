import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" required
            className="w-full border rounded-md p-2" 
            value={name} onChange={e => setName(e.target.value)} 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" required
            className="w-full border rounded-md p-2" 
            value={email} onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" required
            className="w-full border rounded-md p-2" 
            value={password} onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
}
