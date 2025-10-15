/**
 * Validation Schemas
 * ------------------
 * Provides Yup validation schemas for user authentication forms.
 *
 * Exports:
 *   - signupSchema: Validation schema for user signup form inputs.
 *   - loginSchema: Validation schema for user login form inputs.
 *
 * signupSchema
 * ------------
 * Fields:
 *   - fullName:
 *       - Type: string
 *       - Validation:
 *           - Required.
 *           - Minimum 3 characters.
 *           - Maximum 50 characters.
 *           - Must contain only letters and spaces.
 *       - Error Messages:
 *           - "Full name is required."
 *           - "Full name must be at least 3 characters."
 *           - "Full name must not exceed 50 characters."
 *           - "Full name must contain only letters and spaces."
 *
 *   - username:
 *       - Type: string
 *       - Validation:
 *           - Required.
 *           - Minimum 3 characters.
 *           - Maximum 30 characters.
 *           - Must contain only letters, numbers, and underscores.
 *       - Error Messages:
 *           - "Username is required."
 *           - "Username must be at least 3 characters."
 *           - "Username must not exceed 30 characters."
 *           - "Username can only contain letters, numbers, and underscores."
 *
 *   - password:
 *       - Type: string
 *       - Validation:
 *           - Required.
 *           - Minimum 6 characters.
 *           - Maximum 100 characters.
 *           - Must contain at least one uppercase letter.
 *           - Must contain at least one lowercase letter.
 *           - Must contain at least one number.
 *           - Must contain at least one special character (@, $, !, %, *, ?, &, #).
 *       - Error Messages:
 *           - "Password is required."
 *           - "Password must be at least 6 characters."
 *           - "Password must not exceed 100 characters."
 *           - "Password must contain at least one uppercase letter."
 *           - "Password must contain at least one lowercase letter."
 *           - "Password must contain at least one number."
 *           - "Password must include a special character (@, $, !, %, *, ?, &, #)."
 *
 *   - confirmPassword:
 *       - Type: string
 *       - Validation:
 *           - Required.
 *           - Must match the `password` field.
 *       - Error Messages:
 *           - "Confirm password is required."
 *           - "Passwords do not match."
 *
 *   - profilePicture:
 *       - Type: string (optional)
 *       - Validation:
 *           - Must be a valid URL if provided.
 *       - Error Messages:
 *           - "Profile picture must be a valid URL."
 *
 * loginSchema
 * -----------
 * Fields:
 *   - username:
 *       - Type: string
 *       - Validation:
 *           - Required.
 *           - Minimum 3 characters.
 *           - Maximum 30 characters.
 *       - Error Messages:
 *           - "Username is required."
 *           - "Username must be at least 3 characters."
 *           - "Username must not exceed 30 characters."
 *
 *   - password:
 *       - Type: string
 *       - Validation:
 *           - Required.
 *           - Minimum 6 characters.
 *           - Maximum 100 characters.
 *           - Must contain at least one uppercase letter.
 *           - Must contain at least one lowercase letter.
 *           - Must contain at least one number.
 *           - Must contain at least one special character (@, $, !, %, *, ?, &, #).
 *       - Error Messages:
 *           - "Password is required."
 *           - "Password must be at least 6 characters."
 *           - "Password must not exceed 100 characters."
 *           - "Password must contain at least one uppercase letter."
 *           - "Password must contain at least one lowercase letter."
 *           - "Password must contain at least one number."
 *           - "Password must include a special character (@, $, !, %, *, ?, &, #)."
 *
 * Usage:
 *   - Used in `SignUp.jsx` and `Login.jsx` to validate user inputs before form submission.
 *
 * Example:
 *   - Validating signup inputs:
 *       const result = await signupSchema.validate({
 *           fullName: "John Doe",
 *           username: "johndoe",
 *           password: "Password123!",
 *           confirmPassword: "Password123!",
 *           profilePicture: "https://example.com/avatar.png",
 *       });
 *
 *   - Validating login inputs:
 *       const result = await loginSchema.validate({
 *           username: "johndoe",
 *           password: "Password123!",
 *       });
 */

import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
    fullName: Yup.string()
        .required("Full name is required")
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name must not exceed 50 characters")
        .matches(
            /^[a-zA-Z\s]+$/,
            "Full name must contain only letters and spaces"
        ),
    username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must not exceed 30 characters")
        .matches(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must not exceed 100 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
            /[@$!%*?&#]/,
            "Password must include a special character (@, $, !, %, *, ?, &, #)"
        ),
    confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords do not match"),
    profilePicture: Yup.string()
        .url("Profile picture must be a valid URL")
        .notRequired(),
});

export const loginSchema = Yup.object().shape({
    username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must not exceed 30 characters"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must not exceed 100 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(
            /[@$!%*?&#]/,
            "Password must include a special character (@, $, !, %, *, ?, &, #)"
        ),
});
