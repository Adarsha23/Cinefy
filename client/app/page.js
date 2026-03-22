'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import MovieCard from './components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        setMovies(response.data);
      } catch (error) {
        console.error("Data Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', textTransform: 'uppercase', letterSpacing: '4px', fontSize: '1rem' }}>Updating Movie Catalog...</div>;

  return (
    <div style={{ padding: '6rem 4rem', backgroundColor: '#050505', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '3.5rem', fontSize: '3rem', fontWeight: '950', textAlign: 'left', letterSpacing: '-1px' }}>Trending Movies</h1>
      
      {movies.length === 0 ? (
        <div style={{ padding: '6rem 4rem', textAlign: 'center', backgroundColor: '#0d0d0d', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
          <p style={{ color: '#444', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Catalog empty. Please contact administration.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '3rem'
        }}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
