'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get('callback');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user); 
      
      // Navigate to callback or default to home
      router.push(callback || '/');
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050505',
      paddingTop: '80px'
    }}>
      <div style={{
        backgroundColor: '#0d0d0d',
        padding: '3.5rem',
        borderRadius: '4px',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid #1a1a1a'
      }}>
        <h1 style={{ marginBottom: '2.5rem', fontSize: '2.2rem', textAlign: 'center', fontWeight: 'bold' }}>Sign In</h1>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.2rem' }}>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '1rem', borderRadius: '4px',
                border: '1px solid #222', backgroundColor: '#151515', color: 'white', fontSize: '1rem',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '2.5rem' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '1rem', borderRadius: '4px',
                border: '1px solid #222', backgroundColor: '#151515', color: 'white', fontSize: '1rem',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <button style={{
            width: '100%', padding: '1rem', borderRadius: '4px', border: 'none',
            backgroundColor: '#e50914', color: 'white', fontWeight: 'bold', fontSize: '1rem',
            cursor: 'pointer', transition: '0.2s', textTransform: 'uppercase', letterSpacing: '1px'
          }}>
            Login
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            New to Cinefy? <Link href="/register" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Create an account.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
