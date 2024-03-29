"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validator = [
    express_validator_1.check('email', 'Please include a valid email').isEmail(),
    express_validator_1.check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];
exports.default = validator;
