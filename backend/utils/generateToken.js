/**
 * generateTokenAndSetCookie Utility
 * ---------------------------------
 * Generates a JWT token for the given user and sets it as an HTTP-only cookie in the response.
 *
 * Purpose:
 *   - Issues a secure JWT token for user authentication.
 *   - Sets the token as a cookie with appropriate security options.
 *
 * Parameters:
 *   @param {Object} user - The user object (must have `_id` and `username` properties).
 *   @param {Object} res  - The Express response object.
 *
 * How it works:
 *   1. Generates a JWT token containing the user's ID and username.
 *   2. Sets the token as a cookie named `jwt` with the following options:
 *      - `httpOnly`: Prevents JavaScript access to the cookie (mitigates XSS attacks).
 *      - `sameSite: "strict"`: Prevents CSRF attacks by restricting cross-site cookie usage.
 *      - `maxAge`: Sets the cookie expiration to 14 days.
 *      - `secure`: Ensures the cookie is sent only over HTTPS in production or based on the `COOKIE_SECURE` environment variable.
 *   3. Returns the generated token.
 *
 * Environment Variables:
 *   - `JWT_SECRET`: The secret key used to sign the JWT.
 *   - `COOKIE_SECURE`: Overrides the `secure` flag for the cookie. If set to `"true"`, the cookie is sent only over HTTPS.
 *   - `NODE_ENV`: Determines the environment (`production` or `development`). Defaults to `production` for the `secure` flag if `COOKIE_SECURE` is not set.
 *
 * Returns:
 *   - {string} The generated JWT token.
 *
 * Example Usage:
 *   - In a signup or login controller:
 *       const token = generateTokenAndSetCookie(user, res);
 *
 * Dependencies:
 *   - `jsonwebtoken`: Used to generate the JWT token.
 *
 * Security Notes:
 *   - Ensure `JWT_SECRET` is a strong, unique secret key.
 *   - Use `COOKIE_SECURE=true` in production to enforce HTTPS for cookies.
 */

import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (user, res) => {
    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "14d" }
    );

    const secureFlag = process.env.COOKIE_SECURE
        ? process.env.COOKIE_SECURE === "true"
        : process.env.NODE_ENV === "production";

    // Set cookie with token
    res.cookie("jwt", token, {
        httpOnly: true, // Prevent XSS attacks (Cross-Site Scripting)
        sameSite: "strict", // Prevent CSRF attacks (Cross-Site Request Forgery)
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
        secure: secureFlag,
        // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    });

    return token;
};

export default generateTokenAndSetCookie;
