import Diary from "../models/Diary.js";
import Post from "../models/Post.js";

export const createDiary = async (req, res) => {
  try {
    const newDiary = new Diary({
      authorId: req.user.id,
      title: req.body.title,
      coverColor: req.body.coverColor,
      isPrivate: req.body.isPrivate
    });
    const savedDiary = await newDiary.save();
    res.status(200).json(savedDiary);
  } catch (err) { res.status(500).json(err); }
};

export const getUserDiaries = async (req, res) => {
  try {
    const { profileId, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const diaries = await Diary.find({ authorId: profileId }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    // Evaluate locking mechanism for the requester
    const parsedDiaries = diaries.map(diary => {
      const isOwner = diary.authorId === req.user.id;
      const isGranted = diary.grantedAccess.includes(req.user.id);
      const locked = diary.isPrivate && !isOwner && !isGranted;

      return { ...diary._doc, isLocked: locked };
    });

    res.status(200).json(parsedDiaries);
  } catch (err) { res.status(500).json(err); }
};

export const getDiaryById = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    if (!diary) return res.status(404).json("Defter bulunamadı.");

    const isOwner = diary.authorId === req.user.id;
    const isGranted = diary.grantedAccess.includes(req.user.id);

    // Even if locked, we return the cover info so they can request access.
    const locked = diary.isPrivate && !isOwner && !isGranted;
    res.status(200).json({ ...diary._doc, isLocked: locked });
  } catch (err) { res.status(500).json(err); }
};

export const deleteDiary = async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    if (!diary) return res.status(404).json("Defter zaten yok.");

    if (diary.authorId === req.user.id) {
      await Post.deleteMany({ diaryId: diary._id });
      await diary.deleteOne();
      res.status(200).json("Defter ve içindeki sayfalar ateşe atılıp yakıldı.");
    } else {
      res.status(403).json("Yetkisiz işlem.");
    }
  } catch (err) { res.status(500).json(err); }
};
