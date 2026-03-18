'use client';
import Link from 'next/link';

export default function MovieCard({ movie }) {
  console.log("Movie Data:", movie); // Check if posterUrl is what we expect!
  
  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #333'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img 
        src={movie.posterUrl} 
        alt={movie.title} 
        style={{ width: '100%', height: '350px', objectFit: 'cover' }} 
      />
      <div style={{ padding: '1rem', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{movie.title}</h3>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>{movie.genre} • {movie.duration}m</p>
        <Link 
          href={`/movie/${movie.id}`}
          style={{
            display: 'block',
            backgroundColor: '#e50914',
            color: 'white',
            textAlign: 'center',
            padding: '0.6rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
