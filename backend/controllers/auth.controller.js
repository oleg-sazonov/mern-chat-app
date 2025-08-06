export const signup = (req, res) => {
    res.status(200).json({ message: "Signup endpoint" });
};

export const login = (req, res) => {
    res.status(200).json({ message: "Login endpoint" });
};

export const logout = (req, res) => {
    res.status(200).json({ message: "Logout endpoint" });
};
