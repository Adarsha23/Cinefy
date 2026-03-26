// /server/controllers/movieController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get all movies with pagination
const getMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        skip,
        take: limit,
        orderBy: { releaseDate: 'desc' }
      }),
      prisma.movie.count()
    ]);

    res.json({
      movies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching movies" });
  }
};

// 2. Create a new movie (Admin side logic)
const createMovie = async (req, res) => {
  try {
    const { title, description, duration, genre, posterUrl, releaseDate } = req.body;
    
    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        genre,
        posterUrl,
        releaseDate: new Date(releaseDate)
      }
    });
    
    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating movie" });
  }
};


// 3. Get a single movie by ID
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movie details" });
  }
};

// 4. Get all showtimes for a specific movie
const getMovieShows = async (req, res) => {
  try {
    const { id } = req.params;
    const shows = await prisma.show.findMany({
      where: { movieId: parseInt(id) },
      include: { 
        theater: true // Include theater name and location!
      },
      orderBy: { startTime: 'asc' }
    });
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching showtimes" });
  }
};

// 5. Get details for a specific SHOW (for the booking page)
const getShowById = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await prisma.show.findUnique({
      where: { id: parseInt(showId) },
      include: { 
        movie: true,   // Show the title/poster
        theater: true, // Show the theater name/location
        bookings: true // Include all bookings for this show
      }
    });
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: "Error fetching show details" });
  }
};

// Update exports
module.exports = { getMovies, createMovie, getMovieById, getMovieShows, getShowById };


