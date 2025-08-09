import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/:receiverId", protectRoute, getMessages); // Get messages for a specific receiver
router.post("/send/:receiverId", protectRoute, sendMessage); // Send message to a specific receiver

export default router;
