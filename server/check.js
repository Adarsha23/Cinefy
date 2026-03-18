// /server/check.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.movie.count();
  const movies = await prisma.movie.findMany();
  
  console.log(`Total Movies: ${count}`);
  movies.forEach(m => console.log(`- ${m.title}`));
  
  await prisma.$disconnect();
}

check();
