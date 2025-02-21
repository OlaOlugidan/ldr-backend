// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Expected format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
      }
      req.user = user; // Attach user info (id and role) to the request
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header missing.' });
  }
};

module.exports = authenticateJWT;
