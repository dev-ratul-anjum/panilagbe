const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  language: {
    type: String,
    enum: ['en', 'bn'],
    default: 'bn'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema); 