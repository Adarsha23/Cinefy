'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth(); 

  const navItemStyle = { textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', fontWeight: '500' };
  const adminItemStyle = { textDecoration: 'none', color: '#e50914', fontSize: '0.95rem', fontWeight: 'bold' };

  return (
    <nav style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 6rem', 
      backgroundColor: 'rgba(5, 5, 5, 0.9)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: 'white'
    }}>
      <Link href="/" style={{ fontSize: '1.8rem', fontWeight: '950', color: '#e50914', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '2px' }}>
        Cinefy
      </Link>

      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2.5rem' }}>
        <Link href="/" style={{ ...navItemStyle, color: '#fff' }}>Home</Link>
        <Link href="/rates" style={navItemStyle}>Ticket Rates</Link>
        
        {isLoggedIn && user?.role === 'CUSTOMER' && (
          <Link href="/bookings" style={navItemStyle}>My Bookings</Link>
        )}

        {isLoggedIn && user?.role === 'ADMIN' && (
          <Link href="/admin" style={adminItemStyle}>Admin Dashboard</Link>
        )}
      </div>

      <div>
        {!isLoggedIn ? (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/login" style={navItemStyle}>Login</Link>
            <Link href="/register" style={{ 
              textDecoration: 'none', color: '#fff', backgroundColor: '#e50914',
              padding: '10px 28px', borderRadius: '4px', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.85rem'
            }}>Join Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: '#555', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{user?.name}</span>
            <button 
              onClick={logout} 
              style={{ 
                background: 'transparent', border: '1px solid #333', 
                color: '#888', padding: '8px 20px', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem'
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
