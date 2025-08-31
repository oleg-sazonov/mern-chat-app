/**
 * ConversationContext
 * -------------------
 * Provides a global context for managing conversation-related state and responsive layout settings.
 *
 * Exports:
 *   - ConversationContext: The React context object for conversations.
 *   - ConversationProvider: A provider component that wraps the application and supplies conversation-related state and functions.
 *   - useConversation: A custom hook to access the conversation context.
 *
 * State:
 *   - selectedConversation: Stores the currently selected conversation object.
 *   - isMobile: Boolean indicating if the viewport is mobile-sized (<768px).
 *
 * Functions:
 *   - handleSelectConversation(conversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *
 * Context Value:
 *   - selectedConversation: The currently selected conversation object.
 *   - setSelectedConversation: Function to update the selected conversation.
 *   - handleSelectConversation: Function to handle conversation selection.
 *   - isMobile: Boolean indicating if the viewport is mobile-sized.
 *   - setIsMobile: Function to update the `isMobile` state.
 *
 * Usage:
 *   - Wrap the application with the `ConversationProvider` in `App.jsx` to provide global state for conversations.
 *   - Use the `useConversation` hook in child components to access or update conversation-related state.
 *
 * Example:
 *   - Wrapping the app in `App.jsx`:
 *       <ConversationProvider>
 *           <Home />
 *       </ConversationProvider>
 *
 *   - Accessing context in a component:
 *       const { selectedConversation, handleSelectConversation } = useConversation();
 *       handleSelectConversation(conversation);
 *
 * Related Components:
 *   - Referenced in `Home.jsx` to manage responsive layout and conversation state.
 */

import { createContext, useState, useContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ConversationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useConversation = () => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error(
            "useConversation must be used within a ConversationProvider"
        );
    }
    return context;
};

export const ConversationProvider = ({ children }) => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
    };

    return (
        <ConversationContext.Provider
            value={{
                selectedConversation,
                setSelectedConversation,
                handleSelectConversation,
                isMobile,
                setIsMobile,
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};
