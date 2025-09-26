/**
 * Validation Utilities
 * --------------------
 * Provides utility functions for validating user inputs in authentication forms.
 *
 * Exports:
 *   - validateAuthInputs: Validates input fields for signup forms.
 *   - validateLoginInputs: Validates input fields for login forms.
 *
 * validateAuthInputs
 * ------------------
 * Validates user inputs for the signup form using the `signupSchema`.
 *
 * Parameters:
 *   - inputs (Object): The input fields to validate.
 *       - fullName (string): The full name of the user (required).
 *       - username (string): The username of the user (required).
 *       - password (string): The password of the user (required).
 *       - confirmPassword (string): The confirmation password (required).
 *       - gender (string): The gender of the user (required).
 *
 * Returns:
 *   - (Object): Returns an object with the following structure:
 *       - isValid (boolean): `true` if inputs are valid, otherwise `false`.
 *
 * Error Handling:
 *   - Displays the first validation error using toast notifications.
 *   - Shows a generic error message ("Validation failed") if no specific issues are found.
 *
 * Usage:
 *   - Used in `useSignup` to validate form inputs before making API requests.
 *
 * Example:
 *   const isValid = await validateAuthInputs({
 *       fullName: "John Doe",
 *       username: "johndoe",
 *       password: "password123",
 *       confirmPassword: "password123",
 *       gender: "male",
 *   });
 *   if (isValid) {
 *       // Proceed with signup
 *   }
 *
 * validateLoginInputs
 * -------------------
 * Validates user inputs for the login form using the `loginSchema`.
 *
 * Parameters:
 *   - inputs (Object): The input fields to validate.
 *       - username (string): The username of the user (required).
 *       - password (string): The password of the user (required).
 *
 * Returns:
 *   - (boolean): `true` if inputs are valid, otherwise `false`.
 *
 * Error Handling:
 *   - Displays the first validation error using toast notifications.
 *   - Shows a generic error message ("Validation failed") if no specific issues are found.
 *
 * Usage:
 *   - Used in `useLogin` to validate form inputs before making API requests.
 *
 * Example:
 *   const isValid = await validateLoginInputs({
 *       username: "johndoe",
 *       password: "password123",
 *   });
 *   if (isValid) {
 *       // Proceed with login
 *   }
 */

import { showToast } from "./toastConfig";
import { signupSchema, loginSchema } from "./validationSchemas";

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

export const validateLoginInputs = async ({ username, password }) => {
    try {
        await loginSchema.validate(
            { username, password },
            { abortEarly: false }
        );
        return true;
    } catch (error) {
        if (error.inner && error.inner.length > 0) {
            showToast.error(error.inner[0].message);
        } else {
            showToast.error("Validation failed");
        }
        return false;
    }
};
