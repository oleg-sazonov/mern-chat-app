import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    const { message } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id; // Get sender ID from authenticated user

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            // Create a new conversation if it doesn't exist
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        if (!newMessage) {
            return res.status(500).json({ message: "Failed to send message" });
        } else {
            // Add message to conversation
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }
        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
