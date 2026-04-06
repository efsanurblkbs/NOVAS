import Post from "../models/Post.js";
import Diary from "../models/Diary.js";
import Sentiment from "sentiment";

const sentiment = new Sentiment();
const turkishOptions = { extras: { 'mutlu': 3, 'harika': 4, 'mükemmel': 5, 'kötü': -3 } };

export const createPost = async (req, res) => {
  try {
    const result = sentiment.analyze(req.body.desc || "", turkishOptions);
    const newPost = new Post({
      userId: req.body.userId,
      authorId: req.user.id,
      authorName: req.body.authorName, // could also pull from req.user
      title: req.body.title,
      desc: req.body.desc,
      img: req.file ? req.file.path : "",
      sentiment: result.score,
      isPrivate: req.body.isPrivate === 'true',
      diaryId: req.body.diaryId
    });
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) { res.status(500).json(err); }
};

export const getPostsByDiary = async (req, res) => {
  try {
     const { diaryId, page = 1, limit = 20 } = req.query;
     const skip = (page - 1) * limit;

     const diary = await Diary.findById(diaryId);
     if (!diary) return res.status(404).json("Defter bulunamadı");
     
     const isOwner = diary.authorId === req.user.id;
     const isGranted = diary.grantedAccess.includes(req.user.id);
     
     if (diary.isPrivate && !isOwner && !isGranted) {
        return res.status(403).json("Defter kilitli. İzin almanız gerekiyor.");
     }

     const posts = await Post.find({ diaryId }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
     res.status(200).json(posts);
  } catch(err) { res.status(500).json(err); }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Sayfa bulunamadı");
    
    if (post.authorId === req.user.id) {
      const updateData = {
        title: req.body.title || post.title,
        desc: req.body.desc || post.desc,
      };
      if (req.body.isPrivate !== undefined) {
         updateData.isPrivate = req.body.isPrivate === 'true' || req.body.isPrivate === true;
      }
      if (req.file) updateData.img = req.file.path;

      const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
      res.status(200).json(updatedPost);
    } else {
      res.status(403).json("Sadece kendi sayfanızı güncelleyebilirsiniz");
    }
  } catch (err) { res.status(500).json(err); }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Bulunamadı");
    
    // Yazar VEYA defter sahibi silebilir
    if (post.userId === req.user.id || post.authorId === req.user.id) {
      await post.deleteOne();
      res.status(200).json("Sayfa koparıldı");
    } else { 
      res.status(403).json("Yetkiniz yok"); 
    }
  } catch (err) { res.status(500).json(err); }
};
