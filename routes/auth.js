const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersPath = path.join(__dirname, '..', 'users.json');

// Helper: Read all users
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersPath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error("Error reading users file:", err);
    return [];
  }
};

// Helper: Write users back to file
const writeUsers = (data) => {
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
 return res.status(200).json({
      success: true,
      message: 'working'
    });
});

// ✅ Signup API (name + phone)
router.post('/signup', (req, res) => {
  const { first_name, last_name, email, phone, gender, dob, country } = req.body;

  if (!first_name || !last_name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Required fields: first_name, last_name, email, phone'
    });
  }

  let users = readUsers();

  // check if user already exists by email or phone
  const existing = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() || u.phone === phone
  );

  if (existing) {
    return res.status(400).json({ success: false, message: 'User already registered!' });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    first_name,
    last_name,
    email,
    phone,
    gender: gender || '',
    dob: dob || '',
    country: country || '',
  };

  users.push(newUser);
  writeUsers(users);

  return res.status(201).json({
    success: true,
    message: 'Signup successful! Please login now.',
    user: newUser
  });
});


// ✅ Login API (name + phone)
router.post('/login', (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Both name and phone are required.'
    });
  }

  const users = readUsers();
  const foundUser = users.find(
    u => u.first_name.toLowerCase() === name.toLowerCase() && u.phone === phone
  );

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found. Please sign up first.'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Login successful!',
    user: foundUser
  });
});

module.exports = router;
