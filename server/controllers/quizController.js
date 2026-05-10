const File = require("../models/File");

const submitQuiz = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { answers } = req.body;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const quiz = file.quiz;

    let correct = 0;
    let weakTopics = [];

    quiz.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correct++;
      } else {
        if (q.topic) weakTopics.push(q.topic); // ✅ FIX null
      }
    });

    const total = quiz.length;
    const percentage = (correct / total) * 100;

    // remove duplicates
    weakTopics = [...new Set(weakTopics)];

    file.attempts.push({
      answers,
      score: correct,
      weak: percentage < 60,
    });

    await file.save();

    res.json({
      correct,
      total,
      percentage,
      weak: percentage < 60,
      weakTopics,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { submitQuiz };