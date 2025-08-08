import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId, // Reference to User model
                ref: "User",
                required: true,
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId, // Reference to Message model
                ref: "Message",
                default: [], // Default to an empty array if no messages are present
            },
        ],
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
