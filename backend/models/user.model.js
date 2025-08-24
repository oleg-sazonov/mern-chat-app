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
        gender: {
            type: String,
            enum: ["male", "female"],
            required: true,
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
