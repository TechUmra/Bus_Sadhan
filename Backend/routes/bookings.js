const express = require('express');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization') || req.body.token;
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    req.user = jwt.verify(token, 'secretkey');
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Create booking
router.post('/', verifyToken, async (req, res) => {
  const booking = new Booking({ ...req.body, user: req.user.id });
  await booking.save();
  res.redirect(`/my-bookings?token=${req.body.token}`); // Redirect after booking
});

// Get user bookings (used in rendering)
router.get('/', verifyToken, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('bus');
  res.json(bookings);
});

module.exports = router;
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  // Now, req.user.id is available (from JWT token)
  const booking = new Booking({ ...req.body, user: req.user.id });
  await booking.save();
  res.redirect('/my-bookings');
});
