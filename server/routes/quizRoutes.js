const express = require("express");
const router = express.Router();

const { submitQuiz } = require("../controllers/quizController");

// POST /api/quiz/submit/:fileId
router.post("/submit/:fileId", submitQuiz);

module.exports = router;