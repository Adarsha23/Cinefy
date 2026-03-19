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

  // Generate the next 5 days for the selector
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  
  const [selectedDate, setSelectedDate] = useState(dates[0].toDateString());

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading...</div>;
  if (!movie) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Movie Not Found</div>;

  //  Get Price based on the Day of Week
  const getPriceByDate = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDay(); // 0 (Sun) to 6 (Sat)
    
    if (day === 2 || day === 3) return 200; // Tue, Wed (Super2Days)
    if (day === 1 || day === 4) return 350; // Mon, Thu (Weekdays)
    return 400; // Fri, Sat, Sun (Weekends)
  };

  // Filter shows by ONLY the selected date
  const filteredShows = shows.filter(show => 
    new Date(show.startTime).toDateString() === selectedDate
  );

  // Group filtered shows by theater
  const theaters = filteredShows.reduce((acc, show) => {
    if (!acc[show.theater.name]) acc[show.theater.name] = [];
    acc[show.theater.name].push(show);
    return acc;
  }, {});

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', paddingTop: '80px' }}>
      
      {/* Hero Banner */}
      <div style={{
        height: '500px', width: '100%',
        background: `linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 60%), 
                     linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 30%), 
                     url(${movie.backdropUrl || movie.posterUrl}) center/cover no-repeat`,
        display: 'flex', alignItems: 'center', padding: '0 4rem'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '950', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>{movie.title}</h1>
          <p style={{ color: '#bbb', fontSize: '1.1rem', lineHeight: '1.7' }}>{movie.description}</p>
        </div>
      </div>

      {/* VIEWING TIMES SELECTOR */}
      <div style={{ padding: '3rem 4rem', backgroundColor: '#0e0e0e', borderBottom: '1px solid #1f1f1f' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Viewing Times <span style={{ color: '#e50914' }}>.</span></h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#e50914' }}>● SOLD</span>
            <span style={{ fontSize: '0.8rem', color: '#f4b400' }}>● BOOKED</span>
            <span style={{ fontSize: '0.8rem', color: '#0f9d58' }}>● AVAILABLE</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '1rem' }}>
          {dates.map((date, idx) => {
            const isSelected = date.toDateString() === selectedDate;
            const label = idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : date.toLocaleDateString([], { day: '2-digit', month: 'short' });
            
            return (
              <button 
                key={idx}
                onClick={() => { setSelectedDate(date.toDateString()); setSelectedShow(null); }}
                style={{
                  minWidth: '120px', padding: '15px', borderRadius: '4px', cursor: 'pointer',
                  border: 'none', transition: '0.3s',
                  backgroundColor: isSelected ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.03)',
                  borderBottom: isSelected ? '3px solid #e50914' : '3px solid transparent',
                  color: isSelected ? '#e50914' : '#888',
                  fontWeight: 'bold', fontSize: '1rem'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real Shows Section */}
      <div style={{ padding: '3rem 4rem', maxWidth: '1200px' }}>
        {Object.keys(theaters).length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#111', borderRadius: '15px' }}>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>No shows scheduled for {new Date(selectedDate).toDateString()}.</p>
          </div>
        ) : (
          Object.entries(theaters).map(([theaterName, theaterShows]) => (
            <div key={theaterName} style={{ 
              backgroundColor: '#111', borderRadius: '12px', padding: '2rem', 
              border: '1px solid #222', marginBottom: '2rem' 
            }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.8rem', fontWeight: '800' }}>{theaterName}</h3>
              
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {theaterShows.map(show => (
                  <button 
                    key={show.id}
                    onClick={() => setSelectedShow(show)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                      padding: '15px 30px', borderRadius: '10px',
                      border: selectedShow?.id === show.id ? '2px solid #e50914' : '1px solid #333',
                      backgroundColor: selectedShow?.id === show.id ? 'rgba(229,9,20,0.1)' : 'transparent',
                      cursor: 'pointer', transition: '0.2s'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: selectedShow?.id === show.id ? '#e50914' : '#fff' }}>
                      {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>
                      NPR {getPriceByDate(show.startTime)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Floating Confirm Button */}
        {selectedShow && (
          <div style={{ 
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: '1000px', padding: '1.5rem 3rem', backgroundColor: '#e50914', 
            borderRadius: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 15px 40px rgba(229,9,20,0.5)', zIndex: 100
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: '900', fontSize: '1.4rem' }}>{selectedShow.theater.name}</p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>
                {new Date(selectedShow.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • NPR {getPriceByDate(selectedShow.startTime)}
              </p>
            </div>
            <button 
              onClick={() => router.push(`/booking/${selectedShow.id}`)}
              style={{
                backgroundColor: '#fff', color: '#e50914', border: 'none',
                padding: '1.1rem 3rem', borderRadius: '50px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer'
              }}
            >
              Select Seats →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
