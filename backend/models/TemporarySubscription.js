const mongoose = require('mongoose');

const temporarySubscriptionSchema = new mongoose.Schema({
    orderId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    subscription : {
        paymentId : {
            type : String,
            required : true
        },
        paymentMonth : {
            type : Number,
            required : true
        },
        paymentYear : {
            type : Number,
            required : true
        }, 
        shownToUser : {
            type : Boolean,
            required : true
        }
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 86400 // 1800s = 30 mins -> auto delete after 30 mins if unused
    }
})

const TemporarySubscription = mongoose.model('TemporarySubscription', temporarySubscriptionSchema);

module.exports = TemporarySubscription;