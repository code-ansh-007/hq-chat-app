import e from "express";
import Messages from "../models/messages.js";
import User from "../models/user.js";
import Conversation from "../models/conversations.js";

const router = e.Router();

router.post("/", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    console.log("receiver ID", receiverId);
    if (!senderId || !message)
      return res.status(400).send("All fields are required");
    if (conversationId === "new" && receiverId) {
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      const newMessage = new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      return res.status(200).send("Message sent successfully");
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("missing");
    }
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    return res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log("message error: ", error);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await Messages.find({ conversationId });
    const messageUserData = Promise.all(
      messages.map(async (message) => {
        const user = await User.findById(message.senderId);
        return {
          user: { id: user._id, name: user.name, email: user.email },
          message: message.message,
        };
      })
    );
    res.status(200).json(await messageUserData);
  } catch (error) {
    console.log("message error: ", error);
  }
});

export default router;
