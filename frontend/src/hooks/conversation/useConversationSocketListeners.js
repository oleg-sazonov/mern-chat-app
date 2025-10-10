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
 *   - `createMarkAsReadScheduler`: Utility for scheduling mark-as-read requests.
 *   - `createNewMessageHandler`: Utility for handling new message events.
 *   - `createConversationUpdatedHandler`: Utility for handling conversation updates.
 *   - `createConversationCreatedHandler`: Utility for handling new conversation creation.
 *
 * State:
 *   - `selectedConversation`: The currently selected conversation.
 *   - `messages`: The list of messages for the selected conversation.
 *   - `conversations`: The list of all conversations.
 *
 * Actions:
 *   - `setMessages(messages)`: Updates the `messages` state with the provided array.
 *   - `setConversations(conversations)`: Updates the `conversations` state with the provided array.
 *   - `setSelectedConversation(conversation)`: Updates the currently selected conversation.
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
 *       - Replaces temporary conversations with the real conversation if applicable.
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

import { createMarkAsReadScheduler } from "./socketHandlers/markReadScheduler.js";
import { createNewMessageHandler } from "./socketHandlers/newMessageHandler.js";
import { createConversationUpdatedHandler } from "./socketHandlers/conversationUpdatedHandler.js";
import { createConversationCreatedHandler } from "./socketHandlers/conversationCreatedHandler.js";

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

        const scheduleMarkAsRead = createMarkAsReadScheduler({
            markReadTimersRef,
            conversationsRef,
            setConversations,
        });

        const handleNewMessage = createNewMessageHandler({
            authUser,
            messagesRef,
            selectedConversationRef,
            conversationsRef,
            setMessages,
            setConversations,
            playNotification,
            scheduleMarkAsRead,
        });

        const handleConversationUpdated = createConversationUpdatedHandler({
            conversationsRef,
            selectedConversationRef,
            setConversations,
        });

        const handleConversationCreated = createConversationCreatedHandler({
            conversationsRef,
            selectedConversationRef,
            setConversations,
            setSelectedConversation,
            setMessages,
        });

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
