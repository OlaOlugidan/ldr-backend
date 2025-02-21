// controllers/eventController.js

// In-memory arrays for demonstration (replace with your DB logic)
const events = [];
const registrations = [];

exports.createEvent = (req, res) => {
  const { name, date, location, description } = req.body;

  // Validate required event fields
  if (!name || !date || !location) {
    return res.status(400).json({ message: 'Missing required event fields.' });
  }

  // Check for duplicate event (e.g., same name and date)
  const duplicate = events.find(event => event.name === name && event.date === date);
  if (duplicate) {
    return res.status(409).json({ message: 'Event already exists.' });
  }

  const event = {
    id: events.length + 1,
    name,
    date,
    location,
    description,
    createdAt: new Date(),
  };
  events.push(event);
  res.status(201).json({ message: 'Event created successfully.', event });
};

exports.registerEvent = (req, res) => {
  const { eventId } = req.params;
  const { userId, proof } = req.body;

  // Validate input
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required for registration.' });
  }

  // Ensure the event exists
  const event = events.find(e => e.id === parseInt(eventId));
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  // Prevent duplicate registrations
  const alreadyRegistered = registrations.find(r => r.eventId === parseInt(eventId) && r.userId === userId);
  if (alreadyRegistered) {
    return res.status(409).json({ message: 'User already registered for this event.' });
  }

  const registration = {
    id: registrations.length + 1,
    eventId: parseInt(eventId),
    userId,
    proof, // Could be a URL or file path to proof of attendance
    status: 'pending', // For optional admin verification
    createdAt: new Date(),
  };
  registrations.push(registration);
  res.status(201).json({ message: 'Registered for event successfully.', registration });
};

exports.getEventRegistrations = (req, res) => {
  const { eventId } = req.params;
  const eventRegs = registrations.filter(r => r.eventId === parseInt(eventId));
  res.json({ registrations: eventRegs });
};
