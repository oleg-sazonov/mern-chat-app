/**
 * setupBasicMiddlewares
 * ---------------------
 * Configures and applies essential middlewares to the Express app.
 *
 * Parameters:
 *   - app (Express): The Express application instance.
 *   - NODE_ENV (string): The current environment ("development" or "production").
 *   - frontendDistPath (string): The path to the frontend build directory for serving static files.
 *
 * Middlewares Applied:
 *   1. **Compression**:
 *      - Enables gzip compression for HTTP responses to reduce payload size.
 *      - Improves performance by minimizing the amount of data sent to clients.
 *
 *   2. **Cookie Parser**:
 *      - Parses cookies attached to client requests.
 *      - Populates `req.cookies` with an object keyed by cookie names.
 *
 *   3. **Logging (Commented Out)**:
 *      - Uses `morgan` to log HTTP requests.
 *      - Can be configured to use "dev" format for development or "combined" format for production.
 *      - Currently commented out but can be enabled as needed.
 *
 *   4. **Body Parser (JSON)**:
 *      - Parses incoming JSON requests with a size limit of 10MB.
 *      - Attaches the raw body to `req.rawBody` for additional processing if needed.
 *
 *   5. **Body Parser (URL-encoded)**:
 *      - Parses URL-encoded data with a size limit of 10MB.
 *      - Supports extended syntax for rich objects and arrays.
 *
 *   6. **Static File Serving**:
 *      - Serves static files from the frontend build directory (`frontendDistPath`).
 *      - Allows the backend to serve the React app and other static assets in production.
 *
 * Usage:
 *   - Call `setupBasicMiddlewares(app, NODE_ENV, frontendDistPath)` early in your server setup to ensure
 *     all routes and controllers have access to parsed cookies, request bodies, and logging.
 *
 * Example:
 *   import express from "express";
 *   import { setupBasicMiddlewares } from "./middlewares/basicMiddlewares.js";
 *
 *   const app = express();
 *   const NODE_ENV = process.env.NODE_ENV || "development";
 *   const frontendDistPath = path.join(__dirname, "../frontend/dist");
 *
 *   setupBasicMiddlewares(app, NODE_ENV, frontendDistPath);
 */

import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express from "express";

export const setupBasicMiddlewares = (app, NODE_ENV, frontendDistPath) => {
    // Compression
    app.use(compression());

    // Cookie parsing
    app.use(cookieParser());

    // Logging
    // if (NODE_ENV === "production") {
    //     app.use(morgan("combined"));
    // } else {
    //     app.use(morgan("dev"));
    // }

    // Body parsing
    app.use(
        express.json({
            limit: "10mb",
            verify: (req, res, buf) => {
                req.rawBody = buf;
            },
        })
    );

    // URL-encoded data parsing
    app.use(
        express.urlencoded({
            extended: true,
            limit: "10mb",
        })
    );

    // Serve static files from the frontend build directory
    app.use(express.static(frontendDistPath));
};
