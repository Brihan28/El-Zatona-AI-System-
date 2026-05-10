const axios = require("axios");

const generateQuiz = async (text) => {
  const prompt = `
You are an AI teacher.

TASK:
Generate 5 multiple choice questions from the text.

RULES:
- Each question must have exactly 4 options
- Options MUST be labeled A, B, C, D
- Answer MUST be ONLY one letter: A or B or C or D
- Add a short topic for each question
- Return ONLY valid JSON

FORMAT:
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A",
    "topic": "..."
  }
]

TEXT:
${text}
`;

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
};

module.exports = { generateQuiz };