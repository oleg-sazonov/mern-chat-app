import { useState } from "react";
import { showToast } from "../../utils/toastConfig";
import { useConversationStore } from "../conversation/useConversationStore";
import { useReceiverData } from "../conversation/useReceiverData";

export const useSendMessage = () => {
    // Local state for API loading
    const [loading, setLoading] = useState(false);
    const { messages, setMessages } = useConversationStore();
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
