/**
 * Message Routes
 * --------------
 * Defines API routes for managing messages in the chat application.
 *
 * Middleware:
 *   - protectRoute: Ensures that only authenticated users can access these routes.
 *
 * Routes:
 *   - GET /api/messages/:receiverId:
 *       - Description: Retrieves all messages in a conversation between the logged-in user and the specified receiver.
 *       - Middleware: protectRoute
 *       - Controller: getMessages
 *
 *   - POST /api/messages/send/:receiverId:
 *       - Description: Sends a message from the logged-in user to the specified receiver.
 *       - Middleware: protectRoute
 *       - Controller: sendMessage
 *
 * Usage:
 *   - Import this router into the main application and mount it under the `/api/messages` path.
 *       Example:
 *           import messageRoutes from "./routes/message.routes.js";
 *           app.use("/api/messages", messageRoutes);
 */

import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/:receiverId", protectRoute, getMessages); // Get messages for a specific receiver
router.post("/send/:receiverId", protectRoute, sendMessage); // Send message to a specific receiver

export default router;
