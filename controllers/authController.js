// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// For demo purposes, we'll use an in-memory array to simulate a database.
// In production, replace this with actual DB queries.
const users = [];

// Helper to generate tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // short-lived access token
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // long-lived refresh token
  );
};

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    // Check if user already exists (in a real DB query)
    const userExists = users.find((u) => u.username === username);
    if (userExists) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash the password with bcrypt (using 10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, password: hashedPassword, role };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required.' });
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }
    // Reissue a new access token
    const newAccessToken = generateAccessToken(userData);
    res.json({ accessToken: newAccessToken });
  });
};
