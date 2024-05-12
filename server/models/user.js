import mongoose, { model } from "mongoose";

const StatusEnum = ["available", "busy"];
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    status: {
      type: String,
      enum: StatusEnum,
      default: "busy",
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

export default User;
