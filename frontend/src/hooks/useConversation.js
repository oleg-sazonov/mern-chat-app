/**
 * useConversation Hook
 * --------------------
 * Custom hook to access the ConversationContext.
 *
 * Exports:
 *   - useConversation: Provides access to the conversation-related state and functions.
 *
 * Context:
 *   - ConversationContext: Must be used within a ConversationProvider.
 *
 * Functions:
 *   - useConversation()
 *     - Retrieves the context value from ConversationContext.
 *     - Throws an error if used outside of a ConversationProvider.
 *
 * Usage:
 *   - Import and call this hook in any component that needs access to conversation state or functions.
 *   - Example:
 *       const { selectedConversation, handleSelectConversation } = useConversation();
 *
 * Error Handling:
 *   - Throws an error if the hook is used outside of a ConversationProvider.
 */

import { useContext } from "react";
import { ConversationContext } from "../context/ConversationContext";

export const useConversation = () => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error(
            "useConversation must be used within a ConversationProvider"
        );
    }
    return context;
};
