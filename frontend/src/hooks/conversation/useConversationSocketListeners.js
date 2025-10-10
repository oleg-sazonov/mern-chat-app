/**
 * useConversationSocketListeners Hook
 * -----------------------------------
 * Custom hook for managing real-time Socket.IO events related to conversations and messages.
 *
 * Purpose:
 *   - Listens for real-time updates to conversations and messages via Socket.IO.
 *   - Updates the local state for conversations and messages in response to server events.
 *   - Plays a notification sound for incoming messages in unselected conversations.
 *
 * Exports:
 *   - useConversationSocketListeners: Initializes and manages Socket.IO event listeners.
 *
 * Dependencies:
 *   - `useConversation`: Zustand store hook for managing conversation-related state.
 *   - `useAuthContext`: Context hook for accessing the authenticated user's data.
 *   - `useSocketContext`: Context hook for accessing the Socket.IO instance.
 *   - `useNotificationSound`: Hook for playing notification sounds.
 *
 * State:
 *   - `selectedConversation`: The currently selected conversation.
 *   - `messages`: The list of messages for the selected conversation.
 *   - `conversations`: The list of all conversations.
 *
 * Actions:
 *   - `setMessages(messages)`: Updates the `messages` state with the provided array.
 *   - `setConversations(conversations)`: Updates the `conversations` state with the provided array.
 *
 * Real-Time Events:
 *   - `message:new`:
 *       - Triggered when a new message is sent in a conversation.
 *       - Appends the new message to the `messages` state if the conversation is currently selected.
 *       - Increments the `unreadCount` for other conversations.
 *       - Plays a notification sound for incoming messages in unselected conversations.
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
 *   - Optimistically updates the `unreadCount` for conversations to improve UI responsiveness.
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
import { useNotificationSound } from "../ui/useNotificationSound";

export const useConversationSocketListeners = () => {
    const {
        selectedConversation,
        setMessages,
        messages,
        conversations,
        setConversations,
        setSelectedConversation,
    } = useConversation();

    const { authUser } = useAuthContext();
    const { socket } = useSocketContext();
    const { playNotification } = useNotificationSound();

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

            // Determine if this is an incoming message from another user
            const isIncoming = message.senderId?.toString() !== authUser?.id;

            if (currentConv?._id === conversationId) {
                const newMsg = {
                    id: message.id,
                    content: message.content,
                    timestamp: message.createdAt,
                    isSentByCurrentUser:
                        message.senderId?.toString() === authUser?.id,
                    // mark for brief animation
                    isFresh: true,
                };
                setMessages([...messagesRef.current, newMsg]);

                // Clear the "fresh" flag shortly after mount to stop the highlight
                setTimeout(() => {
                    const cur = messagesRef.current || [];
                    const next = cur.map((m) =>
                        m.id === newMsg.id ? { ...m, isFresh: false } : m
                    );
                    setMessages(next);
                }, 600);

                // If it's an incoming message while this conversation is open,
                // ensure server unreadCount stays 0 (debounced).
                if (
                    isIncoming &&
                    currentConv._id &&
                    !currentConv._id.startsWith("temp_")
                ) {
                    scheduleMarkAsRead(conversationId);
                }

                // Optional: still play sound if app is not focused/visible
                // if (isIncoming && (document.hidden || !document.hasFocus())) {
                //     playNotification();
                // }
            } else {
                // Conversation not selected -> will show as unread -> play sound
                // if (isIncoming) {
                //     playNotification(); // <-- play sound for unread
                // }

                const shouldPlaySound =
                    isIncoming &&
                    (selectedConversationRef.current?._id !== conversationId ||
                        document.hidden ||
                        !document.hasFocus());

                if (shouldPlaySound) {
                    playNotification();
                }

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

            const currentSelected = selectedConversationRef.current;

            const merged = {
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
            };

            const tempSelection =
                currentSelected?._id?.startsWith("temp_") &&
                currentSelected.participants?.[0];

            if (tempSelection) {
                const targetUserId = tempSelection._id?.toString();
                const containsTarget = Array.isArray(conv.participants)
                    ? conv.participants.some((p) =>
                          (typeof p === "string" ? p : p?._id)
                              ?.toString()
                              .includes(targetUserId)
                      )
                    : false;

                if (containsTarget) {
                    merged.participants =
                        Array.isArray(conv.participants) &&
                        conv.participants.some(
                            (p) =>
                                typeof p === "object" &&
                                p !== null &&
                                "fullName" in p
                        )
                            ? conv.participants
                            : [
                                  tempSelection,
                                  currentSelected.participants?.find(
                                      (p) => p._id !== tempSelection._id
                                  ),
                              ].filter(Boolean);

                    setSelectedConversation(merged);
                    setMessages([]);
                }
            }

            setConversations([...conversationsRef.current, merged]);

            // setConversations([
            //     ...conversationsRef.current,
            //     {
            //         ...conv,
            //         lastMessage: conv.lastMessage
            //             ? {
            //                   ...conv.lastMessage,
            //                   content:
            //                       conv.lastMessage.content ??
            //                       conv.lastMessage.message ??
            //                       "",
            //               }
            //             : null,
            //     },
            // ]);
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
            markReadTimersRef.current.clear();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, authUser, setMessages, setConversations]);
};

// import { useEffect, useRef } from "react";
// import useConversation from "../../store/zustand/useConversation";
// import { useAuthContext } from "../../store/AuthContext";
// import { useSocketContext } from "../../store/SocketContext";
// import { useNotificationSound } from "../ui/useNotificationSound";

// import { createMarkAsReadScheduler } from "./socketHandlers/markReadScheduler.js";
// import { createNewMessageHandler } from "./socketHandlers/newMessageHandler.js";
// import { createConversationUpdatedHandler } from "./socketHandlers/conversationUpdatedHandler.js";
// import { createConversationCreatedHandler } from "./socketHandlers/conversationCreatedHandler.js";

// export const useConversationSocketListeners = () => {
//     const {
//         selectedConversation,
//         setMessages,
//         messages,
//         conversations,
//         setConversations,
//         setSelectedConversation,
//     } = useConversation();

//     const { authUser } = useAuthContext();
//     const { socket } = useSocketContext();
//     const { playNotification } = useNotificationSound();

//     // Refs to avoid stale closures
//     const messagesRef = useRef(messages);
//     const selectedConversationRef = useRef(selectedConversation);
//     const conversationsRef = useRef(conversations);
//     const markReadTimersRef = useRef(new Map());

//     useEffect(() => {
//         messagesRef.current = messages;
//     }, [messages]);
//     useEffect(() => {
//         selectedConversationRef.current = selectedConversation;
//     }, [selectedConversation]);
//     useEffect(() => {
//         conversationsRef.current = conversations;
//     }, [conversations]);

//     useEffect(() => {
//         if (!socket) return;

//         const scheduleMarkAsRead = createMarkAsReadScheduler({
//             markReadTimersRef,
//             conversationsRef,
//             setConversations,
//         });

//         const handleNewMessage = createNewMessageHandler({
//             authUser,
//             messagesRef,
//             selectedConversationRef,
//             conversationsRef,
//             setMessages,
//             setConversations,
//             playNotification,
//             scheduleMarkAsRead,
//         });

//         const handleConversationUpdated = createConversationUpdatedHandler({
//             conversationsRef,
//             selectedConversationRef,
//             setConversations,
//         });

//         const handleConversationCreated = createConversationCreatedHandler({
//             conversationsRef,
//             selectedConversationRef,
//             setConversations,
//             setSelectedConversation,
//             setMessages,
//         });

//         socket.on("message:new", handleNewMessage);
//         socket.on("conversation:updated", handleConversationUpdated);
//         socket.on("conversation:created", handleConversationCreated);

//         return () => {
//             socket.off("message:new", handleNewMessage);
//             socket.off("conversation:updated", handleConversationUpdated);
//             socket.off("conversation:created", handleConversationCreated);

//             // Clear any pending timers
//             markReadTimersRef.current.forEach((t) => clearTimeout(t));
//             // eslint-disable-next-line react-hooks/exhaustive-deps
//             markReadTimersRef.current.clear();
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [socket, authUser, setMessages, setConversations]);
// };
