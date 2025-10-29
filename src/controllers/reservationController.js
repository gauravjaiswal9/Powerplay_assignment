const { v4: uuidv4 } = require('uuid');
const Event = require('../models/Event');
const Reservation = require('../models/Reservation');

async function optimisticUpdateSeats(eventId, delta, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const event = await Event.findOne({ eventId });
    if (!event) return { error: 'Event not found', status: 404 };

    if (delta < 0 && event.availableSeats < Math.abs(delta)) {
      return { error: 'Not enough seats left', status: 409 };
    }

    const filter = {
      eventId,
      version: event.version
    };

    const updated = await Event.findOneAndUpdate(
      filter,
      { $inc: { availableSeats: delta, version: 1 } },
      { new: true }
    );

    if (updated) {
      return { event: updated };
    }

  }
  return { 
    error: 'Could not update seats due to concurrent updates', status: 409 
  };
}


async function createReservation(req, res, next) {
  try {
    const { partnerId, seats } = req.body;
    const eventId = process.env.EVENT_ID;

    const result = await optimisticUpdateSeats(eventId, -seats);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }

    const reservationId = uuidv4();
    const reservation = new Reservation({
      reservationId,
      partnerId,
      seats,
      status: 'confirmed',
      eventId
    });
    await reservation.save();

    return res.status(201).json({
      reservationId,
      seats,
      status: 'confirmed'
    });
  } catch (err) {
    next(err);
  }
}


async function cancelReservation(req, res, next) {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findOne({ reservationId });

    if (!reservation || reservation.status === 'cancelled') {
      return res.status(404).json({ 
        error: 'Reservation not found or already cancelled' 
      });
    }

    const eventId = reservation.eventId;
    const seatsToRelease = reservation.seats;

    const result = await optimisticUpdateSeats(eventId, +seatsToRelease);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}


async function listReservations(req, res, next) {
  try {
    const reservations = await Reservation.find().select('-_id reservationId partnerId seats status createdAt updatedAt eventId');
    res.json(reservations);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReservation,
  cancelReservation,
  listReservations
};
