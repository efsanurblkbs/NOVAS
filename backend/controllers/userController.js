import User from "../models/User.js";
import Diary from "../models/Diary.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";

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
    const users = await User.find().select("-password");
    const usersWithDiaries = await Promise.all(
      users.map(async (user) => {
        const diaries = await Diary.find({ authorId: user._id })
          .sort({ createdAt: -1 })
          .limit(3)
          .select("title coverColor");
        return { ...user._doc, lastDiaries: diaries };
      })
    );
    res.status(200).json(usersWithDiaries);
  } catch (err) { res.status(500).json({ message: "Kullanıcılar getirilemedi", error: err }); }
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
        // DÜZELTME: followings -> following
        await currentUser.updateOne({ $push: { following: req.params.id } });
        
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
        // DÜZELTME: followings -> following
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("Takipten çıkıldı.");
      } else { res.status(403).json("Zaten takip etmiyorsun."); }
    } catch (err) { res.status(500).json(err); }
  } else { res.status(403).json("Kendini takipten çıkaramazsın."); }
};

export const removeFollower = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const follower = await User.findById(req.params.id);
    if (user.followers.includes(req.params.id)) {
      await user.updateOne({ $pull: { followers: req.params.id } });
      // DÜZELTME: followings -> following
      await follower.updateOne({ $pull: { following: req.user.id } });
      res.status(200).json("Takipçi başarıyla çıkarıldı.");
    } else { res.status(404).json("Takipçi bulunamadı."); }
  } catch (err) { res.status(500).json(err); }
};

export const updateUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      const { password, ...others } = updatedUser._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("Sadece kendi hesabını güncelleyebilirsin!");
  }
};

export const deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      // Önce kullanıcının defterlerini ve bildirimlerini sil (opsiyonel ama temizlik için iyi)
      await Diary.deleteMany({ authorId: req.params.id });
      await Notification.deleteMany({ $or: [{ senderId: req.params.id }, { receiverId: req.params.id }] });
      
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Hesabın başarıyla silindi.");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("Sadece kendi hesabını silebilirsin!");
  }
};
