import authRoutes from "./auths.routes.js";

export const setupRoutes = (app) => {
    // Health check route (before API routes)
    app.get("/health", (req, res) => {
        res.status(200).json({
            status: "OK",
            message: "MERN ChatApp API is running",
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || "development",
        });
    });

    // API routes
    app.use("/api/auth", authRoutes);

    console.log("📋 API routes configured");
    console.log("   📍 GET    /health");
    console.log("   📍 GET    /api/auth/signup");
    console.log("   📍 GET    /api/auth/login");
    console.log("   📍 GET    /api/auth/logout");
};
