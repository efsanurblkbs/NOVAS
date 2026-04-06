import express from "express";
import upload from "../utils/cloudinary.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { updateAvatar, getAllUsers, getUserProfile, followUser, unfollowUser } from "../controllers/userController.js";

const router = express.Router();

router.put("/:id/avatar", verifyToken, upload.single("profilePicture"), updateAvatar);
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserProfile);
router.put("/:id/follow", verifyToken, followUser);
router.put("/:id/unfollow", verifyToken, unfollowUser);

export default router;