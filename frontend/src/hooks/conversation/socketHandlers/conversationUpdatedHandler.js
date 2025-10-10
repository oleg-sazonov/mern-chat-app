/**
 * createConversationUpdatedHandler
 * --------------------------------
 * Factory function to create a handler for the `conversation:updated` Socket.IO event.
 *
 * Purpose:
 *   - Handles updates to conversations in real-time.
 *   - Updates the `lastMessage` and `unreadCount` fields for the corresponding conversation.
 *   - Ensures the `unreadCount` is reset to `0` for the currently selected conversation.
 *
 * Parameters:
 *   @param {Object} options - Configuration options for the handler.
 *       - conversationsRef (React.Ref): A ref to the current list of conversations.
 *       - selectedConversationRef (React.Ref): A ref to the currently selected conversation.
 *       - setConversations (Function): Function to update the `conversations` state.
 *
 * Returns:
 *   - {Function}: A handler function for the `conversation:updated` event.
 *
 * Handler Behavior:
 *   - Finds the conversation matching the `patch._id` in the `conversationsRef`.
 *   - Updates the `lastMessage` field with the new message content, if provided.
 *   - Updates the `unreadCount` field:
 *       - Sets it to `0` if the conversation is currently selected.
 *       - Otherwise, sets it to the value provided in the `patch`.
 *   - Leaves other conversations unchanged.
 *
 * Example Usage:
 *   - Used in `useConversationSocketListeners` to handle real-time conversation updates:
 *       const handleConversationUpdated = createConversationUpdatedHandler({
 *           conversationsRef,
 *           selectedConversationRef,
 *           setConversations,
 *       });
 *       socket.on("conversation:updated", handleConversationUpdated);
 *
 * Example Event Payload:
 *   - patch: The updated conversation data containing:
 *       - _id (string): The ID of the conversation being updated.
 *       - lastMessage (object | null): The updated last message, if any.
 *           - content (string): The content of the last message.
 *           - message (string): Alternative content field for the last message.
 *       - unreadCount (number): The updated unread message count for the conversation.
 *
 * Security Notes:
 *   - Assumes the server emits only valid and authorized updates.
 *   - Relies on the `patch._id` to identify the conversation to update.
 */

export const createConversationUpdatedHandler = ({
    conversationsRef,
    selectedConversationRef,
    setConversations,
}) => {
    return (patch) => {
        setConversations(
            (conversationsRef.current || []).map((conversation) => {
                if (conversation._id !== patch._id) return conversation;

                const isSelected =
                    selectedConversationRef.current?._id === patch._id;

                return {
                    ...conversation,
                    lastMessage: patch.lastMessage
                        ? {
                              ...patch.lastMessage,
                              content:
                                  patch.lastMessage.content ??
                                  patch.lastMessage.message ??
                                  "",
                          }
                        : conversation.lastMessage,
                    ...(typeof patch.unreadCount === "number"
                        ? {
                              unreadCount: isSelected ? 0 : patch.unreadCount,
                          }
                        : {}),
                };
            })
        );
    };
};
