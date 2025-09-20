/**
 * Socket.IO JWT-Authenticated Gateway (Selected Section)
 * ------------------------------------------------------
 * Initializes a Socket.IO server, authenticates clients via JWT from httpOnly cookies,
 * tracks online users across multiple sockets/tabs, and broadcasts online presence.
 *
 * What this code does
 * - Creates an HTTP server + Socket.IO instance with CORS configured for the Vite dev origin.
 * - Parses cookies from the WebSocket upgrade request.
 * - Verifies the `jwt` cookie using process.env.JWT_SECRET and binds `socket.userId`.
 * - Maintains a userId -> Set<socketId> map (supports multiple tabs/devices per user).
 * - On connect: adds the socket to the user's set and emits `onlineUsers` to all clients.
 * - On disconnect: removes the socket; if the user has no more sockets, removes the user and re-emits `onlineUsers`.
 *
 * Security model
 * - Trusts identity derived server-side from the verified JWT (cookie), not from client-sent params.
 * - Tokens are created elsewhere via [`generateTokenAndSetCookie`](../utils/generateToken.js).
 * - Rejects unauthenticated connections by calling `next(new Error("Unauthorized"))` in `io.use`.
 *
 * Key structures
 * - parseCookies(cookieHeader: string) => Record<string,string>
 *   Safely parses the Cookie header into a key/value map.
 *
 * - userSockets: Map<string, Set<string>>
 *   Maps a userId (string) to a set of active socket IDs. Supports multi-tab presence.
 *
 * Events and payloads
 * - Server emits:
 *   - "onlineUsers": string[]
 *     An array of user IDs currently considered online (have ≥ 1 active socket).
 *
 * - Client should:
 *   - Connect with credentials enabled so cookies are sent:
 *       io("http://localhost:5000", { withCredentials: true })
 *   - Listen for "onlineUsers" to update presence. See [`useSocketContext`](../../../frontend/src/store/SocketContext.jsx).
 *
 * Connection lifecycle
 * - io.use(authMiddleware):
 *     1) Parses cookies from the handshake request.
 *     2) Verifies JWT and extracts `payload.id` as `socket.userId`.
 *     3) Rejects if missing/invalid.
 *
 * - io.on("connection", socket):
 *     1) Adds socket.id to userSockets[userId].
 *     2) Broadcasts `onlineUsers` to all clients.
 *     3) On "disconnect":
 *         - Removes socket.id from the user's set.
 *         - If the set is empty, removes the userId.
 *         - Broadcasts `onlineUsers` again.
 *
 * CORS
 * - Configured to allow origin http://localhost:5173 with credentials for local development.
 * - Ensure the HTTP app also allows credentials if using REST + cookies.
 *
 * Error handling
 * - Auth errors during handshake propagate as "Unauthorized" and the connection is rejected.
 * - Disconnect cleanup is resilient even if maps/sets are missing.
 *
 * Best practices embodied here
 * - Derive identity from server-verified JWT (cookie-based session) instead of trusting client-sent IDs.
 * - Track multiple sockets per user to represent true presence across tabs/devices.
 * - Emit presence changes only when they actually change (connect/disconnect).
 *
 * Integration tips
 * - Frontend:
 *     const socket = io("http://localhost:5000", { withCredentials: true });
 *     socket.on("onlineUsers", (ids) => setOnlineUsers(ids));
 *   See: [`useSocketContext`](../../../frontend/src/store/SocketContext.jsx)
 *
 * - Backend boot:
 *   This module exports { app, io, server } and is imported by [backend/app.js](../app.js)
 *   where the Express middlewares and routes are mounted on the same `app` instance.
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
