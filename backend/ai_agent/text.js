const express = require("express");
const router = express.Router();
const { simpleChat } = require("../controllers/chat");
const { runAction } = require("./action");


router.post("/chat/:id", async (req, res) => {
  const { message } = req.body;
  const {id} = req.params;
  const result = await simpleChat(id, message);
  console.log(result);

  if(result.action != null && result?.action.action ){
  
    if(result.action.action == "createPost") return res.json({ action: result.action.action, reply: result.reply, suggests: result.suggestions, post: result.post });

    const actionResult = await runAction(result, id);
    console.log("actionResult", actionResult);

    if(!actionResult.status) return res.json({ status: actionResult.status, reply: actionResult.message, suggests: result.suggestions, post: actionResult.post });
    return res.json({ status: actionResult.status, action: result.action.action, reply: result.reply, suggests: result.suggestions, post: actionResult.post });
  }

  res.json({ reply: result.reply, suggests: result.suggestions, post: result.post });
});


router.post("/getAgent/:id", async (req, res) => {
  const data = req.body;
  const {id} = req.params;
  if(!data || !id) return res.status(400).json({message: "user details not found ...."});
  const prompt = `
  You are an AI assistant. Use the following user information to identify the user and respond appropriately.

  User Details:
  - Name: ${data.name}
  - Email: ${data.email}
  - userId: ${id} (this userId is used for another tasks like get post, edit posts, etc...)
 Response schema (STRICT):
{
  "suggestions": string[],
  "reply": string,
  "username": string,
  "email": string,
  "userId": string,
  "remember": 1,
  "memory": 1
}
  Instructions:
  1. Use only the above information to identify the user.
  2. Do not make up any additional details.
  3. Do not share details untill it asked.
  4. Memory means to store the this respone permanent. 
  `;
  const result = await simpleChat(id, prompt);
  console.log(result);
  if(!result.memory) return res.json({ reply: "Error Occur\n\ntry another day."});
  if(result?.memory !== 1) return res.status(400).json({ reply: result.reply });
  res.json({ reply: result.reply, suggests: result.suggestions, memory: result?.memory === 1 ? true : false });
});

module.exports = router;
