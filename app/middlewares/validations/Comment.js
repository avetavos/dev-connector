"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validator = [
    express_validator_1.check('text', 'Text is required')
        .not()
        .isEmpty()
];
exports.default = validator;
