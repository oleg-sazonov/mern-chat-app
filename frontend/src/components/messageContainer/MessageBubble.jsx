/**
 * MessageBubble Component
 * -----------------------
 * Renders the bubble part of a chat message with appropriate styling.
 *
 * Props:
 *   - content (string): The text content of the message.
 *   - isSentByCurrentUser (boolean): Indicates whether the message was sent by the current user.
 *   - className (string): Additional CSS classes to apply to the bubble. Defaults to an empty string.
 *   - style (object): Inline styles to apply to the bubble. Defaults to an empty object.
 *
 * Behavior:
 *   - Applies different background styles based on whether the message was sent by the current user.
 *   - Ensures long words or unbroken text wrap correctly using `whitespace-pre-wrap` and `[overflow-wrap:anywhere]`.
 *   - Supports additional styling and animations via `className` and `style` props.
 *
 * Styling:
 *   - The `chat-bubble` class is used for consistent bubble styling.
 *   - Background color changes based on `isSentByCurrentUser`:
 *       - Sent by current user: `bg-white/30`.
 *       - Received: `bg-white/10`.
 *   - Text color is always white (`text-white`).
 *   - Includes alignment and transform optimizations (`align-middle`, `will-change-transform`).
 *
 * Usage:
 *   - Used within the `Message` component to render the actual message bubble.
 *
 * Example:
 *   <MessageBubble
 *       content="Hello, how are you?"
 *       isSentByCurrentUser={true}
 *       className="animate-shake"
 *       style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)" }}
 *   />
 *
 * Performance:
 *   - Memoized using `React.memo` to prevent unnecessary re-renders.
 */

import { memo } from "react";

const MessageBubble = memo(
    ({ content, isSentByCurrentUser, className = "", style = {} }) => {
        const bubbleStyle = isSentByCurrentUser ? "bg-white/30" : "bg-white/10";

        return (
            // <div className={`chat-bubble ${bubbleStyle} text-white`}>{content}</div>
            <div
                className={`chat-bubble ${bubbleStyle} text-white align-middle will-change-transform ${className}`}
                style={style}
            >
                <span className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                    {content}
                </span>
            </div>
        );
    }
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
