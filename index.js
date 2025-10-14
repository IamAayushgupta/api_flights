// index.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// ----- Middleware -----
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

// ----- Routes -----
const usersRouter = require('./routes/users');     // optional
const flightsRouter = require('./routes/flights'); // flights API
const authRouter = require('./routes/auth');       // ✅ login/signup routes

let bookingsRouter;
try {
  bookingsRouter = require('./routes/bookings');
} catch (e) {
  bookingsRouter = null;
}

// Mount routes
app.use('/users', usersRouter);
app.use('/flights', flightsRouter);
app.use('/auth', authRouter);        // ✅ new auth route added
if (bookingsRouter) app.use('/bookings', bookingsRouter);

// ----- Root health check -----
app.get('/', (req, res) => {
  res.send({
    status: 'ok',
    message: 'Flight Booking API is running 🚀',
    endpoints: [
      '/auth/signup',
      '/auth/login',
      '/users',
      '/flights',
      '/flights/search',
      '/bookings (if implemented)',
    ],
  });
});

// ----- 404 handler -----
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ----- Error handler -----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ----- Start server -----
app.listen(PORT, () => {
  console.log(`✅ Server started at: http://localhost:${PORT}`);
});
