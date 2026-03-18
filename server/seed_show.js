// /server/seed_show.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Theaters and Showtimes...");

  // 1. Create some Theaters (Adding totalHalls)
  const theaters = await Promise.all([
    prisma.theater.create({ data: { name: 'Cinefy IMAX Hall', location: 'Kathmandu', totalHalls: 5 } }),
    prisma.theater.create({ data: { name: 'Prime Elite 4D', location: 'Lalitpur', totalHalls: 3 } }),
    prisma.theater.create({ data: { name: 'Classic Cinema Box', location: 'Pokhara', totalHalls: 2 } }),
  ]);

  const movies = await prisma.movie.findMany();
  
  if (movies.length === 0) {
    console.log("No movies found! Run node tmdb_seed.js first.");
    return;
  }

  // 2. Create Shows for each movie
  for (const movie of movies) {
    for (const theater of theaters) {
      // Create a few shows for each movie in each theater for March 20th
      const times = ['2026-03-20T11:00:00Z', '2026-03-20T14:30:00Z', '2026-03-20T17:30:00Z', '2026-03-20T21:00:00Z'];
      
      for (const time of times) {
        await prisma.show.create({
          data: {
            movieId: movie.id,
            theaterId: theater.id,
            startTime: new Date(time),
            ticketPrice: 15.0, 
          }
        });
      }
    }
    console.log(`Scheduled shows for: ${movie.title}`);
  }

  console.log("\nSuccessfully seeded real shows! 🍿🚀");
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
