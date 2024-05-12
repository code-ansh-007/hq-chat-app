import e from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

const router = e.Router();

// ? get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    const usersData = await Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            name: user.name,
            receiverId: user._id,
            status: user.status,
          },
          userId: user._id,
        };
      })
    );
    return res.status(200).json(usersData);
  } catch (error) {
    console.log("user error: ", error);
  }
});

// ? Signup route
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).send("Fields missing!");
    else {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).send("Email already exists");
      else {
        const user = new User({ name, email });
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          user.set("password", hashedPassword);
          user.save();
          next();
        });
        return res.status(200).json(user);
      }
    }
  } catch (error) {
    console.log("error: ", error);
  }
});

// ? Signin Route
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ err: "Fields Missing!" });
    else {
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ err: "User email or password is incorrect" });
      else {
        const validateUser = await bcrypt.compare(password, user.password);
        if (!validateUser)
          return res
            .status(400)
            .json({ err: "User email or password is incorrect" });
        else {
          const payload = {
            userId: user._id,
            name: user.name,
            email: user.email,
          };
          const secret = process.env.JWT_SECRET;
          // ?storing jwt token in DB
          jwt.sign(
            payload,
            secret,
            { expiresIn: 84600 },
            async (err, token) => {
              await User.updateOne(
                { _id: user._id },
                {
                  $set: { token },
                }
              );
              user.save();
              res.status(200).json({
                user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  status: user.status,
                },
                token,
              });
            }
          );
        }
      }
    }
  } catch (error) {
    console.log("error: ", error);
  }
});

export default router;
