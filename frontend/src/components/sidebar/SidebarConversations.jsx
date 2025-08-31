/**
 * SidebarConversations Component
 * ------------------------------
 * Renders a list of user conversations for the chat sidebar.
 *
 * Exports:
 *   - SidebarConversations: Displays each conversation using the SidebarConversation component.
 *
 * Context:
 *   - users: Array of user objects fetched from the `useUserStore` hook.
 *   - loading: Boolean indicating whether the user data is being fetched.
 *
 * Layout:
 *   - If `loading` is true:
 *       - Displays a loading spinner centered in the sidebar.
 *   - If `users` exist:
 *       - Maps each user to a SidebarConversation component.
 *       - Passes user data to the SidebarConversation component.
 *   - If no `users` are found:
 *       - Displays a "No users found" message.
 *
 * Usage:
 *   - Used within the `Sidebar` component to display the conversation list.
 *   - Fetches user data and manages loading state via the `useUserStore` hook.
 *
 * Example:
 *   - Rendered in `Sidebar.jsx`:
 *       <SidebarConversations />
 */

import { memo } from "react";
import SidebarConversation from "./conversation/SidebarConversation";
import { useUserStore } from "../../hooks/conversation/useUserStore";

const SidebarConversations = memo(() => {
    const { users, loading } = useUserStore();

    if (loading) {
        return (
            <div className="overflow-auto flex-1 flex items-center justify-center">
                <div className="loading loading-spinner loading-md text-white/60"></div>
            </div>
        );
    }

    return (
        <div className="overflow-auto flex-1">
            {users.length > 0 ? (
                <div className="flex flex-col gap-1 p-2">
                    {users.map((user) => (
                        <SidebarConversation key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 text-white/50 text-sm">
                    No users found
                </div>
            )}
        </div>
    );
});

SidebarConversations.displayName = "SidebarConversations";

export default SidebarConversations;
