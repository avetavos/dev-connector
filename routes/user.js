const express = require('express');
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const validator = require('../middlewares/validations/user');
const User = require('../models/User');

const router = express.Router();

// Route:::   POST api/user/register
// Desc:::    Register new user
// Access:::  Public
router.post('/register', validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  await User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
  });
  try {
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });
    const user = new User({
      name,
      email,
      password,
      avatar
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
