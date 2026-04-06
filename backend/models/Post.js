import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  diaryId: { type: String }, // Ait olduğu defter
  userId: { type: String, required: true }, // Notun sahibi (Defterin sahibi)
  authorId: { type: String, required: true }, // Notu yazan (Kendi veya Arkadaşı)
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, default: "" },
  sentiment: { type: Number, default: 0 },
  isPrivate: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Post", PostSchema);