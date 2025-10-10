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
