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
 *       - fullName (string): The full name of the user (required for signup, optional for login).
 *       - username (string): The username of the user (required).
 *       - password (string): The password of the user (required).
 *       - confirmPassword (string): The confirmation password (required for signup, optional for login).
 *       - gender (string): The gender of the user (required for signup, optional for login).
 *
 * Returns:
 *   - (Object): Returns an object with the following structure:
 *       - isValid (boolean): `true` if inputs are valid, otherwise `false`.
 *
 * Validation Rules:
 *   - `username` and `password` are required for all forms.
 *   - `fullName` is required for signup forms.
 *   - `password` must be at least 6 characters long.
 *   - `password` and `confirmPassword` must match (if `confirmPassword` is provided).
 *   - `gender` is required for signup forms.
 *
 * Error Handling:
 *   - Displays error messages using toast notifications for invalid inputs.
 *   - Shows the first validation error if multiple errors are present.
 *   - Displays a generic error message ("Validation failed") if no specific issues are found.
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
 *   - Used in `SignUp.jsx` and `Login.jsx` for validating form inputs.
 */

import { showToast } from "./toastConfig";
import { signupSchema } from "./validationSchemas";

export const validateAuthInputs = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
}) => {
    try {
        // Validate inputs using Yup schema
        await signupSchema.validate(
            { fullName, username, password, confirmPassword, gender },
            { abortEarly: false } // Collect all validation errors
        );
        return { isValid: true }; // Validation passed
    } catch (error) {
        // Handle validation errors
        if (error.inner && error.inner.length > 0) {
            // Show only the first validation error
            showToast.error(error.inner[0].message);
        } else {
            // Show a generic error message if no specific issues are found
            showToast.error("Validation failed");
        }
        return { isValid: false }; // Validation failed
    }
};
