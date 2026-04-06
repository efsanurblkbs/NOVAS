import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { requestAccess, getNotifications, respondToRequest, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/request", verifyToken, requestAccess);
router.get("/", verifyToken, getNotifications);
router.put("/:id/respond", verifyToken, respondToRequest);
router.delete("/:id", verifyToken, deleteNotification);

export default router;
