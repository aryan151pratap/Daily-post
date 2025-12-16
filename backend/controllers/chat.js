import {OpenRouter} from '@openrouter/sdk';
import { systemPrompt } from './promt.js';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const userHistories = new Map();
const userMemory = new Map();
const postHis = new Map();

export const simpleChat = async (userId, text) => {
	try {
		console.log(userId);
		if (!userHistories.has(userId)) userHistories.set(userId, []);
		if (!userMemory.has(userId)) userMemory.set(userId, {});
		if (!postHis.has(userId)) postHis.set(userId, {});

		const chatHistory = userHistories.get(userId);
		const memory = userMemory.get(userId);
		const post = postHis.get(userId);
		const recentHistory = chatHistory.slice(-6);

		const memoryMessage = {
			role: "assistant",
			content: `Memory: ${JSON.stringify(memory)}`
		};

		const postMessage =
			Object.keys(post).length > 0
				? {
					role: "assistant",
					content: `Draft post (not saved yet): ${JSON.stringify(post)}`
				}
				: null;

		console.log("postMessage", postMessage);

		const messages = [
			{ role: "system", content: systemPrompt },
			memoryMessage,
			...recentHistory,
			...(postMessage ? [postMessage] : []),
			{ role: 'user', content: text },
		];

		const completion = await openRouter.chat.send({
			model: process.env.MODEL,
			messages: messages,
			stream: false,
		});

		let raw = completion.choices?.[0]?.message?.content;

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
		if (result.memory == 1) {
			memory.username = result.username;
			memory.email = result.email;
			memory.userId = result.userId;
			userMemory.set(userId, memory);
			userHistories.delete(userId);
			postHis.delete(userId);
		}
		if(result.remember == 1){
			chatHistory.push({ role: 'user', content: text });
			chatHistory.push({ role: 'assistant', content: result.reply });

			if (result?.action?.action === "createPost" && result?.post) {
				postHis.set(userId, result.post);
			} if (result?.action?.action === "savePost" || result?.action?.action === "editPost") {
				postHis.delete(userId);
			}

			userHistories.set(userId, chatHistory);
		}

		return result;
	} catch (err) {
		if (err.status === 429) {
			return 'Error: Quota exceeded. Try again later.';
		} else if (err.status === 402) {
			return 'Error: Not enough credits. Reduce max_tokens or upgrade account.';
		}
		return {reply: 'Error: ' + err.message + "\ntry again."};
	}
};
