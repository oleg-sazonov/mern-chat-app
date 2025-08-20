/**
 * MessageContainer Component
 * -------------------------
 * Displays the chat messages and input area for the selected conversation.
 *
 * Exports:
 *   - MessageContainer: Renders the chat header, messages, and input form.
 *
 * Context:
 *   - selectedConversation: The currently selected conversation object, accessed via `useConversation`.
 *   - setSelectedConversation: Function to clear the selected conversation (used for mobile navigation).
 *   - isMobile: Boolean indicating if the viewport is mobile-sized (<768px).
 *
 * State:
 *   - message: Stores the current input value for the message being typed.
 *
 * Functions:
 *   - handleSubmit(e)
 *     - Prevents default form submission.
 *     - Logs the message and recipient (replace with API call in production).
 *     - Clears the input after sending.
 *   - handleBackClick()
 *     - Clears the selected conversation (used for mobile navigation).
 *   - handleMessageChange(e)
 *     - Updates the `message` state with the current input value.
 *
 * Layout:
 *   - If `selectedConversation` exists:
 *       - Chat header with avatar, name, and online status.
 *       - List of sample messages (replace with actual data).
 *       - Message input form.
 *   - If no conversation is selected:
 *       - Shows a welcome message and prompt to select a conversation.
 *
 * Usage:
 *   - Used within the `Home` component to display the selected conversation's messages and input area.
 *   - Manages message input and submission.
 *   - Responsive and styled for glassmorphism chat UI.
 */

import { useState, useCallback, useMemo } from "react";
import { useConversation } from "../../hooks/useConversation";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import WelcomeScreen from "./WelcomeScreen";

const MessageContainer = ({ className = "" }) => {
    const [message, setMessage] = useState("");
    const { selectedConversation, setSelectedConversation, isMobile } =
        useConversation();

    // Memoize event handlers to prevent unnecessary re-renders
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (message.trim()) {
                // This would be replaced with actual API call
                console.log(
                    "Sending message:",
                    message,
                    "to:",
                    selectedConversation?.name
                );
                setMessage(""); // Clear input after sending
            }
        },
        [message, selectedConversation]
    );

    const handleBackClick = useCallback(() => {
        setSelectedConversation(null);
    }, [setSelectedConversation]);

    const handleMessageChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    // Memoize avatar URL to avoid recalculation
    const avatarUrl = useMemo(
        () =>
            selectedConversation
                ? `https://robohash.org/user${selectedConversation.id}.png`
                : null,
        // eslint-disable-next-line
        [selectedConversation?.id]
    );

    // Extract UI sections into separate components for better readability
    return (
        <div
            className={`flex-1 flex flex-col bg-white/5 backdrop-blur-md ${className}`}
        >
            {selectedConversation ? (
                <>
                    <ChatHeader
                        conversation={selectedConversation}
                        avatarUrl={avatarUrl}
                        isMobile={isMobile}
                        onBackClick={handleBackClick}
                    />
                    <MessagesList conversation={selectedConversation} />
                    <MessageInput
                        message={message}
                        onChange={handleMessageChange}
                        onSubmit={handleSubmit}
                    />
                </>
            ) : (
                <WelcomeScreen />
            )}
        </div>
    );
};

export default MessageContainer;
