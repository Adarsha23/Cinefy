'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import MovieCard from './components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/movies?page=${page}&limit=8`);
      setMovies(response.data.movies || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Data Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}>
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button 
                onClick={() => fetchMovies(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{
                  padding: '10px 20px', backgroundColor: '#111', color: pagination.page === 1 ? '#333' : '#fff', 
                  border: '1px solid #222', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                }}
              >
                Previous
              </button>
              <div style={{ display: 'flex', alignItems: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>
                PAGE {pagination.page} OF {pagination.pages}
              </div>
              <button 
                onClick={() => fetchMovies(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                style={{
                  padding: '10px 20px', backgroundColor: '#111', color: pagination.page === pagination.pages ? '#333' : '#fff', 
                  border: '1px solid #222', cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
