const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fetch dashboard stats for admin overview
const getAdminStats = async (req, res) => {
  try {
    const [movieCount, bookingCount, totalRev] = await Promise.all([
      prisma.movie.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalPrice: true }
      })
    ]);

    res.json({
      movies: movieCount,
      bookings: bookingCount,
      revenue: totalRev._sum.totalPrice || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admin stats" });
  }
};

// Fetch master log of all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        show: {
          include: {
            movie: { select: { title: true } },
            theater: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching master booking log" });
  }
};

// --- Movie CRUD ---

const createMovie = async (req, res) => {
  try {
    const movie = await prisma.movie.create({ data: req.body });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error creating movie" });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error updating movie" });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.movie.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting movie" });
  }
};

// --- Theater CRUD ---

const getTheaters = async (req, res) => {
  try {
    const theaters = await prisma.theater.findMany();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching theaters" });
  }
};

const createTheater = async (req, res) => {
  try {
    const theater = await prisma.theater.create({ data: req.body });
    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: "Error creating theater" });
  }
};

const updateTheater = async (req, res) => {
  try {
    const { id } = req.params;
    const theater = await prisma.theater.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: "Error updating theater" });
  }
};

const deleteTheater = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.theater.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Theater deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting theater" });
  }
};

// --- Show CRUD ---

const getAllShows = async (req, res) => {
  try {
    const shows = await prisma.show.findMany({
      include: {
        movie: { select: { title: true } },
        theater: { select: { name: true } }
      }
    });
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shows" });
  }
};

const createShow = async (req, res) => {
  try {
    const show = await prisma.show.create({ data: req.body });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: "Error creating showtime" });
  }
};

const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await prisma.show.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: "Error updating show" });
  }
};

const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.show.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Show deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting show" });
  }
};

// Generate and stream full booking report as CSV
const exportBookingReport = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        show: {
          include: {
            movie: { select: { title: true } },
            theater: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Build CSV headers
    const headers = ['BookingID', 'Date', 'Customer', 'Email', 'Movie', 'Theater', 'ShowTime', 'Seats', 'TotalAmount(NPR)', 'Status'];
    
    // Build CSV rows
    const rows = bookings.map(b => [
      b.id,
      new Date(b.createdAt).toLocaleDateString('en-GB'),
      b.user.name,
      b.user.email,
      b.show.movie.title,
      b.show.theater.name,
      new Date(b.show.startTime).toLocaleString('en-GB'),
      b.seats.join(' | '),
      b.totalPrice,
      b.status
    ]);

    // Combine into CSV string
    const csv = [headers, ...rows]
      .map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment(`cinefy_report_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);

  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

module.exports = { 
  getAdminStats, getAllBookings, exportBookingReport,
  getTheaters, createTheater, updateTheater, deleteTheater,
  createMovie, updateMovie, deleteMovie,
  getAllShows, createShow, updateShow, deleteShow
};
