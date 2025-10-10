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
        const isIncoming = message.senderId?.toString() !== authUser?.id;

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
