// index.js
const express = require('express');
const path = require('path');
//const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// ----- Middleware -----
//app.use(cors()); // allow cross-origin requests (useful for Flutter/web)
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// simple request logger (dev)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

// ----- Routes -----
// if you put routes in ./routes/users.js and ./routes/flights.js
// ensure they export an Express router (module.exports = router)
const usersRouter = require('./routes/users');   // expects routes/users.js
const flightsRouter = require('./routes/flights'); // expects routes/flights.js
const bookingsRouter = (() => {
  try {
    return require('./routes/bookings'); // optional if you create it later
  } catch (e) {
    return null;
  }
})();

// mount routes
app.use('/users', usersRouter);       // e.g. GET /users and GET /users/:id
app.use('/flights', flightsRouter);   // e.g. GET /flights, /flights/search, /flights/:id
if (bookingsRouter) app.use('/bookings', bookingsRouter);

// ----- Health check & root -----
app.get('/', (req, res) => {
  res.send({
    status: 'ok',
    message: 'Flight mock API running',
    endpoints: [
      '/users',
      '/users/:id',
      '/flights',
      '/flights/search',
      '/flights/:id',
      '/bookings (if implemented)'
    ]
  });
});

// ----- 404 handler -----
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ----- error handler -----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ----- start server -----
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
