const axios = require("axios");

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
// 🧠 SMART CHUNKING
const splitIntoChunks = (text, maxLength = 3000) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let current = "";

  for (let s of sentences) {
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

// 🤖 OPENROUTER CALL (GPT-3.5 ✅)
const callAI = async (prompt) => {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
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

// 🔹 ORGANIZE (NOT summarizing heavily)
const organizeChunk = async (chunk) => {
  const prompt = `
You are an academic assistant.

TASK:
Clean and ORGANIZE this raw PDF text into structured notes.

RULES:
- Keep MOST content (do NOT heavily summarize)
- Remove noise (headers, repeated text, page numbers)
- Group related ideas
- Use headings
- Improve readability

TEXT:
${chunk}
`;
  return await callAI(prompt);
};

// 🔹 FINAL REFINE
const refineFinal = async (text) => {
  const prompt = `
Create clean, well-structured study notes.

RULES:
- Keep ALL important content
- Remove repetition
- Organize into sections
- Use clear headings
- Keep explanations detailed
- DO NOT shorten too much

TEXT:
${text}
`;
  return await callAI(prompt);
};

// 🚀 MAIN FUNCTION
const summarizeText = async (text) => {
  try {
    text = cleanText(text);

    const chunks = splitIntoChunks(text);
    console.log("Total chunks:", chunks.length);

    const organized = [];

    for (let chunk of chunks) {
      const result = await organizeChunk(chunk);
      organized.push(result);
    }

    const combined = organized.join("\n\n");

    const final = await refineFinal(combined);

    return final;

  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error("Processing failed");
  }
};

module.exports = { summarizeText };