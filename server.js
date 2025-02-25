// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware Configuration
app.use(express.json()); // Parse JSON bodies       // Enable CORS for all origins

//Test route to check API
app.get("/api/test", (req, res) => {
  res.json({ message: "Test API is working!" });
});


app.use(cors({
  origin: "*", // Allow all domains (for development)
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(morgan('combined')); // Logging HTTP requests

// Routes

const testRoutes = require('./routes/test'); // adjust path as needed
app.use('/api', testRoutes);


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



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
