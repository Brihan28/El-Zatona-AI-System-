const express = require("express");
const router = express.Router();

const { createPlan } = require("../controllers/studyPlanController");

// POST /api/study/:fileId
router.post("/:fileId", createPlan);

module.exports = router;