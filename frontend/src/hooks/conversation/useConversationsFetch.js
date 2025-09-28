/**
 * useConversationsFetch Hook
 * --------------------------
 * Custom hook for fetching and normalizing conversations with their last messages.
 *
 * Purpose:
 *   - Fetches conversations from the server.
 *   - Normalizes the `lastMessage` field for consistent structure.
 *   - Handles authentication errors and updates the conversation state.
 *
 * Exports:
 *   - useConversationsFetch: Provides a function to fetch conversations and ensures they are normalized.
 *
 * State:
 *   - conversations (array): The list of conversations stored in the Zustand store.
 *
 * Actions:
 *   - setConversations(conversations):
 *       - Updates the `conversations` state with the fetched and normalized data.
 *   - setAuthUser(authUser):
 *       - Updates the authenticated user state in the AuthContext.
 *
 * Functions:
 *   - fetchConversations():
 *       - Fetches conversations from the `/api/conversations` endpoint.
 *       - Adds a cache buster (`t=${Date.now()}`) to avoid stale data.
 *       - Normalizes the `lastMessage` field to ensure consistent structure.
 *       - Handles authentication errors (401/403) by clearing the user state and showing a toast notification.
 *       - Updates the `conversations` state with the fetched data.
 *
 * Normalization:
 *   - Ensures the `lastMessage` field in each conversation has a `content` property.
 *   - Handles cases where `lastMessage` is missing or has inconsistent structure.
 *
 * Effects:
 *   - Automatically fetches conversations on mount if the `conversations` array is empty.
 *
 * Error Handling:
 *   - Displays error notifications using `showToast` for failed requests or authentication issues.
 *   - Logs errors to the console for debugging.
 *
 * Returns:
 *   - fetchConversations (function): Function to manually fetch conversations.
 *
 * Usage:
 *   - Import and use this hook in components or other hooks to fetch and manage conversations.
 *
 * Example:
 *   - Fetch conversations on component mount:
 *       const { fetchConversations } = useConversationsFetch();
 *       useEffect(() => {
 *           fetchConversations();
 *       }, []);
 */

import { useCallback, useEffect } from "react";
import { showToast } from "../../utils/toastConfig";
import { useAuthContext } from "../../store/AuthContext";
import useConversation from "../../store/zustand/useConversation";

const normalizeConversations = (list) =>
    Array.isArray(list)
        ? list.map((c) =>
              !c.lastMessage
                  ? c
                  : {
                        ...c,
                        lastMessage: {
                            ...c.lastMessage,
                            content:
                                (typeof c.lastMessage === "string"
                                    ? c.lastMessage
                                    : c.lastMessage.content ??
                                      c.lastMessage.message ??
                                      "") || "",
                        },
                    }
          )
        : [];

export const useConversationsFetch = () => {
    const { conversations, setConversations } = useConversation();
    const { setAuthUser } = useAuthContext();

    const fetchConversations = useCallback(async () => {
        try {
            // const res = await fetch("/api/conversations");

            // Add cache buster and disable cache to avoid stale data after browser reopen
            const res = await fetch(`/api/conversations?t=${Date.now()}`, {
                cache: "no-store",
                headers: { "Cache-Control": "no-cache" },
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("user");
                setAuthUser(null);
                showToast.error("Authentication expired. Please login again");
                return;
            }

            if (!res.ok) throw new Error("Failed to fetch conversations");

            const data = await res.json();
            const normalized = normalizeConversations(data);
            setConversations(normalized);
        } catch (err) {
            showToast.error(err.message || "Failed to load conversations");
            console.error("fetchConversations error:", err);
        }
    }, [setConversations, setAuthUser]);

    useEffect(() => {
        if (!conversations.length) {
            fetchConversations();
        }
    }, [conversations.length, fetchConversations]);

    return { fetchConversations };
};
