const { summarizeText } = require("../services/aiService");

const generateSummary = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    const summary = await summarizeText(text);

    res.json({ summary });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};

module.exports = { generateSummary };
