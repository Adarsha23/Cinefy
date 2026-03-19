// client/app/login/page.js
'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // 👈 Use our hook
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // 👈 Pull login function
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Use the global login function (this updates navigation instantly!)
      login(response.data.token); 
      
      router.push('/');
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500") center/cover',
      paddingTop: '80px'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '3.5rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ marginBottom: '2.5rem', fontSize: '2.5rem', textAlign: 'center', fontWeight: '900' }}>Sign In</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="email" 
              placeholder="Email or phone number" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '1rem', borderRadius: '6px',
                border: 'none', backgroundColor: '#333', color: 'white', fontSize: '1rem',
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
                width: '100%', padding: '1rem', borderRadius: '6px',
                border: 'none', backgroundColor: '#333', color: 'white', fontSize: '1rem',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <button style={{
            width: '100%', padding: '1.2rem', borderRadius: '6px', border: 'none',
            backgroundColor: '#e50914', color: 'white', fontWeight: '900', fontSize: '1.1rem',
            cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(229,9,20,0.3)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f40612'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e50914'}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#737373', fontSize: '1rem' }}>
            New to Cinefy? <Link href="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Sign up now.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
