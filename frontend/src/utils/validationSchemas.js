/**
 * signupSchema
 * ------------
 * Validation schema for user signup form inputs.
 *
 * Exports:
 *   - signupSchema: A Zod schema for validating signup form data.
 *
 * Fields:
 *   - fullName:
 *       - Type: string
 *       - Validation:
 *           - Required (minimum 1 character).
 *           - Maximum 50 characters.
 *           - Must contain only letters and spaces.
 *       - Error Messages:
 *           - "Full name is required."
 *           - "Full name must not exceed 50 characters."
 *           - "Full name must contain only letters and spaces."
 *
 *   - username:
 *       - Type: string
 *       - Validation:
 *           - Required (minimum 3 characters).
 *           - Maximum 30 characters.
 *           - Must contain only letters, numbers, and underscores.
 *       - Error Messages:
 *           - "Username must be at least 3 characters."
 *           - "Username must not exceed 30 characters."
 *           - "Username can only contain letters, numbers, and underscores."
 *
 *   - password:
 *       - Type: string
 *       - Validation:
 *           - Required (minimum 6 characters).
 *           - Maximum 100 characters.
 *           - Must contain at least one uppercase letter.
 *           - Must contain at least one lowercase letter.
 *           - Must contain at least one number.
 *           - Must contain at least one special character (@, $, !, %, *, ?, &, #).
 *       - Error Messages:
 *           - "Password must be at least 6 characters."
 *           - "Password must not exceed 100 characters."
 *           - "Password must contain at least one uppercase letter."
 *           - "Password must contain at least one lowercase letter."
 *           - "Password must contain at least one number."
 *           - "Password must contain at least one special character (@, $, !, %, *, ?, &, #)."
 *
 *   - confirmPassword:
 *       - Type: string
 *       - Validation:
 *           - Required (minimum 6 characters).
 *           - Must match the `password` field.
 *       - Error Messages:
 *           - "Confirm password is required."
 *           - "Passwords do not match."
 *
 *   - gender:
 *       - Type: enum ("male", "female")
 *       - Validation:
 *           - Required.
 *       - Error Messages:
 *           - "Gender is required."
 *
 *   - profilePicture:
 *       - Type: string (optional)
 *       - Validation:
 *           - Must be a valid URL if provided.
 *       - Error Messages:
 *           - "Profile picture must be a valid URL."
 *
 * Usage:
 *   - Used in `SignUp.jsx` to validate user inputs before form submission.
 *
 * Example:
 *   - Validating signup inputs:
 *       const result = signupSchema.parse({
 *           fullName: "John Doe",
 *           username: "johndoe",
 *           password: "Password123!",
 *           confirmPassword: "Password123!",
 *           gender: "male",
 *           profilePicture: "https://example.com/avatar.png",
 *       });
 */

import { z } from "zod";

export const signupSchema = z
    .object({
        fullName: z
            .string()
            .min(1, "Full name is required")
            .max(50, "Full name must not exceed 50 characters")
            .regex(
                /^[a-zA-Z\s]+$/,
                "Full name must contain only letters and spaces"
            ),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must not exceed 30 characters")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores"
            ),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(100, "Password must not exceed 100 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[@$!%*?&#]/,
                "Password must contain at least one special character (@, $, !, %, *, ?, &, #)"
            ),
        confirmPassword: z.string().min(6, "Confirm password is required"),
        gender: z.enum(["male", "female"], "Gender is required"),
        profilePicture: z
            .string()
            .url("Profile picture must be a valid URL")
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Highlight the confirmPassword field
    });

// Simple schema to check functionality
// import { z } from "zod";

// export const signupSchema = z
//     .object({
//         fullName: z.string().min(1, "Full name is required"),
//         username: z.string().min(2, "Username must be at least 2 characters"),
//         password: z.string().min(6, "Password must be at least 6 characters"),
//         confirmPassword: z.string().min(6, "Confirm password is required"),
//         gender: z.enum(["male", "female"], "Gender is required"),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"], // Highlight the confirmPassword field
//     });
