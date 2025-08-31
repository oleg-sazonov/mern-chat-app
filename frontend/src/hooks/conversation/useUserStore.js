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
 *       - Displays a loading toast while fetching data.
 *       - Displays an error toast if the fetch fails.
 *
 * Returns:
 *   - loading (boolean): Indicates whether the user data is being fetched.
 *   - users (array): The list of users fetched from the API.
 *
 * Error Handling:
 *   - Displays an error toast if the API request fails.
 *   - Logs the error to the console for debugging purposes.
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
 *               ))}
 *           </ul>
 *       );
 */

import { useState, useEffect } from "react";
import { showToast, dismissToast } from "../../utils/toastConfig";

export const useUserStore = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);

            // Show loading toast
            const loadingToastId = showToast.loading("Loading users...");
            try {
                // Fetch users from the API
                const res = await fetch("/api/users");
                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }
                setUsers(data);
                dismissToast(loadingToastId); // Dismiss loading toast on success
            } catch (error) {
                // Error: dismiss loading toast and show error
                dismissToast(loadingToastId);
                showToast.error(error.message);
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return {
        loading,
        users,
    };
};

export default useUserStore;
