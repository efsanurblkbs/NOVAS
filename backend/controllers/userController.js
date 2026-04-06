import User from "../models/User.js";
import Diary from "../models/Diary.js";
import Notification from "../models/Notification.js";

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Resim yüklenemedi." });
    
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { profilePicture: req.file.path } }, { new: true });
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) { res.status(500).json(err); }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    const publicDiaries = await Diary.find({ isPrivate: false });
    
    const cleanUsers = users.map(user => {
      const { password, ...other } = user._doc;
      const userPublicDiaries = publicDiaries.filter(d => d.authorId === other._id.toString());
      return { 
        ...other, 
        diaryCount: userPublicDiaries.length
      };
    });
    res.status(200).json(cleanUsers);
  } catch (err) { res.status(500).json(err); }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("Kullanıcı bulunamadı.");
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) { res.status(500).json({ message: "Profil getirilirken hata oluştu", error: err });}
};

export const followUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); 
      const currentUser = await User.findById(req.user.id);
      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        
        // Takip Bildirimi
        const newNotif = new Notification({
           senderId: currentUser._id.toString(),
           senderName: currentUser.username,
           receiverId: user._id.toString(),
           type: "FOLLOW",
           status: "PENDING"
        });
        await newNotif.save();

        res.status(200).json("Kullanıcı takip edildi.");
      } else { res.status(403).json("Bu kullanıcıyı zaten takip ediyorsun.");}
    } catch (err) { res.status(500).json(err); }
  } else { res.status(403).json("Kendini takip edemezsin."); }
};

export const unfollowUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);
      if (user.followers.includes(req.user.id)) {
        await user.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("Takipten çıkıldı.");
      } else { res.status(403).json("Zaten takip etmiyorsun."); }
    } catch (err) { res.status(500).json(err); }
  } else { res.status(403).json("Kendini takipten çıkaramazsın."); }
};
