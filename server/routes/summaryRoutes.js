const express = require("express");
const router = express.Router();

const { generateSummary } = require("../controllers/summaryController");

// POST /api/summaries/generate
router.post("/generate", generateSummary);

module.exports = router;
