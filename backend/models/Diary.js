import mongoose from "mongoose";

const DiarySchema = new mongoose.Schema({
  authorId: { type: String, required: true },
  title: { type: String, required: true },
  coverColor: { type: String, default: "#A29BFE" },
  isPrivate: { type: Boolean, default: false },
  grantedAccess: { type: Array, default: [] }
}, { timestamps: true });

export default mongoose.model("Diary", DiarySchema);
