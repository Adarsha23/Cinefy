
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

app.use(cors()); // Allow frontend to talk to this server
app.use(express.json()); // Allow the server to understand JSON data sent in requests

// Import our Auth Routes
const authRoutes = require('./routes/authRoutes');
// Mount them on the '/api/auth' path
app.use('/api/auth', authRoutes);

//test if the server is alive.
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Cinefy Backend is running!' 
  });
});
const movieRoutes = require('./routes/movieRoutes');
app.use('/api/movies', movieRoutes);


// Define the Port and Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
