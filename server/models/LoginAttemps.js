const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  email: String,
  ip: String,
  success: Boolean,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LoginAttempt", attemptSchema);
