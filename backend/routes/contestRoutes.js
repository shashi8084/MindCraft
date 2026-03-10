const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const { 
  createContest, 
  joinContest, 
  submitContest, 
  getLeaderboard 
} = require("../controllers/contestController");



router.post("/create", protect, createContest);
router.post("/join", protect, joinContest);
router.post("/submit", protect, submitContest);
router.get("/leaderboard/:contestId", protect, getLeaderboard);

module.exports = router;
