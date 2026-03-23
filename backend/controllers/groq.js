import OpenAI from "openai";
import { systemPrompt } from "./promt.js";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const userHistories = new Map();
const userMemory = new Map();
const postHis = new Map();

export const simpleChat = async (userId, text) => {
  try {
    if (!userHistories.has(userId)) userHistories.set(userId, []);
    if (!userMemory.has(userId)) userMemory.set(userId, {});
    if (!postHis.has(userId)) postHis.set(userId, {});

    const chatHistory = userHistories.get(userId);
    const memory = userMemory.get(userId);
    const post = postHis.get(userId);

    const recentHistory = chatHistory.slice(-6);

    const memoryMessage = {
      role: "assistant",
      content: `Memory: ${JSON.stringify(memory)}`,
    };

    const postMessage =
      Object.keys(post).length > 0
        ? {
            role: "assistant",
            content: `Draft post (not saved yet): ${JSON.stringify(post)}`,
          }
        : null;

    const messages = [
      { role: "system", content: systemPrompt },
      memoryMessage,
      ...recentHistory,
      ...(postMessage ? [postMessage] : []),
      { role: "user", content: text },
    ];

    // 🔥 NEW API CALL (Groq via OpenAI SDK)
    const response = await client.responses.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      input: messages,
    });

    let raw = response.output_text;

    function extractJSON(text) {
      const match = text.match(/\{[\s\S]*\}$/);
      if (!match) throw new Error("No JSON found");
      return JSON.parse(match[0]);
    }

    raw = raw.replace(/```json|```/g, "").trim();
    raw = raw.replace(/^\s*```[\s\S]*?```$/gm, "").trim();

    let result;

    try {
      result = JSON.parse(raw);
    } catch {
      result = extractJSON(raw);
    }

    // 🧠 MEMORY UPDATE
    if (result.memory == 1) {
      memory.username = result.username;
      memory.email = result.email;
      memory.userId = result.userId;

      userMemory.set(userId, memory);
      userHistories.delete(userId);
      postHis.delete(userId);
    }

    // 💬 CHAT HISTORY
    if (result.remember == 1) {
      chatHistory.push({ role: "user", content: text });
      chatHistory.push({ role: "assistant", content: result.reply });

      if (result?.action?.action === "createPost" && result?.post) {
        postHis.set(userId, result.post);
      }

      if (
        result?.action?.action === "savePost" ||
        result?.action?.action === "editPost"
      ) {
        postHis.delete(userId);
      }

      userHistories.set(userId, chatHistory);
    }

    return result;
  } catch (err) {
    if (err.status === 429) {
      return "Error: Quota exceeded. Try again later.";
    } else if (err.status === 402) {
      return "Error: Not enough credits.";
    }

    return { reply: "Error: " + err.message + "\ntry again." };
  }
};