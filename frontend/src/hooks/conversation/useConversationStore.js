/**
 * useConversationStore Hook
 * --------------------------
 * Custom hook for managing conversation-related state using Zustand.
 *
 * Exports:
 *   - useConversationStore: Provides access to conversation state and actions.
 *
 * State:
 *   - selectedConversation (object | null): The currently selected conversation object.
 *   - conversations (array): An array of all conversations available to the user.
 *   - messages (array): An array of messages for the selected conversation.
 *   - isMobile (boolean): Indicates whether the viewport is mobile-sized (<768px).
 *   - loading (boolean): Indicates whether conversations are being fetched.
 *
 * Actions:
 *   - setSelectedConversation(selectedConversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *   - setConversations(conversations):
 *       - Updates the `conversations` state with the provided array of conversations.
 *   - setMessages(messages):
 *       - Updates the `messages` state with the provided array of messages.
 *   - setIsMobile(isMobile):
 *       - Updates the `isMobile` state based on the viewport size.
 *   - refreshConversations():
 *       - Fetches the latest conversations from the server.
 *
 * Functions:
 *   - fetchConversations():
 *       - Fetches conversations with the last messages from the `/api/conversations` endpoint.
 *       - Handles authentication errors and updates the `conversations` state.
 *   - isSelected(userId):
 *       - Checks if a given user ID matches the currently selected conversation's ID.
 *   - handleSelectConversation(conversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *       - Clears previous messages when selecting a new conversation.
 *   - handleSelectUser(user):
 *       - Handles selecting a user to start a new conversation.
 *       - If a conversation already exists with the user, it selects the existing conversation.
 *       - If no conversation exists, it creates a temporary conversation for immediate UI feedback.
 *
 * Effects:
 *   - Adds a window resize listener to update the `isMobile` state dynamically.
 *       - Removes the listener when the component unmounts.
 *   - Fetches conversations on component mount.
 *
 * Returns:
 *   - selectedConversation (object | null): The currently selected conversation object.
 *   - conversations (array): The list of conversations with their last messages.
 *   - loading (boolean): Whether conversations are being loaded.
 *   - setSelectedConversation (function): Function to update the selected conversation.
 *   - setConversations (function): Function to update the conversations array.
 *   - handleSelectConversation (function): Function to handle conversation selection.
 *   - isSelected (function): Utility function to check if a conversation is selected.
 *   - messages (array): The list of messages for the selected conversation.
 *   - setMessages (function): Function to update the messages array.
 *   - isMobile (boolean): Indicates if the viewport is mobile-sized.
 *   - handleSelectUser (function): Function to handle selecting a user for a new conversation.
 *   - refreshConversations (function): Function to manually refresh conversations.
 *
 * Usage:
 *   - This hook is used in components like `Sidebar` and `MessageContainer` to manage conversation state.
 *   - Provides a centralized way to handle conversation selection, messages, and responsive layout.
 */

import useConversation from "../../store/zustand/useConversation";
import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../../store/AuthContext";
import { showToast } from "../../utils/toastConfig";

export const useConversationStore = () => {
    // Local state for API loading
    const [loading, setLoading] = useState(false);

    // Get state and actions from Zustand store
    const {
        selectedConversation,
        setSelectedConversation,
        messages,
        setMessages,
        isMobile,
        setIsMobile,
        conversations,
        setConversations,
    } = useConversation();

    const { setAuthUser } = useAuthContext();

    // Add window resize listener (similar to what was in Home.jsx)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsMobile]);

    // Function to fetch conversations with last messages
    const fetchConversations = useCallback(async () => {
        setLoading(true);

        try {
            const res = await fetch("/api/conversations");

            // Check for authentication errors
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("user");
                setAuthUser(null);
                showToast.error("Authentication expired. Please login again");
                return;
            }

            if (!res.ok) {
                throw new Error("Failed to fetch conversations");
            }

            const data = await res.json();
            setConversations(data);
        } catch (error) {
            showToast.error(error.message || "Failed to load conversations");
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    }, [setConversations, setAuthUser]);

    // Fetch conversations on mount
    useEffect(() => {
        fetchConversations(true);
    }, [fetchConversations]);

    // Utility function to check if a conversation is selected
    const isSelected = (userId) => {
        return selectedConversation?._id === userId;
    };

    // Function to handle conversation selection
    const handleSelectConversation = useCallback(
        (conversation) => {
            setSelectedConversation(conversation);
            // Clear previous messages when selecting a new conversation
            setMessages([]);
        },
        [setSelectedConversation, setMessages]
    );

    const handleSelectUser = useCallback(
        async (user) => {
            setLoading(true);

            try {
                // Check if there's already a conversation with this user
                const existingConversation = conversations.find((conv) =>
                    conv.participants.some(
                        (participant) => participant._id === user._id
                    )
                );

                if (existingConversation) {
                    // If there is an existing conversation, simply select it
                    handleSelectConversation(existingConversation);
                } else {
                    // Create a temporary conversation object for immediate UI feedback
                    const tempConversation = {
                        _id: `temp_${Date.now()}`,
                        participants: [user],
                        lastMessage: null,
                    };

                    // Select this temporary conversation
                    setSelectedConversation(tempConversation);

                    // Clear messages
                    setMessages([]);

                    // In a real implementation, you would create a new conversation on the backend here
                    // For now, we'll just simulate the selection
                }
            } catch (error) {
                showToast.error(
                    error.message || "Failed to start conversation"
                );
                console.error("Error selecting user:", error);
            } finally {
                setLoading(false);
            }
        },
        [
            conversations,
            setSelectedConversation,
            handleSelectConversation,
            setMessages,
        ]
    );

    return {
        selectedConversation,
        conversations,
        loading,
        setSelectedConversation,
        setConversations,
        handleSelectConversation,
        isSelected,
        messages,
        setMessages,
        isMobile,
        handleSelectUser,
        refreshConversations: () => fetchConversations(false),
    };
};

export default useConversationStore;
