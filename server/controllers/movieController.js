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

module.exports = { getMovies, createMovie };
