/**
 * MessagesList Component
 * ----------------------
 * Displays the list of chat messages for the selected conversation.
 *
 * Exports:
 *   - MessagesList: Renders a scrollable list of messages with loading, error, and empty states.
 *
 * Props:
 *   - conversation (object): The selected conversation object containing details like `id`, `unreadCount`, and `lastMessage`.
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
 *   - Scrolls to the "New messages" divider if there are unread messages.
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
 *
 * Scroll Behavior:
 *   - If there are unread messages:
 *       - Automatically scrolls to the "New messages" divider (no smooth scrolling).
 *   - If there are no unread messages:
 *       - Scrolls to the bottom of the message list.
 *       - Smooth scrolling is applied only for outgoing messages.
 *
 * Priority Rendering:
 *   - Loading > Error > Empty > Messages:
 *       - Displays the loading spinner if `isLoading` is true.
 *       - Displays the error message if `error` is not null.
 *       - Displays the empty state if `messages` is an empty array.
 *       - Displays the list of messages otherwise.
 */

import { memo, useEffect, useRef, useMemo } from "react";
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
        const newMarkerRef = useRef(null);

        // Make sure messages is always an array before using map
        const messagesArray = useMemo(
            () => (Array.isArray(messages) ? messages : []),
            [messages]
        );

        const unreadCount = conversation?.unreadCount || 0;

        // Compute first unread index from unreadCount
        const firstUnreadIndex = useMemo(() => {
            if (!unreadCount || !messagesArray.length) return -1;
            const idx = messagesArray.length - unreadCount;
            return Math.max(0, Math.min(idx, messagesArray.length - 1));
        }, [messagesArray.length, unreadCount]);

        // Scroll behavior:
        // - If there are unread messages: jump to the "New messages" divider (no smooth)
        // - Else: scroll to bottom (smooth only for own outgoing message)
        useEffect(() => {
            if (!messagesArray.length) return;

            if (firstUnreadIndex >= 0 && newMarkerRef.current) {
                newMarkerRef.current.scrollIntoView({
                    behavior: "auto",
                    block: "start",
                });
                return;
            }

            const last = messagesArray[messagesArray.length - 1];
            messagesEndRef.current?.scrollIntoView({
                behavior: last?.isSentByCurrentUser ? "smooth" : "auto",
            });
        }, [messagesArray, firstUnreadIndex, conversation?._id]);

        // Scroll to bottom when messages change
        // useEffect(() => {
        //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // }, [messagesArray, conversation?._id]);

        // Define all possible UI components as variables
        const loadingSpinner = (
            <div className="flex-1 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-white/60"></div>
            </div>
        );

        const errorMessage = (
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

        const emptyConversation = (
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

        const messageList = (
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {messagesArray.map(
                    (
                        message // add idx if divider is needed
                    ) => (
                        <div key={message.id}>
                            {/* {firstUnreadIndex === idx && unreadCount > 0 && (
                            <div
                                ref={newMarkerRef}
                                className="divider text-white/60 text-xs"
                            >
                                New messages
                            </div>
                        )} */}
                            <Message
                                message={message.content}
                                timestamp={message.timestamp}
                                isSentByCurrentUser={
                                    message.isSentByCurrentUser
                                }
                                avatarUrl={
                                    message.isSentByCurrentUser
                                        ? senderAvatarUrl
                                        : receiverAvatarUrl
                                }
                                isFresh={message.isFresh}
                            />
                        </div>
                    )
                )}
                <div ref={messagesEndRef} />
            </div>
        );

        // Determine which component to render using a single return statement
        // Priority order: Loading > Error > Empty > Messages
        let content;
        if (isLoading || conversation?.isLoading) {
            // Add check for conversation.isLoading
            content = loadingSpinner;
        } else if (error) {
            content = errorMessage;
        } else if (messagesArray.length === 0) {
            content = emptyConversation;
        } else {
            content = messageList;
        }

        return content;
    }
);

// Add display name for better debugging
MessagesList.displayName = "MessagesList";

export default MessagesList;
