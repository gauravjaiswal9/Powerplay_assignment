const Event = require('../models/Event');

async function seedEvent(eventIdFromEnv) {
  const existing = await Event.findOne({ eventId: eventIdFromEnv });
  if (existing) {
    console.log('Event already seeded:', eventIdFromEnv);
    return existing;
  }

  const event = new Event({
    eventId: eventIdFromEnv,
    name: 'Node.js Meet-up',
    totalSeats: 500,
    availableSeats: 500,
    version: 0
  });

  await event.save();
  console.log('Seeded event:', eventIdFromEnv);
  return event;
}

module.exports = { seedEvent };
