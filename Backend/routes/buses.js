const express = require('express');
const Bus = require('../models/Bus');

const router = express.Router();

// Get all buses (used in rendering)
router.get('/', async (req, res) => {
  const buses = await Bus.find();
  res.json(buses);
});

// Add a bus (for testing via API)
router.post('/', async (req, res) => {
  const bus = new Bus(req.body);
  await bus.save();
  res.json(bus);
});

module.exports = router;