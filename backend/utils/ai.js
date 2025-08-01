import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Initialize Gemini AI client
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Categorize an email using Gemini AI.
 * @param {string} text - The raw email text.
 * @returns {Promise<string>} - Category like 'Interested', 'Spam', etc.
 */
async function categorizeEmail(text) {
  if (!text) return "Uncategorized";

  const prompt = `
You are a smart email assistant. Categorize the following email into one of these categories:
- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

Only reply with one category name.

Email:
"${text}"
  `.trim();

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([prompt]);
    const category = result.response.text().trim();

    // Normalize and fallback
    return category || "General";
  } catch (err) {
    console.error("❌ Error in AI categorization:", err.message);
    return "General";
  }
}

/**
 * Suggest a smart email reply using Gemini AI.
 * @param {string} text - The raw email text to reply to.
 * @returns {Promise<string>} - Suggested reply.
 */
async function suggestReply(text) {
  if (!text) {
    return "Thanks for your message. I’ll get back to you shortly.";
  }

  const prompt = `
You are an email assistant. Write a short, polite, and relevant reply to the following email:

"${text}"

Reply:
  `.trim();

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([prompt]);
    const reply = result.response.text().trim();

    return reply || "Thank you for reaching out. I’ll respond shortly.";
  } catch (err) {
    console.error("❌ Error in AI reply suggestion:", err.message);
    return "Thank you for reaching out.";
  }
}

export { categorizeEmail, suggestReply };
