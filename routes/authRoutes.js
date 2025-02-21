// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Public endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// Example of a protected route (only accessible to Super Admin and Org Admin)
router.get('/admin-data', authenticateJWT, checkRole(['Super Admin', 'Org Admin']), (req, res) => {
  res.json({ message: 'This is protected admin data.' });
});

module.exports = router;
