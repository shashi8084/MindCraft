const Contest = require("../models/Contest");
const crypto = require("crypto");

/* ============================
   CREATE CONTEST
============================ */
exports.createContest = async (req, res) => {
  try {
    const { title, prompt, timeLimit, count } = req.body;

    if (!title || !prompt || !timeLimit || !count) {
      return res.status(400).json({ message: "All fields required" });
    }

    const { generateQuizContent } = require("../services/aiService");

    const questions = await generateQuizContent({
      prompt,
      difficulty: "medium",
      count: Number(count)
    });

    const joinCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const contest = await Contest.create({
      title,
      prompt,
      questions,
      timeLimit: Number(timeLimit) * 60,
      joinCode,
      createdBy: req.user.id
    });

    res.json({
      message: "Contest created successfully",
      contestId: contest._id,
      joinCode
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

    console.error("CONTEST CREATION ERROR:", error.message);

    res.status(500).json({
      message: error.message || "Contest creation failed"
    });
  }
};


/* ============================
   JOIN CONTEST
============================ */
exports.joinContest = async (req, res) => {
  try {

    const { joinCode } = req.body;

    const contest = await Contest.findOne({ joinCode });

    if (!contest) {
      return res.status(404).json({ message: "Invalid join code" });
    }

    if (contest.status === "ended") {
      return res.status(400).json({ message: "Contest has ended" });
    }

    const alreadyJoined = contest.participants.find(
      (p) => p.user.toString() === req.user.id
    );

    if (!alreadyJoined) {
      contest.participants.push({
        user: req.user.id
      });

      await contest.save();
    }

    res.json({
      contestId: contest._id,
      title: contest.title,
      questions: contest.questions,
      timeLimit: contest.timeLimit
    });

  } catch (error) {
    console.error("JOIN CONTEST ERROR:", error);
    res.status(500).json({ message: "Failed to join contest" });
  }
};


/* ============================
   SUBMIT CONTEST
============================ */
exports.submitContest = async (req, res) => {
  try {

    const { contestId, answers } = req.body;

    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({});
    }

    const participant = contest.participants.find(
      (p) => p.user.toString() === req.user.id
    );

    if (!participant) {
      return res.status(403).json({});
    }

    // If already submitted, just return silently
    if (participant.submittedAt) {
      return res.json({
        score: participant.score,
        total: contest.questions.length
      });
    }

    let score = 0;

    contest.questions.forEach((q, index) => {
      if (answers?.[index] === q.correctAnswer) {
        score++;
      }
    });

    participant.score = score;
    participant.submittedAt = new Date();

    await contest.save();

    const populatedContest = await Contest.findById(contestId)
      .populate("participants.user", "name");

    const leaderboard = populatedContest.participants
      .filter((p) => p.submittedAt)
      .sort((a, b) => {
        if (b.score === a.score) {
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        }
        return b.score - a.score;
      })
      .map((p, index) => ({
        rank: index + 1,
        name: p.user.name,
        score: p.score,
        submittedAt: p.submittedAt
      }));

    const io = req.app.get("io");

    io.to(contest._id.toString()).emit(
      "leaderboardUpdate",
      leaderboard
    );

    res.json({
      score,
      total: contest.questions.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
};


/* ============================
   GET LEADERBOARD
============================ */
exports.getLeaderboard = async (req, res) => {
  try {

    const { contestId } = req.params;

    const contest = await Contest.findById(contestId)
      .populate("participants.user", "name");

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    const leaderboard = contest.participants
      .filter((p) => p.submittedAt)
      .sort((a, b) => {

        if (b.score === a.score) {
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        }

        return b.score - a.score;
      })
      .map((p, index) => ({
        rank: index + 1,
        name: p.user.name,
        score: p.score,
        submittedAt: p.submittedAt
      }));

    res.json(leaderboard);

  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch leaderboard"
    });
  }
};