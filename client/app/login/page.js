// client/app/login/page.js
'use client';
import { useState } from 'react';
import api from '../../lib/axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      
      // SAVE THE TOKEN
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert('Logged in successfully!');
      router.push('/'); // Go to home page
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Login to Cinefy</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input 
          type="email" placeholder="Email" className="p-3 rounded bg-gray-800 border border-gray-700"
          onChange={(e) => setFormData({...formData, email: e.target.value})} required
        />
        <input 
          type="password" placeholder="Password" className="p-3 rounded bg-gray-800 border border-gray-700"
          onChange={(e) => setFormData({...formData, password: e.target.value})} required
        />
        <button type="submit" className="bg-green-600 p-3 rounded font-bold hover:bg-green-700">Login</button>
      </form>
    </div>
  );
}
