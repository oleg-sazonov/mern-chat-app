import authRoutes from "./auth.routes.js";
import messageRoutes from "./message.routes.js";
import userRoutes from "./user.routes.js";

import { getDBHealth } from "../config/db/db.config.js";

export const setupRoutes = async (app) => {
    // Health check route (before API routes)
    app.get("/health", async (req, res) => {
        // res.status(200).json({
        //     status: "OK",
        //     message: "MERN ChatApp API is running",
        //     timestamp: new Date().toISOString(),
        //     environment: process.env.NODE_ENV || "development",
        // });

        const dbHealth = await getDBHealth();
        res.json(dbHealth);
    });

    // API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/messages", messageRoutes);
    app.use("/api/users", userRoutes);

    console.log("📋 API routes configured");
    console.log("Available routes:");
    console.log("   📍 GET     /health");
    console.log("   📍 POST    /api/auth/signup");
    console.log("   📍 POST    /api/auth/login");
    console.log("   📍 POST    /api/auth/logout");
    console.log("   📍 GET     /api/messages/:receiverId (protected)");
    console.log("   📍 POST    /api/messages/send/:receiverId (protected)");
    console.log("   📍 GET     /api/users (protected)");
};
