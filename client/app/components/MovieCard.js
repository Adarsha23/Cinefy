'use client';
import Link from 'next/link';

export default function MovieCard({ movie }) {
  return (
    <div 
      style={{
        background: '#0d0d0d',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: '0.2s',
        cursor: 'pointer',
        border: '1px solid #1a1a1a',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#333';
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1a1a1a';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ position: 'relative' }}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }} 
        />
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#e50914',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: '900',
          padding: '4px 12px',
          borderRadius: '2px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {movie.genre?.split('/')[0]}
        </span>
      </div>

      <div style={{ padding: '1.2rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>
          {movie.title}
        </h3>

        <div style={{ display: 'flex', gap: '15px', color: '#555', fontSize: '0.8rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
          <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
          <span>{movie.genre}</span>
        </div>

        <Link 
          href={`/movie/${movie.id}`}
          style={{
            display: 'block',
            backgroundColor: '#151515',
            color: '#fff',
            textAlign: 'center',
            padding: '0.8rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            border: '1px solid #222'
          }}
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
