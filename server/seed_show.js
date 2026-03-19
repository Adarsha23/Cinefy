// /server/seed_show.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Dynamic Theaters and Showtimes for the next 5 days...");

  // 1. Delete existing data to avoid duplicates (Clear Bookings first!)
  await prisma.booking.deleteMany(); 
  await prisma.show.deleteMany();
  await prisma.theater.deleteMany();

  // 2. Create Theaters
  const theatersData = [
    { name: 'Cinefy IMAX Hall', location: 'Kathmandu', totalHalls: 5 },
    { name: 'Prime Elite 4D', location: 'Lalitpur', totalHalls: 3 },
    { name: 'Classic Cinema Box', location: 'Pokhara', totalHalls: 2 },
  ];

  const theaters = [];
  for (const t of theatersData) {
    const created = await prisma.theater.create({ data: t });
    theaters.push(created);
  }

  const movies = await prisma.movie.findMany();
  if (movies.length === 0) {
    console.log("No movies found! Run node tmdb_seed.js first.");
    return;
  }

  // 3. Helper for Dynamic Pricing (Matches Rates Page)
  const getPrice = (date) => {
    const day = date.getDay();
    if (day === 2 || day === 3) return 200; // Tue, Wed
    if (day === 1 || day === 4) return 350; // Mon, Thu
    return 400; // Fri, Sat, Sun
  };

  // 4. Generate shows for the NEXT 5 DAYS
  for (let i = 0; i < 5; i++) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);
    currentDate.setHours(0, 0, 0, 0);

    const showTimes = [11, 14, 17, 21]; // 11 AM, 2 PM, 5 PM, 9 PM

    for (const movie of movies) { 
      for (const theater of theaters) {
        for (const hour of showTimes) {
          const startTime = new Date(currentDate);
          startTime.setHours(hour, 0, 0, 0);

          await prisma.show.create({
            data: {
              movieId: movie.id,
              theaterId: theater.id,
              startTime: startTime,
              ticketPrice: getPrice(startTime), 
            }
          });
        }
      }
      console.log(`Scheduled shows for [${movie.title}] on ${currentDate.toDateString()}`);
    }
  }

  console.log("\n✅ Successfully seeded dynamic shows with accurate pricing! 🍿🚀");
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
