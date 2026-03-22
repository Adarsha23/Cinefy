const express = require('express');
const router = express.Router();
const { 
  getAdminStats, getAllBookings, 
  getTheaters, createTheater, updateTheater, deleteTheater,
  createMovie, updateMovie, deleteMovie,
  getAllShows, createShow, updateShow, deleteShow
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Auth shield for all admin subroutes
router.use(protect);
router.use(adminOnly);

// Stats & Bookings
router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);

// Theater Endpoints
router.get('/theaters', getTheaters);
router.post('/theaters', createTheater);
router.put('/theaters/:id', updateTheater);
router.delete('/theaters/:id', deleteTheater);

// Movie Endpoints
router.post('/movies', createMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

// Show Endpoints
router.get('/shows', getAllShows);
router.post('/shows', createShow);
router.put('/shows/:id', updateShow);
router.delete('/shows/:id', deleteShow);

module.exports = router;
