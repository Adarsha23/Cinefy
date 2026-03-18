// /server/check.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const movies = await prisma.movie.findMany();
  console.log("Current Movies in Database:");
  movies.forEach(m => {
    console.log(`ID: ${m.id} | Title: ${m.title}`);
  });
  await prisma.$disconnect();
}
check();
