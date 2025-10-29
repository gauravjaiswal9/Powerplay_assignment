const express = require('express');
const router = express.Router();
const { getEventSummary } = require('../controllers/eventController');

router.get('/:eventId', getEventSummary);

module.exports = router;
