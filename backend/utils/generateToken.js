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
