/**
 * useUserStore Hook
 * -----------------
 * Custom hook for managing the state of user data in the chat application.
 *
 * Purpose:
 *   - Provides a centralized way to manage user data and loading state.
 *   - Automatically updates the user list when a new user is created via Socket.IO.
 *
 * Exports:
 *   - useUserStore: Provides user data and loading state.
 *
 * State:
 *   - loading (boolean): Indicates whether the user data is being fetched.
 *   - users (array): An array of user objects fetched from the API.
 *
 * Functions:
 *   - fetchUsers:
 *       - Fetches user data from the `/api/users` endpoint.
 *       - Updates the `users` state with the fetched data.
 *       - Manages the `loading` state during the fetch process.
 *       - Displays a loading toast while fetching data (only on the first load).
 *       - Displays an error toast if the fetch fails.
 *       - Handles authentication errors by clearing local storage and resetting the authentication state.
 *   - Socket listener:
 *       - Listens for the `user:created` event from the backend via Socket.IO.
 *       - Refetches users when a new user is created.
 *
 * Returns:
 *   - loading (boolean): Indicates whether the user data is being fetched.
 *   - users (array): The list of users fetched from the API.
 *
 * Error Handling:
 *   - Displays an error toast if the API request fails.
 *   - Logs the error to the console for debugging purposes.
 *   - Clears local storage and resets authentication state if the API returns a 401 or 403 status.
 *
 * Usage:
 *   - This hook is used in components like `Sidebar` to fetch and display user data.
 *   - Provides a centralized way to manage user data and loading state.
 *
 * Example:
 *   - In a component:
 *       const { loading, users } = useUserStore();
 *       if (loading) {
 *           return <div>Loading...</div>;
 *       }
 *       return (
 *           <ul>
 *               {users.map((user) => (
 *                   <li key={user.id}>{user.fullName}</li>
 *               ))};
 *           </ul>
 *       );
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useSocketContext } from "../../store/SocketContext";
import { useAuthContext } from "../../store/AuthContext";
import { showToast, dismissToast } from "../../utils/toastConfig";

export const useUserStore = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const { setAuthUser } = useAuthContext();
    const isFirstLoad = useRef(true); // Track if this is the first load
    const { socket } = useSocketContext();

    // Fetch users from the API
    const fetchUsers = useCallback(async () => {
        setLoading(true);

        let loadingToastId;
        if (isFirstLoad.current) {
            loadingToastId = showToast.loading("Loading users...");
            isFirstLoad.current = false;
        }

        try {
            const res = await fetch("/api/users");
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("user");
                setAuthUser(null);
                if (loadingToastId) dismissToast(loadingToastId);
                showToast.error("Authentication expired. Please login again.");
                return;
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setUsers(data);
            if (loadingToastId) dismissToast(loadingToastId);
        } catch (error) {
            if (loadingToastId) dismissToast(loadingToastId);
            showToast.error(error.message);
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    }, [setAuthUser]);

    // Refetch users when a new user is created
    useEffect(() => {
        if (!socket) return;
        const handleUserCreated = () => {
            fetchUsers();
        };
        socket.on("user:created", handleUserCreated);
        return () => {
            socket.off("user:created", handleUserCreated);
        };
    }, [socket, fetchUsers]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        loading,
        users,
    };
};
