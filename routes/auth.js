const express = require('express');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/authentication/auth');
const User = require('../models/User');
const validator = require('../middlewares/validations/login');

const router = express.Router();

// Route:::   POST api/auth
// Desc:::    Authenticate user and get token
// Access:::  Private
router.get('/', auth, async (req, res) => {
  await User.findById(req.user.id)
    .select('-password')
    .then(user => {
      res.json(user);
    });
});

// Route:::   POST api/auth/login
// Desc:::    Login user and generate token
// Access:::  Public
router.post('/login', validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: '3h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
