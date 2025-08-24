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
 */

import { useState } from "react";
import toast from "react-hot-toast";

const toasterDark = {
    style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
    },
};

const handleInputErrors = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
}) => {
    // Perform input validation and return true if valid, false otherwise
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill in all fields", toasterDark);
        return false;
    }
    if (password !== confirmPassword) {
        toast.error("Passwords do not match", toasterDark);
        return false;
    }
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters", toasterDark);
        return false;
    }
    return true;
};

export const useSignup = () => {
    const [loading, setLoading] = useState(false);

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
        const loadingToastId = toast.loading("Signing up...", toasterDark);

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

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            // Dismiss loading toast and show success toast
            toast.dismiss(loadingToastId);
            toast.success("Signup successful!", {
                icon: "👏",
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        } catch (error) {
            // Dismiss loading toast and show error toast
            toast.dismiss(loadingToastId);
            toast.error("Signup failed with " + error.message, toasterDark);
        } finally {
            setLoading(false);
        }
    };
    return { loading, handleSignup };
};
