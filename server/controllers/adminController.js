const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get Dashboard Summary Stats (Total Movies, Bookings, Revenue)
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

// 2. Get EVERY booking ever made (Master Log)
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

// 🏛️ 3. CREATE NEW MOVIE (Admin Only)
const createMovie = async (req, res) => {
  try {
    const movie = await prisma.movie.create({ data: req.body });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error creating movie" });
  }
};

// 🏛️ 4. CREATE NEW THEATER (Admin Only)
const createTheater = async (req, res) => {
  try {
    const theater = await prisma.theater.create({ data: req.body });
    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: "Error creating theater" });
  }
};

// 🏛️ 5. CREATE NEW SHOWTIME (Admin Only)
const createShow = async (req, res) => {
  try {
    const show = await prisma.show.create({ data: req.body });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: "Error creating showtime" });
  }
};

module.exports = { getAdminStats, getAllBookings, createMovie, createTheater, createShow };
