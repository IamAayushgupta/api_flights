// routes/users.js
const express = require('express');
const router = express.Router();
const users = require('../users.json'); // load local mock data

// GET all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET single user by id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

module.exports = router;
