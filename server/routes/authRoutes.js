// /server/routes/authRoutes.js

const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// When someone sends a POST request to this router, run 'registerUser'
router.post('/register', registerUser);
router.post('/login', loginUser)

module.exports = router;
