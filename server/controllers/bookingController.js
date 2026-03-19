const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Create a new booking (POST /api/bookings)
const createBooking = async (req, res) => {
  try {
    const { showId, seats, totalPrice } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create the booking entry
    const booking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        showId: parseInt(showId),
        seats,
        totalPrice: parseFloat(totalPrice),
        status: "CONFIRMED"
      }
    });

    res.status(201).json({
      message: "Booking confirmed!",
      booking
    });
  } catch (error) {
    console.error("CRITICAL BOOKING ERROR:", error);
    res.status(500).json({ message: "Booking failed.", error: error.message });
  }
};

// 2. Get all bookings for a user (GET /api/bookings/me)
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        show: {
          include: {
            movie: true,
            theater: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

module.exports = { createBooking, getUserBookings };
