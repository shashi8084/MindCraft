const Quiz = require("../models/Quiz");

/* ============================
   GENERATE QUIZ
============================ */
exports.generateQuiz = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);
    console.log("USER:", req.user);

    const {
      prompt,
      difficulty = "easy",
      count = 5,
      timeLimit = 10
    } = req.body;

    if (!prompt || prompt.trim().length < 3) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    if (count < 1 || count > 50) {
      return res.status(400).json({
        message: "Question count must be between 1 and 50"
      });
    }

    if (timeLimit < 1 || timeLimit > 120) {
      return res.status(400).json({
        message: "Time limit must be between 1 and 120 minutes"
      });
    }

    const timeLimitSeconds = Number(timeLimit) * 60;

    const { generateQuizContent } = require("../services/aiService");

    const questions = await generateQuizContent({
      prompt,
      difficulty,
      count
    });

    const quiz = await Quiz.create({
      user: req.user.id,
      prompt,
      difficulty,
      timeLimit: timeLimitSeconds,
      questions
    });

    res.json({
      quizId: quiz._id,
      questions: quiz.questions,
      timeLimit: quiz.timeLimit,
      startedAt: quiz.startedAt
    });

  } catch (error) {

    if (
      error.response?.status === 429 ||
      error.response?.data?.error?.code === 429
    ) {
      return res.status(429).json({
        message: "AI quota exceeded. Please try again later."
      });
    }

    console.error("GENERATION ERROR:", error.message);

    res.status(500).json({
      message: error.message || "AI generation failed"
    });
  }
};


/* ============================
   SUBMIT QUIZ
============================ */
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (quiz.completed) {
      return res.status(400).json({ message: "Quiz already submitted" });
    }

    const now = new Date();
    const timeTaken = (now - quiz.startedAt) / 1000;

    if (timeTaken > quiz.timeLimit) {
      quiz.completed = true;
      quiz.score = 0;
      quiz.userAnswers = answers || [];
      await quiz.save();

      return res.status(400).json({
        message: "Time expired! Quiz auto-submitted.",
        score: 0,
        total: quiz.questions.length
      });
    }

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (answers?.[index] === q.correctAnswer) {
        score++;
      }
    });

    quiz.score = score;
    quiz.completed = true;
    quiz.userAnswers = answers || [];
    await quiz.save();

    const User = require("../models/User");
    const user = await User.findById(req.user.id);

    if (score > user.highestScore) {
      user.highestScore = score;
      await user.save();
    }

    res.json({
      message: "Quiz submitted successfully",
      score,
      total: quiz.questions.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Submission failed" });
  }
};


/* ============================
   QUIZ HISTORY
============================ */
exports.getMyQuizzes = async (req, res) => {
  try {

    const quizzes = await Quiz.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-questions");

    res.json(quizzes);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz history" });
  }
};


/* ============================
   DELETE QUIZ
============================ */
exports.deleteQuiz = async (req, res) => {
  try {

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await quiz.deleteOne();

    res.json({ message: "Quiz deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete quiz" });
  }
};


/* ============================
   QUIZ REVIEW
============================ */
exports.getQuizReview = async (req, res) => {
  try {

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      prompt: quiz.prompt,
      questions: quiz.questions,
      userAnswers: quiz.userAnswers || []
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to load quiz review" });
  }
};