const express = require('express');
const { getMovies, createMovie, getMovieById, getMovieShows, getShowById } = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Retrieve a list of all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *   post:
 *     summary: Create a new movie (Protected)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created
 */
router.get('/', getMovies);
router.post('/', protect, createMovie);

/**
 * @swagger
 * /api/movies/show/{showId}:
 *   get:
 *     summary: Get details of a specific show
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: showId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Show details
 */
router.get('/show/:showId', getShowById);

/**
 * @swagger
 * /api/movies/{id}/shows:
 *   get:
 *     summary: Get showtimes for a specific movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of shows
 */
router.get('/:id/shows', getMovieShows);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get a specific movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie details
 */
router.get('/:id', getMovieById);

module.exports = router;
