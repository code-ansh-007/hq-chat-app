import mongoose, { model } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Conversation = model("conversation", conversationSchema);

export default Conversation;
