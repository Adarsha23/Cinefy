'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function BookingPage() {
  const { showId } = useParams();
  const router = useRouter();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const res = await api.get(`/movies/show/${showId}`);
        const showData = res.data;
        setShow(showData);

        const taken = showData.bookings.reduce((acc, booking) => {
          return [...acc, ...booking.seats];
        }, []);
        setBookedSeats(taken);
      } catch (err) {
        console.error("Show Detail Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShowDetails();
  }, [showId]);

  // Pricing logic for ticket calculation
  const getTicketPrice = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDay(); 
    if (day === 2 || day === 3) return 200; 
    if (day === 1 || day === 4) return 350; 
    return 400; 
  };

  const currentPrice = show ? getTicketPrice(show.startTime) : 0;
  const totalPrice = selectedSeats.length * currentPrice;

  const toggleSeatSelection = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId) 
        : [...prev, seatId]
    );
  };

  const handleBookingConfirm = async () => {
    try {
      if (selectedSeats.length === 0) return alert("Please select at least one seat.");
      
      await api.post('/bookings', {
        showId: parseInt(showId),
        seats: selectedSeats,
        totalPrice: totalPrice 
      });

      alert("Booking confirmed successfully.");
      router.push('/bookings');
    } catch (err) {
      if (err.response?.status === 401) {
        // Automatically redirect to login with callback URL to return after authentication
        router.push(`/login?callback=/booking/${showId}`);
      } else {
        alert(err.response?.data?.message || "Booking failed.");
      }
    }
  };

  if (loading) return <div style={{ color: '#444', padding: '10rem', textAlign: 'center', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Loading Theater Configuration...</div>;
  if (!show) return <div style={{ color: '#e50914', padding: '10rem', textAlign: 'center' }}>Selected show not found.</div>;

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '100px 2rem 150px 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '0.5rem' }}>{show.movie.title}</h2>
        <p style={{ color: '#e50914', fontWeight: 'bold', marginBottom: '4rem', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
          {show.theater.name} • {new Date(show.startTime).toLocaleString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
        </p>

        {/* Cinematic Screen Indicator */}
        <div style={{ width: '100%', height: '2px', background: 'linear-gradient(to right, transparent, #333, transparent)', marginBottom: '1rem' }} />
        <p style={{ color: '#222', fontSize: '0.7rem', letterSpacing: '8px', marginBottom: '5rem', fontWeight: 'bold' }}>THEATER SCREEN</p>

        {/* Interactive Seating Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginBottom: '5rem' }}>
          {rows.map(row => (
            <div key={row} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ width: '30px', fontSize: '0.8rem', color: '#222', fontWeight: 'bold' }}>{row}</span>
              {cols.map(col => {
                const seatId = `${row}${col}`;
                const isSelected = selectedSeats.includes(seatId);
                const isBooked = bookedSeats.includes(seatId);

                return (
                  <div 
                    key={seatId} 
                    onClick={() => toggleSeatSelection(seatId)}
                    style={{
                      width: '34px', height: '34px', borderRadius: '4px',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 'bold',
                      backgroundColor: isBooked ? '#111' : isSelected ? '#e50914' : 'transparent',
                      color: isBooked ? '#333' : isSelected ? '#fff' : '#666',
                      border: isSelected ? '1px solid #e50914' : '1px solid #222',
                    }}
                  >
                    {!isBooked && col}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Global Checkout Bar */}
        {selectedSeats.length > 0 && (
          <div style={{ 
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: '1000px', backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a',
            padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderRadius: '4px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', zIndex: 1000
          }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, color: '#555', fontSize: '0.85rem', fontWeight: 'bold' }}>{selectedSeats.length} SEATS SELECTED</p>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.6rem', fontWeight: '950' }}>Total NPR {totalPrice}</h3>
            </div>
            <button 
              onClick={handleBookingConfirm}
              style={{
                backgroundColor: '#e50914', color: 'white', border: 'none',
                padding: '1.2rem 4.5rem', borderRadius: '4px', fontWeight: '900', 
                fontSize: '1rem', cursor: 'pointer', transition: '0.2s', 
                textTransform: 'uppercase', letterSpacing: '1px'
              }}
            >
              Verify Reservation
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
