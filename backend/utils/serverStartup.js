import { connectDB } from "../config/db/db.config.js";

export const startServer = async (app, PORT, NODE_ENV) => {
    try {
        // Connect to database first
        console.log("🔌 Connecting to database...");
        await connectDB();

        // Start the server
        const server = app.listen(PORT, () => {
            logServerStartup(PORT, NODE_ENV);
        });

        // Handle server-specific errors
        setupServerErrorHandling(server, PORT);

        return server;
    } catch (error) {
        handleStartupError(error);
    }
};

const logServerStartup = (PORT, NODE_ENV) => {
    console.log("\n" + "=".repeat(60));
    console.log("🎉 MERN Store Server Started Successfully!");
    console.log("=".repeat(60));
    console.log(`🚀 Server running on port: ${PORT}`);
    console.log(`📊 Environment: ${NODE_ENV}`);
    // console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    // console.log(
    //     `🛡️  Security: ${
    //         NODE_ENV === "production" ? "Production grade" : "Development mode"
    //     }`
    // );

    if (NODE_ENV === "development") {
        console.log(`🌐 Local server: http://localhost:${PORT}`);
        console.log(`📱 Frontend dev: http://localhost:5173`);
        // console.log(`🔍 API base: http://localhost:${PORT}/api`);
        // console.log(`💡 Tip: Rate limiting is disabled in development`);
    } else {
        console.log(`📦 Static files: Serving from frontend/dist`);
        console.log(`🌐 Production app: http://localhost:${PORT}`);
    }

    console.log("=".repeat(60) + "\n");
};

const setupServerErrorHandling = (server, PORT) => {
    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            console.error(`❌ Port ${PORT} is already in use!`);
            console.log("💡 Solutions:");
            console.log("   1. Change PORT in your .env file");
            console.log("   2. Kill the process using this port:");
            console.log(
                `      Windows: netstat -ano | findstr :${PORT} && taskkill /PID <PID> /F`
            );
            console.log(`      Mac/Linux: lsof -ti:${PORT} | xargs kill -9`);
            console.log("   3. Use a different port: PORT=5001 npm run dev");
        } else {
            console.error("❌ Server error:", error.message);
        }
        process.exit(1);
    });

    // Set server timeout for production
    if (process.env.NODE_ENV === "production") {
        server.timeout = 30000; // 30 seconds
    }
};

const handleStartupError = (error) => {
    console.error("❌ Failed to start server:");
    console.error("   Error:", error.message);

    // Provide helpful error messages based on error type
    if (error.message.includes("MONGODB_URI")) {
        console.error("💡 Check your MongoDB connection string in .env file");
    } else if (error.message.includes("ENOTFOUND")) {
        console.error(
            "💡 Check your internet connection and database accessibility"
        );
    } else if (error.message.includes("authentication")) {
        console.error("💡 Check your database credentials");
    } else if (error.message.includes("EADDRINUSE")) {
        console.error(
            "💡 Port is already in use. Try a different port or kill the existing process"
        );
    }

    process.exit(1);
};
