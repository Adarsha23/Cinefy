'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import MovieCard from './components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Movies...</div>;

  return (
    <div style={{ padding: '3rem 2rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Now Showing</h1>
      
      {movies.length === 0 ? (
        <p>No movies available at the moment. Check back later!</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2.5rem'
        }}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
