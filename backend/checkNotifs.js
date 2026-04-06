import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/novas").then(async () => {
  const Notification = mongoose.model("Notification", new mongoose.Schema({}, { strict: false }));
  const notifs = await Notification.find();
  console.log("ALL NOTIFS:", notifs);
  process.exit();
}).catch(console.error);
