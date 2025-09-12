/**
 * MessagesList Component
 * ----------------------
 * Displays the list of chat messages for the selected conversation.
 *
 * Exports:
 *   - MessagesList: Renders a scrollable list of messages with loading, error, and empty states.
 *
 * Props:
 *   - conversation (object): The selected conversation object containing details like `id` and `lastMessage`.
 *   - isLoading (boolean): Indicates if messages are being loaded (optional, defaults to `false`).
 *   - messages (array): The list of messages for the selected conversation (optional, defaults to an empty array).
 *   - error (object | null): Error object if messages failed to load (optional, defaults to `null`).
 *   - receiverAvatarUrl (string): URL for the receiver's avatar.
 *   - senderAvatarUrl (string): URL for the current user's avatar.
 *
 * States:
 *   - Loading State:
 *       - Displays a spinner while messages are being loaded.
 *   - Error State:
 *       - Displays an error message and a retry button if messages fail to load.
 *   - Empty State:
 *       - Displays a placeholder message when no messages exist in the conversation.
 *   - Messages List:
 *       - Renders a list of `Message` components for each message in the `messages` array.
 *       - Alternates between sender and receiver styles based on `isSentByCurrentUser`.
 *
 * Effects:
 *   - Automatically scrolls to the bottom of the message list when new messages are added or the conversation changes.
 *
 * Layout:
 *   - Wrapper: A scrollable container for the messages.
 *   - Message Bubbles:
 *       - Alternates between "chat-start" (messages from the receiver) and "chat-end" (messages from the sender).
 *       - Includes avatar, message content, and timestamp.
 *
 * Usage:
 *   - Used within the `MessageContainer` component to display the messages of the selected conversation.
 *
 * Example:
 *   - Rendered in `MessageContainer.jsx`:
 *       <MessagesList
 *           conversation={selectedConversation}
 *           isLoading={isLoadingMessages}
 *           messages={messages}
 *           error={messagesError}
 *           receiverAvatarUrl={receiverAvatarUrl}
 *           senderAvatarUrl={senderAvatarUrl}
 *       />
 */

import { memo, useEffect, useRef } from "react";
import Message from "./Message";

const MessagesList = memo(
    ({
        conversation,
        isLoading = false,
        messages = [],
        error = null,
        receiverAvatarUrl,
        senderAvatarUrl,
    }) => {
        const messagesEndRef = useRef(null);

        // Scroll to bottom when messages change
        useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages, conversation?._id]);

        if (isLoading) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <div className="loading loading-spinner loading-lg text-white/60"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white/60 text-center">
                        <div className="text-xl mb-2">⚠️</div>
                        <p>Failed to load messages</p>
                        <button className="btn btn-sm bg-white/20 mt-2">
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        // Make sure messages is always an array before using map
        const messagesArray = Array.isArray(messages) ? messages : [];

        // Display "start conversation" message if no messages exist
        if (messagesArray.length === 0 && !isLoading) {
            return (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-white/60 text-center">
                        <div className="text-xl mb-2">💬</div>
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">
                            Type a message to start the conversation
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {messagesArray.map((message) => (
                    <Message
                        key={message.id}
                        message={message.content}
                        timestamp={message.timestamp}
                        isSentByCurrentUser={message.isSentByCurrentUser}
                        avatarUrl={
                            message.isSentByCurrentUser
                                ? senderAvatarUrl
                                : receiverAvatarUrl
                        }
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        );
    }
);

export default MessagesList;
