const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },  
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profilePicture: {
    filename: { type: String },
    path: { type: String },
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Users = mongoose.model("User", userSchema);

module.exports = Users;
