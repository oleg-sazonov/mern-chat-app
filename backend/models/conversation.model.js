/**
 * Conversation Model
 * ------------------
 * Represents a conversation between two or more participants in the chat application.
 *
 * Schema Fields:
 *   - participants (array):
 *       - Type: Array of ObjectIds referencing the `User` model.
 *       - Required: Yes.
 *       - Description: Contains the IDs of users participating in the conversation.
 *
 *   - messages (array):
 *       - Type: Array of ObjectIds referencing the `Message` model.
 *       - Default: Empty array.
 *       - Description: Stores the IDs of messages exchanged in the conversation.
 *
 *   - reads (array):
 *       - Type: Array of objects.
 *       - Description: Tracks the read status for each participant in the conversation.
 *       - Fields:
 *           - userId:
 *               - Type: ObjectId referencing the `User` model.
 *               - Required: Yes.
 *               - Description: The ID of the user whose read status is being tracked.
 *           - lastReadAt:
 *               - Type: Date.
 *               - Default: null.
 *               - Description: The timestamp of the last message read by the user.
 *           - unreadCount:
 *               - Type: Number.
 *               - Default: 0.
 *               - Description: The number of unread messages for the user.
 *
 * Schema Options:
 *   - timestamps:
 *       - Automatically manages `createdAt` and `updatedAt` fields.
 *
 * Indexes:
 *   - { "reads.userId": 1 }:
 *       - Optimizes queries involving the `reads.userId` field.
 *
 * Model:
 *   - Name: `Conversation`.
 *   - Description: Represents a conversation between users, including participants, messages, and read statuses.
 *
 * Usage:
 *   - Import the model to interact with the `conversations` collection in MongoDB.
 *       import Conversation from "../models/conversation.model.js";
 */

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
        reads: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                lastReadAt: { type: Date, default: null },
                unreadCount: { type: Number, default: 0 },
            },
        ],
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

conversationSchema.index({ "reads.userId": 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
