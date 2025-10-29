function validateReservationInput(req, res, next) {
  const { partnerId, seats } = req.body;
  if (!partnerId || typeof partnerId !== 'string') {
    return res.status(400).json({ error: 'partnerId is required (string)' });
  }
  if (!Number.isInteger(seats)) {
    return res.status(400).json({ error: 'seats must be integer' });
  }
  if (seats <= 0 || seats > 10) {
    return res.status(400).json({ error: 'seats must be between 1 and 10' });
  }
  next();
}

module.exports = { validateReservationInput };
