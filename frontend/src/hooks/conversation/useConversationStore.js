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
 *   - refreshConversations (function): Function to manually refresh conversations.
 *
 * Usage:
 *   - This hook is used in components like `Sidebar` and `MessageContainer` to manage conversation state.
 *   - Provides a centralized way to handle conversation selection, messages, and responsive layout.
 *
 * Example:
 *   - In a component:
 *       const {
 *           selectedConversation,
 *           conversations,
 *           loading,
 *           handleSelectConversation,
 *           isSelected,
 *           messages,
 *           setMessages,
 *           isMobile,
 *           refreshConversations,
 *       } = useConversationStore();
 *
 *       // Select a conversation
 *       handleSelectConversation(conversation);
 *
 *       // Check if a user is selected
 *       const isUserSelected = isSelected(userId);
 *
 *       // Refresh conversations
 *       refreshConversations();
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
    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        // Clear previous messages when selecting a new conversation
        setMessages([]);
    };

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
        refreshConversations: () => fetchConversations(false),
    };
};

export default useConversationStore;
