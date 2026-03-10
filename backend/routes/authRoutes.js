const express = require("express");
const router = express.Router();
const { signup, login, getProfile, changePassword,   googleAuth, verifyEmail, resendVerification  } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const {forgotPassword, resetPassword} = require("../controllers/authController");


router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/verify-email", verifyEmail);
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", resendVerification);


module.exports = router;
