const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  highestScore: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);