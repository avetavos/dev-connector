"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validator = [
    express_validator_1.check('status', 'Status is required')
        .not()
        .isEmpty(),
    express_validator_1.check('skills', 'Skills in required')
        .not()
        .isEmpty()
];
exports.default = validator;
