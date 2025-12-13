import gemini from "../config/gemini.js";

let chatHistory = [];

export const simpleChat = async (id, text) => {
  try {
    chatHistory.push({ role: "user", content: text });
    const contextPrompt = `
You are a helpful AI assistant.
Keep track of the conversation with the user.
Use the following chat history as context:

Chat History:
${chatHistory.map(h => `${h.role}: ${h.content}`).join("\n")}

Current question:
${text}

Answer the question concisely, while keeping context in mind.
`;

    const model = gemini.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(contextPrompt);
    const reply = result?.response?.text() || "No response from AI";
    console.log(reply);

    return {reply};
  } catch (err) {
    if (err.status === 429) {
      return "Error: Quota exceeded. Try again later.";
    }
    return "Error: " + err.message;
  }
};
