/**
 * getUsersForSidebar Controller
 * -----------------------------
 * Retrieves a list of all users except the currently logged-in user.
 * Intended for displaying user lists in the chat sidebar.
 *
 * Request:
 *   - req.user._id: The logged-in user's ID (set by protectRoute middleware)
 *
 * How it works:
 *   1. Finds all users in the database whose _id does not match the logged-in user.
 *      - Uses Mongoose query syntax: { _id: { $ne: loggedInUserId } }
 *        - $ne is a MongoDB operator meaning "not equal".
 *        - This query returns all users whose _id is NOT equal to the logged-in user's ID.
 *   2. Excludes sensitive fields (password, __v) from the result using .select("-password -__v").
 *   3. Returns the list of users as a JSON response.
 *
 * Responses:
 *   - 200: Returns an array of user objects (excluding password and __v).
 *   - 500: Internal server error.
 *
 * Dependencies:
 *   - User model
 *
 * Example Mongoose Query:
 *   User.find({ _id: { $ne: loggedInUserId } })
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
