import mongoose from "mongoose";
import Notification from "./models/Notification.js";
import fs from "fs";

async function run() {
  await mongoose.connect("mongodb://localhost:27017/novas");
  const notifs = await Notification.find({});
  fs.writeFileSync("output.txt", JSON.stringify(notifs));
  process.exit();
}
run();
