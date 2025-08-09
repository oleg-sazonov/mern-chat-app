import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServerConfig } from "./config/server/server.config.js";
import { setupBasicMiddlewares } from "./middlewares/basicMiddlewares.js";
import { setupProcessHandlers } from "./utils/processHandlers.js";
import { startServer } from "./utils/serverStartup.js";
import { setupRoutes } from "./routes/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create and configure the Express application
export const createApp = () => {
    const app = express();
    const { NODE_ENV } = createServerConfig(__dirname);

    console.log("🚀 Starting MERN Chat-App Server...");
    console.log(`📍 Environment: ${NODE_ENV}`);

    // Setup basic middleware
    setupBasicMiddlewares(app, NODE_ENV);

    // Routes
    setupRoutes(app);

    return app;
};

// Bootstrap function to initialize the application
export const bootstrap = async () => {
    try {
        // Setup process handlers first
        setupProcessHandlers();

        // Get server configuration
        const { PORT, NODE_ENV } = createServerConfig(__dirname);

        // Create Express app with all middleware and routes
        const app = createApp();

        // Start the server
        const server = await startServer(app, PORT, NODE_ENV);

        return { app, server, PORT, NODE_ENV };
    } catch (error) {
        console.error("💥 Failed to bootstrap application:", error.message);
        process.exit(1);
    }
};
