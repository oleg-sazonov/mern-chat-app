/**
 * SidebarConversations Component
 * ------------------------------
 * Renders a list of user conversations and search results in the sidebar.
 *
 * Exports:
 *   - SidebarConversations: Displays conversations and user search results.
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
 *   - displayItems (array): The filtered list of conversations and users to display.
 *   - noResultsMessage (string): The message to display when no matches are found.
 *   - isSearching (boolean): Indicates whether the user is actively searching.
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
 *       - Matches participants' full names, usernames, or last message content with the search term.
 *   - Filters users:
 *       - Excludes the current user and users already in conversations.
 *       - Matches users' full names or usernames with the search term.
 *   - Combines and sorts results:
 *       - Combines matching conversations and users into a single list for display.
 *
 * Usage:
 *   - Used within the `Sidebar` component to display conversations and search results.
 *   - Manages filtering logic for conversations and users based on the search term.
 */

import { memo, useMemo } from "react";
import SidebarConversation from "./conversation/SidebarConversation";
import SidebarUser from "./user/SidebarUser";
import { useConversationStore } from "../../hooks/conversation/useConversationStore";
import { useUserStore } from "../../hooks/conversation/useUserStore";
import { useAuthContext } from "../../store/AuthContext";

const SidebarConversations = memo(({ searchTerm = "" }) => {
    const { conversations, loading: conversationsLoading } =
        useConversationStore();
    const { users, loading: usersLoading } = useUserStore();
    const { authUser } = useAuthContext();

    const loading = conversationsLoading || usersLoading;

    // Determine what to display based on search term
    const { displayItems, noResultsMessage, isSearching } = useMemo(() => {
        const trimmedSearch = searchTerm.trim().toLowerCase();

        // If not searching, just return conversations
        if (!trimmedSearch) {
            return {
                displayItems: conversations.map((conv) => ({
                    type: "conversation",
                    data: conv,
                })),
                noResultsMessage: "No conversations found",
                isSearching: false,
            };
        }

        // Create a set of IDs for all users who are already in conversations
        // but exclude the current user from this set
        const usersInConversations = new Set();
        conversations.forEach((conv) => {
            conv.participants.forEach((participant) => {
                if (participant._id !== authUser?.id) {
                    usersInConversations.add(participant._id);
                }
            });
        });

        // Filter conversations - check all participants
        const matchingConversations = conversations.filter((conv) => {
            // Find the other participant (not the current user)
            const otherParticipants = conv.participants.filter(
                (p) => p._id !== authUser?.id
            );

            // Check if any participant name/username matches the search term
            const nameMatches = otherParticipants.some((participant) => {
                const fullNameMatch = participant.fullName
                    ?.toLowerCase()
                    .includes(trimmedSearch);
                const usernameMatch = participant.username
                    ?.toLowerCase()
                    .includes(trimmedSearch);
                return fullNameMatch || usernameMatch;
            });

            // Check if last message content matches
            const messageMatches = conv.lastMessage?.content
                ?.toLowerCase()
                .includes(trimmedSearch);

            return nameMatches || messageMatches;
        });

        // Filter users that aren't in conversations
        const matchingUsers = users.filter((user) => {
            // Don't show current user
            if (user._id === authUser?.id) return false;

            // Don't show users that are already in existing conversations
            if (usersInConversations.has(user._id)) return false;

            // Check if name or username matches
            const fullNameMatch = user.fullName
                ?.toLowerCase()
                .includes(trimmedSearch);
            const usernameMatch = user.username
                ?.toLowerCase()
                .includes(trimmedSearch);

            return fullNameMatch || usernameMatch;
        });

        // Combine and sort results
        const items = [
            ...matchingConversations.map((conv) => ({
                type: "conversation",
                data: conv,
            })),
            ...matchingUsers.map((user) => ({ type: "user", data: user })),
        ];

        return {
            displayItems: items,
            noResultsMessage: "No matches found",
            isSearching: true,
        };
    }, [searchTerm, conversations, users, authUser]);

    // Rest of the component remains the same
    if (loading) {
        return (
            <div className="overflow-auto flex-1 flex items-center justify-center">
                <div className="loading loading-spinner loading-md text-white/60"></div>
            </div>
        );
    }

    return (
        <div className="overflow-auto flex-1">
            {displayItems.length > 0 ? (
                <div className="flex flex-col gap-1 p-2">
                    {isSearching && (
                        <div className="text-xs text-white/60 px-2 pb-2">
                            Search Results:
                        </div>
                    )}

                    {displayItems.map((item) =>
                        item.type === "conversation" ? (
                            <SidebarConversation
                                key={`conv-${item.data._id}`}
                                conversation={item.data}
                            />
                        ) : (
                            <SidebarUser
                                key={`user-${item.data._id}`}
                                user={item.data}
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
