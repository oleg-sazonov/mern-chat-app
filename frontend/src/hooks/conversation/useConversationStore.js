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
 *   - messages (array): An array of messages for the selected conversation.
 *   - isMobile (boolean): Indicates whether the viewport is mobile-sized (<768px).
 *
 * Functions:
 *   - handleSelectConversation(conversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *   - isSelected(userId):
 *       - Checks if a given user ID matches the currently selected conversation's ID.
 *
 * Effects:
 *   - Adds a window resize listener to update the `isMobile` state dynamically.
 *       - Removes the listener when the component unmounts.
 *
 * Returns:
 *   - selectedConversation (object | null): The currently selected conversation object.
 *   - setSelectedConversation (function): Function to update the selected conversation.
 *   - handleSelectConversation (function): Function to handle conversation selection.
 *   - isSelected (function): Utility function to check if a conversation is selected.
 *   - messages (array): The list of messages for the selected conversation.
 *   - setMessages (function): Function to update the messages array.
 *   - isMobile (boolean): Indicates if the viewport is mobile-sized.
 *
 * Usage:
 *   - This hook is used in components like `Sidebar` and `MessageContainer` to manage conversation state.
 *   - Provides a centralized way to handle conversation selection, messages, and responsive layout.
 *
 * Example:
 *   - In a component:
 *       const {
 *           selectedConversation,
 *           handleSelectConversation,
 *           isSelected,
 *           messages,
 *           setMessages,
 *           isMobile,
 *       } = useConversationStore();
 *
 *       // Select a conversation
 *       handleSelectConversation(conversation);
 *
 *       // Check if a user is selected
 *       const isUserSelected = isSelected(userId);
 */

import useConversation from "../../store/zustand/useConversation";
import { useEffect } from "react";

export const useConversationStore = () => {
    // Get state and actions from Zustand store
    const {
        selectedConversation,
        setSelectedConversation,
        messages,
        setMessages,
        isMobile,
        setIsMobile,
    } = useConversation();

    // Add window resize listener (similar to what was in Home.jsx)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsMobile]);

    // Utility function to check if a conversation is selected
    const isSelected = (userId) => {
        return selectedConversation?._id === userId;
    };

    // Function to handle conversation selection
    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
    };

    return {
        selectedConversation,
        setSelectedConversation,
        handleSelectConversation,
        isSelected,
        messages,
        setMessages,
        isMobile,
    };
};

export default useConversationStore;
