import { useEffect, useState } from "react";
import {
  getEvent,
  getReservations,
  createReservation,
  cancelReservation,
} from "./api";
import "./App.css";

function App() {
  const [event, setEvent] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [partnerId, setPartnerId] = useState("");
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const e = await getEvent();
      const r = await getReservations();
      setEvent(e);
      setReservations(r);
    } catch (err) {
      setError("Failed to load data. Check backend connection.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!partnerId || seats < 1) return alert("Enter valid details!");
    try {
      setLoading(true);
      await createReservation(partnerId, Number(seats));
      setPartnerId("");
      setSeats(1);
      await fetchData();
      alert("Reservation created successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Error creating reservation");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id);
      await fetchData();
      alert("Reservation cancelled!");
    } catch (err) {
      alert(err.response?.data?.error || "Error cancelling reservation");
    }
  };

  if (!event) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>🎟️ PowerPlay TicketBoss</h1>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <h2>{event.name}</h2>
        <p><b>Event ID:</b> {event.eventId}</p>
        <p><b>Total Seats:</b> {event.totalSeats}</p>
        <p><b>Available Seats:</b> {event.availableSeats}</p>
        <p><b>Version:</b> {event.version}</p>
      </div>

      <div className="card">
        <h3>Create Reservation</h3>
        <input
          type="text"
          placeholder="Partner ID"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="10"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />
        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Processing..." : "Reserve Seats"}
        </button>
      </div>

      <div className="card">
        <h3>All Reservations</h3>
        {reservations.length === 0 ? (
          <p>No reservations yet.</p>
        ) : (
          <ul>
            {reservations.map((r) => (
              <li key={r.reservationId}>
                <span>
                  <b>{r.partnerId}</b> — {r.seats} seats — {r.status}
                </span>
                {r.status === "confirmed" && (
                  <button
                    className="cancel"
                    onClick={() => handleCancel(r.reservationId)}
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
