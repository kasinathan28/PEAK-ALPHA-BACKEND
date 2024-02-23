const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  houseName: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  
  // You can add more fields based on your needs
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
