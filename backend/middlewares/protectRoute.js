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
