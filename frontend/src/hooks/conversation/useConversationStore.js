/**
 * useConversationStore Hook
 * --------------------------
 * Custom hook for managing conversation-related state using Zustand.
 *
 * Purpose:
 *   - Provides centralized state management for conversations, messages, and responsive layout.
 *   - Handles conversation selection, message updates, and real-time synchronization.
 *
 * Exports:
 *   - useConversationStore: Provides access to conversation state and actions.
 *
 * State:
 *   - selectedConversation (object | null): The currently selected conversation object.
 *   - conversations (array): An array of all conversations available to the user.
 *   - messages (array): An array of messages for the selected conversation.
 *   - isMobile (boolean): Indicates whether the viewport is mobile-sized (<768px).
 *   - loading (boolean): Indicates whether conversations are being fetched or updated.
 *
 * Actions:
 *   - setSelectedConversation(selectedConversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *   - setConversations(conversations):
 *       - Updates the `conversations` state with the provided array of conversations.
 *   - setMessages(messages):
 *       - Updates the `messages` state with the provided array of messages.
 *   - refreshConversations():
 *       - Fetches the latest conversations from the server.
 *
 * Functions:
 *   - isSelected(conversationId):
 *       - Checks if a given conversation ID matches the currently selected conversation's ID.
 *   - handleSelectConversation(conversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *       - Prevents re-selection if the conversation is already selected.
 *       - Marks the conversation as read by sending a request to the server.
 *       - Optimistically clears the unread badge for the conversation.
 *   - handleSelectUser(user):
 *       - Handles selecting a user to start a new conversation.
 *       - If a conversation already exists with the user, it selects the existing conversation.
 *       - If no conversation exists, it creates a temporary conversation for immediate UI feedback.
 *   - markConversationRead(conversationId):
 *       - Marks a conversation as read by sending a request to the server.
 *       - Optimistically clears the unread badge for the conversation.
 *
 * Effects:
 *   - Initializes side effects:
 *       - Adds a window resize listener to update the `isMobile` state dynamically.
 *       - Fetches conversations on component mount.
 *       - Listens for real-time Socket.IO events:
 *           - `message:new`: Appends a new message to the selected conversation.
 *           - `conversation:updated`: Updates the `lastMessage` field for a conversation.
 *           - `conversation:created`: Adds a new conversation to the list.
 *
 * Returns:
 *   - selectedConversation (object | null): The currently selected conversation object.
 *   - conversations (array): The list of conversations with their last messages.
 *   - loading (boolean): Whether conversations are being loaded or updated.
 *   - setSelectedConversation (function): Function to update the selected conversation.
 *   - setConversations (function): Function to update the conversations array.
 *   - handleSelectConversation (function): Function to handle conversation selection.
 *   - isSelected (function): Utility function to check if a conversation is selected.
 *   - messages (array): The list of messages for the selected conversation.
 *   - setMessages (function): Function to update the messages array.
 *   - isMobile (boolean): Indicates if the viewport is mobile-sized.
 *   - handleSelectUser (function): Function to handle selecting a user for a new conversation.
 *   - markConversationRead (function): Function to mark a conversation as read.
 *   - refreshConversations (function): Function to manually refresh conversations.
 *
 * Usage:
 *   - This hook is used in components like `Sidebar` and `MessageContainer` to manage conversation state.
 *   - Provides a centralized way to handle conversation selection, messages, and responsive layout.
 *
 * Example:
 *   - Import and use this hook in a component:
 *       const {
 *           selectedConversation,
 *           conversations,
 *           handleSelectConversation,
 *           refreshConversations,
 *       } = useConversationStore();
 */

import useConversation from "../../store/zustand/useConversation";
import { useState, useCallback } from "react";
import { showToast } from "../../utils/toastConfig";
import { useResponsiveBreakpoint } from "../ui/useResponsiveBreakpoint";
import { useConversationsFetch } from "./useConversationsFetch";
import { useConversationSocketListeners } from "./useConversationSocketListeners";

export const useConversationStore = () => {
    const [loading, setLoading] = useState(false);

    // Zustand store state/actions
    const {
        selectedConversation,
        setSelectedConversation,
        messages,
        setMessages,
        isMobile,
        conversations,
        setConversations,
    } = useConversation();

    // Side-effects (listeners + initial fetch + responsive)
    const { fetchConversations } = useConversationsFetch();

    // Stable wrapper to avoid re-creating a new function each render
    const refreshConversationsCb = useCallback(() => {
        fetchConversations(false);
    }, [fetchConversations]);

    useResponsiveBreakpoint();
    useConversationSocketListeners();

    const isSelected = (conversationId) =>
        selectedConversation?._id === conversationId;

    // const handleSelectConversation = useCallback(
    //     (conversation) => {
    //         if (selectedConversation?._id === conversation._id) return;
    //         setLoading(true);
    //         setSelectedConversation(conversation);
    //         setLoading(false);
    //     },
    //     [selectedConversation, setSelectedConversation]
    // );

    const handleSelectConversation = useCallback(
        async (conversation) => {
            if (selectedConversation?._id === conversation._id) return;
            setSelectedConversation(conversation);

            // Mark as read (ignore errors to keep UI snappy)
            if (conversation?._id && !conversation._id.startsWith("temp_")) {
                try {
                    await fetch(`/api/conversations/${conversation._id}/read`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                    });
                } catch (err) {
                    // Intentionally ignore; remote state will reconcile via socket
                    console.debug(
                        "markConversationRead failed (ignored):",
                        err
                    );
                }
                // Optimistically clear unread badge
                setConversations(
                    (conversations || []).map((c) =>
                        c._id === conversation._id
                            ? { ...c, unreadCount: 0 }
                            : c
                    )
                );
            }
        },
        [
            selectedConversation,
            setSelectedConversation,
            setConversations,
            conversations,
        ]
    );

    const handleSelectUser = useCallback(
        async (user) => {
            setLoading(true);
            try {
                const existing = conversations.find((conv) =>
                    conv.participants.some((p) => p._id === user._id)
                );

                if (existing) {
                    handleSelectConversation(existing);
                } else {
                    const tempConversation = {
                        _id: `temp_${Date.now()}`,
                        participants: [user],
                        lastMessage: null,
                    };
                    setSelectedConversation(tempConversation);
                    setMessages([]);
                }
            } catch (error) {
                showToast.error(
                    error.message || "Failed to start conversation"
                );
                console.error("Error selecting user:", error);
            } finally {
                setLoading(false);
            }
        },
        [
            conversations,
            handleSelectConversation,
            setSelectedConversation,
            setMessages,
        ]
    );

    const markConversationRead = useCallback(
        async (conversationId) => {
            if (!conversationId || conversationId.startsWith("temp_")) return;

            // Optimistically clear unread badge
            setConversations(
                (conversations || []).map((c) =>
                    c._id === conversationId ? { ...c, unreadCount: 0 } : c
                )
            );

            try {
                await fetch(`/api/conversations/${conversationId}/read`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
            } catch {
                // ignore (socket/next server patch will reconcile)
            }
        },
        [setConversations, conversations]
    );

    return {
        selectedConversation,
        conversations,
        loading,
        setSelectedConversation,
        setConversations,
        handleSelectConversation,
        isSelected,
        messages,
        setMessages,
        isMobile,
        handleSelectUser,
        markConversationRead,
        refreshConversations: refreshConversationsCb,
    };
};

export default useConversationStore;
