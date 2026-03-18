// client/app/login/page.js
'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      alert("Welcome back!");
      router.push('/');
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{
      height: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500") center/cover'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '3rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #333'
      }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2.2rem', textAlign: 'center' }}>Sign In</h1>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px',
              border: 'none', backgroundColor: '#333', color: 'white', fontSize: '1rem'
            }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '1rem', marginBottom: '2rem', borderRadius: '6px',
              border: 'none', backgroundColor: '#333', color: 'white', fontSize: '1rem'
            }}
          />
          <button style={{
            width: '100%', padding: '1rem', borderRadius: '6px', border: 'none',
            backgroundColor: '#e50914', color: 'white', fontWeight: 'bold', fontSize: '1.1rem',
            cursor: 'pointer', transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f40612'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e50914'}
          >
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '2rem', color: '#888', textAlign: 'center' }}>
          New to Cinefy? <Link href="/register" style={{ color: 'white', textDecoration: 'none' }}>Sign up now.</Link>
        </p>
      </div>
    </div>
  );
}

