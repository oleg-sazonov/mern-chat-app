export const createMarkAsReadScheduler = ({
    markReadTimersRef,
    conversationsRef,
    setConversations,
}) => {
    return (conversationId) => {
        if (!conversationId) return;

        const timers = markReadTimersRef.current;
        const existing = timers.get(conversationId);
        if (existing) clearTimeout(existing);

        const timer = setTimeout(async () => {
            setConversations(
                (conversationsRef.current || []).map((conversation) =>
                    conversation._id === conversationId
                        ? { ...conversation, unreadCount: 0 }
                        : conversation
                )
            );

            try {
                await fetch(`/api/conversations/${conversationId}/read`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
            } catch {
                /* ignore network errors; socket patches will reconcile */
            } finally {
                timers.delete(conversationId);
            }
        }, 250);

        timers.set(conversationId, timer);
    };
};
