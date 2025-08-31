/**
 * useConversation Store
 * ----------------------
 * Zustand store for managing conversation-related state in the chat application.
 *
 * Exports:
 *   - useConversation: A Zustand store hook for accessing and updating conversation state.
 *
 * State:
 *   - selectedConversation (object | null): The currently selected conversation object.
 *   - messages (array): An array of messages for the selected conversation.
 *   - isMobile (boolean): Indicates whether the viewport is mobile-sized (<768px).
 *
 * Actions:
 *   - setSelectedConversation(selectedConversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *   - setMessages(messages):
 *       - Updates the `messages` state with the provided array of messages.
 *   - setIsMobile(isMobile):
 *       - Updates the `isMobile` state based on the viewport size.
 *
 * Usage:
 *   - This store is used throughout the application to manage conversation state.
 *   - Replaces the need for React Context (e.g., ConversationContext).
 *
 * Example:
 *   - Accessing and updating state:
 *       const {
 *           selectedConversation,
 *           setSelectedConversation,
 *           messages,
 *           setMessages,
 *           isMobile,
 *           setIsMobile,
 *       } = useConversation();
 *
 *       // Set a new conversation
 *       setSelectedConversation({ id: "123", name: "John Doe" });
 *
 *       // Update messages
 *       setMessages([{ id: "1", content: "Hello!" }]);
 *
 *       // Update mobile state
 *       setIsMobile(window.innerWidth < 768);
 */

import { create } from "zustand";

const useConversation = create((set) => ({
    // Conversation selection
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) =>
        set({ selectedConversation }),

    // Messages management
    messages: [],
    setMessages: (messages) => set({ messages }),

    // Responsive layout state (moved from ConversationContext)
    isMobile: window.innerWidth < 768,
    setIsMobile: (isMobile) => set({ isMobile }),
}));

export default useConversation;
