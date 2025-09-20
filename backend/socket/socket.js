/**
 * Socket.IO Server Setup
 * ----------------------
 * This module initializes a Socket.IO server for real-time communication in the MERN Chat App.
 *
 * Exports:
 *   - `app`: The Express application instance.
 *   - `io`: The Socket.IO server instance.
 *   - `server`: The HTTP server instance.
 *
 * Features:
 *   - Tracks online users and their socket connections.
 *   - Emits the list of online users to all connected clients.
 *   - Handles user connection and disconnection events.
 *
 * Dependencies:
 *   - `socket.io`: Provides real-time, bidirectional communication between clients and the server.
 *   - `http`: Used to create the HTTP server.
 *   - `express`: Provides the Express application instance.
 *
 * Usage:
 *   - Import this module in your backend entry point (e.g., `server.js`) to initialize the Socket.IO server.
 *   - Use the `io` instance to emit or listen for custom events.
 *
 * Example:
 *   - Import and start the server:
 *       import { server } from "./socket/socket.js";
 *       server.listen(5000, () => console.log("Server running on port 5000"));
 *
 * State:
 *   - `userSocketMap`: An object mapping user IDs to their corresponding socket IDs.
 *       Example: { "userId1": "socketId1", "userId2": "socketId2" }
 *
 * Events:
 *   - `connection`: Triggered when a client connects to the server.
 *       - Logs the socket ID of the connected client.
 *       - Maps the user ID (from the query parameters) to the socket ID.
 *       - Emits the updated list of online users to all connected clients.
 *   - `disconnect`: Triggered when a client disconnects from the server.
 *       - Logs the socket ID of the disconnected client.
 *       - Removes the user ID from the `userSocketMap`.
 *       - Emits the updated list of online users to all connected clients.
 *
 * Example Workflow:
 *   1. A user connects to the server with their `userId` in the query parameters.
 *   2. The server maps the `userId` to the socket ID and stores it in `userSocketMap`.
 *   3. The server emits the updated list of online users to all connected clients.
 *   4. When a user disconnects, their `userId` is removed from `userSocketMap`.
 *   5. The server emits the updated list of online users to all connected clients.
 */

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected with socket ID:", socket.id);

    const { userId } = socket.handshake.query;
    if (userId != null && userId !== undefined) {
        userSocketMap[userId] = socket.id;
        console.log("User connected with ID:", userId);
        console.log("================================");

        // Emit the updated list of online users to all connected clients
        // This will notify all clients about the current online users
        io.emit("onlineUsers", Object.keys(userSocketMap));
    }

    // socket.on() is used to listen for the events from both client and server sides
    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);

        delete userSocketMap[userId];

        // Emit the updated list of online users to all connected clients
        // This will notify all clients about the current online users
        io.emit("onlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
