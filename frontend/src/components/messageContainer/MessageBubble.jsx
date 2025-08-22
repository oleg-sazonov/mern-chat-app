/**
 * MessageBubble Component
 * ----------------------
 * Renders just the bubble part of a message.
 *
 * Props:
 *   - content: The text content of the message
 *   - isSentByCurrentUser: Boolean indicating if the current user sent this message
 *
 * Usage:
 *   - Used within the Message component to render the actual message bubble
 */

import { memo } from "react";

const MessageBubble = memo(({ content, isSentByCurrentUser }) => {
    const bubbleStyle = isSentByCurrentUser ? "bg-white/20" : "bg-white/10";

    return (
        <div className={`chat-bubble ${bubbleStyle} text-white`}>{content}</div>
    );
});

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
