const mongoose = require('mongoose');

const TemporaryOrderSessionSchema = new mongoose.Schema({
  tran_id: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: {
    type: Array,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  subscription: {
    type: Array,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 1800s = 30 mins -> auto delete after 30 mins if unused
  }
});

module.exports = mongoose.model('TemporaryOrderSession', TemporaryOrderSessionSchema);