/**
 * useConversationStore Hook
 * --------------------------
 * Custom hook for managing conversation-related state using Zustand.
 *
 * Exports:
 *   - useConversationStore: Provides access to conversation state and actions.
 *
 * State:
 *   - selectedConversation (object | null): The currently selected conversation object.
 *   - conversations (array): An array of all conversations available to the user.
 *   - messages (array): An array of messages for the selected conversation.
 *   - isMobile (boolean): Indicates whether the viewport is mobile-sized (<768px).
 *   - loading (boolean): Indicates whether conversations are being fetched.
 *
 * Actions:
 *   - setSelectedConversation(selectedConversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *   - setConversations(conversations):
 *       - Updates the `conversations` state with the provided array of conversations.
 *   - setMessages(messages):
 *       - Updates the `messages` state with the provided array of messages.
 *   - setIsMobile(isMobile):
 *       - Updates the `isMobile` state based on the viewport size.
 *   - refreshConversations():
 *       - Fetches the latest conversations from the server.
 *
 * Functions:
 *   - fetchConversations():
 *       - Fetches conversations with the last messages from the `/api/conversations` endpoint.
 *       - Handles authentication errors and updates the `conversations` state.
 *   - normalizeConversations(list):
 *       - Normalizes the `lastMessage` field in conversations to ensure consistent structure.
 *   - isSelected(conversationId):
 *       - Checks if a given conversation ID matches the currently selected conversation's ID.
 *   - handleSelectConversation(conversation):
 *       - Updates the `selectedConversation` state with the provided conversation object.
 *   - handleSelectUser(user):
 *       - Handles selecting a user to start a new conversation.
 *       - If a conversation already exists with the user, it selects the existing conversation.
 *       - If no conversation exists, it creates a temporary conversation for immediate UI feedback.
 *
 * Effects:
 *   - Adds a window resize listener to update the `isMobile` state dynamically.
 *       - Removes the listener when the component unmounts.
 *   - Fetches conversations on component mount.
 *   - Listens for real-time Socket.IO events:
 *       - `message:new`: Appends a new message to the selected conversation.
 *       - `conversation:updated`: Updates the `lastMessage` field for a conversation.
 *       - `conversation:created`: Adds a new conversation to the list.
 *
 * Returns:
 *   - selectedConversation (object | null): The currently selected conversation object.
 *   - conversations (array): The list of conversations with their last messages.
 *   - loading (boolean): Whether conversations are being loaded.
 *   - setSelectedConversation (function): Function to update the selected conversation.
 *   - setConversations (function): Function to update the conversations array.
 *   - handleSelectConversation (function): Function to handle conversation selection.
 *   - isSelected (function): Utility function to check if a conversation is selected.
 *   - messages (array): The list of messages for the selected conversation.
 *   - setMessages (function): Function to update the messages array.
 *   - isMobile (boolean): Indicates if the viewport is mobile-sized.
 *   - handleSelectUser (function): Function to handle selecting a user for a new conversation.
 *   - refreshConversations (function): Function to manually refresh conversations.
 *
 * Usage:
 *   - This hook is used in components like `Sidebar` and `MessageContainer` to manage conversation state.
 *   - Provides a centralized way to handle conversation selection, messages, and responsive layout.
 */

import useConversation from "../../store/zustand/useConversation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuthContext } from "../../store/AuthContext";
import { showToast } from "../../utils/toastConfig";
import { useSocketContext } from "../../store/SocketContext";

export const useConversationStore = () => {
    const [loading, setLoading] = useState(false);

    // Zustand store state/actions
    const {
        selectedConversation,
        setSelectedConversation,
        messages,
        setMessages,
        isMobile,
        setIsMobile,
        conversations,
        setConversations,
    } = useConversation();

    const { setAuthUser, authUser } = useAuthContext();
    const { socket } = useSocketContext();

    // Refs to avoid stale closures in socket handlers
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

    // Window resize listener
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsMobile]);

    // Normalize conversations' lastMessage shape
    const normalizeConversations = useCallback((list) => {
        if (!Array.isArray(list)) return [];
        return list.map((c) => {
            if (!c.lastMessage) return c;
            const lm = c.lastMessage;
            return {
                ...c,
                lastMessage: {
                    ...lm,
                    content:
                        (typeof lm === "string"
                            ? lm
                            : lm.content ?? lm.message ?? "") || "",
                },
            };
        });
    }, []);

    // Fetch conversations with last messages
    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/conversations");

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("user");
                setAuthUser(null);
                showToast.error("Authentication expired. Please login again");
                return;
            }

            if (!res.ok) throw new Error("Failed to fetch conversations");

            const data = await res.json();
            setConversations(normalizeConversations(data));
        } catch (error) {
            showToast.error(error.message || "Failed to load conversations");
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    }, [setConversations, setAuthUser, normalizeConversations]);

    // Initial load
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Socket event bindings
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

    const isSelected = (conversationId) =>
        selectedConversation?._id === conversationId;

    const handleSelectConversation = useCallback(
        (conversation) => {
            if (selectedConversation?._id === conversation._id) return;
            setLoading(true);
            setSelectedConversation(conversation);
        },
        [selectedConversation, setSelectedConversation]
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
        refreshConversations: () => fetchConversations(false),
    };
};

export default useConversationStore;
