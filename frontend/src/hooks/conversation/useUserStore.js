/**
 * useUserStore Hook
 * -----------------
 * Custom hook for managing the state of user data in the chat application.
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

import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../store/AuthContext";
import { showToast, dismissToast } from "../../utils/toastConfig";

export const useUserStore = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const { setAuthUser } = useAuthContext();
    const isFirstLoad = useRef(true); // Track if this is the first load

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);

            // Only show loading toast on first load
            let loadingToastId;
            if (isFirstLoad.current) {
                loadingToastId = showToast.loading("Loading users...");
                isFirstLoad.current = false;
            }

            try {
                // Fetch users from the API
                const res = await fetch("/api/users");

                // Check for authentication errors
                if (res.status === 401 || res.status === 403) {
                    // Clear user data
                    localStorage.removeItem("user");
                    setAuthUser(null);
                    if (loadingToastId) dismissToast(loadingToastId);
                    showToast.error(
                        "Authentication expired. Please login again."
                    );
                    // No need to manually redirect as ProtectedRoute will handle this
                    return;
                }

                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }
                setUsers(data);
                if (loadingToastId) dismissToast(loadingToastId); // Dismiss loading toast on success
            } catch (error) {
                // Error: dismiss loading toast and show error
                if (loadingToastId) dismissToast(loadingToastId);
                showToast.error(error.message);
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [setAuthUser]); // Add setAuthUser to dependency array

    return {
        loading,
        users,
    };
};
