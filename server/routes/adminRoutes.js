const express = require('express');
const { getAdminStats, getAllBookings, createMovie, createTheater, createShow } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// 🏰 MAIN DASHBOARD ENDPOINTS
router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/bookings', protect, adminOnly, getAllBookings);

// 🏛️ CREATION ENDPOINTS (Admin Only)
router.post('/movies', protect, adminOnly, createMovie);
router.post('/theaters', protect, adminOnly, createTheater);
router.post('/shows', protect, adminOnly, createShow);

module.exports = router;
