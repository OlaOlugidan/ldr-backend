// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Enable CORS for all origins BEFORE any route definitions
app.use(cors({
  origin: "*", // Allow all domains (for development)
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Parse JSON bodies
app.use(express.json());

// Logging HTTP requests
app.use(morgan('combined'));

// Test route to check API
app.get("/api/test", (req, res) => {
  res.json({ message: "Test API is working!" });
});

// (Optional) Comment out external test routes temporarily for debugging
// const testRoutes = require('./routes/test');
// app.use('/api', testRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

// Error handling middleware should be last
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
