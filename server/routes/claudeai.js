import e from "express";
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API,
});
const router = e.Router();

router.post("/", async (req, res) => {
  const { username } = req.body;
  const msg = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `generate a message to a person, don't refer to the person, saying that the user with username ${username} is currently busy and won't be able to recieve any message right now and the reply should only be 25 words max`,
          },
        ],
      },
    ],
  });
  return res.json(msg);
});

export default router;
