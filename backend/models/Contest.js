const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String
});

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  score: {
    type: Number,
    default: 0
  },
  submittedAt: Date
});

const contestSchema = new mongoose.Schema({
  title: String,
  prompt: String,
  questions: [questionSchema],
  timeLimit: Number, // seconds
  joinCode: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["upcoming", "live", "ended"],
    default: "upcoming"
  },
  participants: [participantSchema]
}, { timestamps: true });

module.exports = mongoose.model("Contest", contestSchema);
