/**
 * Authentication Routes
 * ---------------------
 * Defines API routes for user authentication in the chat application.
 *
 * Routes:
 *   - POST /api/auth/signup:
 *       - Description: Registers a new user.
 *       - Controller: signup
 *
 *   - POST /api/auth/login:
 *       - Description: Authenticates a user and issues a JWT token.
 *       - Controller: login
 *
 *   - POST /api/auth/logout:
 *       - Description: Logs out the user by clearing the authentication cookie.
 *       - Controller: logout
 *
 * Usage:
 *   - Import this router into the main application and mount it under the `/api/auth` path.
 *       Example:
 *           import authRoutes from "./routes/auth.routes.js";
 *           app.use("/api/auth", authRoutes);
 */

import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
