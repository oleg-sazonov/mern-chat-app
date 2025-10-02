/**
 * useMessages Hook
 * -----------------
 * Custom hook for managing messages in a conversation.
 *
 * Purpose:
 *   - Fetches and manages the state of messages for the currently selected conversation.
 *   - Handles loading states and error notifications during message fetching.
 *
 * Parameters:
 *   - receiverData (object | null): The receiver's data, including:
 *       - _id (string): The unique ID of the receiver.
 *
 * State:
 *   - isLoading (boolean): Indicates whether messages are being fetched.
 *
 * Context:
 *   - selectedConversation (object | null): The currently selected conversation, accessed via `useConversationStore`.
 *   - messages (array): The list of messages for the selected conversation, accessed via `useConversationStore`.
 *   - setMessages (function): Updates the `messages` state in the `useConversationStore`.
 *
 * Functions:
 *   - fetchMessages():
 *       - Fetches messages for the selected conversation from the API.
 *       - Clears messages if the selected conversation is temporary or invalid.
 *       - Updates the `messages` state with the fetched messages.
 *       - Handles errors and displays error notifications using `showToast`.
 *
 * Effects:
 *   - Fetches messages whenever the selected conversation or receiver changes.
 *   - Clears messages for temporary conversations or when no conversation is selected.
 *
 * Error Handling:
 *   - Displays error notifications using `showToast` for failed requests.
 *   - Prevents duplicate error toasts in React Strict Mode using a `didToastRef`.
 *
 * Returns:
 *   - isLoading (boolean): Indicates whether messages are being fetched.
 *   - messages (array): The list of messages for the selected conversation.
 *
 * Usage:
 *   - Import and use the hook in a component:
 *       const { isLoading, messages } = useMessages(receiverData);
 *
 *   - Example:
 *       <MessagesList
 *           isLoading={isLoading}
 *           messages={messages}
 *       />
 *
 * Example API Response:
 *   - The API should return an array of messages with the following structure:
 *       [
 *           {
 *               "_id": "messageId",
 *               "message": "Hello!",
 *               "createdAt": "2023-10-01T12:30:00.000Z",
 *               "senderId": "userId1"
 *           }
 *       ]
 *
 * Example Transformation:
 *   - The hook transforms the API response into the following format:
 *       [
 *           {
 *               id: "messageId",
 *               content: "Hello!",
 *               timestamp: "2023-10-01T12:30:00.000Z",
 *               isSentByCurrentUser: true
 *           }
 *       ]
 */

import { useState, useEffect, useRef } from "react";
import { useConversationStore } from "../conversation/useConversationStore";
import { showToast } from "../../utils/toastConfig";

export const useMessages = (receiverData) => {
    const [isLoading, setIsLoading] = useState(false);
    const { selectedConversation, messages, setMessages } =
        useConversationStore();

    // Prevent duplicate error toasts in React Strict Mode (dev)
    const didToastRef = useRef(false);

    // Load messages when conversation changes
    useEffect(() => {
        // Set loading state to true immediately when conversation changes
        setIsLoading(true);

        const fetchMessages = async () => {
            // Skip fetching if this is a temporary conversation
            if (
                !selectedConversation ||
                selectedConversation._id?.startsWith("temp_")
            ) {
                setMessages([]);
                setIsLoading(false);
                return;
            }

            // Get receiverId from the participant who is not the current user
            const receiverId = receiverData?._id;
            if (!receiverId) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch messages from API
                const res = await fetch(`/api/messages/${receiverId}`);

                // If no conversation exists yet, treat as empty list (no toast)
                if (res.status === 404) {
                    setMessages([]);
                    setIsLoading(false);
                    return;
                }

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

                // Set messages safely
                setMessages(
                    Array.isArray(formattedMessages) ? formattedMessages : []
                );
            } catch (error) {
                console.error("Error fetching messages:", error);
                // showToast.error("Could not load messages");
                // setMessages([]);

                // De-dupe toast in Strict Mode
                if (!didToastRef.current) {
                    didToastRef.current = true;
                    showToast.error("Could not load messages");
                    // Reset the flag after a short delay to allow future distinct errors
                    setTimeout(() => (didToastRef.current = false), 1500);
                }
                setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [selectedConversation, receiverData, setMessages]);

    return {
        isLoading,
        messages: Array.isArray(messages) ? messages : [],
    };
};
