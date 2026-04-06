import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Post.js";
import Diary from "./models/Diary.js";
import User from "./models/User.js";

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Bağlandı, taşıma başlıyor...");

    const users = await User.find();
    for (const user of users) {
      // Check if they already have an "Eski Sayfalar" diary
      let defaultDiary = await Diary.findOne({ authorId: user._id, title: "Eski Sayfalar" });
      
      if (!defaultDiary) {
        defaultDiary = new Diary({
          authorId: user._id,
          title: "Eski Sayfalar",
          coverColor: "#FF9B9B",
          isPrivate: false
        });
        defaultDiary = await defaultDiary.save();
      }

      const result = await Post.updateMany(
        { userId: user._id, diaryId: { $exists: false } },
        { $set: { diaryId: defaultDiary._id } }
      );
      
      console.log(`${user.username} için ${result.modifiedCount} sayfa taşındı.`);
    }

    console.log("Göç tamamlandı.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

migrate();
