/**
 * useLogin Hook
 * -------------
 * Custom hook for handling user login functionality.
 *
 * Purpose:
 *   - Provides a reusable function to handle user login.
 *   - Manages API requests, input validation, and user feedback via toast notifications.
 *
 * State:
 *   - `loading` (boolean): Indicates whether the login request is in progress.
 *
 * Functions:
 *   - `handleLogin`:
 *       - Validates inputs using `validateLoginInputs`.
 *       - Sends a POST request to the `/api/auth/login` endpoint with the user credentials.
 *       - Displays a loading toast while the request is in progress.
 *       - Displays a success toast on successful login.
 *       - Displays an error toast if the login fails.
 *       - Stores the user data in localStorage and updates the authentication context.
 *
 * Parameters:
 *   - `username` (string): The username entered by the user.
 *   - `password` (string): The password entered by the user.
 *
 * Returns:
 *   - `handleLogin` (function): Function to initiate the login process.
 *   - `loading` (boolean): Indicates whether the login request is in progress.
 *
 * Example Usage:
 *   - Used in the `Login` component:
 *       const { loading, handleLogin } = useLogin();
 *       await handleLogin({
 *           username: "johndoe",
 *           password: "password123",
 *       });
 *
 * Behavior:
 *   - If validation fails, the function returns early with `{ success: false, errorMessage: null }`.
 *   - If the login request succeeds:
 *       - The user data is stored in localStorage.
 *       - The authentication context is updated with the logged-in user.
 *       - A success toast is displayed.
 *   - If the login request fails:
 *       - An error toast is displayed with the failure message.
 *       - The function returns `{ success: false, errorMessage: <error message> }`.
 */

import { useState } from "react";

import { showToast, dismissToast } from "../../utils/toastConfig";
import { setStorageItem } from "../../utils/storage";
import { useAuthContext } from "../../store/AuthContext";
import { validateLoginInputs } from "../../utils/validationUtils";
import { apiRequest } from "../../utils/apiUtils";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const handleLogin = async ({ username, password }) => {
        const isValid = await validateLoginInputs({ username, password });

        // if (!isValid) return;

        if (!isValid) {
            return { success: false, errorMessage: null };
        }

        setLoading(true);

        // Show loading toast
        const loadingToastId = showToast.loading("Logging in...");
        try {
            const data = await apiRequest("/api/auth/login", "POST", {
                username,
                password,
            });

            const userToStore = {
                id: data.user._id,
                username: data.user.username,
            };

            setStorageItem("user", userToStore);
            setAuthUser(userToStore);

            // Dismiss loading toast and show success toast
            dismissToast(loadingToastId);
            showToast.success("Login successful!");
            return { success: true, errorMessage: null };
        } catch (error) {
            // Dismiss loading toast and show error toast
            dismissToast(loadingToastId);
            const message = error.message || "Login failed";
            showToast.error("Login failed with " + message);
            return { success: false, errorMessage: message };
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading };
};
