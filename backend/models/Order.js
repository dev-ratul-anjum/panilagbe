const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user : {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    waterType: {
      type: String,
      required: true
    },
    waterQuantity: {
      type: String,
      required: true,
    }
  }],
  name : {
    type: String,
    required: true
  },
  email : {
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
    enum: ['cash', 'bKash', 'Nagad', 'onlinePayment'],
    default: 'cash'
  },
  deliveryDate: {
    type: Date
  },
  subscription: [
    {paymentId : String, paymentMonth: Number, paymentYear: Number, shownToUser : {type : Boolean, default : false}}
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema); 