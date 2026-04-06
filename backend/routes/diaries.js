import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createDiary, getUserDiaries, getDiaryById, deleteDiary } from "../controllers/diaryController.js";

const router = express.Router();

router.post("/", verifyToken, createDiary);
router.get("/", verifyToken, getUserDiaries);
router.get("/:id", verifyToken, getDiaryById);
router.delete("/:id", verifyToken, deleteDiary);

export default router;
