/**
 * useMessages Hook
 * -----------------
 * Custom hook for managing messages in a conversation.
 *
 * Exports:
 *   - useMessages: Provides message state, loading state, and functions for handling message input and submission.
 *
 * Parameters:
 *   - receiverData (object | null): The receiver's data, including:
 *       - _id (string): The receiver's unique ID.
 *
 * State:
 *   - message (string): The current input value for the message being typed.
 *   - isLoading (boolean): Indicates whether messages are being fetched or sent.
 *
 * Context:
 *   - selectedConversation (object | null): The currently selected conversation, accessed via `useConversationStore`.
 *   - messages (array): The list of messages for the selected conversation, accessed via `useConversationStore`.
 *   - setMessages (function): Function to update the messages array, accessed via `useConversationStore`.
 *
 * Functions:
 *   - fetchMessages():
 *       - Fetches messages for the selected conversation from the API.
 *       - Skips fetching for temporary conversations or if no receiver is selected.
 *       - Updates the `messages` state with the fetched messages.
 *       - Handles errors and displays error notifications using `showToast`.
 *   - handleSubmit(e):
 *       - Handles message submission.
 *       - Creates an optimistic message for immediate UI feedback.
 *       - Sends the message to the API.
 *       - Replaces the optimistic message with the confirmed message from the API.
 *       - Handles errors and removes failed messages from the UI.
 *   - handleMessageChange(e):
 *       - Updates the `message` state with the current input value.
 *
 * Effects:
 *   - Fetches messages when the selected conversation changes.
 *   - Clears messages for temporary conversations or when no conversation is selected.
 *
 * Returns:
 *   - message (string): The current input value for the message being typed.
 *   - isLoading (boolean): Indicates whether messages are being fetched or sent.
 *   - handleSubmit (function): Function to handle message submission.
 *   - handleMessageChange (function): Function to handle changes in the message input field.
 *
 * Usage:
 *   - Used in the `MessageContainer` component to manage message input, submission, and fetching.
 *
 * Example:
 *   - Import and use the hook in a component:
 *       const { message, isLoading, handleSubmit, handleMessageChange } = useMessages(receiverData);
 *
 *   - Render a message input field:
 *       <form onSubmit={handleSubmit}>
 *           <input
 *               type="text"
 *               value={message}
 *               onChange={handleMessageChange}
 *               placeholder="Type a message..."
 *           />
 *           <button type="submit" disabled={isLoading}>Send</button>
 *       </form>
 */

import { useState, useCallback, useEffect } from "react";
import { useConversationStore } from "../conversation/useConversationStore";
import { showToast } from "../../utils/toastConfig";

export const useMessages = (receiverData) => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { selectedConversation, messages, setMessages } =
        useConversationStore();

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

    // Handle message submission
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

    const handleMessageChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    return {
        message,
        isLoading,
        handleSubmit,
        handleMessageChange,
    };
};
