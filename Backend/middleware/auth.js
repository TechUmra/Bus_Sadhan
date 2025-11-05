const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key_here';  // Keep in env for production

module.exports = (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization');

  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach user info to request
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};