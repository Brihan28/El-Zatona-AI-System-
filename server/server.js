require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/fileRoutes");
const quizRoutes = require("./routes/quizRoutes");
const studyRoutes = require("./routes/studyPlanRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/study", studyRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API running");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log("Server running"));