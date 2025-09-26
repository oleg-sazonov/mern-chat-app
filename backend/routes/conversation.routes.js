/**
 * Conversation Routes
 * -------------------
 * Defines API routes for managing conversations in the chat application.
 *
 * Middleware:
 *   - protectRoute: Ensures that only authenticated users can access these routes.
 *
 * Routes:
 *   - GET /api/conversations:
 *       - Description: Fetches all conversations for the logged-in user, including the last message and participant details.
 *       - Middleware: protectRoute
 *       - Controller: getConversationsWithLastMessage
 *
 *   - POST /api/conversations/:id/read:
 *       - Description: Marks a specific conversation as read for the logged-in user.
 *       - Middleware: protectRoute
 *       - Controller: markConversationRead
 *
 * Usage:
 *   - Import this router into the main application and mount it under the `/api/conversations` path.
 *       Example:
 *           import conversationRoutes from "./routes/conversation.routes.js";
 *           app.use("/api/conversations", conversationRoutes);
 */

import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
    getConversationsWithLastMessage,
    markConversationRead,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.get("/", protectRoute, getConversationsWithLastMessage);
router.post("/:id/read", protectRoute, markConversationRead);

export default router;
