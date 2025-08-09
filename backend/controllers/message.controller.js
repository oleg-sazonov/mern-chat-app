/**
 * Message Controller
 * ------------------
 * Handles messaging functionality for the chat application.
 *
 * Exports:
 *   - sendMessage: Sends a message from the authenticated user to a receiver.
 *
 * sendMessage(req, res)
 * ---------------------
 * Sends a message from the authenticated user to the specified receiver.
 *
 * Request:
 *   - req.body.message: The message content (string, required)
 *   - req.params.receiverId: The receiver's user ID (string, required)
 *   - req.user._id: The sender's user ID (set by protectRoute middleware)
 *
 * How it works:
 *   1. Finds an existing conversation between sender and receiver, or creates a new one.
 *   2. Creates a new message document in the database.
 *   3. Adds the new message's ID to the conversation's messages array and saves the conversation.
 *   4. Responds with the created message and a success message.
 *
 * Responses:
 *   - 201: Message sent successfully, returns the new message data.
 *   - 500: Failed to send message or internal server error.
 *
 * Dependencies:
 *   - Conversation model
 *   - Message model
 */

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
