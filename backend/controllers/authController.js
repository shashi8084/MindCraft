const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");


// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exixts
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
      isEmailVerified: false
    });

    const emailToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // (Next step: send this token via email)
    const verificationLink =
      `http://localhost:5000/api/auth/verify-email?token=${emailToken}`;
    
    await sendEmail(
      email,
      "Verify your email",
      `<p>Click to verify your account:</p>
      <a href="${verificationLink}">${verificationLink}</a>`
    );

    res.status(201).json({
      message: "Signup successful. Please verify your email."
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //  Block password login for Google users
    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "Please login using Google"
      });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        highestScore: user.highestScore,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await require("bcryptjs").compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await require("bcryptjs").hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Google Authentication
exports.googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      // 🔗 MERGE CASE
      if (user.authProvider === "local") {
        user.authProvider = "google";
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_AUTH",
        authProvider: "google"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        highestScore: user.highestScore
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Google auth failed" });
  }
};
//  VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await User.findOneAndUpdate(
      { email: decoded.email },
      { isEmailVerified: true }
    );

    // Redirect user to frontend login page
    res.redirect("http://localhost:5173/");
  } catch (error) {
    res.status(400).json({ message: "Verification link expired or invalid" });
  }
};

//  FORGOT PASSWORD 
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Security: don't reveal if email exists
      return res.json({
        message: "If this email exists, a reset link has been sent"
      });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink =
      `http://localhost:5173/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      "Reset your password",
      `<p>Click below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>`
    );


    res.json({
      message: "If this email exists, a reset link has been sent"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== RESEND VERIFICATION EMAIL ====================
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "If the email exists, a verification link has been sent"
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        message: "Email is already verified"
      });
    }

    const emailToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const verificationLink =
      `http://localhost:5000/api/auth/verify-email?token=${emailToken}`;

    await sendEmail(
      email,
      "Verify your email",
      `<p>Click to verify your account:</p>
       <a href="${verificationLink}">${verificationLink}</a>`
    );

    res.json({
      message: "Verification email sent"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// RESET PASSWORD 
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(400).json({ message: "Token expired or invalid" });
  }
};
