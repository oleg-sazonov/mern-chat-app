/**
 * MessageContainer Component
 * --------------------------
 * Displays the chat messages and input area for the selected conversation.
 *
 * Exports:
 *   - MessageContainer: Renders the chat header, messages list, and input form.
 *
 * Props:
 *   - className (string): Additional CSS classes for styling the container. Defaults to an empty string.
 *
 * Context:
 *   - selectedConversation: The currently selected conversation object, accessed via `useConversationStore`.
 *   - setSelectedConversation: Function to clear the selected conversation (used for mobile navigation).
 *   - isMobile: Boolean indicating if the viewport is mobile-sized (<768px).
 *
 * State:
 *   - message (string): Stores the current input value for the message being typed.
 *
 * Functions:
 *   - handleSubmit(e):
 *       - Prevents default form submission.
 *       - Logs the message and recipient (replace with API call in production).
 *       - Clears the input after sending.
 *   - handleBackClick():
 *       - Clears the selected conversation (used for mobile navigation).
 *   - handleMessageChange(e):
 *       - Updates the `message` state with the current input value.
 *
 * Memoized Values:
 *   - avatarUrl (string | null): The avatar URL for the selected conversation. Defaults to a placeholder if not provided.
 *
 * Layout:
 *   - If `selectedConversation` exists:
 *       - ChatHeader: Displays the conversation's avatar, name, and online status.
 *       - MessagesList: Displays the list of messages for the selected conversation.
 *       - MessageInput: Input form for typing and sending messages.
 *   - If no conversation is selected:
 *       - WelcomeScreen: Displays a welcome message and prompt to select a conversation.
 *
 * Usage:
 *   - Used within the `Home` component to display the selected conversation's messages and input area.
 *   - Manages message input and submission.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `Home.jsx`:
 *       <MessageContainer className="w-3/4" />
 */

import { useState, useCallback, useMemo } from "react";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import WelcomeScreen from "./WelcomeScreen";
import { useConversationStore } from "../../hooks/conversation/useConversationStore";

const MessageContainer = ({ className = "" }) => {
    const [message, setMessage] = useState("");
    const { selectedConversation, setSelectedConversation, isMobile } =
        useConversationStore();

    // Memoize event handlers
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (message.trim()) {
                // This would be replaced with actual API call
                console.log(
                    "Sending message:",
                    message,
                    "to:",
                    selectedConversation?.fullName
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

    // Memoize avatar URL
    const avatarUrl = useMemo(
        () =>
            selectedConversation
                ? selectedConversation.profilePicture ||
                  `https://robohash.org/user${selectedConversation._id}.png`
                : null,
        [selectedConversation]
    );

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
