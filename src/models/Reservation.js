const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  reservationId: { type: String, required: true, unique: true },
  partnerId: { type: String, required: true },
  seats: { type: Number, required: true },
  status: { type: String, enum: ['confirmed','cancelled'], default: 'confirmed' },
  eventId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
