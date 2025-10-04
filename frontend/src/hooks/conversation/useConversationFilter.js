/**
 * useConversationFilter Hook
 * --------------------------
 * Custom hook for filtering conversations and users based on a search term.
 *
 * Purpose:
 *   - Provides a unified API for searching across both conversations and users.
 *   - Handles filtering, sorting, limiting, and selection logic for conversations and users.
 *
 * Exports:
 *   - useConversationFilter: Filters and sorts conversations and users based on the search term.
 *
 * Parameters:
 *   - searchTerm (string): The search term to filter by.
 *   - conversations (array): Array of conversation objects to filter.
 *   - users (array): Array of user objects to filter.
 *   - currentUserId (string): ID of the current user to exclude from results.
 *   - isLoading (boolean): Indicates if data is being loaded.
 *   - selectedConversation (object | null): The currently selected conversation.
 *
 * Returns:
 *   - displayItems (array): Combined array of filtered conversation and user objects with:
 *       - type: "conversation" or "user" to determine rendering component.
 *       - data: The original conversation or user object.
 *       - isSelected: Boolean flag indicating if this item is currently selected.
 *   - noResultsMessage (string): Message to display when no results are found.
 *   - isSearching (boolean): Indicates whether a search is currently active.
 *   - loading (boolean): Passes through the loading state from parameters.
 *
 * Behavior:
 *   - Filters conversations by matching participant names or usernames with the search term.
 *   - Filters users by excluding the current user and users already in conversations.
 *   - Sorts conversations by `lastMessage.createdAt` in descending order (newest first).
 *   - Limits the total number of results to 30 for better performance and usability.
 *   - Handles temporary conversations (IDs starting with "temp_") and marks them as selected if applicable.
 *
 * Helper Functions:
 *   - filterConversations:
 *       - Filters conversations based on participant names and usernames.
 *       - Excludes the current user from the participant list.
 *   - filterUsers:
 *       - Filters users by excluding the current user and users already in conversations.
 *       - Matches users by full name or username.
 *
 * Usage:
 *   - Used in components like `SidebarConversations` to power the search functionality.
 *
 * Example:
 *   const { displayItems, noResultsMessage, isSearching } = useConversationFilter(
 *     searchTerm,
 *     conversations,
 *     users,
 *     authUser.id,
 *     loading,
 *     selectedConversation
 *   );
 */

import { useMemo } from "react";

export const useConversationFilter = (
    searchTerm = "",
    conversations = [],
    users = [],
    currentUserId,
    isLoading = false,
    selectedConversation = null
) => {
    const MAX_RESULTS = 30;

    // Helper to sort by last message time (newest first)
    const getLastMessageTime = (conv) =>
        new Date(conv?.lastMessage?.createdAt || 0).getTime();

    // Combined result items, message, and search state
    const { displayItems, noResultsMessage, isSearching } = useMemo(() => {
        const trimmedSearch = searchTerm.trim().toLowerCase();
        const selectedId = selectedConversation?._id || "";
        const isTempId = selectedId?.startsWith("temp_");

        // If we have a temporary conversation ID, extract the user ID from it
        let selectedUserId = null;
        if (isTempId && selectedConversation?.participants?.[0]?._id) {
            selectedUserId = selectedConversation.participants[0]._id;
        }

        // If not searching, return conversations sorted by lastMessage.createdAt
        if (!trimmedSearch) {
            const sortedConversations = [...conversations].sort(
                (a, b) => getLastMessageTime(b) - getLastMessageTime(a)
            );
            return {
                displayItems: sortedConversations.map((conv) => ({
                    type: "conversation",
                    data: conv,
                    isSelected: conv._id === selectedId,
                })),
                noResultsMessage: "No conversations found",
                isSearching: false,
            };
        }

        // Create a set of IDs for users who already have conversations with the current user
        const usersInConversations = new Set();
        conversations.forEach((conv) => {
            conv.participants.forEach((participant) => {
                if (participant._id !== currentUserId) {
                    usersInConversations.add(participant._id);
                }
            });
        });

        // Filter conversations - match participant names/usernames
        const matchingConversations = filterConversations(
            conversations,
            trimmedSearch,
            currentUserId
        );

        // Filter users - exclude current user and users already in conversations
        const matchingUsers = filterUsers(
            users,
            trimmedSearch,
            currentUserId,
            usersInConversations
        );

        // Sort matched conversations by lastMessage.createdAt
        const matchingConversationsSorted = [...matchingConversations].sort(
            (a, b) => getLastMessageTime(b) - getLastMessageTime(a)
        );

        // Combine and sort results - adding isSelected property to each item
        const items = [
            ...matchingConversationsSorted.map((conv) => ({
                type: "conversation",
                data: conv,
                isSelected: conv._id === selectedId,
            })),
            ...matchingUsers.map((user) => ({
                type: "user",
                data: user,
                isSelected: isTempId && user._id === selectedUserId,
            })),
        ];

        const limitedItems = items.slice(0, MAX_RESULTS);

        return {
            displayItems: limitedItems,
            noResultsMessage:
                limitedItems.length === 0
                    ? "No matches found"
                    : "No matches found",
            isSearching: true,
        };
    }, [searchTerm, conversations, users, currentUserId, selectedConversation]);

    return {
        displayItems,
        noResultsMessage,
        isSearching,
        loading: isLoading,
    };
};

// Helper function to filter conversations
function filterConversations(conversations, searchTerm, currentUserId) {
    return conversations.filter((conv) => {
        // Find the other participants (not the current user)
        const otherParticipants = conv.participants.filter(
            (p) => p._id !== currentUserId
        );

        // Check if any participant name/username matches the search term
        return otherParticipants.some((participant) => {
            const fullNameMatch = participant.fullName
                ?.toLowerCase()
                .includes(searchTerm);
            const usernameMatch = participant.username
                ?.toLowerCase()
                .includes(searchTerm);
            return fullNameMatch || usernameMatch;
        });
    });
}

// Helper function to filter users
function filterUsers(users, searchTerm, currentUserId, usersInConversations) {
    return users.filter((user) => {
        // Don't show current user
        if (user._id === currentUserId) return false;

        // Don't show users that are already in existing conversations
        if (usersInConversations.has(user._id)) return false;

        // Check if name or username matches
        const fullNameMatch = user.fullName?.toLowerCase().includes(searchTerm);
        const usernameMatch = user.username?.toLowerCase().includes(searchTerm);

        return fullNameMatch || usernameMatch;
    });
}
