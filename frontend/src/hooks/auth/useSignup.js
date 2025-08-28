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
 *   - handleInputErrors:
 *       - Validates the signup form inputs.
 *       - Displays error messages using toast notifications for invalid inputs.
 *       - Returns `true` if inputs are valid, otherwise `false`.
 *   - handleSignup:
 *       - Validates inputs using `handleInputErrors`.
 *       - Sends a POST request to the `/api/auth/signup` endpoint with the user data.
 *       - Displays a loading toast while the request is in progress.
 *       - Displays a success toast on successful signup.
 *       - Displays an error toast if the signup fails.
 *       - Stores the user data in localStorage and updates the authentication context.
 *
 * Layout:
 *   - Loading Toast: Displays "Signing up..." while the request is in progress.
 *   - Success Toast: Displays "Signup successful!" on successful signup.
 *   - Error Toast: Displays the error message if the signup fails.
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
 *
 * Related Components:
 *   - Referenced in `Home.jsx` for managing user authentication state after signup.
 */

import { useState } from "react";

import { showToast, dismissToast } from "../../utils/toastConfig";
import { setStorageItem } from "../../utils/storage";
import { useAuthContext } from "../../context/AuthContext";

const handleInputErrors = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
}) => {
    // Perform input validation and return true if valid, false otherwise
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        showToast.error("All fields are required");
        return false;
    }
    if (password !== confirmPassword) {
        showToast.error("Passwords do not match");
        return false;
    }
    if (password.length < 6) {
        showToast.error("Password must be at least 6 characters");
        return false;
    }
    return true;
};

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
        const success = await handleInputErrors({
            fullName,
            username,
            password,
            confirmPassword,
            gender,
        });

        if (!success) return;

        setLoading(true);

        // Show loading toast
        const loadingToastId = showToast.loading("Signing up...");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    username,
                    password,
                    confirmPassword,
                    gender,
                }),
            });

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            const data = await res.json();

            const userToStore = {
                id: data.user._id,
                username: data.user.username,
                fullName: data.user.fullName,
            };

            if (data.error) {
                throw new Error(data.error);
            }

            if (res.ok) {
                setStorageItem("user", userToStore);
                setAuthUser(userToStore);
            }

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
