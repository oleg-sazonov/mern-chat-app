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
 * Hooks:
 *   - useReceiverData:
 *       - Provides receiver data, avatar URLs, and header data for the chat interface.
 *       - Returns:
 *           - receiverData (object | null): The receiver's data, including `_id`, `fullName`, `username`, and `profilePicture`.
 *           - avatarUrl (string | null): The avatar URL for the receiver.
 *           - headerData (object | null): Data for the `ChatHeader` component, including the receiver's name, username, and online status.
 *           - senderAvatarUrl (string): The avatar URL for the current user (sender).
 *   - useMessages:
 *       - Manages message input, submission, and fetching.
 *       - Returns:
 *           - message (string): The current input value for the message being typed.
 *           - isLoading (boolean): Indicates whether messages are being fetched or sent.
 *           - handleSubmit (function): Function to handle message submission.
 *           - handleMessageChange (function): Function to handle changes in the message input field.
 *
 * Functions:
 *   - handleBackClick():
 *       - Clears the selected conversation (used for mobile navigation).
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
 *   - Manages message input, submission, and fetching.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `Home.jsx`:
 *       <MessageContainer className="w-3/4" />
 */

import { useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import WelcomeScreen from "./WelcomeScreen";
import { useConversationStore } from "../../hooks/conversation/useConversationStore";
import { useReceiverData } from "../../hooks/conversation/useReceiverData";
import { useMessages } from "../../hooks/messages/useMessages";

const MessageContainer = ({ className = "" }) => {
    const { selectedConversation, setSelectedConversation, isMobile } =
        useConversationStore();

    // Get receiver data using custom hook
    const { receiverData, avatarUrl, headerData, senderAvatarUrl } =
        useReceiverData();

    // Get message handling using custom hook
    const { message, isLoading, handleSubmit, handleMessageChange } =
        useMessages(receiverData);

    // Handle back button click for mobile
    const handleBackClick = useCallback(() => {
        setSelectedConversation(null);
    }, [setSelectedConversation]);

    return (
        <div
            className={`flex-1 flex flex-col bg-white/5 backdrop-blur-md ${className}`}
        >
            {selectedConversation ? (
                <>
                    <ChatHeader
                        conversation={headerData}
                        avatarUrl={avatarUrl}
                        isMobile={isMobile}
                        onBackClick={handleBackClick}
                    />
                    <MessagesList
                        conversation={selectedConversation}
                        isLoading={isLoading}
                        receiverAvatarUrl={avatarUrl}
                        senderAvatarUrl={senderAvatarUrl}
                    />
                    <MessageInput
                        message={message}
                        onChange={handleMessageChange}
                        onSubmit={handleSubmit}
                        isDisabled={!receiverData || isLoading}
                    />
                </>
            ) : (
                <WelcomeScreen />
            )}
        </div>
    );
};

export default MessageContainer;
