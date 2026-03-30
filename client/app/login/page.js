'use client';
import { useState, Suspense } from 'react';
import api from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get('callback');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      // 1. Zod Validation
      loginSchema.parse({ email, password });

      // 2. API Call
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user); 
      
      // Navigate to callback or default to home
      router.push(callback || '/');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = {};
        err.errors.forEach(error => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      } else {
        alert(err.response?.data?.message || "Authentication failed");
      }
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
              type="text" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '1rem', borderRadius: '4px',
                border: errors.email ? '1px solid #e50914' : '1px solid #222', 
                backgroundColor: '#151515', color: 'white', fontSize: '1rem',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
            {errors.email && <p style={{ color: '#e50914', fontSize: '0.75rem', marginTop: '5px' }}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: '2.5rem' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '1rem', borderRadius: '4px',
                border: errors.password ? '1px solid #e50914' : '1px solid #222', 
                backgroundColor: '#151515', color: 'white', fontSize: '1rem',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
            {errors.password && <p style={{ color: '#e50914', fontSize: '0.75rem', marginTop: '5px' }}>{errors.password}</p>}
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

export default function Login() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
