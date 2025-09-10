/**
 * Message Component
 * ----------------
 * Renders a single message bubble in the chat interface.
 *
 * Exports:
 *   - Message: Displays a single chat message with avatar, content, and timestamp.
 *
 * Props:
 *   - message (string): The text content of the message.
 *   - isSentByCurrentUser (boolean): Indicates if the current user sent this message.
 *   - avatarUrl (string): URL for the sender's avatar image.
 *   - timestamp (string): The time the message was sent (ISO string).
 *
 * Layout:
 *   - Chat Bubble:
 *       - Positioned on the right (sent) or left (received) based on `isSentByCurrentUser`.
 *   - Avatar:
 *       - Displays the sender's profile picture.
 *       - Uses the current user's avatar for sent messages or the provided `avatarUrl` for received messages.
 *   - Message Content:
 *       - Displays the actual message text inside a styled bubble.
 *   - Timestamp:
 *       - Shows the time the message was sent below the bubble.
 *
 * Functions:
 *   - formatMessageTime(timestamp):
 *       - Formats the timestamp into a readable time string.
 *       - Returns "Just now" if the timestamp is invalid or not provided.
 *
 * Hooks:
 *   - useCurrentUser:
 *       - Retrieves the current user's data, including profile picture and username.
 *   - useAuthContext:
 *       - Provides authentication context, including the authenticated user's data.
 *
 * Usage:
 *   - Used within the `MessagesList` component to render each individual message.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `MessagesList.jsx`:
 *       <Message
 *           message="Hello, how are you?"
 *           isSentByCurrentUser={true}
 *           avatarUrl="https://robohash.org/me.png"
 *           timestamp="2023-10-01T12:30:00.000Z"
 *       />
 */

import { memo } from "react";
import MessageBubble from "./MessageBubble";
import { formatMessageTime } from "../../utils/dateUtils";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import { useAuthContext } from "../../store/AuthContext";

const Message = memo(
    ({ message, isSentByCurrentUser, avatarUrl, timestamp }) => {
        // Position message on the right (sent) or left (received)
        const position = isSentByCurrentUser ? "chat-end" : "chat-start";

        // Format timestamp or provide fallback
        const formattedTime = formatMessageTime(timestamp) || "Just now";

        // Get current user data from hooks
        const { currentUser } = useCurrentUser();
        const { authUser } = useAuthContext();

        // Get the user data for avatar generation (prefer current user data)
        const userData = currentUser || authUser || {};

        // Generate sender avatar URL using the same logic as SidebarFooter
        const senderAvatarUrl =
            userData.profilePicture ||
            (userData.username
                ? `https://robohash.org/${userData.username}.png`
                : `https://robohash.org/${userData.id || "me"}.png`);

        return (
            <div className={`chat ${position}`}>
                {/* Avatar */}
                <div className="chat-image avatar">
                    <div className="w-8 rounded-full bg-white/10">
                        <img
                            src={
                                isSentByCurrentUser
                                    ? senderAvatarUrl || avatarUrl
                                    : avatarUrl
                            }
                            alt={
                                isSentByCurrentUser
                                    ? "My avatar"
                                    : "User avatar"
                            }
                            loading="lazy"
                        />
                    </div>
                </div>

                {/* Message content bubble */}
                <MessageBubble
                    content={message}
                    isSentByCurrentUser={isSentByCurrentUser}
                />

                {/* Timestamp */}
                <div className="chat-footer text-white/40 text-xs mt-1">
                    {formattedTime}
                </div>
            </div>
        );
    }
);

Message.displayName = "Message";

export default Message;
