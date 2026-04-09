import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";
import diaryRoute from "./routes/diaries.js";
import notificationRoute from "./routes/notifications.js";
import dailyRoute from "./routes/daily.js";

dotenv.config();
const app = express();

// Middlewar
app.use(express.json());
// backend/server.js
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://novas-sigma.vercel.app",
    "https://novas-git-main-efsa-bolukbass-projects.vercel.app"
  ],
  credentials: true
}));

// Rotalar
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);
app.use("/api/diaries", diaryRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/daily", dailyRoute);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Bağlandı! ✅"))
  .catch((err) => console.log(err));

app.listen(8800, () => {
  console.log("Sunucu 8800 portunda hazır! 🚀");
});