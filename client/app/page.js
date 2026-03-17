
'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Cinefy 🎬</h1>
      <p>Your premier destination for online movie ticket booking.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/register" style={{ marginRight: '1rem', color: '#0070f3' }}>Register</Link>
        <Link href="/login" style={{ color: '#0070f3' }}>Login</Link>
      </div>
    </div>
  );
}
