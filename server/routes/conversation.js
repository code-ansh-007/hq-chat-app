import e from "express";
import Conversation from "../models/conversations.js";
import User from "../models/user.js";

const router = e.Router();

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });
    const conversationUserData = await Promise.all(
      conversations.map(async (convo) => {
        const receiverId = convo.members.find((member) => member !== userId);
        if (receiverId) {
          const user = await User.findById(receiverId);
          return {
            user: {
              receiverId: user._id,
              name: user.name,
              email: user.email,
              status: user.status,
            },
            conversationId: convo._id,
          };
        }
      })
    );
    res.status(200).json(conversationUserData);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { senderId, recieverId } = req.body;
    const conversation = new Conversation({
      members: [senderId, recieverId],
    });
    await conversation.save();
    return res.status(200).send("convo created successfully");
  } catch (error) {
    console.log(error);
  }
});

export default router;
