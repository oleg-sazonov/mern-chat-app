/**
 * Message Component
 * ----------------
 * Renders a single message bubble in the chat interface.
 *
 * Exports:
 *   - Message: Displays a single chat message with avatar, content, and timestamp.
 *
 * Props:
 *   - message: The text content of the message.
 *   - isSentByCurrentUser: Boolean indicating if the current user sent this message.
 *   - avatarUrl: URL for the sender's avatar image.
 *   - timestamp: The time the message was sent (ISO string).
 *
 * Layout:
 *   - Chat Bubble: Positioned on the left (received) or right (sent) based on the sender.
 *   - Avatar: Displays the sender's profile picture.
 *   - Message Content: Shows the actual message text inside a styled bubble.
 *   - Timestamp: Displays the time the message was sent below the bubble.
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

const Message = memo(
    ({ message, isSentByCurrentUser, avatarUrl, timestamp }) => {
        const position = isSentByCurrentUser ? "chat-end" : "chat-start";
        // const bubbleStyle = isSentByCurrentUser ? "bg-white/20" : "bg-white/10";

        return (
            <div className={`chat ${position}`}>
                <div className="chat-image avatar">
                    <div className="w-8 rounded-full bg-white/10">
                        <img
                            src={avatarUrl}
                            alt={
                                isSentByCurrentUser
                                    ? "My avatar"
                                    : "User avatar"
                            }
                            loading="lazy"
                        />
                    </div>
                </div>
                {/* <div className={`chat-bubble ${bubbleStyle} text-white`}>
                    {message}
                </div> */}
                <MessageBubble
                    content={message}
                    isSentByCurrentUser={isSentByCurrentUser}
                />
                <div className="chat-footer text-white/40 text-xs mt-1">
                    {formatMessageTime(timestamp) || "12:30"}
                </div>
            </div>
        );
    }
);

Message.displayName = "Message";

export default Message;
