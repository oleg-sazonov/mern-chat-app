/**
 * SidebarConversations Component
 * ------------------------------
 * Renders a list of user conversations for the chat sidebar.
 *
 * Exports:
 *   - SidebarConversations: Displays each conversation using the SidebarConversation component.
 *
 * Context:
 *   - conversations: Array of conversation objects fetched from the `useConversationStore` hook.
 *   - loading: Boolean indicating whether the conversation data is being fetched.
 *
 * Layout:
 *   - If `loading` is true:
 *       - Displays a loading spinner centered in the sidebar.
 *   - If `conversations` exist:
 *       - Maps each conversation to a SidebarConversation component.
 *       - Passes conversation data to the SidebarConversation component.
 *   - If no `conversations` are found:
 *       - Displays a "No conversations found" message.
 *
 * Usage:
 *   - Used within the `Sidebar` component to display the conversation list.
 *   - Fetches conversation data and manages loading state via the `useConversationStore` hook.
 *
 * Example:
 *   - Rendered in `Sidebar.jsx`:
 *       <SidebarConversations />
 *
 * Dependencies:
 *   - SidebarConversation: A component that renders individual conversation items.
 *   - useConversationStore: A Zustand hook for managing conversation-related state.
 */

import { memo } from "react";
import SidebarConversation from "./conversation/SidebarConversation";
import { useConversationStore } from "../../hooks/conversation/useConversationStore";

const SidebarConversations = memo(() => {
    const { conversations, loading } = useConversationStore();

    if (loading) {
        return (
            <div className="overflow-auto flex-1 flex items-center justify-center">
                <div className="loading loading-spinner loading-md text-white/60"></div>
            </div>
        );
    }

    return (
        <div className="overflow-auto flex-1">
            {conversations.length > 0 ? (
                <div className="flex flex-col gap-1 p-2">
                    {conversations.map((conversation) => (
                        <SidebarConversation
                            key={conversation._id}
                            conversation={conversation}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 text-white/50 text-sm">
                    No conversations found
                </div>
            )}
        </div>
    );
});

SidebarConversations.displayName = "SidebarConversations";

export default SidebarConversations;
