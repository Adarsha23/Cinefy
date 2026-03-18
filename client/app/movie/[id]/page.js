'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]); // Real shows state
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('MAR 20'); // Matching our seed date
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Fetch movie info AND shows at the same time
        const [movieRes, showsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/movies/${id}/shows`)
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;
  if (!movie) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Movie Not Found</div>;

  // Group shows by theater name so we can list them nicely
  const theaters = shows.reduce((acc, show) => {
    if (!acc[show.theater.name]) acc[show.theater.name] = [];
    acc[show.theater.name].push(show);
    return acc;
  }, {});

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      
      {/* Hero Banner (Same as before) */}
      <div style={{
        height: '600px', width: '100%',
        background: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 60%), 
                     linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 30%), 
                     url(${movie.backdropUrl || movie.posterUrl}) center/cover no-repeat`,
        display: 'flex', alignItems: 'center', padding: '0 4rem'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1rem' }}>{movie.title}</h1>
          <p style={{ color: '#bbb', fontSize: '1.1rem', lineHeight: '1.7' }}>{movie.description}</p>
        </div>
      </div>

      {/* Real Shows Section */}
      <div style={{ padding: '3rem 4rem', maxWidth: '1200px' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: '#e50914' }}>Available Showtimes</h2>
        
        {Object.keys(theaters).length === 0 ? (
          <p style={{ color: '#666' }}>No shows scheduled for this movie yet.</p>
        ) : (
          Object.entries(theaters).map(([theaterName, theaterShows]) => (
            <div key={theaterName} style={{ 
              backgroundColor: '#111', borderRadius: '12px', padding: '2rem', 
              border: '1px solid #222', marginBottom: '2rem' 
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}> {theaterName}</h3>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {theaterShows.map(show => (
                  <button 
                    key={show.id}
                    onClick={() => setSelectedShow(show)}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: selectedShow?.id === show.id ? '2px solid #e50914' : '1px solid #444',
                      backgroundColor: selectedShow?.id === show.id ? 'rgba(229,9,20,0.2)' : 'transparent',
                      color: selectedShow?.id === show.id ? '#e50914' : '#fff',
                      fontWeight: 'bold', cursor: 'pointer', transition: '0.2s'
                    }}
                  >
                    {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}

        {selectedShow && (
          <div style={{ 
            marginTop: '2rem', padding: '2rem', backgroundColor: '#e50914', 
            borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem' }}>Selected: {selectedShow.theater.name}</p>
              <p style={{ margin: 0 }}>Time: {new Date(selectedShow.startTime).toLocaleTimeString()}</p>
            </div>
            <button style={{
              backgroundColor: '#fff', color: '#e50914', border: 'none',
              padding: '1rem 2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer'
            }}>
              Go to Seat Selection →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
