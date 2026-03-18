// /server/controllers/authController.js

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // instance of prisma client

// The Register Function
const registerUser = async (req, res) => {
  try {
    // 1. Grab the info the user sent in the request body
    const { name, email, password } = req.body;

    // 2. Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 3.hash the passwords 10 times
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new user in  database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    res.status(201).json({ 
      message: "User registered successfully!", 
        user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    });

  } catch (error) {
    console.error("Error in registration: ", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
const jwt = require('jsonwebtoken');

// The Login Function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Check if the password matches the hash!
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Create the JWT
    // We put their 'id' and 'role' inside the token so we know who they are later
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Send the token back to the frontend
    res.json({
      message: "Login successful!",
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("Error in login: ", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


module.exports = { registerUser, loginUser };
