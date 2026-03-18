'use client';
import Link from 'next/link';

export default function MovieCard({ movie }) {
  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #2a2a2a',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.04)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(229,9,20,0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Poster */}
      <div style={{ position: 'relative' }}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} 
        />
        {/* Genre Badge on top of poster */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(229, 9, 20, 0.9)',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          padding: '4px 10px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {movie.genre.split('/')[0]}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {movie.title}
        </h3>

        {/* Runtime & Genre Row */}
        <div style={{ display: 'flex', gap: '12px', color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <span>🕐 {Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
          <span> {movie.genre}</span>
        </div>

        {/* Mock Showtimes */}
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Today's Showtimes</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['02:30 PM', '05:30 PM', '09:00 PM'].map(time => (
              <span key={time} style={{
                padding: '4px 10px',
                border: '1px solid #e50914',
                borderRadius: '5px',
                fontSize: '0.8rem',
                color: '#e50914',
                fontWeight: 'bold'
              }}>
                {time}
              </span>
            ))}
          </div>
        </div>

        <Link 
          href={`/movie/${movie.id}`}
          style={{
            display: 'block',
            backgroundColor: '#e50914',
            color: 'white',
            textAlign: 'center',
            padding: '0.65rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}
        >
          Book Tickets →
        </Link>
      </div>
    </div>
  );
}
