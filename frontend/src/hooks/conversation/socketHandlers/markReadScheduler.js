/**
 * createMarkAsReadScheduler
 * -------------------------
 * Factory function to create a scheduler for marking conversations as read.
 *
 * Purpose:
 *   - Debounces mark-as-read requests to avoid excessive API calls.
 *   - Optimistically updates the `unreadCount` for conversations in the UI.
 *
 * Parameters:
 *   @param {Object} options - Configuration options for the scheduler.
 *       - markReadTimersRef (React.Ref): A ref to a `Map` that tracks active timers for conversations.
 *       - conversationsRef (React.Ref): A ref to the current list of conversations.
 *       - setConversations (Function): Function to update the `conversations` state.
 *
 * Returns:
 *   - {Function}: A function to schedule a mark-as-read request for a specific conversation.
 *
 * Scheduler Behavior:
 *   - Checks if a timer already exists for the given `conversationId`.
 *   - If a timer exists, it clears the existing timer to reset the debounce period.
 *   - Sets a new timer (250ms) to:
 *       - Optimistically update the `unreadCount` for the conversation to `0`.
 *       - Send a `POST` request to the `/api/conversations/:id/read` endpoint to mark the conversation as read on the server.
 *       - Removes the timer from the `markReadTimersRef` after execution.
 *   - Ignores network errors during the API call, as real-time socket updates will reconcile the state.
 *
 * Example Usage:
 *   - Used in `useConversationSocketListeners` to handle real-time updates:
 *       const scheduleMarkAsRead = createMarkAsReadScheduler({
 *           markReadTimersRef,
 *           conversationsRef,
 *           setConversations,
 *       });
 *       scheduleMarkAsRead(conversationId);
 *
 * Example Workflow:
 *   1. User opens a conversation.
 *   2. `scheduleMarkAsRead(conversationId)` is called.
 *   3. After 250ms, the conversation's `unreadCount` is set to `0` in the UI.
 *   4. A `POST` request is sent to the server to mark the conversation as read.
 *   5. If the API call fails, the UI remains consistent due to optimistic updates.
 *
 * Security Notes:
 *   - Assumes the user is authenticated and authorized to mark the conversation as read.
 *   - Relies on the server to enforce proper access control for the `/api/conversations/:id/read` endpoint.
 */

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
