/**
 * protectRoute Middleware
 * -----------------------
 * Protects routes by ensuring the request has a valid JWT token in cookies.
 *
 * Usage:
 *   Add as middleware to any route that requires authentication.
 *   Example:
 *     router.post("/send/:receiverId", protectRoute, sendMessage);
 *
 * How it works:
 *   1. Extracts the JWT token from the "jwt" cookie.
 *   2. Verifies the token using the JWT secret.
 *   3. Finds the user by ID from the decoded token (excluding password).
 *   4. Attaches the user object to req.user for downstream handlers.
 *   5. If any step fails, responds with an appropriate error and status code.
 *
 * Error Handling:
 *   - 401 Unauthorized: No token provided.
 *   - 403 Unauthorized: Invalid token or forbidden access.
 *   - 404 Not Found:    User not found in database.
 *
 * Dependencies:
 *   - jsonwebtoken
 *   - User model
 */

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies?.jwt;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        }

        // Check if token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res
                .status(403)
                .json({ message: "Unauthorized - Invalid token" });
        }

        // Find user by ID from token. decoded.id is the user ID. selecting -password to avoid sending password hash in response.
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return res.status(403).json({ message: "Forbidden access" });
    }
};
