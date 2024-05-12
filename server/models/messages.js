import mongoose, { model } from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Messages = model("message", messagesSchema);

export default Messages;
