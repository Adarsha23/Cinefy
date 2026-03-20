// /server/promote_admin.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const emailToPromote = 'prasaiadarsha@gmail.com';

async function promote() {
  console.log(`Promoting ${emailToPromote} to ADMIN Status... 🏛️`);

  try {
    const user = await prisma.user.update({
      where: { email: emailToPromote },
      data: { role: 'ADMIN' }
    });

    console.log(`\n✅ Success! ${user.name} is now an ADMIN! 🥂`);
    console.log("Logout and Log Back In to see the Admin Dashboard. 🎬");
  } catch (error) {
    console.error("Error promoting user:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

promote();
