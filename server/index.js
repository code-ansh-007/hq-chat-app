import express from "express";
import { connectMongoDB } from "./mongodb-connection.js";
import "dotenv/config";
import userRouter from "./routes/user.js";
import conversationRouter from "./routes/conversation.js";
import messageRouter from "./routes/message.js";
import claudeRouter from "./routes/claudeai.js";
import cors from "cors";
import { Server } from "socket.io";
import User from "./models/user.js";
import Messages from "./models/messages.js";
import bodyParser from "body-parser";

const options = {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
};
const io = new Server(8000, options);

// ? Initializating Socket.io
let users = [];
io.on("connection", (socket) => {
  // console.log("User Connected socket: ", socket.id);
  socket.on("addUser", async (userId) => {
    const userExists = users.find((user) => userId === user.userId);
    if (!userExists) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
      await User.findByIdAndUpdate(userId, { $set: { status: "available" } });
    }
  });

  socket.on("disconnect", async () => {
    const user = users.find((user) => user.socketId === socket.id);
    if (user) {
      users = users.filter((user) => user.socketId !== socket.id);
      console.log("DISCONNECTED USER OBJECT: ", user);
      io.emit("getUsers", users);
      await User.findByIdAndUpdate(user.userId, { $set: { status: "busy" } });
    } else {
      console.log("user not found");
    }
  });

  socket.on(
    "sendMessage",
    async ({ conversationId, senderId, message, receiverId }) => {
      console.log("users: ", users);
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await User.findById(senderId);
      console.log("receiver: ", receiver);
      if (receiver) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            message,
            user: { id: user._id, name: user.name, email: user.email },
          });
      }
    }
  );
});

const app = express();
const PORT = process.env.PORT || 8000;

// ? Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// ? mongoDB connection
connectMongoDB(process.env.MONGODB_URI)
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((err) => {
    console.log("Error connecting to mongo db: ", err);
  });

app.get("/", (req, res) => {
  return res.send("welcome");
});

// ? routes
app.use("/api/users", userRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/claude", claudeRouter);

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
