const axios = require("axios");

const SUMMARY_RULES = {
  short: { min: 50, max: 100 },
  medium: { min: 100, max: 150 },
  long: { min: 200, max: 300 },
};

// 🧹 CLEAN TEXT
const cleanText = (text) => {
  return text
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/Page \d+/gi, "")
    .replace(/CS\d+/gi, "")
    .replace(/Dr\..*?\./gi, "")
    .replace(/@.*?\s/g, "")
    .replace(/\b\d+\b/g, "")
    .trim();
};

const splitIntoChunks = (text, maxLength = 3000) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let current = "";

  for (const s of sentences) {
    if ((current + s).length > maxLength) {
      chunks.push(current);
      current = s;
    } else {
      current += s;
    }
  }

  if (current) chunks.push(current);
  return chunks;
};

const countWords = (text) => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const isWithinRange = (text, type) => {
  const { min, max } = SUMMARY_RULES[type];
  const wordCount = countWords(text);
  return wordCount >= min && wordCount <= max;
};

const callAI = async (prompt) => {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
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

const organizeChunk = async (chunk) => {
  const prompt = `
You are an academic assistant.

TASK:
Clean and organize this raw PDF text into structured study notes.

RULES:
- Keep most important academic content
- Remove noise (headers, repeated text, page numbers)
- Group related ideas
- Preserve definitions, steps, and examples
- Keep headings only if present in source content

TEXT:
${chunk}
`;

  return await callAI(prompt);
};

const refineFinal = async (text, type, attempt = 1) => {
  const { min, max } = SUMMARY_RULES[type];

  const prompt = `
Create ONE clean paragraph summary.

STRICT REQUIREMENTS:
- Summary type: ${type}
- Word count must be between ${min} and ${max} words.
- Preserve key concepts (definitions, steps, examples).
- Keep meaning accurate; only adjust verbosity.
- No bullet points unless source is inherently structured that way.
- Return only the summary text.
${attempt > 1 ? `- Previous attempt missed word range. Make this fit exactly ${min}-${max} words.` : ""}

CONTENT:
${text}
`;

  return await callAI(prompt);
};

const summarizeText = async (text, type = "medium") => {
  try {
    const clean = cleanText(text);
    const chunks = splitIntoChunks(clean);

    const organized = [];
    for (const chunk of chunks) {
      organized.push(await organizeChunk(chunk));
    }

    const combined = organized.join("\n\n");

    const maxRetries = 4;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const final = (await refineFinal(combined, type, attempt)).trim();
      if (isWithinRange(final, type)) {
        return final;
      }
    }

    throw new Error("Unable to fit summary into requested word range");
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error("Processing failed");
  }
};

module.exports = { summarizeText };
