const Event = require('../models/Event');
const Reservation = require('../models/Reservation');

async function getEventSummary(req, res, next) {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const reservationCount = await Reservation.countDocuments({ eventId, status: 'confirmed' });

    res.json({
      eventId: event.eventId,
      name: event.name,
      totalSeats: event.totalSeats,
      availableSeats: event.availableSeats,
      reservationCount,
      version: event.version
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEventSummary };
