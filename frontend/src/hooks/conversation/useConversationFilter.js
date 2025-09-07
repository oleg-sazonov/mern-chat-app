/**
 * useConversationFilter Hook
 * --------------------------
 * Custom hook for filtering conversations and users based on a search term.
 *
 * This hook provides sophisticated filtering logic to find matching conversations and users,
 * handling the complexity of:
 * - Determining which users already have conversations with the current user
 * - Identifying selected conversations or temporary conversations
 * - Properly formatting results for consistent rendering
 *
 * Exports:
 *   - useConversationFilter: Provides filtered conversations and users based on a search term.
 *
 * Parameters:
 *   - searchTerm (string): The search term to filter by.
 *   - conversations (array): Array of conversation objects to filter.
 *   - users (array): Array of user objects to filter.
 *   - currentUserId (string): ID of the current user to exclude from results.
 *   - isLoading (boolean): Indicates if data is being loaded.
 *   - selectedConversation (object|null): The currently selected conversation.
 *
 * State Management:
 *   - Uses useMemo to efficiently compute filtered results only when dependencies change.
 *   - Tracks which conversation or user is currently selected to apply proper styling.
 *   - Handles special case of temporary conversations (with IDs starting with "temp_").
 *
 * Return Object:
 *   - displayItems (array): Combined array of filtered conversation and user objects with:
 *       - type: "conversation" or "user" to determine rendering component
 *       - data: The original conversation or user object
 *       - isSelected: Boolean flag indicating if this item is currently selected
 *   - noResultsMessage (string): Appropriate message to display when no results are found.
 *   - isSearching (boolean): Indicates whether a search is currently active.
 *   - loading (boolean): Passes through the loading state from parameters.
 *
 * Helper Functions:
 *   - filterConversations: Filters conversations based on participant names and usernames.
 *   - filterUsers: Filters users, excluding the current user and those already in conversations.
 *
 * Selection Logic:
 *   - Regular conversations: Matched by comparing _id with selectedConversation._id
 *   - Temporary conversations: Identified by ID prefix "temp_" and matched against user ID
 *
 * Usage:
 *   - This hook is used in the SidebarConversations component to power the search functionality.
 *   - It provides a unified API for searching across both conversations and users.
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

        // If not searching, just return conversations
        if (!trimmedSearch) {
            return {
                displayItems: conversations.map((conv) => ({
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

        // Combine and sort results - adding isSelected property to each item
        const items = [
            ...matchingConversations.map((conv) => ({
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

        return {
            displayItems: items,
            noResultsMessage: "No matches found",
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
