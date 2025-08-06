import { disconnectDB } from "../config/db/db.config.js";

export const setupProcessHandlers = () => {
    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
        console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
        try {
            // 🔐 SECURE: Close database connection properly
            console.log("🔄 Closing database connections...");
            await disconnectDB();

            console.log("👋 Server shutdown complete!");
            process.exit(0);
        } catch (error) {
            console.error("❌ Error during shutdown:", error.message);
            process.exit(1);
        }
    };

    // Handle different termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
        console.error("🚨 Unhandled Promise Rejection at:", promise);
        console.error("🚨 Reason:", reason);
        if (process.env.NODE_ENV === "production") {
            console.log(
                "🛑 Shutting down due to unhandled promise rejection..."
            );
            process.exit(1);
        }
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
        console.error("🚨 Uncaught Exception:", error.message);
        console.error("🚨 Stack:", error.stack);
        console.log("🛑 Shutting down due to uncaught exception...");
        process.exit(1);
    });
};
