import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the user who sent the message
            ref: "User", // Reference to the User model
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the user who received the message
            ref: "User", // Reference to the User model
            required: true,
        },
        message: {
            type: String, // The content of the message
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
