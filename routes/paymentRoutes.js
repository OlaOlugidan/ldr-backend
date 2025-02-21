// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const bodyParser = require('body-parser');

// Endpoint for initiating a subscription session
router.post('/create-session', paymentController.createSubscriptionSession);

// Stripe webhook endpoint must use the raw body parser for signature verification
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

module.exports = router;
