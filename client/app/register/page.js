// client/app/register/page.js
'use client'; // This tells Next.js this is an interactive component
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert("Registration successful! 🍿");
      router.push('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{
      height: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500") center/cover'
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
        <h1 style={{ marginBottom: '2rem', fontSize: '2.2rem', textAlign: 'center' }}>Join Cinefy</h1>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            style={{
              width: '100%', padding: '1rem', marginBottom: '1.2rem', borderRadius: '6px',
              border: 'none', backgroundColor: '#333', color: 'white', fontSize: '1rem'
            }}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            style={{
              width: '100%', padding: '1rem', marginBottom: '1.2rem', borderRadius: '6px',
              border: 'none', backgroundColor: '#333', color: 'white', fontSize: '1rem'
            }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            style={{
              width: '100%', padding: '1rem', marginBottom: '1.8rem', borderRadius: '6px',
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
            Create Account
          </button>
        </form>

        <p style={{ marginTop: '2rem', color: '#888', textAlign: 'center' }}>
          Already have an account? <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>Sign in now.</Link>
        </p>
      </div>
    </div>
  );
}
