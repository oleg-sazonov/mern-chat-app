/**
 * generateTokenAndSetCookie Utility
 * ---------------------------------
 * Generates a JWT token for the given user and sets it as an HTTP-only cookie in the response.
 *
 * Usage:
 *   Call this function after successful authentication (signup or login) to issue a JWT and set it in a cookie.
 *   Example:
 *     generateTokenAndSetCookie(user, res);
 *
 * Parameters:
 *   @param {Object} user - The user object (must have _id and username properties).
 *   @param {Object} res  - The Express response object.
 *
 * How it works:
 *   1. Generates a JWT token containing the user's id and username.
 *   2. Sets the token as a cookie named "jwt" with security options:
 *      - httpOnly: true (prevents JavaScript access to the cookie)
 *      - sameSite: "strict" (mitigates CSRF attacks)
 *      - maxAge: 14 days
 *      - secure: true in production (cookie sent only over HTTPS)
 *   3. Returns the generated token.
 *
 * Dependencies:
 *   - jsonwebtoken
 */

import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (user, res) => {
    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "14d" }
    );

    // Set cookie with token
    res.cookie("jwt", token, {
        httpOnly: true, // Prevent XSS attacks (Cross-Site Scripting)
        sameSite: "strict", // Prevent CSRF attacks (Cross-Site Request Forgery)
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    return token;
};

export default generateTokenAndSetCookie;
