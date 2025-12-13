import fetch from "node-fetch";
import { systemPrompt } from "./promt.js";

const userHistories = new Map();

export const simpleChat = async (userId, text) => {
  try {
    console.log(userId);
    if (!userHistories.has(userId)) {
      userHistories.set(userId, []);
    }

    const chatHistory = userHistories.get(userId);
    const recentHistory = chatHistory.slice(-6);

    const messages = [
		{ role: "system", content: systemPrompt },
		...recentHistory,
		{ role: "user", content: text }
    ];

    console.log("thinking ....")
    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        messages,
        stream: false
      })
    });

    const data = await response.json();
    console.log(data);
    let raw = data?.message?.content || "";

    raw = raw.replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      result = { reply: raw, remember: 0 };
    }

    if (result.remember === 1) {
      chatHistory.push({ role: "user", content: text });
      chatHistory.push({ role: "assistant", content: result.reply });
      userHistories.set(userId, chatHistory);
    }

    return result;

  } catch (err) {
    return { reply: "Error contacting Llama: " + err.message, remember: 0 };
  }
};
