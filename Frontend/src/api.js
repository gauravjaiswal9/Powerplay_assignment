import axios from "axios";

const API_BASE = "http://localhost:4000";

export const getEvent = async () => {
  const res = await axios.get(`${API_BASE}/events/node-meetup-2025`);
  return res.data;
};

export const getReservations = async () => {
  const res = await axios.get(`${API_BASE}/reservations`);
  return res.data;
};

export const createReservation = async (partnerId, seats) => {
  const res = await axios.post(`${API_BASE}/reservations`, { partnerId, seats });
  return res.data;
};

export const cancelReservation = async (reservationId) => {
  await axios.delete(`${API_BASE}/reservations/${reservationId}`);
};
