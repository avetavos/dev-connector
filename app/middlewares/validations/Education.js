"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validator = [
    express_validator_1.check('school', 'School is required')
        .not()
        .isEmpty(),
    express_validator_1.check('degree', 'Degree is required')
        .not()
        .isEmpty(),
    express_validator_1.check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
    express_validator_1.check('from', 'From date is required')
        .not()
        .isEmpty()
];
exports.default = validator;
