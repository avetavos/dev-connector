'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = require('mongoose');
const userSchema = new mongoose_1.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});
const userModel = mongoose_1.model('user', userSchema);
exports.default = userModel;
