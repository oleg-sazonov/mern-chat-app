/**
 * MessageBubble Component
 * -----------------------
 * Renders the bubble part of a chat message with appropriate styling.
 *
 * Props:
 *   - content (string): The text content of the message.
 *   - isSentByCurrentUser (boolean): Indicates whether the message was sent by the current user.
 *
 * Behavior:
 *   - Applies different background styles based on whether the message was sent by the current user.
 *   - Ensures long words or unbroken text wrap correctly using `whitespace-pre-wrap` and `[overflow-wrap:anywhere]`.
 *
 * Usage:
 *   - Used within the `Message` component to render the actual message bubble.
 *
 * Example:
 *   <MessageBubble
 *       content="Hello, how are you?"
 *       isSentByCurrentUser={true}
 *   />
 */

import { memo } from "react";

const MessageBubble = memo(({ content, isSentByCurrentUser }) => {
    const bubbleStyle = isSentByCurrentUser ? "bg-white/20" : "bg-white/10";

    return (
        // <div className={`chat-bubble ${bubbleStyle} text-white`}>{content}</div>
        <div className={`chat-bubble ${bubbleStyle} text-white`}>
            <span className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                {content}
            </span>
        </div>
    );
});

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
