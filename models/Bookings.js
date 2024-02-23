const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    UserId :{
        type:String,
        required: true,
    },
    paymentIntentId:{
        type:String,
        required: true,
    },
    productId:{
        type:String,
        required:true,
    }
})


const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;

