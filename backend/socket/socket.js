/**
 * Socket.IO JWT-Authenticated Gateway
 * -----------------------------------
 * Initializes a Socket.IO server, authenticates clients via JWT from httpOnly cookies,
 * tracks online users across multiple sockets/tabs, and broadcasts online presence.
 *
 * Exports:
 *   - `app`: The Express application instance.
 *   - `io`: The Socket.IO server instance.
 *   - `server`: The HTTP server instance.
 *   - `getReceiverSocketIds`: Utility function to retrieve active socket IDs for a specific user.
 *
 * Key Structures:
 *   - `userSockets`: A `Map` that tracks active socket IDs for each user (`userId -> Set<socketId>`).
 *
 * Features:
 *   - JWT Authentication:
 *       - Parses cookies from the WebSocket handshake request.
 *       - Verifies the `jwt` cookie using `process.env.JWT_SECRET`.
 *       - Attaches the `userId` to the socket instance upon successful authentication.
 *   - Multi-Tab/Device Support:
 *       - Tracks multiple active sockets for each user.
 *   - Online Presence:
 *       - Emits the `onlineUsers` event with the list of currently online user IDs.
 *   - Cleanup on Disconnect:
 *       - Removes the socket ID from the user's set.
 *       - If no sockets remain for a user, removes the user from `userSockets`.
 *       - Re-emits the updated `onlineUsers` list.
 *
 * Functions:
 *   - `parseCookies(cookieHeader: string) => Record<string, string>`:
 *       - Safely parses the `Cookie` header into a key-value map.
 *   - `getReceiverSocketIds(userId: string) => string[]`:
 *       - Retrieves an array of active socket IDs for a specific user.
 *
 * Events:
 *   - Server Emits:
 *       - `onlineUsers`: An array of user IDs currently online (have ≥ 1 active socket).
 *   - Client Emits:
 *       - `disconnect`: Triggered when a client disconnects.
 *
 * Security:
 *   - Trusts identity derived server-side from the verified JWT (cookie-based session).
 *   - Rejects unauthenticated connections by calling `next(new Error("Unauthorized"))` in `io.use`.
 *
 * Usage:
 *   - Frontend:
 *       const socket = io("http://localhost:5000", { withCredentials: true });
 *       socket.on("onlineUsers", (ids) => setOnlineUsers(ids));
 *
 * Example Workflow:
 *   1. Client connects with a valid JWT cookie.
 *   2. Server verifies the JWT and attaches the `userId` to the socket.
 *   3. The socket is added to the `userSockets` map.
 *   4. The server emits the updated `onlineUsers` list to all clients.
 *   5. On disconnect, the socket is removed, and the `onlineUsers` list is updated.
 */

import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Parse cookie header safely
const parseCookies = (cookieHeader = "") =>
    Object.fromEntries(
        cookieHeader
            .split(";")
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p) => {
                const idx = p.indexOf("=");
                if (idx === -1) return null;
                return [p.slice(0, idx), decodeURIComponent(p.slice(idx + 1))];
            })
            .filter(Boolean)
    );

export const getReceiverSocketIds = (userId) => {
    return Array.from(userSockets.get(userId) || []);
};

// userId -> Set<socketId>
const userSockets = new Map();

// Auth middleware: verify JWT from cookie and attach userId to socket
io.use((socket, next) => {
    try {
        const cookies = parseCookies(socket.request.headers?.cookie || "");
        const token = cookies.jwt;
        if (!token) return next(new Error("Unauthorized"));
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = payload.id?.toString();
        if (!socket.userId) return next(new Error("Unauthorized"));
        next();
    } catch (err) {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    const userId = socket.userId; // from verified JWT
    console.log("socket connected:", socket.id, "user:", userId);

    // Track this socket for the user
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);

    // Broadcast online users
    io.emit("onlineUsers", Array.from(userSockets.keys()));

    // Cleanup on disconnect
    socket.on("disconnect", () => {
        console.log("socket disconnected:", socket.id, "user:", userId);
        const set = userSockets.get(userId);
        if (set) {
            set.delete(socket.id);
            if (set.size === 0) userSockets.delete(userId);
        }
        io.emit("onlineUsers", Array.from(userSockets.keys()));
    });
});

export { app, io, server };
