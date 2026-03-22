'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';

export default function MovieDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);

  // Define date selection range (next 5 days)
  const dRange = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  
  const [selectedDate, setSelectedDate] = useState(dRange[0].toDateString());

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/movies/${id}/shows`)
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch (err) {
        console.error("Data Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  if (loading) return <div style={{ color: '#555', padding: '10rem', textAlign: 'center', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Loading Movie Data...</div>;
  if (!movie) return <div style={{ color: '#e50914', padding: '10rem', textAlign: 'center' }}>Movie Not Found</div>;

  // Day-of-week pricing logic
  const getTicketPrice = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDay();
    if (day === 2 || day === 3) return 200;
    if (day === 1 || day === 4) return 350;
    return 400;
  };

  const filteredShowsByDate = shows.filter(s => new Date(s.startTime).toDateString() === selectedDate);

  // Organize shows by their theater location
  const groupedTheaters = filteredShowsByDate.reduce((acc, show) => {
    if (!acc[show.theater.name]) acc[show.theater.name] = [];
    acc[show.theater.name].push(show);
    return acc;
  }, {});

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', paddingTop: '80px' }}>
      
      {/* Visual Header */}
      <div style={{
        height: '450px', width: '100%',
        background: `linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%), 
                     linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0) 30%), 
                     url(${movie.backdropUrl || movie.posterUrl}) center/cover no-repeat`,
        display: 'flex', alignItems: 'center', padding: '0 6rem'
      }}>
        <div style={{ maxWidth: '700px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '1rem' }}>{movie.title}</h1>
          <p style={{ color: '#888', fontSize: '1.2rem', lineHeight: '1.6' }}>{movie.description}</p>
        </div>
      </div>

      {/* Showtimes & Theater Selection */}
      <div style={{ padding: '3rem 6rem', backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Viewing Times</h2>

        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto' }}>
          {dRange.map((date, idx) => {
            const isSelected = date.toDateString() === selectedDate;
            const label = idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : date.toLocaleDateString([], { day: '2-digit', month: 'short' });
            
            return (
              <button 
                key={idx}
                onClick={() => { setSelectedDate(date.toDateString()); setSelectedShow(null); }}
                style={{
                  minWidth: '120px', padding: '15px', borderRadius: '4px', cursor: 'pointer',
                  border: isSelected ? '1px solid #e50914' : '1px solid #222', 
                  backgroundColor: isSelected ? 'rgba(229,9,20,0.05)' : 'transparent',
                  color: isSelected ? '#e50914' : '#666',
                  fontWeight: 'bold', fontSize: '0.9rem', transition: '0.2s'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '4rem 6rem', maxWidth: '1200px' }}>
        {Object.keys(groupedTheaters).length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#0d0d0d', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
            <p style={{ color: '#444', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>No available showtimes for the selected date.</p>
          </div>
        ) : (
          Object.entries(groupedTheaters).map(([theaterName, theaterShows]) => (
            <div key={theaterName} style={{ 
              backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '2.5rem', 
              border: '1px solid #1a1a1a', marginBottom: '2rem' 
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', fontWeight: 'bold', color: '#fff' }}>{theaterName}</h3>
              
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {theaterShows.map(show => (
                  <button 
                    key={show.id}
                    onClick={() => setSelectedShow(show)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                      padding: '1.2rem 2.5rem', borderRadius: '4px',
                      border: selectedShow?.id === show.id ? '1px solid #e50914' : '1px solid #222',
                      backgroundColor: selectedShow?.id === show.id ? '#1a1a1a' : 'transparent',
                      cursor: 'pointer', transition: '0.2s'
                    }}
                  >
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: selectedShow?.id === show.id ? '#e50914' : '#fff' }}>
                      {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 'bold' }}>
                      NPR {getTicketPrice(show.startTime)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Global Reservation Trigger */}
        {selectedShow && (
          <div style={{ 
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: '1100px', padding: '1.5rem 3.5rem', backgroundColor: '#e50914', 
            borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)', zIndex: 1000
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: '900', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{selectedShow.theater.name}</p>
              <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                {new Date(selectedShow.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — NPR {getTicketPrice(selectedShow.startTime)}
              </p>
            </div>
            <button 
              onClick={() => router.push(`/booking/${selectedShow.id}`)}
              style={{
                backgroundColor: '#fff', color: '#e50914', border: 'none',
                padding: '1.2rem 4rem', borderRadius: '4px', fontWeight: '900', fontSize: '1rem', 
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px'
              }}
            >
              Continue to Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
