/**
 * useLogout Hook
 * --------------
 * Custom hook for handling user logout functionality.
 *
 * Exports:
 *   - useLogout: Provides a function to handle user logout and a loading state.
 *
 * State:
 *   - loading: Boolean indicating whether the logout request is in progress.
 *
 * Functions:
 *   - handleLogout:
 *       - Sends a POST request to the `/api/auth/logout` endpoint to log the user out.
 *       - Displays a loading toast while the request is in progress.
 *       - Displays a success toast on successful logout.
 *       - Displays an error toast if the logout fails.
 *       - Clears the user data from localStorage and updates the authentication context.
 *
 * Usage:
 *   - This hook is used in components like `SidebarFooter` to handle user logout.
 *
 * Example:
 *   - Used in `SidebarFooter.jsx`:
 *       const { loading, handleLogout } = useLogout();
 *       <button onClick={handleLogout} disabled={loading}>Logout</button>
 */

import { useState } from "react";
import { showToast, dismissToast } from "../../utils/toastConfig";
import { useAuthContext } from "../../store/AuthContext";
import { apiRequest } from "../../utils/apiUtils";

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const handleLogout = async () => {
        setLoading(true);

        // Show loading toast
        const loadingToastId = showToast.loading("Logging out...");

        try {
            await apiRequest("/api/auth/logout", "POST");

            // Clear user data
            localStorage.removeItem("user");
            setAuthUser(null);

            // Success: dismiss loading toast and show success
            dismissToast(loadingToastId);
            showToast.success("Logged out successfully!");
        } catch (error) {
            // Error: dismiss loading toast and show error
            dismissToast(loadingToastId);
            showToast.error(error.message);
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleLogout };
};

export default useLogout;
