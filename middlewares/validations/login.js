const { check } = require('express-validator');

module.exports = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
];
