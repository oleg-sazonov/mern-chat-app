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
 *   - `conversation:updated`:
 *       - Triggered when a conversation's last message is updated.
 *       - Updates the `lastMessage` field for the corresponding conversation in the `conversations` state.
 *   - `conversation:created`:
 *       - Triggered when a new conversation is created.
 *       - Adds the new conversation to the `conversations` state if it doesn't already exist.
 *
 * Behavior:
 *   - Uses refs (`messagesRef`, `selectedConversationRef`, `conversationsRef`) to avoid stale closures in event handlers.
 *   - Ensures that state updates are consistent and do not overwrite the latest data.
 *
 * Cleanup:
 *   - Removes all Socket.IO event listeners when the component using the hook unmounts or when the `socket` instance changes.
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
            }
        };

        const handleConversationUpdated = (patch) => {
            setConversations(
                conversationsRef.current.map((c) =>
                    c._id === patch._id
                        ? {
                              ...c,
                              lastMessage: {
                                  ...patch.lastMessage,
                                  content:
                                      patch.lastMessage?.content ??
                                      patch.lastMessage?.message ??
                                      "",
                              },
                          }
                        : c
                )
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
        };
    }, [socket, authUser, setMessages, setConversations]);
};
