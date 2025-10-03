// routes/flights.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', 'flights.json');

function loadFlights() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load flights.json:', e.message);
    return [];
  }
}

// GET /flights
router.get('/', (req, res) => {
  const flights = loadFlights();
  res.json({ meta: { total: flights.length }, data: flights });
});

// GET /flights/search?from=DEL&to=BOM&date=YYYY-MM-DD
router.get('/search', (req, res) => {
  const flights = loadFlights();
  const { from, to, date } = req.query;
  if (!from || !to || !date) return res.status(400).json({ error: 'from, to and date required' });
  const results = flights.filter(f => f.from === from && f.to === to && f.departure_time.startsWith(date));
  res.json({ meta: { count: results.length }, data: results });
});

// GET /flights/:id
router.get('/:id', (req, res) => {
  const flights = loadFlights();
  const f = flights.find(x => String(x.id) === String(req.params.id));
  if (!f) return res.status(404).json({ error: 'Flight not found' });
  res.json(f);
});

module.exports = router;
