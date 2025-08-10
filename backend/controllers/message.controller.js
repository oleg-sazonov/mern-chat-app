/**
 * Message Controller
 * ------------------
 * Handles messaging functionality for the chat application.
 *
 * Exports:
 *   - sendMessage: Sends a message from the authenticated user to a receiver.
 *   - getMessages: Retrieves all messages in a conversation between the authenticated user and a receiver.
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
 *   1. Finds an existing conversation between sender and receiver using:
 *        { participants: { $all: [senderId, receiverId] } }
 *      - $all is a MongoDB operator that matches arrays containing all specified elements.
 *      - This query finds a conversation where both users are participants, regardless of order.
 *   2. If no conversation exists, creates a new one with both participants.
 *   3. Creates a new message document in the database.
 *   4. Adds the new message's ID to the conversation's messages array and saves the conversation.
 *   5. Responds with the created message and a success message.
 *
 * Responses:
 *   - 201: Message sent successfully, returns the new message data.
 *   - 500: Failed to send message or internal server error.
 *
 * getMessages(req, res)
 * ---------------------
 * Retrieves all messages in a conversation between the authenticated user (sender) and the specified receiver.
 *
 * Request:
 *   - req.params.receiverId: The receiver's user ID (string, required)
 *   - req.user._id: The sender's user ID (set by protectRoute middleware)
 *
 * How it works:
 *   1. Finds the conversation between the sender and receiver using:
 *        { participants: { $all: [senderId, receiverId] } }
 *      - $all ensures both users are in the participants array.
 *   2. Uses .populate("messages") to replace message IDs in the conversation's messages array
 *      with the actual message documents from the Message collection.
 *      - Without populate: messages is an array of ObjectIDs.
 *      - With populate: messages is an array of full message objects (with fields like text, sender, createdAt, etc.).
 *   3. If the conversation exists, returns all messages in the conversation.
 *   4. If not found, responds with 404.
 *
 * Responses:
 *   - 200: Messages retrieved successfully, returns the messages array.
 *   - 404: Conversation not found.
 *   - 500: Internal server error.
 *
 * Dependencies:
 *   - Conversation model
 *   - Message model
 *
 * Notes:
 *   - { participants: { $all: [senderId, receiverId] } } is a Mongoose/MongoDB query that finds conversations containing both users.
 *   - .populate("messages") is a Mongoose method that fetches and replaces message IDs with the corresponding message documents,
 *     making it easy to access all message details in a single query.
 */

import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    const { message } = req.body;
    const { receiverId } = req.params; // Get the user ID to chat with from the request parameters
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

export const getMessages = async (req, res) => {
    const { receiverId } = req.params; // Get the user ID to chat with from the request parameters
    const senderId = req.user._id; // Get sender ID from authenticated user

    try {
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // If conversation exists, retrieve messages
        const messages = conversation.messages;

        res.status(200).json({
            message: "Messages retrieved successfully",
            data: messages,
        });
    } catch (error) {
        console.error("Error in getMessages controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
