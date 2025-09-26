/**
 * useConversationSocketListeners Hook
 * -----------------------------------
 * Custom hook for managing real-time Socket.IO events related to conversations and messages.
 *
 * Exports:
 *   - useConversationSocketListeners: Sets up listeners for real-time updates to conversations and messages.
 *
 * Dependencies:
 *   - `useConversation`: Zustand store hook for managing conversation-related state.
 *   - `useAuthContext`: Context hook for accessing the authenticated user's data.
 *   - `useSocketContext`: Context hook for accessing the Socket.IO instance.
 *
 * State:
 *   - selectedConversation (object | null): The currently selected conversation.
 *   - messages (array): The list of messages for the selected conversation.
 *   - conversations (array): The list of all conversations.
 *
 * Actions:
 *   - setMessages(messages): Updates the `messages` state with the provided array.
 *   - setConversations(conversations): Updates the `conversations` state with the provided array.
 *
 * Real-Time Events:
 *   - `message:new`:
 *       - Triggered when a new message is sent in a conversation.
 *       - Appends the new message to the `messages` state if the conversation is currently selected.
 *       - Increments the `unreadCount` for other conversations.
 *   - `conversation:updated`:
 *       - Triggered when a conversation's last message is updated.
 *       - Updates the `lastMessage` field for the corresponding conversation in the `conversations` state.
 *       - Keeps `unreadCount` at 0 for the currently selected conversation.
 *   - `conversation:created`:
 *       - Triggered when a new conversation is created.
 *       - Adds the new conversation to the `conversations` state if it doesn't already exist.
 *
 * Behavior:
 *   - Uses refs (`messagesRef`, `selectedConversationRef`, `conversationsRef`) to avoid stale closures in event handlers.
 *   - Ensures that state updates are consistent and do not overwrite the latest data.
 *   - Debounces server-side `mark-as-read` requests to prevent excessive API calls.
 *
 * Cleanup:
 *   - Removes all Socket.IO event listeners when the component using the hook unmounts or when the `socket` instance changes.
 *   - Clears any pending `mark-as-read` timers.
 *
 * Usage:
 *   - Import and use this hook in components or other hooks to enable real-time updates for conversations and messages.
 *
 * Example:
 *   - Used in `useConversationStore` to manage real-time updates:
 *       import { useConversationSocketListeners } from "./useConversationSocketListeners";
 *       useConversationSocketListeners();
 */

import { useEffect, useRef } from "react";
import useConversation from "../../store/zustand/useConversation";
import { useAuthContext } from "../../store/AuthContext";
import { useSocketContext } from "../../store/SocketContext";

export const useConversationSocketListeners = () => {
    const {
        selectedConversation,
        setMessages,
        messages,
        conversations,
        setConversations,
    } = useConversation();

    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();

    // Refs to avoid stale closures
    const messagesRef = useRef(messages);
    const selectedConversationRef = useRef(selectedConversation);
    const conversationsRef = useRef(conversations);
    const markReadTimersRef = useRef(new Map());

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);
    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);
    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    useEffect(() => {
        if (!socket) return;

        // Debounced server mark-as-read to keep unreadCount at 0 on the server too
        const scheduleMarkAsRead = (conversationId) => {
            if (!conversationId) return;
            const timers = markReadTimersRef.current;
            const existing = timers.get(conversationId);
            if (existing) clearTimeout(existing);

            const t = setTimeout(async () => {
                // Optimistically ensure 0 on client list
                setConversations(
                    (conversationsRef.current || []).map((c) =>
                        c._id === conversationId ? { ...c, unreadCount: 0 } : c
                    )
                );
                try {
                    await fetch(`/api/conversations/${conversationId}/read`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                    });
                } catch {
                    // ignore; next server patch will reconcile
                } finally {
                    timers.delete(conversationId);
                }
            }, 250);

            timers.set(conversationId, t);
        };

        const handleNewMessage = ({ conversationId, message }) => {
            const currentConv = selectedConversationRef.current;
            if (currentConv?._id === conversationId) {
                const newMsg = {
                    id: message.id,
                    content: message.content,
                    timestamp: message.createdAt,
                    isSentByCurrentUser:
                        message.senderId?.toString() === authUser?.id,
                };
                setMessages([...messagesRef.current, newMsg]);

                // If it's an incoming message while this conversation is open,
                // mark it as read on the server so unreadCount doesn't accumulate.
                const isIncoming =
                    message.senderId?.toString() !== authUser?.id;
                if (
                    isIncoming &&
                    currentConv._id &&
                    !currentConv._id.startsWith("temp_")
                ) {
                    scheduleMarkAsRead(conversationId);
                }
            } else {
                // Fallback increment to avoid missed badges if server patch is delayed
                setConversations(
                    conversationsRef.current.map((c) =>
                        c._id === conversationId
                            ? {
                                  ...c,
                                  lastMessage: {
                                      content: message.content,
                                      createdAt: message.createdAt,
                                      sender: { _id: message.senderId },
                                  },
                                  unreadCount: (c.unreadCount || 0) + 1,
                              }
                            : c
                    )
                );
            }
        };

        const handleConversationUpdated = (patch) => {
            setConversations(
                conversationsRef.current.map((c) => {
                    if (c._id !== patch._id) return c;

                    const isCurrentSelected =
                        selectedConversationRef.current?._id === patch._id;

                    return {
                        ...c,
                        lastMessage: patch.lastMessage
                            ? {
                                  ...patch.lastMessage,
                                  content:
                                      patch.lastMessage.content ??
                                      patch.lastMessage.message ??
                                      "",
                              }
                            : c.lastMessage,
                        // Keep 0 for currently selected conversation
                        ...(typeof patch.unreadCount === "number"
                            ? {
                                  unreadCount: isCurrentSelected
                                      ? 0
                                      : patch.unreadCount,
                              }
                            : {}),
                    };
                })
            );
        };

        const handleConversationCreated = (conv) => {
            if (conversationsRef.current.find((c) => c._id === conv._id))
                return;
            setConversations([
                ...conversationsRef.current,
                {
                    ...conv,
                    lastMessage: conv.lastMessage
                        ? {
                              ...conv.lastMessage,
                              content:
                                  conv.lastMessage.content ??
                                  conv.lastMessage.message ??
                                  "",
                          }
                        : null,
                },
            ]);
        };

        socket.on("message:new", handleNewMessage);
        socket.on("conversation:updated", handleConversationUpdated);
        socket.on("conversation:created", handleConversationCreated);

        return () => {
            socket.off("message:new", handleNewMessage);
            socket.off("conversation:updated", handleConversationUpdated);
            socket.off("conversation:created", handleConversationCreated);

            // Clear any pending timers
            markReadTimersRef.current.forEach((t) => clearTimeout(t));
            markReadTimersRef.current.clear();
        };
    }, [socket, authUser, setMessages, setConversations]);
};
