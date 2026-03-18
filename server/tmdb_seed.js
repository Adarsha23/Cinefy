// /server/tmdb_seed.js
// fetch the now playing movies from tmdb and save them to the database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const TMDB_TOKEN = process.env.TMDB_API_KEY;

async function seedFromTMDB() {
  console.log('Fetching movies from TMDB...');

  // 1. Call TMDB "Now Playing" endpoint
  const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('TMDB API call failed:', response.status, response.statusText);
    process.exit(1);
  }

  const data = await response.json();
  const movies = data.results.slice(0, 15); // Grab first 15 movies

  console.log(`Got ${movies.length} movies. Fetching full details...`);

  // 2. Clear old mock movies first
  await prisma.movie.deleteMany({});
  console.log('Cleared old movies.');

  // 3. For each movie, get full details (including runtime + genres)
  for (const m of movies) {
    const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${m.id}`, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const detail = await detailRes.json();

    const genre = detail.genres?.map(g => g.name).join('/') || 'General';
    const posterUrl = `https://image.tmdb.org/t/p/w500${detail.poster_path}`;
    const backdropUrl = detail.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${detail.backdrop_path}` // Wide 16:9 image for hero
      : posterUrl;

    await prisma.movie.create({
      data: {
        title: detail.title,
        description: detail.overview || 'No description available.',
        duration: detail.runtime || 120,
        genre: genre,
        posterUrl: posterUrl,
        backdropUrl: backdropUrl,
        releaseDate: new Date(detail.release_date),
      },
    });

    console.log(`Saved: ${detail.title}`);
  }

  console.log('\nAll movies saved to your database!');
  await prisma.$disconnect();
}

seedFromTMDB().catch((err) => {
  console.error('Error:', err);
  prisma.$disconnect();
  process.exit(1);
});
