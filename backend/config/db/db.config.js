/**
 * db.config.js
 * ------------
 * MongoDB connection configuration and management using Mongoose.
 *
 * Features:
 *   - Registers connection event handlers (connected, error, disconnected, reconnected, timeout) only once.
 *   - Validates MongoDB URI and its format before connecting.
 *   - Provides optimized connection options for pool size, timeouts, and monitoring.
 *   - Masks sensitive credentials in logs for security.
 *   - Handles and logs connection errors with helpful hints.
 *   - Exports functions to connect and disconnect from MongoDB.
 *   - Provides helper functions for connection status and health checks.
 *
 * Functions:
 *   - connectDB: Connects to MongoDB using environment variables and logs connection status.
 *   - disconnectDB: Gracefully disconnects from MongoDB and logs status.
 *   - isConnected: Returns true if Mongoose is connected to MongoDB.
 *   - getConnectionInfo: Returns connection details (name, host, readyState).
 *   - getDBHealth: Returns health status of the MongoDB connection (connected/disconnected/error).
 *
 * Usage:
 *   Import and call connectDB() during server startup to establish a database connection.
 *   Call disconnectDB() for graceful shutdown.
 *   Use getDBHealth() in health check routes to monitor database status.
 *
 * Example:
 *   import { connectDB, disconnectDB, getDBHealth } from "./config/db/db.config.js";
 *   await connectDB();
 *   // ... later, on shutdown
 *   await disconnectDB();
 *   // In a route handler:
 *   const dbHealth = await getDBHealth();
 *
 * Dependencies:
 *   - mongoose
 */

import mongoose from "mongoose";

// 🔧 OPTIMIZED: Register event handlers only once
let eventHandlersRegistered = false;

const registerConnectionEventHandlers = () => {
    if (eventHandlersRegistered) return;

    mongoose.connection.on("connected", () => {
        console.log("📊 Mongoose connected to MongoDB");
        if (process.env.NODE_ENV === "development") {
            console.log(`📊 Database: ${mongoose.connection.name}`);
        }
    });

    mongoose.connection.on("error", (err) => {
        console.error("❌ Mongoose connection error occurred");
        if (process.env.NODE_ENV === "development") {
            console.error("Error details:", err.message);
        }
    });

    mongoose.connection.on("disconnected", () => {
        console.log("🔌 Mongoose disconnected from MongoDB");
    });

    mongoose.connection.on("reconnected", () => {
        console.log("🔄 Mongoose reconnected to MongoDB");
    });

    mongoose.connection.on("timeout", () => {
        console.error("⏰ MongoDB connection timeout");
    });

    eventHandlersRegistered = true;
};

export const connectDB = async () => {
    try {
        // 🔧 OPTIMIZED: Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("📊 Already connected to MongoDB");
            return mongoose.connection;
        }

        // Register event handlers only once
        registerConnectionEventHandlers();

        // 🔐 SECURE: Validate MongoDB URI
        const dbURI = process.env.MONGODB_URI;
        if (!dbURI) {
            throw new Error("MONGODB_URI environment variable is required");
        }

        // 🔐 SECURE: Validate URI format
        if (
            !dbURI.startsWith("mongodb://") &&
            !dbURI.startsWith("mongodb+srv://")
        ) {
            throw new Error("Invalid MongoDB URI format");
        }

        // 🔧 OPTIMIZED: Simplified connection options
        const options = {
            // Connection management
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,

            // Heartbeat
            heartbeatFrequencyMS: 10000,

            // Write concern and read preference
            retryWrites: true,
            w: "majority",
            readPreference: "primary",

            // Development monitoring
            ...(process.env.NODE_ENV === "development" && {
                monitorCommands: true,
            }),
        };

        // Connect to MongoDB
        const conn = await mongoose.connect(dbURI, options);

        // 🔐 SECURE: Safe connection confirmation
        console.log("✅ MongoDB connected successfully");

        if (process.env.NODE_ENV === "development") {
            const maskedUri = dbURI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
            console.log(
                `📊 Connection: ${
                    maskedUri.split("@")[1]?.split("/")[0] || "hidden"
                }`
            );
        }

        return conn;
    } catch (error) {
        console.error("❌ MongoDB connection failed:");

        // 🔐 SECURE: Safe error logging
        const safeErrorMessage = error.message.replace(
            /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/g,
            "mongodb$1://***:***@"
        );
        console.error("   Error:", safeErrorMessage);

        // 🔧 OPTIMIZED: Simplified error messages
        const errorHelp = {
            MONGODB_URI: "💡 Make sure MONGODB_URI is set in your .env file",
            authentication:
                "💡 Check your MongoDB credentials and authentication",
            network:
                "💡 Check your internet connection and MongoDB server accessibility",
            timeout:
                "💡 MongoDB server is taking too long to respond. Check server status.",
            SSL: "💡 SSL/TLS connection issue. Check your MongoDB SSL configuration.",
            "not supported":
                "💡 Some connection options are deprecated. Please check MongoDB documentation.",
        };

        // Find and display relevant error message
        const errorType = Object.keys(errorHelp).find((key) =>
            error.message.toLowerCase().includes(key.toLowerCase())
        );

        if (errorType) {
            console.error(errorHelp[errorType]);
        }

        process.exit(1);
    }
};

export const disconnectDB = async () => {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("🔌 MongoDB disconnected successfully");
        }
    } catch (error) {
        console.error("❌ Error disconnecting from MongoDB");
        if (process.env.NODE_ENV === "development") {
            console.error("Error details:", error.message);
        }
    }
};

// 🔧 OPTIMIZED: Enhanced helper functions remain the same
export const isConnected = () => mongoose.connection.readyState === 1;

export const getConnectionInfo = () => {
    if (!isConnected()) {
        return { connected: false };
    }

    return {
        connected: true,
        readyState: mongoose.connection.readyState,
        ...(process.env.NODE_ENV === "development" && {
            name: mongoose.connection.name,
            host: mongoose.connection.host?.replace(/^.*@/, "***@") || "hidden",
        }),
    };
};

export const getDBHealth = async () => {
    try {
        if (!isConnected()) {
            return { status: "disconnected", healthy: false };
        }

        await mongoose.connection.db.admin().ping();

        return {
            status: "connected",
            healthy: true,
            readyState: mongoose.connection.readyState,
            uptime: process.uptime(),
        };
    } catch (error) {
        return {
            status: "error",
            healthy: false,
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Connection error",
        };
    }
};
