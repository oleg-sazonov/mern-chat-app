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
 *       - Validates inputs using `validateAuthInputs`.
 *       - Sends a POST request to the `/api/auth/login` endpoint with the user credentials.
 *       - Displays a loading toast while the request is in progress.
 *       - Displays a success toast on successful login.
 *       - Displays an error toast if the login fails.
 *       - Stores the user data in localStorage and updates the authentication context.
 *
 * Layout:
 *   - Loading Toast: Displays "Logging in..." while the request is in progress.
 *   - Success Toast: Displays "Login successful!" on successful login.
 *   - Error Toast: Displays the error message if the login fails.
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
 *
 * Related Components:
 *   - Referenced in `Home.jsx` for managing user authentication state after login.
 */

import { useState } from "react";

import { showToast, dismissToast } from "../../utils/toastConfig";
import { setStorageItem } from "../../utils/storage";
import { useAuthContext } from "../../context/AuthContext";
import { validateAuthInputs } from "../../utils/validationUtils";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const handleLogin = async ({ username, password }) => {
        const isValid = await validateAuthInputs({ username, password });

        if (!isValid) return;

        setLoading(true);

        // Show loading toast
        const loadingToastId = showToast.loading("Logging in...");
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

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

export default useLogin;
