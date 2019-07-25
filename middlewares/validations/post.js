const { check } = require('express-validator');

module.exports = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];
