// client/app/register/page.js
'use client'; // This tells Next.js this is an interactive component
import { useState } from 'react';
import api from '../../lib/axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration Successful! Please login.');
      router.push('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input 
          type="text" placeholder="Name" className="p-3 rounded bg-gray-800 border border-gray-700"
          onChange={(e) => setFormData({...formData, name: e.target.value})} required
        />
        <input 
          type="email" placeholder="Email" className="p-3 rounded bg-gray-800 border border-gray-700"
          onChange={(e) => setFormData({...formData, email: e.target.value})} required
        />
        <input 
          type="password" placeholder="Password" className="p-3 rounded bg-gray-800 border border-gray-700"
          onChange={(e) => setFormData({...formData, password: e.target.value})} required
        />
        <button type="submit" className="bg-blue-600 p-3 rounded font-bold hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
}
