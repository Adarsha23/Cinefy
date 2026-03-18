// /server/mock.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.movie.createMany({
    data: [
      {
        title: "The Batman",
        description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
        duration: 176,
        genre: "Action/Crime",
        posterUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onun.jpg",
        releaseDate: new Date("2022-03-04")
      },
      {
        title: "Dune",
        description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.",
        duration: 155,
        genre: "Sci-Fi/Adventure",
        posterUrl: "https://image.tmdb.org/t/p/w500/d5N0ZarWpYvWp1TgZqcC9PqQZ3.jpg",
        releaseDate: new Date("2021-10-22")
      },
      {
        title: "Avatar: The Way of Water",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
        duration: 192,
        genre: "Sci-Fi/Action",
        posterUrl: "https://image.tmdb.org/t/p/w500/t6Sna4v9S6JSdp3beC9v9uOqq9v.jpg",
        releaseDate: new Date("2022-12-16")
      }
    ]
  });
  console.log("Database Seeded Successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
