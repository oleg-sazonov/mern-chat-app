/**
 * getConversationsWithLastMessage Controller
 * ------------------------------------------
 * Fetches all conversations for the logged-in user, including the last message
 * and participant details for each conversation.
 *
 * Request:
 *   - req.user._id: The ID of the authenticated user (set by the `protectRoute` middleware).
 *
 * Response:
 *   - 200: Returns an array of conversations with the following structure:
 *       [
 *           {
 *               _id: "conversationId",
 *               participants: [
 *                   {
 *                       _id: "userId",
 *                       fullName: "John Doe",
 *                       username: "johndoe",
 *                       profilePicture: "https://example.com/avatar.png"
 *                   },
 *                   ...
 *               ],
 *               lastMessage: {
 *                   content: "Hello!",
 *                   sender: {
 *                       _id: "userId",
 *                       fullName: "John Doe",
 *                       username: "johndoe",
 *                       profilePicture: "https://example.com/avatar.png"
 *                   },
 *                   createdAt: "2023-10-01T12:30:00.000Z"
 *               }
 *           },
 *           ...
 *       ]
 *   - 500: Returns an error message if an internal server error occurs.
 *
 * How it works:
 *   1. Finds all conversations where the logged-in user is a participant.
 *   2. Populates the `messages` field with the most recent message (sorted by `createdAt` in descending order).
 *   3. Populates the `participants` field with user details (excluding sensitive information).
 *   4. Formats the response to include the last message and participant details.
 *
 * Dependencies:
 *   - Conversation model: Used to query and populate conversation data.
 *
 * Example:
 *   - Request:
 *       GET /api/conversations
 *   - Response:
 *       [
 *           {
 *               "_id": "conversationId1",
 *               "participants": [
 *                   {
 *                       "_id": "userId1",
 *                       "fullName": "John Doe",
 *                       "username": "johndoe",
 *                       "profilePicture": "https://example.com/avatar1.png"
 *                   },
 *                   {
 *                       "_id": "userId2",
 *                       "fullName": "Jane Smith",
 *                       "username": "janesmith",
 *                       "profilePicture": "https://example.com/avatar2.png"
 *                   }
 *               ],
 *               "lastMessage": {
 *                   "content": "Hello!",
 *                   "sender": {
 *                       "_id": "userId1",
 *                       "fullName": "John Doe",
 *                       "username": "johndoe",
 *                       "profilePicture": "https://example.com/avatar1.png"
 *                   },
 *                   "createdAt": "2023-10-01T12:30:00.000Z"
 *               }
 *           }
 *       ]
 */

import Conversation from "../models/conversation.model.js";

export const getConversationsWithLastMessage = async (req, res) => {
    const loggedInUserId = req.user._id;

    try {
        // Fetch conversations where the logged-in user is a participant
        const conversations = await Conversation.find({
            participants: loggedInUserId,
        })
            .populate({
                path: "messages",
                options: { sort: { createdAt: -1 }, limit: 1 }, // Get the most recent message
                populate: {
                    path: "senderId receiverId", // Populate sender and receiver details
                    select: "fullName username profilePicture",
                },
            })
            .populate({
                path: "participants",
                select: "fullName username profilePicture", // Populate participant details
            })
            .lean();

        // Format the response to include the last message
        const formattedConversations = conversations.map((conversation) => {
            const lastMessage = conversation.messages[0] || null;

            return {
                _id: conversation._id,
                participants: conversation.participants,
                lastMessage: lastMessage
                    ? {
                          content: lastMessage.message,
                          sender: lastMessage.senderId,
                          createdAt: lastMessage.createdAt,
                      }
                    : null,
            };
        });

        res.status(200).json(formattedConversations);
    } catch (error) {
        console.error(
            "Error fetching conversations with last message:",
            error.message
        );
        res.status(500).json({ error: "Internal server error" });
    }
};
