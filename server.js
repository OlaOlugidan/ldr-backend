// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware Configuration
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable CORS for all origins
app.use(morgan('combined')); // Logging HTTP requests

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Load API routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Payment Routes
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

// server.js (after routes)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully!" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
