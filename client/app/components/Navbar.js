'use client';

import Link from 'next/link';

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '1rem 2rem', 
      background: '#111', 
      color: 'white' 
    }}>
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Cinefy</Link>
      <div>
        <Link href="/login" style={{ marginLeft: '1rem' }}>Login</Link>
        <Link href="/register" style={{ marginLeft: '1rem' }}>Register</Link>
        <button onClick={handleLogout} style={{ 
          marginLeft: '1rem', 
          background: 'none', 
          border: 'none', 
          color: 'red', 
          cursor: 'pointer' 
        }}>Logout</button>
      </div>
    </nav>
  );
}
