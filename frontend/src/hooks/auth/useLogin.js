/**
 * useLogin Hook
 * -------------
 * Custom hook for handling user login functionality.
 *
 * Exports:
 *   - useLogin: Provides a function to handle user login and a loading state.
 *
 * State:
 *   - loading: Boolean indicating whether the login request is in progress.
 *
 * Functions:
 *   - handleLogin:
 *       - Validates inputs using `validateLoginInputs`.
 *       - Sends a POST request to the `/api/auth/login` endpoint with the user credentials.
 *       - Displays a loading toast while the request is in progress.
 *       - Displays a success toast on successful login.
 *       - Displays an error toast if the login fails.
 *       - Stores the user data in localStorage and updates the authentication context.
 *
 * Parameters:
 *   - username (string): The username entered by the user.
 *   - password (string): The password entered by the user.
 *
 * Returns:
 *   - handleLogin: Function to initiate the login process.
 *   - loading: Boolean indicating whether the login request is in progress.
 *
 * Usage:
 *   - This hook is used in the `Login` component to handle form submission.
 *   - Manages form validation, API requests, and user feedback via toast notifications.
 *
 * Example:
 *   - Used in `Login.jsx`:
 *       const { loading, handleLogin } = useLogin();
 *       await handleLogin({
 *           username: "johndoe",
 *           password: "password123",
 *       });
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

        if (!isValid) return;

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
        } catch (error) {
            // Dismiss loading toast and show error toast
            dismissToast(loadingToastId);
            showToast.error("Login failed with " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading };
};
