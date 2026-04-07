import Notification from "../models/Notification.js";
import Diary from "../models/Diary.js";
import User from "../models/User.js";

export const requestAccess = async (req, res) => {
  try {
    const { diaryId } = req.body;
    const diary = await Diary.findById(diaryId);
    if (!diary) return res.status(404).json("Defter bulunamadı.");
    if (diary.authorId === req.user.id) return res.status(400).json("Kendi defterinize istek atamazsınız.");

    const existingRequest = await Notification.findOne({
      senderId: req.user.id,
      diaryId: diaryId,
      status: "PENDING"
    });
    if (existingRequest) return res.status(400).json("Zaten beklemede olan bir isteğiniz var.");

    const sender = await User.findById(req.user.id);

    const newNotification = new Notification({
      senderId: req.user.id,
      receiverId: diary.authorId,
      senderName: sender.username,
      type: "ACCESS_REQUEST",
      diaryId: diary._id,
      diaryTitle: diary.title
    });

    await newNotification.save();
    res.status(200).json("Erişim isteği gönderildi.");
  } catch (err) { res.status(500).json(err); }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiverId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) { res.status(500).json(err); }
};

export const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'APPROVE' or 'REJECT'

    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json("Bildirim bulunamadı.");
    if (notification.receiverId !== req.user.id) return res.status(403).json("Yetkisiz.");

    if (action === "APPROVE") {
      await Diary.findByIdAndUpdate(notification.diaryId, {
        $addToSet: { grantedAccess: notification.senderId }
      });
      notification.status = "APPROVED";
    } else {
      notification.status = "REJECTED";
    }
    
    await notification.save();

    // Bi-directional Notification: İsteği atan kişiye (requester) sonucu bildir.
    const resultNotification = new Notification({
      senderId: req.user.id,
      receiverId: notification.senderId,
      senderName: req.user.username,
      type: "ACCESS_RESULT",
      diaryId: notification.diaryId,
      diaryTitle: notification.diaryTitle,
      status: action === "APPROVE" ? "APPROVED" : "REJECTED"
    });
    await resultNotification.save();

    res.status(200).json(notification);
  } catch (err) { res.status(500).json(err); }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if(notification && notification.receiverId === req.user.id) {
       await notification.deleteOne();
       res.status(200).json("Silindi.");
    } else {
       res.status(403).json("Yetkiniz yok.");
    }
  } catch (err) { res.status(500).json(err); }
};
