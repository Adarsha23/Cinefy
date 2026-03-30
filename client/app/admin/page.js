'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { isLoggedIn, user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ movies: 0, bookings: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding/editing items
  const [movieForm, setMovieForm] = useState({ id: null, title: '', description: '', duration: '', genre: '', posterUrl: '', backdropUrl: '', releaseDate: '' });
  const [theaterForm, setTheaterForm] = useState({ id: null, name: '', location: '', totalHalls: 1 });
  const [showForm, setShowForm] = useState({ id: null, movieId: '', theaterId: '', startTime: '', ticketPrice: '' });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, bookingsRes, moviesRes, theatersRes, showsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/bookings'),
          api.get('/movies'),
          api.get('/admin/theaters'),
          api.get('/admin/shows')
        ]);
        setStats(statsRes.data);
        setBookings(bookingsRes.data);
        setMovies(moviesRes.data.movies || []);
        setTheaters(theatersRes.data);
        setShows(showsRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isLoggedIn) {
      if (user?.role !== 'ADMIN') router.push('/');
      else fetchAdminData();
    } else if (!authLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [authLoading, isLoggedIn, user, router]);

  // Handle movie submission (Create/Update)
  const submitMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...movieForm, duration: parseInt(movieForm.duration), releaseDate: new Date(movieForm.releaseDate) };
      if (movieForm.id) {
        await api.put(`/admin/movies/${movieForm.id}`, payload);
        alert("Movie Updated");
      } else {
        await api.post('/admin/movies', payload);
        alert("Movie Created");
      }
      window.location.reload();
    } catch (err) { alert("Action Failed"); }
  };

  const deleteMovie = async (id) => {
    if (!confirm("Delete movie and its dependencies?")) return;
    try {
      await api.delete(`/admin/movies/${id}`);
      window.location.reload();
    } catch (err) { alert("Deletion Failed"); }
  };

  // Handle theater submission (Create/Update)
  const submitTheater = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...theaterForm, totalHalls: parseInt(theaterForm.totalHalls) };
      if (theaterForm.id) {
        await api.put(`/admin/theaters/${theaterForm.id}`, payload);
        alert("Theater Updated");
      } else {
        await api.post('/admin/theaters', payload);
        alert("Theater Created");
      }
      window.location.reload();
    } catch (err) { alert("Action Failed"); }
  };

  const deleteTheater = async (id) => {
    if (!confirm("Delete this theater?")) return;
    try {
      await api.delete(`/admin/theaters/${id}`);
      window.location.reload();
    } catch (err) { alert("Deletion Failed"); }
  };

  // Handle show submission (Create/Update)
  const submitShow = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...showForm, 
        movieId: parseInt(showForm.movieId), 
        theaterId: parseInt(showForm.theaterId),
        ticketPrice: parseFloat(showForm.ticketPrice),
        startTime: new Date(showForm.startTime).toISOString()
      };
      if (showForm.id) {
        await api.put(`/admin/shows/${showForm.id}`, payload);
        alert("Show Updated");
      } else {
        await api.post('/admin/shows', payload);
        alert("Show Scheduled");
      }
      window.location.reload();
    } catch (err) { alert("Action Failed"); }
  };

  const deleteShow = async (id) => {
    if (!confirm("Cancel this show?")) return;
    try {
      await api.delete(`/admin/shows/${id}`);
      window.location.reload();
    } catch (err) { alert("Deletion Failed"); }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/admin/reports/bookings', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cinefy_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to generate report.");
    }
  };

  if (loading) return <div style={{ color: '#888', textAlign: 'center', marginTop: '15%' }}>Loading Admin Utilities...</div>;

  return (
    <div style={{ backgroundColor: '#050505', color: '#eee', minHeight: '100vh', display: 'flex', paddingTop: '70px' }}>
      
      {/* Navigation Sidebar */}
      <div style={{ width: '260px', backgroundColor: '#0d0d0d', borderRight: '1px solid #1a1a1a', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', position: 'fixed', height: '100vh' }}>
        <div style={{ color: '#e50914', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '2rem', letterSpacing: '2px' }}>CINEFY COMMAND</div>
        <button onClick={() => setActiveTab('overview')} style={navBtnStyle(activeTab === 'overview')}>Overview</button>
        <button onClick={() => setActiveTab('movies')} style={navBtnStyle(activeTab === 'movies')}>Manage Movies</button>
        <button onClick={() => setActiveTab('theaters')} style={navBtnStyle(activeTab === 'theaters')}>Manage Theaters</button>
        <button onClick={() => setActiveTab('shows')} style={navBtnStyle(activeTab === 'shows')}>Manage Shows</button>
      </div>

      {/* Main Content Area */}
      <div style={{ marginLeft: '260px', flexGrow: 1, padding: '3rem 5rem' }}>
        
        {activeTab === 'overview' && (
          <div style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={sectionTitleStyle}>Operations Overview</h2>
              <button
                onClick={handleExportCSV}
                style={{
                  backgroundColor: 'transparent', color: '#e50914', border: '1px solid #e50914',
                  padding: '0.7rem 1.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem',
                  cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', transition: '0.2s'
                }}
                onMouseEnter={e => { e.target.style.backgroundColor = '#e50914'; e.target.style.color = '#fff'; }}
                onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#e50914'; }}
              >
                Download Report (.csv)
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
              <div style={statBoxStyle}><span style={statLabelStyle}>TOTAL MOVIES</span><div style={statValStyle}>{stats.movies}</div></div>
              <div style={statBoxStyle}><span style={statLabelStyle}>TICKETS PURCHASED</span><div style={statValStyle}>{stats.bookings}</div></div>
              <div style={{...statBoxStyle, borderLeft: '4px solid #e50914'}}><span style={statLabelStyle}>GROSS REVENUE</span><div style={statValStyle}>NPR {stats.revenue}</div></div>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: '#888', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Transaction Log</h3>
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeadStyle}><th>User</th><th>Movie</th><th>Theater</th><th>Seats</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={tableRowStyle}>
                      <td>{b.user.name}</td>
                      <td style={{ fontWeight: 'bold' }}>{b.show.movie.title}</td>
                      <td>{b.show.theater.name}</td>
                      <td>{b.seats.join(', ')}</td>
                      <td>NPR {b.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- MOVIE MANAGEMENT --- */}
        {activeTab === 'movies' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={sectionTitleStyle}>{movieForm.id ? 'Edit Movie' : 'Add New Movie'}</h2>
            <form onSubmit={submitMovie} style={formStyle}>
              <input type="text" placeholder="Movie Title" value={movieForm.title} onChange={e => setMovieForm({...movieForm, title: e.target.value})} style={inputStyle} required />
              <textarea placeholder="Description" value={movieForm.description} onChange={e => setMovieForm({...movieForm, description: e.target.value})} style={{...inputStyle, minHeight: '120px'}} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="number" placeholder="Duration (min)" value={movieForm.duration} onChange={e => setMovieForm({...movieForm, duration: e.target.value})} style={inputStyle} required />
                <input type="text" placeholder="Genre" value={movieForm.genre} onChange={e => setMovieForm({...movieForm, genre: e.target.value})} style={inputStyle} required />
              </div>
              <input type="url" placeholder="Poster Image URL" value={movieForm.posterUrl} onChange={e => setMovieForm({...movieForm, posterUrl: e.target.value})} style={inputStyle} required />
              <input type="url" placeholder="Hero Backdrop URL" value={movieForm.backdropUrl} onChange={e => setMovieForm({...movieForm, backdropUrl: e.target.value})} style={inputStyle} required />
              <input type="date" value={movieForm.releaseDate} onChange={e => setMovieForm({...movieForm, releaseDate: e.target.value})} style={inputStyle} required />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={primaryBtnStyle}>{movieForm.id ? 'Update Movie Entry' : 'Create Movie Entry'}</button>
                {movieForm.id && <button type="button" onClick={() => setMovieForm({ id: null, title: '', description: '', duration: '', genre: '', posterUrl: '', backdropUrl: '', releaseDate: '' })} style={secondaryBtnStyle}>Cancel</button>}
              </div>
            </form>

            <h3 style={subHeaderStyle}>Library Catalog</h3>
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead><tr style={tableHeadStyle}><th>Title</th><th>Genre</th><th>Release</th><th>Actions</th></tr></thead>
                <tbody>
                  {movies.map(m => (
                    <tr key={m.id} style={tableRowStyle}>
                      <td style={{fontWeight:600}}>{m.title}</td>
                      <td>{m.genre}</td>
                      <td>{m.releaseDate.split('T')[0]}</td>
                      <td>
                        <button onClick={() => setMovieForm({ ...m, releaseDate: m.releaseDate.split('T')[0], id: m.id })} style={editBtnStyle}>Edit</button>
                        <button onClick={() => deleteMovie(m.id)} style={delBtnStyle}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- THEATER MANAGEMENT --- */}
        {activeTab === 'theaters' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={sectionTitleStyle}>{theaterForm.id ? 'Edit Theater' : 'Add New Theater'}</h2>
            <form onSubmit={submitTheater} style={formStyle}>
              <input type="text" placeholder="Theater Name" value={theaterForm.name} onChange={e => setTheaterForm({...theaterForm, name: e.target.value})} style={inputStyle} required />
              <input type="text" placeholder="Location/City" value={theaterForm.location} onChange={e => setTheaterForm({...theaterForm, location: e.target.value})} style={inputStyle} required />
              <input type="number" placeholder="Number of Halls" value={theaterForm.totalHalls} onChange={e => setTheaterForm({...theaterForm, totalHalls: e.target.value})} style={inputStyle} required />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={primaryBtnStyle}>{theaterForm.id ? 'Update Theater' : 'Add Theater'}</button>
                {theaterForm.id && <button type="button" onClick={() => setTheaterForm({ id: null, name: '', location: '', totalHalls: 1 })} style={secondaryBtnStyle}>Cancel</button>}
              </div>
            </form>

            <h3 style={subHeaderStyle}>Registered Venues</h3>
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead><tr style={tableHeadStyle}><th>Name</th><th>Location</th><th>Halls</th><th>Actions</th></tr></thead>
                <tbody>
                  {theaters.map(t => (
                    <tr key={t.id} style={tableRowStyle}>
                      <td style={{fontWeight:600}}>{t.name}</td>
                      <td>{t.location}</td>
                      <td>{t.totalHalls}</td>
                      <td>
                        <button onClick={() => setTheaterForm({ ...t, id: t.id })} style={editBtnStyle}>Edit</button>
                        <button onClick={() => deleteTheater(t.id)} style={delBtnStyle}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SHOW MANAGEMENT --- */}
        {activeTab === 'shows' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={sectionTitleStyle}>{showForm.id ? 'Edit Show' : 'Schedule New Show'}</h2>
            <form onSubmit={submitShow} style={formStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select value={showForm.movieId} onChange={e => setShowForm({...showForm, movieId: e.target.value})} style={inputStyle} required>
                  <option value="">Select Movie</option>
                  {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
                <select value={showForm.theaterId} onChange={e => setShowForm({...showForm, theaterId: e.target.value})} style={inputStyle} required>
                  <option value="">Select Theater</option>
                  {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="datetime-local" value={showForm.startTime} onChange={e => setShowForm({...showForm, startTime: e.target.value})} style={inputStyle} required />
                <input type="number" placeholder="Ticket Price (NPR)" value={showForm.ticketPrice} onChange={e => setShowForm({...showForm, ticketPrice: e.target.value})} style={inputStyle} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={primaryBtnStyle}>{showForm.id ? 'Update Schedule' : 'Confirm Show Schedule'}</button>
                {showForm.id && <button type="button" onClick={() => setShowForm({ id: null, movieId: '', theaterId: '', startTime: '', ticketPrice: '' })} style={secondaryBtnStyle}>Cancel</button>}
              </div>
            </form>

            <h3 style={subHeaderStyle}>Live Show Schedules</h3>
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead><tr style={tableHeadStyle}><th>Movie</th><th>Theater</th><th>Time</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>
                  {shows.map(s => (
                    <tr key={s.id} style={tableRowStyle}>
                      <td style={{fontWeight:600}}>{s.movie.title}</td>
                      <td>{s.theater.name}</td>
                      <td>{new Date(s.startTime).toLocaleString()}</td>
                      <td>NPR {s.ticketPrice}</td>
                      <td>
                        <button onClick={() => setShowForm({ ...s, id: s.id, movieId: s.movieId, theaterId: s.theaterId, startTime: s.startTime.slice(0, 16) })} style={editBtnStyle}>Edit</button>
                        <button onClick={() => deleteShow(s.id)} style={delBtnStyle}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sidebar Button Logic
const navBtnStyle = (active) => ({
  background: active ? '#1a1a1a' : 'transparent',
  color: active ? '#e50914' : '#666',
  border: 'none', padding: '15px 20px', borderRadius: '12px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', fontSize: '0.95rem'
});

// UI Building Blocks
const statBoxStyle = { backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a', padding: '1.8rem', borderRadius: '12px' };
const statLabelStyle = { color: '#555', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px' };
const statValStyle = { fontSize: '2rem', marginTop: '5px', fontWeight: 'bold' };

const sectionTitleStyle = { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' };
const subHeaderStyle = { fontSize: '1.2rem', marginTop: '3.5rem', marginBottom: '1.5rem', color: '#888', textTransform: 'uppercase' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '1.2rem', backgroundColor: '#0d0d0d', padding: '2.5rem', borderRadius: '15px', border: '1px solid #1a1a1a' };
const inputStyle = { width: '100%', padding: '1.1rem', backgroundColor: '#151515', border: '1px solid #222', color: '#fff', borderRadius: '10px', fontSize: '1rem', outline: 'none' };

const primaryBtnStyle = { padding: '1rem 2rem', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const secondaryBtnStyle = { background: '#222', color: '#fff', border: 'none', borderRadius: '8px', padding: '1rem 2rem', cursor: 'pointer' };

const tableWrapStyle = { backgroundColor: '#0d0d0d', borderRadius: '12px', border: '1px solid #1a1a1a', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const tableHeadStyle = { backgroundColor: '#151515', color: '#555', fontSize: '0.85rem' };
const tableRowStyle = { borderTop: '1px solid #1a1a1a' };

const editBtnStyle = { background: 'none', border: 'none', color: '#1db954', cursor: 'pointer', marginRight: '1rem', fontWeight: 'bold' };
const delBtnStyle = { background: 'none', border: 'none', color: '#fa3e3e', cursor: 'pointer', fontWeight: 'bold' };
