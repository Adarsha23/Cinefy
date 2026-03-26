'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

// Define strict registration schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // 1. Client-side Zod validation
      registerSchema.parse(form);

      // 2. API Request
      await api.post('/auth/register', form);
      alert("Registration successful");
      router.push('/login');
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Capture specific zod errors
        const formattedErrors = {};
        err.errors.forEach(error => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      } else {
        alert(err.response?.data?.message || "Registration failed");
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
        <h1 style={{ marginBottom: '2rem', fontSize: '2.2rem', textAlign: 'center', fontWeight: 'bold' }}>Create Account</h1>
        
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '1.2rem' }}>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              style={{
                width: '100%', padding: '1rem', borderRadius: '4px',
                border: errors.name ? '1px solid #e50914' : '1px solid #222', 
                backgroundColor: '#151515', color: 'white', fontSize: '1rem', outline: 'none'
              }}
            />
            {errors.name && <p style={{ color: '#e50914', fontSize: '0.75rem', marginTop: '5px' }}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <input 
              type="text" 
              placeholder="Email Address" 
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              style={{
                width: '100%', padding: '1rem', borderRadius: '4px',
                border: errors.email ? '1px solid #e50914' : '1px solid #222', 
                backgroundColor: '#151515', color: 'white', fontSize: '1rem', outline: 'none'
              }}
            />
            {errors.email && <p style={{ color: '#e50914', fontSize: '0.75rem', marginTop: '5px' }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <input 
              type="password" 
              placeholder="Password" 
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              style={{
                width: '100%', padding: '1rem', borderRadius: '4px',
                border: errors.password ? '1px solid #e50914' : '1px solid #222', 
                backgroundColor: '#151515', color: 'white', fontSize: '1rem', outline: 'none'
              }}
            />
            {errors.password && <p style={{ color: '#e50914', fontSize: '0.75rem', marginTop: '5px' }}>{errors.password}</p>}
          </div>
          <button style={{
            width: '100%', padding: '1rem', borderRadius: '4px', border: 'none',
            backgroundColor: '#e50914', color: 'white', fontWeight: 'bold', fontSize: '1rem',
            cursor: 'pointer', transition: '0.2s', textTransform: 'uppercase', letterSpacing: '1px'
          }}>
            Register
          </button>
        </form>

        <p style={{ marginTop: '2.5rem', color: '#666', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link href="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Sign in.</Link>
        </p>
      </div>
    </div>
  );
}
