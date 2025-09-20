/**
 * Application Bootstrap and Configuration
 * ----------------------------------------
 * This module sets up and bootstraps the backend application for the MERN Chat App.
 * It integrates Express, Socket.IO, middleware, routes, and server startup logic.
 *
 * Exports:
 *   - `createApp`: Configures and returns the Express application instance.
 *   - `bootstrap`: Initializes the application, sets up process handlers, and starts the server.
 *
 * Dependencies:
 *   - `dotenv`: Loads environment variables from a `.env` file.
 *   - `path`: Provides utilities for working with file and directory paths.
 *   - `url`: Provides utilities for working with file URLs.
 *   - `./socket/socket.js`: Initializes the Socket.IO server and exports the `app` and `server` instances.
 *   - `./config/server/server.config.js`: Provides server configuration (e.g., PORT, NODE_ENV).
 *   - `./middlewares/basicMiddlewares.js`: Sets up essential middleware (e.g., compression, logging).
 *   - `./routes/index.js`: Configures API routes for the application.
 *   - `./utils/processHandlers.js`: Sets up process-level handlers for graceful shutdown and error handling.
 *   - `./utils/serverStartup.js`: Handles server startup logic.
 *
 * Functions:
 *   - `createApp()`: Configures the Express application with middleware and routes.
 *   - `bootstrap()`: Initializes the application, sets up process handlers, and starts the server.
 *
 * Usage:
 *   - Import and call the `bootstrap` function in your entry point (e.g., `server.js`) to start the application.
 *
 * Example:
 *   - Starting the application:
 *       import { bootstrap } from "./app.js";
 *       bootstrap().then(({ app, server, PORT }) => {
 *           console.log(`Server running on port ${PORT}`);
 *       });
 *
 * Environment Variables:
 *   - `PORT`: The port on which the server will run (default: 5000).
 *   - `NODE_ENV`: The environment mode ("development" or "production").
 *
 * Features:
 *   - Integrates Socket.IO for real-time communication.
 *   - Configures middleware for logging, compression, and request parsing.
 *   - Sets up API routes for authentication, messaging, and user management.
 *   - Handles process-level events for graceful shutdown and error handling.
 *
 * Functions:
 *   - `createApp()`:
 *       - Configures the Express application with middleware and routes.
 *       - Returns the configured application instance.
 *   - `bootstrap()`:
 *       - Sets up process handlers for graceful shutdown and error handling.
 *       - Configures and starts the HTTP server with Socket.IO integration.
 *       - Returns the application, server, and configuration details.
 *
 * Example Workflow:
 *   1. Load environment variables using `dotenv`.
 *   2. Configure the Express application with middleware and routes.
 *   3. Initialize the Socket.IO server for real-time communication.
 *   4. Start the HTTP server and log the server details.
 *   5. Handle process-level events for graceful shutdown and error handling.
 */

// import express from "express";
import { app, server } from "./socket/socket.js";
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
    // const app = express();
    const socketIOApp = app;
    const { NODE_ENV } = createServerConfig(__dirname);

    console.log("🚀 Starting MERN Chat-App Server...");
    console.log(`📍 Environment: ${NODE_ENV}`);

    // Setup basic middleware
    setupBasicMiddlewares(socketIOApp, NODE_ENV);

    // Routes
    setupRoutes(socketIOApp);

    return socketIOApp;
};

// Bootstrap function to initialize the application
export const bootstrap = async () => {
    try {
        // Setup process handlers first
        setupProcessHandlers();

        // Get server configuration
        const { PORT, NODE_ENV } = createServerConfig(__dirname);

        // Create Express app with all middleware and routes
        const application = createApp();

        // Use the existing HTTP server with Socket.io
        const socketIOServer = server;

        // Start the server
        const startedSocketIOServer = await startServer(
            socketIOServer,
            PORT,
            NODE_ENV
        );

        return {
            app: application,
            server: startedSocketIOServer,
            PORT,
            NODE_ENV,
        };
    } catch (error) {
        console.error("💥 Failed to bootstrap application:", error.message);
        process.exit(1);
    }
};
