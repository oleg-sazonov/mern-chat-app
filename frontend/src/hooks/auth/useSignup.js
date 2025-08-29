/**
 * useSignup Hook
 * --------------
 * Custom hook for handling user signup functionality.
 *
 * Exports:
 *   - useSignup: Provides a function to handle user signup and a loading state.
 *
 * State:
 *   - loading: Boolean indicating whether the signup request is in progress.
 *
 * Functions:
 *   - handleSignup:
 *       - Validates inputs using `validateAuthInputs`.
 *       - Sends a POST request to the `/api/auth/signup` endpoint with the user data.
 *       - Displays a loading toast while the request is in progress.
 *       - Displays a success toast on successful signup.
 *       - Displays an error toast if the signup fails.
 *       - Stores the user data in localStorage and updates the authentication context.
 *
 * Parameters:
 *   - fullName (string): The full name of the user.
 *   - username (string): The username of the user.
 *   - password (string): The password of the user.
 *   - confirmPassword (string): The confirmation password to match the password.
 *   - gender (string): The gender of the user.
 *
 * Returns:
 *   - handleSignup: Function to initiate the signup process.
 *   - loading: Boolean indicating whether the signup request is in progress.
 *
 * Usage:
 *   - This hook is used in the `SignUp` component to handle form submission.
 *   - Manages form validation, API requests, and user feedback via toast notifications.
 *
 * Example:
 *   - Used in `SignUp.jsx`:
 *       const { loading, handleSignup } = useSignup();
 *       await handleSignup({
 *           fullName: "John Doe",
 *           username: "johndoe",
 *           password: "password123",
 *           confirmPassword: "password123",
 *           gender: "male",
 *       });
 */

import { useState } from "react";

import { showToast, dismissToast } from "../../utils/toastConfig";
import { setStorageItem } from "../../utils/storage";
import { useAuthContext } from "../../context/AuthContext";
import { validateAuthInputs } from "../../utils/validationUtils";
import { apiRequest } from "../../utils/apiUtils";

export const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const handleSignup = async ({
        fullName,
        username,
        password,
        confirmPassword,
        gender,
    }) => {
        const isValid = await validateAuthInputs({
            fullName,
            username,
            password,
            confirmPassword,
            gender,
        });

        if (!isValid) return;

        setLoading(true);

        // Show loading toast
        const loadingToastId = showToast.loading("Signing up...");

        try {
            const data = await apiRequest("/api/auth/signup", "POST", {
                fullName,
                username,
                password,
                confirmPassword,
                gender,
            });

            const userToStore = {
                id: data.user._id,
                username: data.user.username,
            };

            setStorageItem("user", userToStore);
            setAuthUser(userToStore);

            // Dismiss loading toast and show success toast
            dismissToast(loadingToastId);
            showToast.success("Signup successful!");
        } catch (error) {
            // Dismiss loading toast and show error toast
            dismissToast(loadingToastId);
            showToast.error("Signup failed with " + error.message);
        } finally {
            setLoading(false);
        }
    };
    return { loading, handleSignup };
};
