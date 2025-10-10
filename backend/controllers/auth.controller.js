/**
 * Auth Controller
 * ---------------
 * Handles user authentication and authorization for the chat application.
 *
 * Exports:
 *   - signup: Registers a new user.
 *   - login: Authenticates a user and issues a JWT token.
 *   - logout: Logs out the user by clearing the authentication cookie.
 *
 * signup(req, res)
 * ----------------
 * Registers a new user.
 * - Validates required fields: fullName, username, password, confirmPassword.
 * - Checks for existing username.
 * - Hashes the password using bcrypt.
 * - Generates a profile picture URL (RoboHash by default).
 * - Creates and saves the user in the database.
 * - Issues a JWT token and sets it as an HTTP-only cookie.
 * - Emits a `user:created` event via Socket.IO to notify all connected clients.
 * - Responds with user info (excluding password) and a success message.
 * - Handles validation and server errors.
 *
 * login(req, res)
 * ---------------
 * Authenticates a user.
 * - Validates username and password.
 * - Checks if the user exists and password is correct.
 * - Issues a JWT token and sets it as an HTTP-only cookie.
 * - Responds with user info (excluding password) and a success message.
 * - Handles validation and server errors.
 *
 * logout(req, res)
 * ----------------
 * Logs out the user.
 * - Clears the JWT authentication cookie.
 * - Responds with a logout success message.
 * - Handles validation and server errors.
 *
 * Dependencies:
 *   - bcrypt: For hashing and comparing passwords.
 *   - User model: For interacting with the `users` collection in MongoDB.
 *   - generateTokenAndSetCookie utility: For generating JWT tokens and setting them as cookies.
 *   - Socket.IO: For emitting real-time events to connected clients.
 *
 * Example Usage:
 * ---------------
 * - Signup:
 *     POST /api/auth/signup
 *     Body: {
 *         "fullName": "John Doe",
 *         "username": "johndoe",
 *         "password": "Password123!",
 *         "confirmPassword": "Password123!"
 *     }
 * - Login:
 *     POST /api/auth/login
 *     Body: {
 *         "username": "johndoe",
 *         "password": "Password123!"
 *     }
 * - Logout:
 *     POST /api/auth/logout
 */

import { io } from "../socket/socket.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword } = req.body;

        // Validate request body
        if (!fullName || !username || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        //Salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Uncomment the following lines if you want to use RoboHash for avatars
        const avatarUrl = `https://robohash.org/${username}.png`;

        // Uncomment the following lines if you want to use DiceBear for avatars
        // const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            profilePicture: avatarUrl,
        });

        if (newUser) {
            // Generate JWT token
            const token = generateTokenAndSetCookie(newUser, res);

            await newUser.save();

            // Emit to all clients: a new user was created
            io.emit("user:created", {
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePicture: newUser.profilePicture,
                createdAt: newUser.createdAt,
            });

            res.status(201).json({
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    profilePicture: newUser.profilePicture,
                },
                message: "User registered successfully",
            });
        } else {
            res.status(500).json({ message: "User registration failed" });
        }
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // Use optional chaining to handle case where user is null and avoid errors
        const isPasswordValid = await bcrypt.compare(
            password,
            user?.password || ""
        );

        if (!user || !isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid username or password" });
        }

        // Generate JWT token and set cookie
        const token = generateTokenAndSetCookie(user, res);

        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                profilePicture: user.profilePicture,
            },
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error in login controller:", error.message);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the cookie by setting it to an empty value and a past expiration date
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};
