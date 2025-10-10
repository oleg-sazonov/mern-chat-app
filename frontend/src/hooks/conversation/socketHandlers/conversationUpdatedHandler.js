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
