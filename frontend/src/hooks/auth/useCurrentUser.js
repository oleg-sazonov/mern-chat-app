/**
 * useCurrentUser Hook
 * -------------------
 * Custom hook for fetching and managing the current authenticated user's profile.
 *
 * Exports:
 *   - useCurrentUser: Provides the current user's profile and loading state.
 *
 * State:
 *   - loading (boolean): Indicates whether the user's profile is being fetched.
 *   - currentUser (object | null): The current authenticated user's profile data.
 *
 * Context:
 *   - authUser: The basic authentication data from `AuthContext`.
 *   - setAuthUser: Function to update the authentication state in `AuthContext`.
 *
 * Functions:
 *   - fetchCurrentUser:
 *       - Fetches the current user's profile from the `/api/users/me` endpoint.
 *       - Updates the `currentUser` state with the fetched data.
 *       - Manages the `loading` state during the fetch process.
 *       - Handles authentication errors by clearing local storage and resetting `authUser`.
 *
 * Returns:
 *   - currentUser (object | null): The current authenticated user's profile data.
 *   - loading (boolean): Indicates whether the user's profile is being fetched.
 *
 * Error Handling:
 *   - Clears local storage and resets `authUser` if the API returns a 401 or 403 status.
 *   - Logs errors to the console for debugging purposes.
 *
 * Usage:
 *   - Used in components like `SidebarFooter` to display the current user's profile.
 *
 * Example:
 *   - In a component:
 *       const { currentUser, loading } = useCurrentUser();
 *       if (loading) return <Spinner />;
 *       return <p>{currentUser?.fullName}</p>;
 */

import { useState, useEffect } from "react";
import { useAuthContext } from "../../store/AuthContext";

export const useCurrentUser = () => {
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const { authUser, setAuthUser } = useAuthContext();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!authUser) return;

            setLoading(true);
            try {
                const res = await fetch("/api/users/me");

                // Handle authentication errors
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("user");
                    setAuthUser(null);
                    return;
                }

                if (res.ok) {
                    const userData = await res.json();
                    setCurrentUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [authUser, setAuthUser]);

    return { currentUser, loading };
};

export default useCurrentUser;
