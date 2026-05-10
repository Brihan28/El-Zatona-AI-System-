const axios = require("axios");

const generateStudyPlan = async ({ weakTopics, examDate, hoursPerDay }) => {
  const prompt = `
You are an AI study planner.

TASK:
Create a personalized study plan.

INPUT:
- Weak topics: ${weakTopics.join(", ")}
- Exam date: ${examDate}
- Study hours per day: ${hoursPerDay}

RULES:
- Distribute topics across days
- Include revision days
- Balance workload
- Be realistic
- Prioritize weak topics first
- Repeat weak topics multiple times
- Add revision days every 3 days
- Respect study hours strictly
- Make plan until exam date
- Prioritize the weakest topics more frequently
- Repeat difficult topics more often than easy ones
- Gradually reduce repetition near exam date
- Last 3 days: only revision + practice tests

FORMAT:
Return JSON ONLY like:
[
  { "day": "Day 1", "plan": "Study Topic A + practice" },
  { "day": "Day 2", "plan": "Study Topic B" }
    
]
`;

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
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

module.exports = { generateStudyPlan };