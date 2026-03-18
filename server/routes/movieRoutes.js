// /server/routes/movieRoutes.js
const express = require('express');
const { getMovies, createMovie, getMovieById } = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Anyone can see movies
router.get('/', getMovies);

// Get a single movie by ID
router.get('/:id', getMovieById);


// Only logged in users  can add movies
router.post('/', protect, createMovie);

module.exports = router;
