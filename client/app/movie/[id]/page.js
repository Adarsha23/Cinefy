'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';

export default function MovieDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center', fontSize: '1.5rem' }}>Loading...</div>;
  if (!movie) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Movie Not Found</div>;

  const dates = ['MAR 18', 'MAR 19', 'MAR 20', 'MAR 21', 'MAR 22'];
  const showtimes = ['11:00 AM', '02:30 PM', '05:30 PM', '09:00 PM'];

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      
      {/* Hero Banner */}
      <div style={{
        height: '600px',
        width: '100%',
        background: `linear-gradient(to right, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.3) 100%), 
                     linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(10,10,10,1) 100%), 
                     url(${movie.posterUrl}) center/cover no-repeat`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 4rem'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <p style={{ color: '#e50914', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Now Showing
          </p>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1rem', lineHeight: '1.1' }}>
            {movie.title}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', color: '#aaa', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: '#222', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>{movie.genre}</span>
            <span style={{ backgroundColor: '#222', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>🕐 {Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            <span style={{ backgroundColor: '#e50914', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>4K</span>
          </div>
          <p style={{ color: '#bbb', fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '500px' }}>
            {movie.description}
          </p>
        </div>
      </div>

      {/* Booking Section */}
      <div style={{ padding: '3rem 4rem', maxWidth: '1200px' }}>
        
        {/* Date Selector */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#fff' }}>Select Date</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {dates.map((date, i) => (
            <button key={date} onClick={() => setSelectedDate(i)} style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: selectedDate === i ? '2px solid #e50914' : '1px solid #333',
              backgroundColor: selectedDate === i ? '#e50914' : 'transparent',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s'
            }}>
              {date}
            </button>
          ))}
        </div>

        {/* Theater + Showtimes */}
        <div style={{ 
          backgroundColor: '#111', 
          borderRadius: '12px', 
          padding: '2rem', 
          border: '1px solid #222' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.3rem 0' }}>Cinefy Prime Hall</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>🏛️ Kathmandu • Standard & Premium Seating</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {showtimes.map(time => (
                <button key={time} onClick={() => setSelectedTime(time)} style={{
                  padding: '10px 20px',
                  border: selectedTime === time ? '2px solid #e50914' : '1px solid #444',
                  borderRadius: '8px',
                  backgroundColor: selectedTime === time ? 'rgba(229,9,20,0.15)' : 'transparent',
                  color: selectedTime === time ? '#e50914' : '#ccc',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s'
                }}>
                  {time}
                </button>
              ))}
            </div>
          </div>

          {selectedTime && (
            <div style={{ 
              borderTop: '1px solid #222', 
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <p style={{ color: '#888', margin: '0 0 0.3rem 0' }}>Selected Show</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                  {dates[selectedDate]} at {selectedTime}
                </p>
              </div>
              <button style={{
                backgroundColor: '#e50914',
                color: 'white',
                border: 'none',
                padding: '1rem 3rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(229,9,20,0.4)'
              }}>
                Select Seats →
              </button>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { label: 'Release Date', value: new Date(movie.releaseDate).toLocaleDateString() },
            { label: 'Duration', value: `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` },
            { label: 'Genre', value: movie.genre },
            { label: 'Format', value: '4K Ultra HD' },
          ].map(info => (
            <div key={info.label} style={{ backgroundColor: '#111', padding: '1.2rem', borderRadius: '10px', border: '1px solid #1f1f1f' }}>
              <p style={{ color: '#e50914', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.5rem 0' }}>{info.label}</p>
              <p style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>{info.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
