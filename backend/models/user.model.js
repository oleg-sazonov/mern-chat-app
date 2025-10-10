/**
 * User Model
 * ----------
 * Represents a user in the chat application.
 *
 * Schema Fields:
 *   - fullName:
 *       - Type: String.
 *       - Required: Yes.
 *       - Trimmed: Yes.
 *       - Maximum Length: 50 characters.
 *       - Description: The full name of the user.
 *
 *   - username:
 *       - Type: String.
 *       - Required: Yes.
 *       - Unique: Yes.
 *       - Trimmed: Yes.
 *       - Minimum Length: 3 characters.
 *       - Maximum Length: 30 characters.
 *       - Description: The username of the user.
 *
 *   - password:
 *       - Type: String.
 *       - Required: Yes.
 *       - Minimum Length: 6 characters.
 *       - Description: The hashed password of the user.
 *
 *   - profilePicture:
 *       - Type: String.
 *       - Default: "" (empty string).
 *       - Description: The URL of the user's profile picture.
 *
 * Schema Options:
 *   - timestamps:
 *       - Automatically manages `createdAt` and `updatedAt` fields.
 *
 * Model:
 *   - Name: `User`.
 *   - Description: Represents a user in the chat application, including personal details and authentication information.
 *
 * Usage:
 *   - Import the model to interact with the `users` collection in MongoDB.
 *       import User from "../models/user.model.js";
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        profilePicture: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

const User = mongoose.model("User", userSchema);

export default User;
