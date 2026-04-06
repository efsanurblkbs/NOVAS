import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  senderName: { type: String },
  type: { type: String, required: true }, // "ACCESS_REQUEST" vb.
  diaryId: { type: String },
  diaryTitle: { type: String },
  status: { type: String, default: "PENDING" } // "PENDING", "APPROVED", "REJECTED"
}, { timestamps: true });

export default mongoose.model("Notification", NotificationSchema);
