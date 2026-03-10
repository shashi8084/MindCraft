const express = require("express");
const router = express.Router();
const { generateQuiz, submitQuiz, getMyQuizzes } = require("../controllers/quizController");
const protect = require("../middleware/authMiddleware");
const { deleteQuiz, getQuizReview } = require("../controllers/quizController");


router.post("/generate", protect, generateQuiz);
router.post("/submit", protect, submitQuiz);
router.get("/my-quizzes", protect, getMyQuizzes);
router.delete("/:id", protect, deleteQuiz);
router.get("/:id/review", protect, getQuizReview);


module.exports = router;