// controllers/milestoneController.js

// In-memory storage for demonstration (replace with your DB logic)
const milestones = [];

// Define scoring for different activity types
const scoreMapping = {
  eventAttendance: 10,
  mentorship: 5,
  training: 15,
};

exports.logMilestone = (req, res) => {
  const { userId, activityType, description, proof } = req.body;

  // Validate required fields
  if (!userId || !activityType || !description) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Validate activity type against allowed types
  if (!scoreMapping[activityType]) {
    return res.status(400).json({ message: 'Invalid activity type.' });
  }

  // (Optional) Check for duplicate milestone entries here if needed

  // Create the milestone entry
  const milestone = {
    id: milestones.length + 1,
    userId,
    activityType,
    description,
    proof, // URL or file reference, if applicable
    status: 'pending', // Awaiting admin approval
    score: scoreMapping[activityType],
    createdAt: new Date(),
  };

  milestones.push(milestone);
  res.status(201).json({ message: 'Milestone logged successfully.', milestone });
};

exports.getMilestonesForReview = (req, res) => {
  // Admins see only pending milestones
  const pendingMilestones = milestones.filter(m => m.status === 'pending');
  res.json({ milestones: pendingMilestones });
};

exports.approveMilestone = (req, res) => {
  const { id } = req.params;
  const milestone = milestones.find(m => m.id === parseInt(id));
  if (!milestone) {
    return res.status(404).json({ message: 'Milestone not found.' });
  }
  milestone.status = 'approved';
  res.json({ message: 'Milestone approved successfully.', milestone });
};
