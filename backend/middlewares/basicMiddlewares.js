/**
 * setupBasicMiddlewares
 * ---------------------
 * Configures and applies essential middlewares to the Express app.
 *
 * Parameters:
 *   - app: The Express application instance.
 *   - NODE_ENV: The current environment ("development" or "production").
 *
 * Middlewares applied:
 *   1. Compression: Enables gzip compression for responses.
 *   2. Cookie Parser: Parses cookies attached to client requests and populates req.cookies.
 *   3. Logging (Morgan): Logs HTTP requests in "dev" format for development, "combined" for production.
 *   4. Body Parser (JSON): Parses incoming JSON requests with a 10MB limit and attaches raw body to req.rawBody.
 *   5. Body Parser (URL-encoded): Parses URL-encoded data with a 10MB limit.
 *
 * Usage:
 *   Call setupBasicMiddlewares(app, NODE_ENV) early in your server setup to ensure all routes and controllers
 *   have access to parsed cookies, request bodies, and logging.
 *
 * Dependencies:
 *   - compression
 *   - morgan
 *   - cookie-parser
 *   - express
 */

import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express from "express";

export const setupBasicMiddlewares = (app, NODE_ENV) => {
    // Compression
    app.use(compression());

    // Cookie parsing
    app.use(cookieParser());

    // Logging
    if (NODE_ENV === "production") {
        app.use(morgan("combined"));
    } else {
        app.use(morgan("dev"));
    }

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
};
