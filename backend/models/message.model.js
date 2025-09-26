/**
 * Message Model
 * -------------
 * Represents a message exchanged between two users in the chat application.
 *
 * Schema Fields:
 *   - senderId:
 *       - Type: ObjectId referencing the `User` model.
 *       - Required: Yes.
 *       - Description: The ID of the user who sent the message.
 *
 *   - receiverId:
 *       - Type: ObjectId referencing the `User` model.
 *       - Required: Yes.
 *       - Description: The ID of the user who received the message.
 *
 *   - message:
 *       - Type: String.
 *       - Required: Yes.
 *       - Description: The content of the message.
 *       - Additional: Automatically trims whitespace from the message content.
 *
 * Schema Options:
 *   - timestamps:
 *       - Automatically manages `createdAt` and `updatedAt` fields.
 *
 * Model:
 *   - Name: `Message`.
 *   - Description: Represents a single message exchanged between users, including sender, receiver, and content.
 *
 * Usage:
 *   - Import the model to interact with the `messages` collection in MongoDB.
 *       import Message from "../models/message.model.js";
 */

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
