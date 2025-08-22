/**
 * MessagesList Component
 * ----------------------
 * Displays the list of chat messages for the selected conversation.
 *
 * Exports:
 *   - MessagesList: Renders a scrollable list of messages with loading and error states.
 *
 * Props:
 *   - conversation: The selected conversation object containing details like `id` and `lastMessage`.
 *   - messages: Array of message objects (optional, defaults to an empty array).
 *   - isLoading: Boolean indicating if messages are being loaded (optional, defaults to `false`).
 *   - error: Error object if messages failed to load (optional, defaults to `null`).
 *
 * Layout:
 *   - Loading State: Displays a spinner while messages are loading.
 *   - Error State: Displays an error message if messages fail to load.
 *   - Chat Bubbles:
 *       - Alternates between "chat-start" (messages from the other user) and "chat-end" (messages from the current user).
 *       - Includes avatar, message content, and timestamp.
 *   - Sample Messages:
 *       - Displays placeholder messages for demonstration purposes.
 *       - Uses the conversation's `id` and `lastMessage` for dynamic content.
 *
 * Usage:
 *   - Used within the `MessageContainer` component to display the messages of the selected conversation.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `MessageContainer.jsx`:
 *       <MessagesList
 *           conversation={selectedConversation}
 *           messages={messagesData}
 *           isLoading={isLoadingMessages}
 *           error={messagesError}
 *       />
 */

import { memo, useEffect, useRef } from "react";
import Message from "./Message";
import generateSampleMessages from "../../data/sampleMessages";

const MessagesList = memo(
    ({ conversation, messages = [], isLoading = false, error = null }) => {
        const messagesEndRef = useRef(null);
        let sampleMessages = [];

        // Scroll to bottom when messages change
        useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages, conversation?.id]);

        // For now, we'll use sample messages until API integration
        // This can be replaced with actual messages when ready
        if (conversation) {
            sampleMessages = generateSampleMessages(conversation);
        }

        // Use actual messages if provided, otherwise use sample messages
        const displayMessages = messages.length > 0 ? messages : sampleMessages;

        // Get avatar URLs
        const userAvatarUrl = `https://robohash.org/user${conversation?.id}.png`;
        const myAvatarUrl = "https://robohash.org/me.png";

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

        return (
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {displayMessages.map((message) => (
                    <Message
                        key={message.id}
                        message={message.content}
                        timestamp={message.timestamp}
                        isSentByCurrentUser={message.isSentByCurrentUser}
                        avatarUrl={
                            message.isSentByCurrentUser
                                ? myAvatarUrl
                                : userAvatarUrl
                        }
                    />
                ))}
                <div ref={messagesEndRef} />{" "}
                {/* Empty div for scrolling to latest message */}
            </div>
        );
    }
);

MessagesList.displayName = "MessagesList";

export default MessagesList;
