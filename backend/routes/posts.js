import express from "express";
import upload from "../utils/cloudinary.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { createPost, getPostsByDiary, updatePost, deletePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("img"), createPost);
router.get("/", verifyToken, getPostsByDiary);
router.put("/:id", verifyToken, upload.single("img"), updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;