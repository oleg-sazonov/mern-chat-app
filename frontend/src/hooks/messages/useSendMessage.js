/**
 * useSendMessage Hook
 * -------------------
 * Custom hook for sending messages in a conversation.
 *
 * Exports:
 *   - useSendMessage: Provides functionality to send messages and manage loading state.
 *
 * State:
 *   - loading (boolean): Indicates whether a message is being sent.
 *
 * Context:
 *   - messages (array): The current list of messages in the selected conversation, accessed via `useConversationStore`.
 *   - setMessages (function): Updates the messages array in the `useConversationStore`.
 *   - refreshConversations (function): Refreshes the list of conversations to update the last message in the sidebar.
 *   - receiverData (object | null): The receiver's data, including `_id`, accessed via `useReceiverData`.
 *
 * Functions:
 *   - sendMessage(message):
 *       - Sends a message to the receiver via the API.
 *       - Updates the messages state with the new message.
 *       - Refreshes the conversations list to reflect the latest message in the sidebar.
 *       - Handles errors and displays error notifications using `showToast`.
 *
 * Parameters:
 *   - message (string): The content of the message to be sent.
 *
 * Returns:
 *   - sendMessage (function): Function to send a message.
 *   - loading (boolean): Indicates whether a message is being sent.
 *
 * Usage:
 *   - Import and use the hook in a component:
 *       const { sendMessage, loading } = useSendMessage();
 *
 *   - Call `sendMessage` to send a message:
 *       await sendMessage("Hello, world!");
 *
 * Example:
 *   - Using the hook in a component:
 *       const { sendMessage, loading } = useSendMessage();
 *
 *       const handleSubmit = async (e) => {
 *           e.preventDefault();
 *           if (!message.trim()) return;
 *           await sendMessage(message);
 *       };
 *
 *       return (
 *           <form onSubmit={handleSubmit}>
 *               <input
 *                   type="text"
 *                   value={message}
 *                   onChange={(e) => setMessage(e.target.value)}
 *                   placeholder="Type a message..."
 *               />
 *               <button type="submit" disabled={loading}>Send</button>
 *           </form>
 *       );
 */

import { useState } from "react";
import { showToast } from "../../utils/toastConfig";
import { useConversationStore } from "../conversation/useConversationStore";
import { useReceiverData } from "../conversation/useReceiverData";

export const useSendMessage = () => {
    // Local state for API loading
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, refreshConversations } =
        useConversationStore();
    const { receiverData } = useReceiverData();

    const sendMessage = async (message) => {
        if (!receiverData?._id) {
            showToast.error("Cannot send message: No receiver selected");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/messages/send/${receiverData._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message.trim() }),
            });

            if (!res.ok) {
                throw new Error("Failed to send message");
            }

            // Get the confirmed message from API
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            setMessages([
                ...messages,
                {
                    id: data.data._id,
                    content: data.data.message,
                    timestamp: data.data.createdAt,
                    isSentByCurrentUser: true,
                },
            ]);

            // Refresh conversations to update the last message in the sidebar
            refreshConversations();

            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            showToast.error("Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;
