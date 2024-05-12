import mongoose from "mongoose";

export const connectMongoDB = (uri) => {
  return mongoose.connect(uri);
};
