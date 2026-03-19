'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth(); // 👈 Use our new global hook

  return (
    <nav style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 6rem', 
      backgroundColor: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: 'white'
    }}>
      {/* LEFT: Branding */}
      <Link href="/" style={{ fontSize: '1.8rem', fontWeight: '950', color: '#e50914', textDecoration: 'none', textTransform: 'uppercase' }}>
        Cinefy
      </Link>

      {/* CENTER: Main Navigation */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2.5rem' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#fff', fontSize: '1rem', fontWeight: '500' }}>Home</Link>
        <Link href="/rates" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: '500' }}>Ticket Rates</Link>
        {isLoggedIn && (
          <Link href="/bookings" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: '500' }}>My Bookings</Link>
        )}
      </div>

      {/* RIGHT: Auth Logic */}
      <div>
        {!isLoggedIn ? (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/login" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Login</Link>
            <Link href="/register" style={{ 
              textDecoration: 'none', color: '#fff', backgroundColor: '#e50914',
              padding: '8px 24px', borderRadius: '50px', fontWeight: 'bold'
            }}>Join Now</Link>
          </div>
        ) : (
          <button 
            onClick={logout} 
            style={{ 
              background: 'rgba(229, 9, 20, 0.1)', border: '1px solid #e50914', 
              color: '#e50914', padding: '8px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
