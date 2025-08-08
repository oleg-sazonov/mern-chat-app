import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } =
            req.body;

        // Validate request body
        if (
            !fullName ||
            !username ||
            !password ||
            !confirmPassword ||
            !gender
        ) {
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

        // Generate profile picture
        const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Create new user
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePicture:
                gender === "male" ? boyProfilePicture : girlProfilePicture,
        });

        if (newUser) {
            // Generate JWT token
            const token = generateTokenAndSetCookie(newUser, res);

            await newUser.save();

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
