const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']); // Bypasses your local Mumbai ISP's DNS

const dotenv = require("dotenv");
dotenv.config();
const contestRoutes = require("./routes/contestRoutes");
const quizRoutes = require("./routes/quizRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/contest", contestRoutes);



// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

const protect = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed protected route!",
    user: req.user
  });
});


// Connect MongoDB
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    const http = require("http");
    const { initSocket } = require("./utils/socket");

    const server = http.createServer(app);

    // 🔥 Initialize Socket
    const io = initSocket(server);
    app.set("io", io);

    // Start server
    server.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.log(err));

  // const adminOnly = require("./middleware/adminMiddleware");

  // app.get("/api/admin/test", protect, adminOnly, (req, res) => {
  //   res.json({ message: "Admin access granted" });
  // });
