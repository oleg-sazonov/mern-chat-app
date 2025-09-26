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
 *               },
 *               unreadCount: 2
 *           },
 *           ...
 *       ]
 *   - 500: Returns an error message if an internal server error occurs.
 *
 * How it works:
 *   1. Finds all conversations where the logged-in user is a participant.
 *   2. Populates the `messages` field with the most recent message (sorted by `createdAt` in descending order).
 *   3. Populates the `participants` field with user details (excluding sensitive information).
 *   4. Formats the response to include the last message, participant details, and unread count.
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
 *               },
 *               "unreadCount": 2
 *           }
 *       ]
 */
import Conversation from "../models/conversation.model.js";
import { io, getReceiverSocketIds } from "../socket/socket.js";

export const getConversationsWithLastMessage = async (req, res) => {
    const loggedInUserId = req.user._id;

    try {
        const conversations = await Conversation.find({
            participants: loggedInUserId,
        })
            .populate({
                path: "messages",
                select: "message senderId createdAt",
                options: { sort: { createdAt: -1 } },
                perDocumentLimit: 1,
            })
            .populate({
                path: "participants",
                select: "fullName username profilePicture",
            })
            .lean();

        const formattedConversations = conversations.map((conversation) => {
            const lastMessage = conversation.messages?.[0] || null;
            const myReads = (conversation.reads || []).find(
                (r) => r.userId?.toString() === loggedInUserId.toString()
            );
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
                unreadCount: myReads?.unreadCount || 0,
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

/**
 * markConversationRead Controller
 * -------------------------------
 * Marks a conversation as read for the logged-in user.
 *
 * Request:
 *   - req.params.id: The ID of the conversation to mark as read.
 *   - req.user._id: The ID of the authenticated user (set by the `protectRoute` middleware).
 *
 * Response:
 *   - 200: Returns a success message indicating the conversation was marked as read.
 *   - 404: Returns an error message if the conversation is not found.
 *   - 403: Returns an error message if the user is not a participant in the conversation.
 *   - 500: Returns an error message if an internal server error occurs.
 *
 * How it works:
 *   1. Finds the conversation by its ID.
 *   2. Verifies that the logged-in user is a participant in the conversation.
 *   3. Updates the `reads` array for the user:
 *       - Sets `lastReadAt` to the current timestamp.
 *       - Resets `unreadCount` to 0.
 *   4. Saves the updated conversation to the database.
 *   5. Emits a `conversation:updated` event via Socket.IO to notify the user's other sessions.
 *
 * Dependencies:
 *   - Conversation model: Used to query and update conversation data.
 *   - Socket.IO: Used to emit real-time updates to the user's other sessions.
 *
 * Example:
 *   - Request:
 *       POST /api/conversations/:id/read
 *   - Response:
 *       {
 *           "message": "Marked as read"
 *       }
 */
export const markConversationRead = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const conv = await Conversation.findById(id);
        if (!conv)
            return res.status(404).json({ message: "Conversation not found" });

        const isParticipant = conv.participants.some(
            (p) => p.toString() === userId.toString()
        );
        if (!isParticipant)
            return res.status(403).json({ message: "Forbidden" });

        conv.reads = conv.reads || [];
        const idx = conv.reads.findIndex(
            (r) => r.userId.toString() === userId.toString()
        );
        if (idx === -1) {
            conv.reads.push({ userId, lastReadAt: new Date(), unreadCount: 0 });
        } else {
            conv.reads[idx].lastReadAt = new Date();
            conv.reads[idx].unreadCount = 0;
        }

        await conv.save();

        // notify this user's other sessions to clear the badge
        getReceiverSocketIds(userId.toString()).forEach((sid) =>
            io
                .to(sid)
                .emit("conversation:updated", { _id: conv._id, unreadCount: 0 })
        );

        res.json({ message: "Marked as read" });
    } catch (e) {
        console.error("markConversationRead error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
};
