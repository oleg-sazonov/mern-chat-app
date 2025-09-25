/**
 * SocketContext
 * -------------
 * Provides a React context for managing the Socket.IO connection and online user state.
 *
 * Exports:
 *   - `SocketContext`: The React context for socket-related state and actions.
 *   - `useSocketContext`: A custom hook to access the `SocketContext`.
 *   - `SocketContextProvider`: A provider component that wraps the application and manages the Socket.IO connection.
 *
 * State:
 *   - `socket`: The current Socket.IO connection instance.
 *   - `onlineUsers`: An array of user IDs representing the currently online users.
 *
 * Context:
 *   - `SocketContext`: Stores the `socket`, `onlineUsers`, and `setOnlineUsers` state.
 *
 * Hooks:
 *   - `useSocketContext`:
 *       - Provides access to the `SocketContext`.
 *       - Throws an error if used outside of a `SocketContextProvider`.
 *
 * Components:
 *   - `SocketContextProvider`:
 *       - Manages the Socket.IO connection and online user state.
 *       - Listens for the `onlineUsers` event from the server to update the list of online users.
 *       - Cleans up the socket connection when the component unmounts or the `currentUser` changes.
 *
 * Behavior:
 *   - Establishes a new Socket.IO connection when the `currentUser` changes.
 *   - Disconnects the socket when the `currentUser` becomes null or the component unmounts.
 *   - Updates the `onlineUsers` state when the server emits the `onlineUsers` event.
 *
 * Usage:
 *   - Wrap the application with `SocketContextProvider` to provide socket-related state and actions.
 *   - Use `useSocketContext` in child components to access the socket instance and online user state.
 *
 * Example:
 *   - Wrapping the app in `App.jsx`:
 *       <SocketContextProvider>
 *           <App />
 *       </SocketContextProvider>
 *
 *   - Accessing context in a component:
 *       const { socket, onlineUsers } = useSocketContext();
 *       console.log(onlineUsers);
 *
 * Dependencies:
 *   - `socket.io-client`: Used to establish a Socket.IO connection.
 *   - `useCurrentUser`: Custom hook to get the current authenticated user.
 *
 * Implementation Details:
 *   - Uses `useEffect` to establish and clean up the Socket.IO connection.
 *   - Uses `useRef` to store the socket instance and avoid unnecessary re-renders.
 *   - Listens for the `onlineUsers` event from the server to update the `onlineUsers` state.
 *   - Automatically disconnects the socket when the `currentUser` becomes null or the component unmounts.
 */

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useCurrentUser } from "../hooks/auth/useCurrentUser";

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error(
            "useSocketContext must be used within a SocketContextProvider"
        );
    }
    return context;
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { currentUser } = useCurrentUser();
    const socketRef = useRef(null);

    useEffect(() => {
        // When currentUser changes
        if (currentUser) {
            const newSocket = io("http://localhost:5000", {
                withCredentials: true, // send httpOnly jwt cookie
                transports: ["websocket", "polling"],
            });
            socketRef.current = newSocket;
            setSocket(newSocket);

            // socket.on() is used to listen for the events from both client and server sides
            newSocket.on("onlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => {
                // Cleanup: disconnect socket when component unmounts or currentUser changes
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            };
        } else {
            // No user, disconnect existing socket
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        }
        // Only depend on currentUser
    }, [currentUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, setOnlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
