const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  version: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
