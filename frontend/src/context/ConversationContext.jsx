/**
 * ConversationContext
 * -------------------
 * Provides a global context for managing conversation-related state and responsive layout settings.
 *
 * Exports:
 *   - ConversationContext: The React context object for conversations.
 *   - ConversationProvider: A provider component that wraps the application and supplies conversation-related state and functions.
 *
 * State:
 *   - selectedConversation: Stores the currently selected conversation object.
 *   - isMobile: Boolean indicating if the viewport is mobile-sized (<768px).
 *
 * Functions:
 *   - handleSelectConversation(conversation)
 *     - Updates the selectedConversation state with the provided conversation object.
 *
 * Context Value:
 *   - selectedConversation: The currently selected conversation object.
 *   - setSelectedConversation: Function to update the selected conversation.
 *   - handleSelectConversation: Function to handle conversation selection.
 *   - isMobile: Boolean indicating if the viewport is mobile-sized.
 *   - setIsMobile: Function to update the isMobile state.
 *
 * Usage:
 *   - Wrap the application with the ConversationProvider in `App.jsx` to provide global state for conversations.
 *   - Use the ConversationContext or the `useConversation` hook to access conversation-related state and functions in child components.
 *
 * Example:
 *   - Wrapping the app in `App.jsx`:
 *       <ConversationProvider>
 *           <Home />
 *       </ConversationProvider>
 *
 *   - Accessing context in a component:
 *       const { selectedConversation, handleSelectConversation } = useContext(ConversationContext);
 */

import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ConversationContext = createContext();

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
