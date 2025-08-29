/**
 * validateAuthInputs Utility
 * --------------------------
 * Validates user input for authentication forms.
 *
 * Exports:
 *   - validateAuthInputs: A function to validate input fields for signup and login forms.
 *
 * Parameters:
 *   - inputs (Object): The input fields to validate.
 *       - fullName (string): The full name of the user (optional for login).
 *       - username (string): The username of the user.
 *       - password (string): The password of the user.
 *       - confirmPassword (string): The confirmation password (optional for login).
 *       - gender (string): The gender of the user (optional for login).
 *
 * Returns:
 *   - (boolean): Returns `true` if inputs are valid, otherwise `false`.
 *
 * Validation Rules:
 *   - Username and password are required.
 *   - Full name is required for signup.
 *   - Password must be at least 6 characters long.
 *   - Password and confirmPassword must match (if confirmPassword is provided).
 *   - Gender is required for signup.
 *
 * Error Handling:
 *   - Displays error messages using toast notifications for invalid inputs.
 *
 * Usage:
 *   - Used in `useSignup` and `useLogin` hooks to validate form inputs before making API requests.
 *
 * Example:
 *   - Validating signup inputs:
 *       const isValid = await validateAuthInputs({
 *           fullName: "John Doe",
 *           username: "johndoe",
 *           password: "password123",
 *           confirmPassword: "password123",
 *           gender: "male",
 *       });
 *       if (isValid) {
 *           // Proceed with signup
 *       }
 *
 * Related Components:
 *   - Referenced in `Home.jsx` for managing user authentication state during signup and login.
 */

import { showToast } from "./toastConfig";

export const validateAuthInputs = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
}) => {
    if (!username || !password) {
        showToast.error("Username and password are required");
        return false;
    }

    if (fullName !== undefined && !fullName) {
        showToast.error("Full name is required");
        return false;
    }

    if (password.length < 6) {
        showToast.error("Password must be at least 6 characters");
        return false;
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
        showToast.error("Passwords do not match");
        return false;
    }

    if (gender !== undefined && !gender) {
        showToast.error("Gender is required");
        return false;
    }

    return true;
};
