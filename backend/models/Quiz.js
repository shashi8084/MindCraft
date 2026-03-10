const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String
});

const quizSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userAnswers: {
        type: [String],
        default: []
    },
    prompt: String,
    questions: [questionSchema],
    score: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    timeLimit: {
        type: Number, // in seconds
        default: 300  // 5 minutes default
    },
    startedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);