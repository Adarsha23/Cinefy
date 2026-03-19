const express = require('express');
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Create a booking (Protected route)
router.post('/', protect, createBooking);

// 2. Get user's own bookings
router.get('/me', protect, getUserBookings);

module.exports = router;
