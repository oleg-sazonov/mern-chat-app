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
