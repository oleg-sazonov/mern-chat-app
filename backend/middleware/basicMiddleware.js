import compression from "compression";
import morgan from "morgan";
import express from "express";

export const setupBasicMiddleware = (app, NODE_ENV) => {
    // Compression
    app.use(compression());

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
