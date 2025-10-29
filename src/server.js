require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./config/db');
const reservationsRouter = require('./routes/reservations');
const eventsRouter = require('./routes/events');
const errorHandler = require('./utils/errorHandler');
const { seedEvent } = require('./utils/dbSeed');
const Event = require('./models/Event');

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const EVENT_ID = process.env.EVENT_ID;

async function start() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set. See .env');
    process.exit(1);
  }

  await connect(MONGO_URI);

  await seedEvent(EVENT_ID);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/reservations', reservationsRouter);
  app.use('/events', eventsRouter);

  app.get('/', async (req, res) => {
  try {
      const event = await Event.findOne();
      if (!event) {
        return res.status(404).json({ error: 'No event found' });
      }

      const reservationCount = event.totalSeats - event.availableSeats;

      res.json({
        eventId: event.eventId,
        name: event.name,
        totalSeats: event.totalSeats,
        availableSeats: event.availableSeats,
        reservationCount,
        version: event.version
      });
    } catch (error) {
      console.error('Error fetching event summary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Event id: ${EVENT_ID}`);
  });
}

start().catch(err => {
  console.error('Failed to start server', err);
  process.exit(1);
});
