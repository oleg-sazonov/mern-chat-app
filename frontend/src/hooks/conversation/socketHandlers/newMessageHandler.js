/**
 * createNewMessageHandler
 * -----------------------
 * Factory function to create a handler for the `message:new` Socket.IO event.
 *
 * Purpose:
 *   - Handles incoming messages in real-time.
 *   - Updates the state of messages and conversations based on the received message.
 *   - Plays a notification sound for incoming messages in unselected conversations.
 *   - Marks conversations as read if the message belongs to the currently selected conversation.
 *
 * Parameters:
 *   @param {Object} options - Configuration options for the handler.
 *       - authUser (Object): The authenticated user object.
 *       - messagesRef (React.Ref): A ref to the current list of messages.
 *       - selectedConversationRef (React.Ref): A ref to the currently selected conversation.
 *       - conversationsRef (React.Ref): A ref to the list of all conversations.
 *       - setMessages (Function): Function to update the `messages` state.
 *       - setConversations (Function): Function to update the `conversations` state.
 *       - playNotification (Function): Function to play a notification sound.
 *       - scheduleMarkAsRead (Function): Function to schedule a mark-as-read request.
 *
 * Returns:
 *   - {Function}: A handler function for the `message:new` event.
 *
 * Handler Behavior:
 *   - Extracts the sender ID and determines if the message was sent by the current user.
 *   - If the message belongs to the currently selected conversation:
 *       - Appends the message to the `messages` state.
 *       - Marks the message as "fresh" for a brief animation effect.
 *       - Schedules a mark-as-read request if the message is incoming.
 *   - If the message belongs to another conversation:
 *       - Updates the `lastMessage` and `unreadCount` for the corresponding conversation.
 *       - Plays a notification sound if the message is incoming and the conversation is not selected.
 *
 * Example Usage:
 *   - Used in `useConversationSocketListeners` to handle real-time message updates:
 *       const handleNewMessage = createNewMessageHandler({
 *           authUser,
 *           messagesRef,
 *           selectedConversationRef,
 *           conversationsRef,
 *           setMessages,
 *           setConversations,
 *           playNotification,
 *           scheduleMarkAsRead,
 *       });
 *       socket.on("message:new", handleNewMessage);
 *
 * Example Event Payload:
 *   - conversationId: The ID of the conversation the message belongs to.
 *   - message: The message object containing:
 *       - id: The unique ID of the message.
 *       - content: The text content of the message.
 *       - senderId: The ID of the user who sent the message.
 *       - createdAt: The timestamp when the message was created.
 *
 * Security Notes:
 *   - Assumes the server emits only valid and authorized messages.
 *   - Relies on the `authUser` object for determining the current user's identity.
 */

export const createNewMessageHandler = ({
    authUser,
    messagesRef,
    selectedConversationRef,
    conversationsRef,
    setMessages,
    setConversations,
    playNotification,
    scheduleMarkAsRead,
}) => {
    return ({ conversationId, message }) => {
        const currentConversation = selectedConversationRef.current;

        const currentUserId =
            authUser?.id ||
            authUser?._id ||
            JSON.parse(localStorage.getItem("user") || "{}").id;

        const senderId =
            typeof message.senderId === "object" && message.senderId !== null
                ? message.senderId._id || message.senderId.id
                : message.senderId;

        const isSentByCurrentUser =
            senderId?.toString() === currentUserId?.toString();

        const isIncoming = !isSentByCurrentUser;

        if (currentConversation?._id === conversationId) {
            const newMessage = {
                id: message.id,
                content: message.content,
                timestamp: message.createdAt,
                isSentByCurrentUser:
                    message.senderId?.toString() === authUser?.id,
                isFresh: true,
            };

            setMessages([...messagesRef.current, newMessage]);

            setTimeout(() => {
                const existingMessages = messagesRef.current || [];
                const updatedMessages = existingMessages.map((item) =>
                    item.id === newMessage.id
                        ? { ...item, isFresh: false }
                        : item
                );
                setMessages(updatedMessages);
            }, 600);

            if (
                isIncoming &&
                currentConversation._id &&
                !currentConversation._id.startsWith("temp_")
            ) {
                scheduleMarkAsRead(conversationId);
            }
        } else {
            const shouldPlaySound =
                isIncoming &&
                (selectedConversationRef.current?._id !== conversationId ||
                    document.hidden ||
                    !document.hasFocus());

            if (shouldPlaySound) {
                playNotification();
            }

            setConversations(
                (conversationsRef.current || []).map((conversation) =>
                    conversation._id === conversationId
                        ? {
                              ...conversation,
                              lastMessage: {
                                  content: message.content,
                                  createdAt: message.createdAt,
                                  sender: { _id: message.senderId },
                              },
                              unreadCount: (conversation.unreadCount || 0) + 1,
                          }
                        : conversation
                )
            );
        }
    };
};
