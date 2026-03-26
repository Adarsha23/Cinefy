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

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET || "fallback_refresh_secret",
    { expiresIn: '7d' } // Long-lived
  );

  return { accessToken, refreshToken };
};

// The Login Function
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Set refreshToken in secure HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful!",
      token: accessToken, // Frontend uses accessToken for authorization
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login Check Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Refresh Token Handler
const refreshToken = async (req, res) => {
  try {
    const rfToken = req.cookies.refreshToken;
    if (!rfToken) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(rfToken, process.env.REFRESH_SECRET || "fallback_refresh_secret");
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(401).json({ message: "User not found" });

    const { accessToken } = generateTokens(user);
    res.json({ token: accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: "Logout successful" });
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser };
