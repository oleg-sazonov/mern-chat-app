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
 *   - messages: Array of messages for the selected conversation, accessed via `useConversationStore`.
 *   - setMessages: Function to update the messages array.
 *
 * State:
 *   - message (string): Stores the current input value for the message being typed.
 *   - isLoading (boolean): Indicates whether messages are being fetched or sent.
 *
 * Functions:
 *   - handleSubmit(e):
 *       - Prevents default form submission.
 *       - Sends a message to the receiver using an API call.
 *       - Updates the UI optimistically with the new message.
 *       - Handles errors and removes failed messages from the UI.
 *   - handleBackClick():
 *       - Clears the selected conversation (used for mobile navigation).
 *   - handleMessageChange(e):
 *       - Updates the `message` state with the current input value.
 *
 * Memoized Values:
 *   - receiverData (object | null): The receiver's data, including `_id`, `fullName`, `username`, and `profilePicture`.
 *   - avatarUrl (string | null): The avatar URL for the receiver. Defaults to a placeholder if not provided.
 *   - headerData (object | null): Data for the `ChatHeader` component, including the receiver's name, username, and online status.
 *
 * Effects:
 *   - Fetches messages for the selected conversation when it changes.
 *   - Clears messages for temporary conversations or when no conversation is selected.
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

import { useState, useCallback, useMemo, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import WelcomeScreen from "./WelcomeScreen";
import { useConversationStore } from "../../hooks/conversation/useConversationStore";
import { showToast } from "../../utils/toastConfig";

const MessageContainer = ({ className = "" }) => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        selectedConversation,
        setSelectedConversation,
        isMobile,
        messages,
        setMessages,
    } = useConversationStore();

    // Get receiver data from selected conversation
    const receiverData = useMemo(() => {
        if (!selectedConversation) return null;

        // Handle temporary conversations (created when selecting a user)
        if (selectedConversation._id?.startsWith("temp_")) {
            return selectedConversation.participants[0];
        }

        // Find the other participant in regular conversations
        const participant = selectedConversation.participants?.find(
            (p) => p._id !== JSON.parse(localStorage.getItem("user") || "{}").id
        );

        return participant || selectedConversation.participants?.[0];
    }, [selectedConversation]);

    // Load messages when conversation changes
    useEffect(() => {
        const fetchMessages = async () => {
            // Skip fetching if this is a temporary conversation
            if (
                !selectedConversation ||
                selectedConversation._id?.startsWith("temp_")
            ) {
                // Clear messages for new conversations or when no conversation is selected
                setMessages([]);
                return;
            }

            // Get receiverId from the participant who is not the current user
            const receiverId = receiverData?._id;
            if (!receiverId) return;

            try {
                // Only show loading state and fetch messages if we don't already have them
                // This prevents clearing messages when clicking the same conversation
                if (messages.length === 0) {
                    setIsLoading(true);

                    // Fetch messages from API
                    const res = await fetch(`/api/messages/${receiverId}`);

                    if (!res.ok) {
                        throw new Error("Failed to fetch messages");
                    }

                    const data = await res.json();

                    // Transform API response to match our message format
                    const formattedMessages = data.data.map((msg) => ({
                        id: msg._id,
                        content: msg.message,
                        timestamp: msg.createdAt,
                        isSentByCurrentUser:
                            msg.senderId ===
                            JSON.parse(localStorage.getItem("user") || "{}").id,
                    }));

                    setMessages(formattedMessages);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
                showToast.error("Could not load messages");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [selectedConversation?._id, receiverData, setMessages, messages.length]);

    // Memoize event handlers
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!message.trim() || !receiverData?._id) return;

            // Create optimistic message for immediate UI update
            const tempId = `temp-${Date.now()}`;
            const optimisticMessage = {
                id: tempId,
                content: message.trim(),
                timestamp: new Date().toISOString(),
                isSentByCurrentUser: true,
            };

            try {
                // Update UI immediately
                setMessages((prevMessages) => [
                    ...prevMessages,
                    optimisticMessage,
                ]);

                // Clear input
                setMessage("");

                // Send message to API
                const res = await fetch(
                    `/api/messages/send/${receiverData._id}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ message: message.trim() }),
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to send message");
                }

                // Get confirmed message from API
                const data = await res.json();

                // Replace optimistic message with confirmed message
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === tempId
                            ? {
                                  id: data.data._id,
                                  content: data.data.message,
                                  timestamp: data.data.createdAt,
                                  isSentByCurrentUser: true,
                              }
                            : msg
                    )
                );
            } catch (error) {
                console.error("Error sending message:", error);
                showToast.error("Failed to send message");

                // Remove failed message
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg.id !== tempId)
                );
            }
        },
        [message, receiverData, setMessages]
    );

    const handleBackClick = useCallback(() => {
        setSelectedConversation(null);
    }, [setSelectedConversation]);

    const handleMessageChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    // Memoize avatar URL with fallbacks
    const avatarUrl = useMemo(() => {
        if (!receiverData) return null;

        return (
            receiverData.profilePicture ||
            `https://robohash.org/user${receiverData._id}.png`
        );
    }, [receiverData]);

    // Prepare header data for ChatHeader component
    const headerData = useMemo(() => {
        if (!receiverData) return null;

        return {
            name: receiverData.fullName,
            username: receiverData.username,
            isOnline: receiverData.isOnline || false,
            _id: receiverData._id,
        };
    }, [receiverData]);

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
                        messages={messages}
                        isLoading={isLoading}
                        receiverAvatarUrl={avatarUrl}
                        senderAvatarUrl={`https://robohash.org/${
                            JSON.parse(localStorage.getItem("user") || "{}").id
                        }.png`}
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
