const express = require('express');
const router = express.Router();
const { createReservation, cancelReservation, listReservations } = require('../controllers/reservationController');
const { validateReservationInput } = require('../middleware/validateRequest');

router.post('/', validateReservationInput, createReservation);

router.delete('/:reservationId', cancelReservation);

router.get('/', listReservations);

module.exports = router;
