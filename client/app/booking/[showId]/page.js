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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShowDetails();
  }, [showId]);

  // DYNAMIC PRICE HELPER
  const getPriceByDate = (dateString) => {
    const d = new Date(dateString);
    const day = d.getDay(); 
    if (day === 2 || day === 3) return 200; // Tue, Wed
    if (day === 1 || day === 4) return 350; // Mon, Thu
    return 400; // Fri, Sat, Sun
  };

  const currentPrice = show ? getPriceByDate(show.startTime) : 0;
  const totalPrice = selectedSeats.length * currentPrice;

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId) 
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    try {
      if (selectedSeats.length === 0) return alert("Select at least one seat!");
      
      await api.post('/bookings', {
        showId: parseInt(showId),
        seats: selectedSeats,
        totalPrice: totalPrice // 👈 Using corrected dynamic price
      });

      alert("Booking Successful! 🍿");
      router.push('/bookings');
    } catch (err) {
      alert("Booking failed. Please login first! 🔐");
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading theater...</div>;
  if (!show) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Show not found</div>;

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', padding: '100px 2rem 150px 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>{show.movie.title}</h2>
        <p style={{ color: '#e50914', fontWeight: 'bold', marginBottom: '3rem', letterSpacing: '1px' }}>
          {show.theater.name} • {new Date(show.startTime).toLocaleString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
        </p>

        {/* The Screen */}
        <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '50px', marginBottom: '1rem', boxShadow: '0 10px 30px rgba(255,255,255,0.1)' }} />
        <p style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '4px', marginBottom: '4rem' }}>SCREEN THIS WAY</p>

        {/* Seat Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginBottom: '4rem' }}>
          {rows.map(row => (
            <div key={row} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ width: '25px', fontSize: '0.8rem', color: '#444', fontWeight: 'bold' }}>{row}</span>
              {cols.map(col => {
                const seatId = `${row}${col}`;
                const isSelected = selectedSeats.includes(seatId);
                const isBooked = bookedSeats.includes(seatId);

                return (
                  <div 
                    key={seatId} 
                    onClick={() => toggleSeat(seatId)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '6px',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 'bold',
                      backgroundColor: isBooked ? '#222' : isSelected ? '#e50914' : 'rgba(255,255,255,0.05)',
                      color: isBooked ? '#444' : isSelected ? '#fff' : '#666',
                      border: isSelected ? '1px solid #e50914' : '1px solid #222',
                      boxShadow: isSelected ? '0 0 15px rgba(229,9,20,0.4)' : 'none'
                    }}
                  >
                    {!isBooked && col}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        {selectedSeats.length > 0 && (
          <div style={{ 
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            width: '90%', maxWidth: '800px', backgroundColor: '#111', border: '1px solid #222',
            padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderRadius: '100px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 1000
          }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>{selectedSeats.length} Seats: {selectedSeats.join(', ')}</p>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: '900' }}>Total: NPR {totalPrice}</h3>
            </div>
            <button 
              onClick={handleBooking}
              style={{
                backgroundColor: '#e50914', color: 'white', border: 'none',
                padding: '1.2rem 3.5rem', borderRadius: '50px', fontWeight: '900', 
                fontSize: '1.1rem', cursor: 'pointer', transition: '0.3s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Confirm NPR {totalPrice} →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
