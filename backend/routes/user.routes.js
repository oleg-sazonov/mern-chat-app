/**
 * User Routes
 * -----------
 * Defines API routes for managing user-related functionality in the chat application.
 *
 * Middleware:
 *   - protectRoute: Ensures that only authenticated users can access these routes.
 *
 * Routes:
 *   - GET /api/users:
 *       - Description: Fetches a list of all users except the currently logged-in user.
 *       - Middleware: protectRoute
 *       - Controller: getUsersForSidebar
 *
 *   - GET /api/users/me:
 *       - Description: Fetches the details of the currently logged-in user.
 *       - Middleware: protectRoute
 *       - Controller: getCurrentUser
 *
 * Usage:
 *   - Import this router into the main application and mount it under the `/api/users` path.
 *       Example:
 *           import userRoutes from "./routes/user.routes.js";
 *           app.use("/api/users", userRoutes);
 */

import express from "express";
import {
    getUsersForSidebar,
    getCurrentUser,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar); // Only authenticated users can access this route
router.get("/me", protectRoute, getCurrentUser);

export default router;
