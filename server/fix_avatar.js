// /server/fix_avatar.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  // 1. Batman
  await prisma.movie.updateMany({
    where: { title: "The Batman" },
    data: { posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500" }
  });

  // 2. Dune
  await prisma.movie.updateMany({
    where: { title: "Dune" },
    data: { posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500" }
  });

  // 3. Avatar
  await prisma.movie.updateMany({
    where: { title: "Avatar: The Way of Water" },
    data: { posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500" }
  });

  console.log("All posters updated with working Unsplash images!");
  await prisma.$disconnect();
}

fix();
