const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Bus', busSchema);