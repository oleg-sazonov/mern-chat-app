/**
 * SidebarConversations Component
 * ------------------------------
 * Displays a list of conversations and users in the sidebar, filtered by a search term.
 *
 * Exports:
 *   - SidebarConversations: Renders conversations and user search results.
 *
 * Props:
 *   - searchTerm (string): The current search term to filter conversations and users.
 *
 * Context:
 *   - conversations: Array of conversation objects from `useConversationStore`.
 *   - users: Array of user objects from `useUserStore`.
 *   - authUser: The currently authenticated user from `useAuthContext`.
 *   - loading: Boolean indicating whether conversations or users are being fetched.
 *
 * State:
 *   - displayItems (array): The filtered and sorted list of conversations and users to display.
 *   - noResultsMessage (string): The message to display when no matches are found.
 *   - isSearching (boolean): Indicates whether the user is actively searching.
 *
 * Effects:
 *   - Resets conversation state when the authenticated user changes.
 *   - Hydrates conversations with incomplete participant data by refetching them.
 *
 * Layout:
 *   - If `loading` is true:
 *       - Displays a loading spinner centered in the sidebar.
 *   - If searching and results exist:
 *       - Displays matching conversations and users.
 *   - If searching with no results:
 *       - Displays a "No matches found" message.
 *   - If not searching:
 *       - Displays existing conversations or "No conversations found".
 *
 * Functions:
 *   - Filters conversations:
 *       - Matches participants' full names or usernames with the search term.
 *   - Filters users:
 *       - Excludes the current user and users already in conversations.
 *       - Matches users' full names or usernames with the search term.
 *   - Combines and sorts results:
 *       - Combines matching conversations and users into a single list for display.
 *
 * Usage:
 *   - Used within the `Sidebar` component to display conversations and search results.
 *   - Manages filtering logic for conversations and users based on the search term.
 *
 * Example:
 *   - Rendered in `Sidebar.jsx`:
 *       <SidebarConversations searchTerm={searchTerm} />
 */

import { memo, useEffect, useMemo } from "react";
import SidebarConversation from "./conversation/SidebarConversation";
import SidebarUser from "./user/SidebarUser";
import { useConversationStore } from "../../hooks/conversation/useConversationStore";
import { useUserStore } from "../../hooks/conversation/useUserStore";
import { useAuthContext } from "../../store/AuthContext";
import { useConversationFilter } from "../../hooks/conversation/useConversationFilter";
import { useConversationsHydration } from "../../hooks/conversation/useConversationsHydration";

const SidebarConversations = memo(({ searchTerm = "" }) => {
    const {
        conversations,
        loading: conversationsLoading,
        selectedConversation,
        setConversations,
        setSelectedConversation,
        setMessages,
        refreshConversations,
    } = useConversationStore();
    const { users, loading: usersLoading } = useUserStore();
    const { authUser } = useAuthContext();

    // Reset on user switch; useConversationsFetch will refetch when length === 0
    useEffect(() => {
        setSelectedConversation(null);
        setMessages([]);
        setConversations([]);
    }, [authUser?.id, setSelectedConversation, setMessages, setConversations]);

    // Hydrate if any conversation has incomplete participant data (moved to hook)
    useConversationsHydration(conversations, refreshConversations);

    const loading = conversationsLoading || usersLoading;

    // Use the custom hook for filtering
    const { displayItems, noResultsMessage, isSearching } =
        useConversationFilter(
            searchTerm,
            conversations,
            users,
            authUser?.id,
            loading,
            selectedConversation
        );

    const sortedDisplayItems = useMemo(() => displayItems, [displayItems]);

    // Render loading state
    if (loading) {
        return (
            <div className="overflow-auto flex-1 flex items-center justify-center">
                <div className="loading loading-spinner loading-md text-white/60"></div>
            </div>
        );
    }

    return (
        <div className="overflow-auto flex-1">
            {sortedDisplayItems.length > 0 ? (
                <div className="flex flex-col gap-1 p-2">
                    {isSearching && (
                        <div className="text-xs text-white/60 px-2 pb-2">
                            Search Results:
                        </div>
                    )}

                    {sortedDisplayItems.map((item) =>
                        item.type === "conversation" ? (
                            <SidebarConversation
                                key={`conv-${item.data._id}`}
                                conversation={item.data}
                                // No need to pass isSelected as SidebarConversation gets it from useConversationStore
                            />
                        ) : (
                            <SidebarUser
                                key={`user-${item.data._id}`}
                                user={item.data}
                                isSelected={item.isSelected} // Pass the isSelected flag from our filtered item
                            />
                        )
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 text-white/50 text-sm">
                    {noResultsMessage}
                </div>
            )}
        </div>
    );
});

SidebarConversations.displayName = "SidebarConversations";

export default SidebarConversations;
