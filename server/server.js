
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware (Think of these as "filters" the request passes through)
app.use(cors()); // Allows frontend to talk to this server
app.use(express.json()); // Allows the server to understand JSON data sent in requests

// Create a "Health Check" route
//test if the server is alive.
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Cinefy Backend is running!' 
  });
});

// Define the Port and Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
