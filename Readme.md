# 🎟️ PowerPlay Assignment – TicketBoss API + Frontend

A simple **event ticket reservation system** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
It supports **event creation, seat reservations, cancellations**, and **concurrency-safe updates** through optimistic locking.

---

## 🌍 Live Link  

- **Backend (Render):** [Backend](https://powerplay-assignment.onrender.com)  

---
## 📦 Project Structure

```
PowerPlay Assignment/
│
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── eventController.js
│   │   │   └── reservationController.js
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   └── Reservation.js
│   │   ├── routes/
│   │   │   ├── events.js
│   │   │   └── reservations.js
│   │   ├── utils/
│   │   │   └── dbSeed.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│
└── Frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── api.js
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Setup Instructions

### 🧩 Prerequisites
- Node.js (v18+)
- MongoDB running locally (`mongodb://127.0.0.1:27017/`)

---

### 🛠 Backend Setup

1. Navigate to backend:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=4000
   MONGO_URI=mongodb://127.0.0.1:27017/ticketboss
   EVENT_ID=node-meetup-2025
   ```

4. Start backend:
   ```bash
   npm run dev
   ```

5. On first startup, it seeds the event automatically:
   ```json
   {
     "eventId": "node-meetup-2025",
     "name": "Node.js Meet-up",
     "totalSeats": 500,
     "availableSeats": 500,
     "version": 0
   }
   ```

---

### 💻 Frontend Setup

1. Navigate to frontend:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

4. Open:
   ```
   http://localhost:5173
   ```

---

## 🧭 API Documentation (with examples)

**Base URL:** `http://localhost:4000`

---

### 1) GET `/` — Event summary (root)

**Description:** Returns the seeded event summary with live seat availability and reservation count.

**Curl**
```bash
curl http://localhost:4000/
```

**Response (example)**
```json
{
  "eventId": "node-meetup-2025",
  "name": "Node.js Meet-up",
  "totalSeats": 500,
  "availableSeats": 496,
  "reservationCount": 4,
  "version": 4
}
```

---

### 2) GET `/events/:eventId` — Event detail by ID

**Description:** Fetch event summary by eventId.

**Curl**
```bash
curl http://localhost:4000/events/node-meetup-2025
```

**Response (example)**
```json
{
  "eventId": "node-meetup-2025",
  "name": "Node.js Meet-up",
  "totalSeats": 500,
  "availableSeats": 496,
  "version": 4
}
```

---

### 3) GET `/reservations` — List all reservations

**Description:** Returns an array of all reservations (both confirmed and cancelled).

**Curl**
```bash
curl http://localhost:4000/reservations
```

**Response (example)**
```json
[
  {
    "reservationId": "654820bc-307e-4cee-9976-3472133a371f",
    "partnerId": "abc-company",
    "seats": 3,
    "status": "cancelled",
    "eventId": "node-meetup-2025",
    "createdAt": "2025-10-28T14:40:02.844Z",
    "updatedAt": "2025-10-28T14:42:34.248Z"
  },
  {
    "reservationId": "48f0704e-9d71-47bb-bbd3-8d931d5d1ab3",
    "partnerId": "gaurav",
    "seats": 2,
    "status": "confirmed",
    "eventId": "node-meetup-2025",
    "createdAt": "2025-10-28T20:06:06.672Z",
    "updatedAt": "2025-10-28T20:06:06.672Z"
  },
  {
    "reservationId": "719cc4c2-ec8f-4e1c-9fc6-f2a0e053348a",
    "partnerId": "anaand",
    "seats": 2,
    "status": "confirmed",
    "eventId": "node-meetup-2025",
    "createdAt": "2025-10-29T06:39:38.803Z",
    "updatedAt": "2025-10-29T06:39:38.803Z"
  }
]
```

---

### 4) POST `/reservations` — Create a reservation

**Description:** Reserve a number of seats (1–10) for a partner. Decreases `availableSeats` on success.

**Curl**
```bash
curl -X POST http://localhost:4000/reservations   -H "Content-Type: application/json"   -d '{"partnerId":"vikas","seats":3}'
```

**Request body example**
```json
{
  "partnerId": "vikas",
  "seats": 3
}
```

**Response (example)**
```json
{
  "reservationId": "5e163948-cae5-46e0-8b9e-a42f755426e7",
  "seats": 3,
  "status": "confirmed"
}
```

**Possible errors**
- `400 Bad Request` — missing or invalid `partnerId` or `seats`
- `409 Conflict` — not enough seats available (or version conflict if concurrent)

---

### 5) DELETE `/reservations/:reservationId` — Cancel a reservation

**Description:** Cancel an existing reservation by ID. Returns `204 No Content` on success and returns seats back to `availableSeats`.

**Curl**
```bash
curl -X DELETE http://localhost:4000/reservations/5e163948-cae5-46e0-8b9e-a42f755426e7
```

**Response**
- `204 No Content` — success (no response body)

**After cancellation**
- The reservation's `status` becomes `"cancelled"`.
- `availableSeats` increases by the reservation's `seats`.

---

## 🧠 Technical Decisions

- **Backend:** Built using **Node.js** and **Express.js** to handle RESTful APIs with a modular architecture (routes, controllers, models, and middleware separated for scalability).  

- **Database:** **MongoDB** is used to store both event and reservation data. It provides flexibility in schema design and supports atomic updates using operators like `$inc`, which are crucial for concurrency-safe seat management.

- **Frontend:** A minimal **React (Vite)** interface is implemented to visualize event details, reservations, and real-time seat updates. It uses **Axios** to interact with backend APIs.

- **Concurrency:**  
  Implemented **Optimistic Locking** using a `version` field in the `Event` model.  
  Each document includes a `version` counter that increments on every successful update.  
  When a seat reservation or cancellation is made:
  1. The current event is fetched with its `version`.
  2. The update query includes a `version` match condition.  
  3. The database performs:  
     ```js
     { $inc: { availableSeats: delta, version: 1 } }
     ```  
  4. If the version has changed (another user updated it concurrently), the update fails gracefully — preventing **race conditions** and **overbooking**.
  
  This approach ensures **data integrity**, **atomicity**, and **safe concurrent seat updates** even under high parallel API requests.

- **IDs:** Each reservation is identified using **UUID v4**, ensuring globally unique IDs across systems — avoiding collisions even when multiple users create reservations simultaneously.

---

## ✅ Assumptions

- Single event managed via `EVENT_ID` environment variable.
- No authentication — APIs are public for simplicity.
- Reservations are small; pagination not implemented for listing.

---

## 🚀 Scripts

### Backend (in `Backend/`)
```bash
npm run dev    # start with nodemon
npm start      # production start
```

### Frontend (in `Frontend/`)
```bash
npm run dev    # start Vite dev server
npm run build  # build for production
```

---

## ✨ Author
**Gaurav Kumar Jaiswal**  
B.Tech, Electronics and Communication Engineering  
Indian Institute of Information Technology, Nagpur 
