/**
 * User Controller
 * ---------------
 * Handles user-related operations for the chat application.
 *
 * Exports:
 *   - getUsersForSidebar: Retrieves a list of all users except the currently logged-in user.
 *   - getCurrentUser: Retrieves the profile of the currently logged-in user.
 *
 * getUsersForSidebar(req, res)
 * ----------------------------
 * Retrieves a list of all users except the currently logged-in user.
 *
 * Request:
 *   - req.user._id: The logged-in user's ID (set by protectRoute middleware).
 *
 * How it works:
 *   1. Finds all users in the database whose `_id` does not match the logged-in user's ID.
 *      - Query: `{ _id: { $ne: loggedInUserId } }`
 *      - `$ne`: MongoDB operator meaning "not equal".
 *   2. Excludes sensitive fields (`password`, `__v`) using `.select("-password -__v")`.
 *   3. Returns the list of users as a JSON response.
 *
 * Responses:
 *   - 200: Returns an array of user objects (excluding sensitive fields).
 *   - 500: Internal server error.
 *
 * Example:
 *   - Request:
 *       GET /api/users
 *   - Response:
 *       [
 *           {
 *               "_id": "12345",
 *               "fullName": "John Doe",
 *               "username": "johndoe",
 *               "profilePicture": "https://example.com/avatar.png",
 *               ...
 *           },
 *           ...
 *       ]
 *
 * getCurrentUser(req, res)
 * ------------------------
 * Retrieves the profile of the currently logged-in user.
 *
 * Request:
 *   - req.user: The logged-in user's data (set by protectRoute middleware).
 *
 * How it works:
 *   1. Accesses the `req.user` object, which is populated by the `protectRoute` middleware.
 *   2. Returns the user's profile data, excluding sensitive fields like `password`.
 *
 * Responses:
 *   - 200: Returns the user's profile as a JSON object.
 *   - 500: Internal server error.
 *
 * Example:
 *   - Request:
 *       GET /api/users/me
 *   - Response:
 *       {
 *           "_id": "12345",
 *           "fullName": "John Doe",
 *           "username": "johndoe",
 *           "gender": "male",
 *           "profilePicture": "https://example.com/avatar.png",
 *           "createdAt": "2023-01-01T00:00:00.000Z",
 *           "updatedAt": "2023-01-10T00:00:00.000Z"
 *       }
 */

import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    const loggedInUserId = req.user._id; // Get logged-in user ID from authenticated user

    try {
        // Fetch all users except the logged-in user (loggedInUserId)
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } })
            .select("-password -__v")
            .lean(); // Exclude password and version field
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users for sidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        // req.user is already set by the protectRoute middleware
        // We just need to return it without the password
        const user = req.user;

        // Return user data without sensitive information
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            gender: user.gender,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        console.error("Error fetching current user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
