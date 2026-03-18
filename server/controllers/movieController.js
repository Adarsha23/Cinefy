// /server/controllers/movieController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
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

// Update exports
module.exports = { getMovies, createMovie, getMovieById, getMovieShows };


