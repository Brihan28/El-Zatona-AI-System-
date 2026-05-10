const File = require("../models/File");
const { generateStudyPlan } = require("../services/studyPlanner");

const createPlan = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { examDate, hoursPerDay } = req.body;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const lastAttempt = file.attempts[file.attempts.length - 1];

    if (!lastAttempt) {
      return res.status(400).json({ error: "No quiz attempts found" });
    }

    // 🔥 REAL WEAK TOPICS (based on wrong answers)
    let weakTopics = [];

    file.quiz.forEach((q, i) => {
      if (lastAttempt.answers[i] !== q.answer) {
        if (q.topic) weakTopics.push(q.topic);
      }
    });

    // remove duplicates
    weakTopics = [...new Set(weakTopics)];

    // fallback
    if (weakTopics.length === 0) {
      weakTopics = ["General Revision"];
    }

    const planRaw = await generateStudyPlan({
      weakTopics,
      examDate,
      hoursPerDay,
    });

    const plan = JSON.parse(planRaw);

    res.json({
      message: "Study plan generated",
      weakTopics,
      plan,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to generate plan" });
  }
};

module.exports = { createPlan };