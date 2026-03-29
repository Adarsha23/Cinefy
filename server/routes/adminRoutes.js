const express = require('express');
const router = express.Router();
const { 
  getAdminStats, getAllBookings, exportBookingReport,
  getTheaters, createTheater, updateTheater, deleteTheater,
  createMovie, updateMovie, deleteMovie,
  getAllShows, createShow, updateShow, deleteShow
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/stats', getAdminStats);

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get master log of all bookings (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings
 */
router.get('/bookings', getAllBookings);

/**
 * @swagger
 * /api/admin/reports/bookings:
 *   get:
 *     summary: Export full booking report as CSV (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file with all booking data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/reports/bookings', exportBookingReport);

/**
 * @swagger
 * /api/admin/theaters:
 *   get:
 *     summary: Get all theaters
 *     tags: [Admin - Theaters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of theaters
 *   post:
 *     summary: Register a new theater
 *     tags: [Admin - Theaters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Theater created
 */
router.get('/theaters', getTheaters);
router.post('/theaters', createTheater);

/**
 * @swagger
 * /api/admin/theaters/{id}:
 *   put:
 *     summary: Update theater details
 *     tags: [Admin - Theaters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theater updated
 *   delete:
 *     summary: Delete a theater
 *     tags: [Admin - Theaters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theater deleted
 */
router.put('/theaters/:id', updateTheater);
router.delete('/theaters/:id', deleteTheater);


/**
 * @swagger
 * /api/admin/movies:
 *   post:
 *     summary: Create a movie entry
 *     tags: [Admin - Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Movie created
 */
router.post('/movies', createMovie);

/**
 * @swagger
 * /api/admin/movies/{id}:
 *   put:
 *     summary: Update a movie
 *     tags: [Admin - Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie updated
 *   delete:
 *     summary: Delete a movie
 *     tags: [Admin - Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie deleted
 */
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

/**
 * @swagger
 * /api/admin/shows:
 *   get:
 *     summary: Get all shows
 *     tags: [Admin - Shows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shows
 *   post:
 *     summary: Schedule a new show
 *     tags: [Admin - Shows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Show scheduled
 */
router.get('/shows', getAllShows);
router.post('/shows', createShow);

/**
 * @swagger
 * /api/admin/shows/{id}:
 *   put:
 *     summary: Update show timing/pricing
 *     tags: [Admin - Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Show updated
 *   delete:
 *     summary: Cancel a show
 *     tags: [Admin - Shows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Show canceled
 */
router.put('/shows/:id', updateShow);
router.delete('/shows/:id', deleteShow);

module.exports = router;
