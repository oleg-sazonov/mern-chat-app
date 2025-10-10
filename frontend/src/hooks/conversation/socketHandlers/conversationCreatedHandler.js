/**
 * createConversationCreatedHandler
 * --------------------------------
 * Factory function to create a handler for the `conversation:created` Socket.IO event.
 *
 * Purpose:
 *   - Handles the creation of new conversations in real-time.
 *   - Adds the new conversation to the list of conversations.
 *   - Replaces temporary conversations with the real conversation if applicable.
 *   - Updates the selected conversation and clears messages if the new conversation matches the temporary selection.
 *
 * Parameters:
 *   @param {Object} options - Configuration options for the handler.
 *       - conversationsRef (React.Ref): A ref to the current list of conversations.
 *       - selectedConversationRef (React.Ref): A ref to the currently selected conversation.
 *       - setConversations (Function): Function to update the `conversations` state.
 *       - setSelectedConversation (Function): Function to update the selected conversation.
 *       - setMessages (Function): Function to update the `messages` state.
 *
 * Returns:
 *   - {Function}: A handler function for the `conversation:created` event.
 *
 * Handler Behavior:
 *   - Checks if the conversation already exists in the `conversationsRef`.
 *       - If it exists, the function exits early.
 *   - Merges the new conversation with its `lastMessage` field, ensuring consistent structure.
 *   - If a temporary conversation is selected:
 *       - Checks if the new conversation contains the target user from the temporary selection.
 *       - Replaces the temporary conversation with the real conversation.
 *       - Updates the participants list if necessary.
 *       - Clears the `messages` state for the new conversation.
 *   - Adds the new conversation to the `conversations` state.
 *
 * Example Usage:
 *   - Used in `useConversationSocketListeners` to handle real-time conversation creation:
 *       const handleConversationCreated = createConversationCreatedHandler({
 *           conversationsRef,
 *           selectedConversationRef,
 *           setConversations,
 *           setSelectedConversation,
 *           setMessages,
 *       });
 *       socket.on("conversation:created", handleConversationCreated);
 *
 * Example Event Payload:
 *   - conversation: The new conversation object containing:
 *       - _id (string): The ID of the new conversation.
 *       - participants (array): The participants of the conversation.
 *       - lastMessage (object | null): The last message in the conversation, if any.
 *
 * Security Notes:
 *   - Assumes the server emits only valid and authorized conversations.
 *   - Relies on the `_id` field to identify conversations.
 */

export const createConversationCreatedHandler = ({
    conversationsRef,
    selectedConversationRef,
    setConversations,
    setSelectedConversation,
    setMessages,
}) => {
    return (conversation) => {
        if (
            (conversationsRef.current || []).some(
                (item) => item._id === conversation._id
            )
        ) {
            return;
        }

        const currentSelected = selectedConversationRef.current;

        const mergedConversation = {
            ...conversation,
            lastMessage: conversation.lastMessage
                ? {
                      ...conversation.lastMessage,
                      content:
                          conversation.lastMessage.content ??
                          conversation.lastMessage.message ??
                          "",
                  }
                : null,
        };

        const temporarySelection =
            currentSelected?._id?.startsWith("temp_") &&
            currentSelected.participants?.[0];

        if (temporarySelection) {
            const targetUserId = temporarySelection._id?.toString();

            const containsTarget = Array.isArray(conversation.participants)
                ? conversation.participants.some((participant) =>
                      (typeof participant === "string"
                          ? participant
                          : participant?._id
                      )
                          ?.toString()
                          .includes(targetUserId)
                  )
                : false;

            if (containsTarget) {
                mergedConversation.participants =
                    Array.isArray(conversation.participants) &&
                    conversation.participants.some(
                        (participant) =>
                            typeof participant === "object" &&
                            participant !== null &&
                            "fullName" in participant
                    )
                        ? conversation.participants
                        : [
                              temporarySelection,
                              currentSelected.participants?.find(
                                  (participant) =>
                                      participant._id !== temporarySelection._id
                              ),
                          ].filter(Boolean);

                setSelectedConversation(mergedConversation);
                setMessages([]);
            }
        }

        setConversations([
            ...(conversationsRef.current || []),
            mergedConversation,
        ]);
    };
};
