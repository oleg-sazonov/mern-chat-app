import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getConversationsWithLastMessage } from "../controllers/conversation.controller.js";

const router = express.Router();

// Route to fetch conversations with the last message
router.get("/", protectRoute, getConversationsWithLastMessage);

export default router;
