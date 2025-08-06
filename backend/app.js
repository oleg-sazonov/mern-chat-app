import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { startServer } from "./utils/serverStartup.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createServerConfig = () => {
    const PORT = process.env.PORT || 5000;
    const NODE_ENV = process.env.NODE_ENV || "development";
    const projectRoot = path.resolve(__dirname, "..");

    return { PORT, NODE_ENV, __dirname: projectRoot };
};

export const createApp = () => {
    const app = express();
    const { NODE_ENV, __dirname } = createServerConfig();

    console.log("🚀 Starting MERN Chat-App Server...");
    console.log(`📍 Environment: ${NODE_ENV}`);
    // console.log(`📂 Project Root: ${__dirname}`);

    return app;
};

export const bootstrap = async () => {
    try {
        // Get server configuration
        const { PORT, NODE_ENV, __dirname } = createServerConfig();

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
