const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminUsername: {
    type: String,
    required: true,
    unique: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
  // You can add more fields based on your needs
  // For example, adminName, adminEmail, etc.
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

