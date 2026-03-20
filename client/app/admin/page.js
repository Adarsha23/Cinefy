'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, movies, theaters, bookings
  const [stats, setStats] = useState({ movies: 0, bookings: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding Movie
  const [newMovie, setNewMovie] = useState({ title: '', description: '', duration: '', genre: '', posterUrl: '', backdropUrl: '', releaseDate: '' });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/bookings')
        ]);
        setStats(statsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error("Access Denied", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isLoggedIn) fetchAdminData();
    else if (!authLoading && !isLoggedIn) router.push('/login');
  }, [authLoading, isLoggedIn]);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/movies', { ...newMovie, duration: parseInt(newMovie.duration), releaseDate: new Date(newMovie.releaseDate) });
      alert("Movie Added Successfully! 🍿");
      setNewMovie({ title: '', description: '', duration: '', genre: '', posterUrl: '', backdropUrl: '', releaseDate: '' });
      setActiveTab('overview'); // Go back to overview
    } catch (err) {
      alert("Error adding movie. Please check fields.");
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Entering Command Center... 🏗️</div>;

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex', paddingTop: '80px' }}>
      
      {/* 🏰 SIDEBAR */}
      <div style={{ width: '280px', backgroundColor: '#111', borderRight: '1px solid #222', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '950', color: '#e50914', marginBottom: '1rem' }}>CINEFY ADMIN</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('overview')} style={{ background: activeTab === 'overview' ? 'rgba(229,9,20,0.1)' : 'transparent', color: activeTab === 'overview' ? '#e50914' : '#888', border: 'none', padding: '15px', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>Dashboard Overview</button>
          <button onClick={() => setActiveTab('movies')} style={{ background: activeTab === 'movies' ? 'rgba(229,9,20,0.1)' : 'transparent', color: activeTab === 'movies' ? '#e50914' : '#888', border: 'none', padding: '15px', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>Add New Movie</button>
          <button onClick={() => setActiveTab('bookings')} style={{ background: activeTab === 'bookings' ? 'rgba(229,9,20,0.1)' : 'transparent', color: activeTab === 'bookings' ? '#e50914' : '#888', border: 'none', padding: '15px', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>Booking History</button>
        </nav>
      </div>

      {/* 🏙️ MAIN PANEL */}
      <div style={{ flexGrow: 1, padding: '4rem', overflowY: 'auto' }}>
        
        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
              <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '2rem', borderRadius: '15px' }}>
                <p style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Total Movies</p>
                <h3 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{stats.movies}</h3>
              </div>
              <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '2rem', borderRadius: '15px' }}>
                <p style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Tickets Sold</p>
                <h3 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{stats.bookings}</h3>
              </div>
              <div style={{ backgroundColor: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', padding: '2rem', borderRadius: '15px' }}>
                <p style={{ color: '#e50914', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Total Revenue</p>
                <h3 style={{ fontSize: '2.5rem', margin: '10px 0', color: '#fff' }}>NPR {stats.revenue}</h3>
              </div>
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Master Booking Log <span style={{ color: '#e50914' }}>.</span></h2>
            {/* Table stays here */}
          </>
        )}

        {activeTab === 'movies' && (
          <div style={{ maxWidth: '700px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Add New Movie 🎬</h2>
            <p style={{ color: '#888', marginBottom: '3rem' }}>Fill in the details to add a new title to the Cinefy lineup.</p>
            
            <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <input type="text" placeholder="Movie Title" value={newMovie.title} onChange={(e) => setNewMovie({...newMovie, title: e.target.value})} required style={{ padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
              <textarea placeholder="Description" value={newMovie.description} onChange={(e) => setNewMovie({...newMovie, description: e.target.value})} required style={{ padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px', minHeight: '120px' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="number" placeholder="Duration (mins)" value={newMovie.duration} onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})} required style={{ flex: 1, padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
                <input type="text" placeholder="Genre" value={newMovie.genre} onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})} required style={{ flex: 1, padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
              </div>
              <input type="url" placeholder="Poster Image URL" value={newMovie.posterUrl} onChange={(e) => setNewMovie({...newMovie, posterUrl: e.target.value})} required style={{ padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
              <input type="url" placeholder="Backdrop Image URL (16:9)" value={newMovie.backdropUrl} onChange={(e) => setNewMovie({...newMovie, backdropUrl: e.target.value})} required style={{ padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
              <input type="date" value={newMovie.releaseDate} onChange={(e) => setNewMovie({...newMovie, releaseDate: e.target.value})} required style={{ padding: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
              
              <button type="submit" style={{ marginTop: '1rem', padding: '1.2rem', backgroundColor: '#e50914', color: '#white', fontWeight: '900', fontSize: '1.1rem', borderRadius: '10px', cursor: 'pointer', border: 'none' }}>Save Movie to Lineup</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
