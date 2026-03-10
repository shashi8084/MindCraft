const axios = require("axios");

/**
 * AI Service for generating quiz content using Google Gemini
 */
const generateQuizContent = async ({ prompt, difficulty, count }) => {

  const fullPrompt = `
You are an expert exam question generator.

TASK:
Create exactly ${count} MULTIPLE CHOICE QUESTIONS (MCQs).

SUBJECT:
${prompt}

DIFFICULTY:
${difficulty}

RULES:
- Questions must be real subject-based.
- 4 options per question.
- Only ONE correct answer.
- No explanations.

IMPORTANT:
Return ONLY valid JSON.

FORMAT:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Exact text of the correct option"
    }
  ]
}
`;

  try {

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.6
        }
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("AI returned empty response");
    }

    /* -------- CLEAN AI OUTPUT -------- */

    let cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Ensure JSON starts from first {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid AI JSON format");
    }

    cleaned = cleaned.substring(start, end + 1);

    const parsed = JSON.parse(cleaned);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("AI response missing questions array");
    }

    return parsed.questions;

  } catch (error) {

    console.error(
      "AI Generation Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = {
  generateQuizContent,
};