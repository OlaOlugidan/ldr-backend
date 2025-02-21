// routes/apiRoutes.js
const express = require('express');
const router = express.Router();

const milestoneController = require('../controllers/milestoneController');
const eventController = require('../controllers/eventController');

// Authentication & RBAC middleware (assume these are implemented)
const authenticateJWT = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/roleMiddleware');

// Milestone Endpoints
// Members log milestones
router.post('/milestones', authenticateJWT, (req, res) => {
  // Optionally, you could enforce member role here
  milestoneController.logMilestone(req, res);
});

// Admin review and approval of milestones
router.get('/milestones/review', authenticateJWT, checkRole(['Super Admin', 'Org Admin']), milestoneController.getMilestonesForReview);
router.put('/milestones/:id/approve', authenticateJWT, checkRole(['Super Admin', 'Org Admin']), milestoneController.approveMilestone);

// Event Endpoints
// Admin creates events
router.post('/events', authenticateJWT, checkRole(['Super Admin', 'Org Admin']), eventController.createEvent);

// Members register for events
router.post('/events/:eventId/register', authenticateJWT, checkRole(['Member']), eventController.registerEvent);

// Admin reviews event registrations
router.get('/events/:eventId/registrations', authenticateJWT, checkRole(['Super Admin', 'Org Admin']), eventController.getEventRegistrations);

module.exports = router;
