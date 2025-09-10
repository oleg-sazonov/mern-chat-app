/**
 * useReceiverData Hook
 * ---------------------
 * Custom hook for extracting and formatting receiver data from the selected conversation.
 *
 * Exports:
 *   - useReceiverData: Provides receiver data, avatar URLs, and header data for the chat interface.
 *
 * State:
 *   - selectedConversation: The currently selected conversation, accessed via `useConversationStore`.
 *
 * Memoized Values:
 *   - receiverData (object | null):
 *       - Extracts the receiver's data from the selected conversation.
 *       - Handles both temporary and regular conversations.
 *       - Returns the first participant if no specific receiver is found.
 *       - Structure:
 *           - _id (string): The receiver's unique ID.
 *           - fullName (string): The receiver's full name.
 *           - username (string): The receiver's username.
 *           - profilePicture (string): The URL of the receiver's profile picture.
 *           - isOnline (boolean): Indicates if the receiver is online.
 *   - avatarUrl (string | null):
 *       - The avatar URL for the receiver.
 *       - Falls back to a generated RoboHash URL if no profile picture is available.
 *   - headerData (object | null):
 *       - Data for the `ChatHeader` component.
 *       - Structure:
 *           - name (string): The receiver's full name.
 *           - username (string): The receiver's username.
 *           - isOnline (boolean): Indicates if the receiver is online.
 *           - _id (string): The receiver's unique ID.
 *   - senderAvatarUrl (string):
 *       - The avatar URL for the current user (sender).
 *       - Generated using the current user's ID and RoboHash.
 *
 * Usage:
 *   - Used in the `MessageContainer` component to provide receiver and sender data for the chat interface.
 *   - Supplies data for components like `ChatHeader` and `MessagesList`.
 *
 * Example:
 *   - Import and use the hook in a component:
 *       const { receiverData, avatarUrl, headerData, senderAvatarUrl } = useReceiverData();
 *
 *   - Access receiver data:
 *       console.log(receiverData.fullName); // Outputs the receiver's full name
 *
 *   - Use avatar URLs in components:
 *       <img src={avatarUrl} alt="Receiver's Avatar" />
 *       <img src={senderAvatarUrl} alt="Sender's Avatar" />
 */

import { useMemo } from "react";
import { useConversationStore } from "./useConversationStore";

export const useReceiverData = () => {
    const { selectedConversation } = useConversationStore();

    // Get receiver data from selected conversation
    const receiverData = useMemo(() => {
        if (!selectedConversation) return null;

        // Handle temporary conversations (created when selecting a user)
        if (selectedConversation._id?.startsWith("temp_")) {
            return selectedConversation.participants[0];
        }

        // Find the other participant in regular conversations
        const participant = selectedConversation.participants?.find(
            (p) => p._id !== JSON.parse(localStorage.getItem("user") || "{}").id
        );

        return participant || selectedConversation.participants?.[0];
    }, [selectedConversation]);

    // Memoize avatar URL with fallbacks
    const avatarUrl = useMemo(() => {
        if (!receiverData) return null;

        return (
            receiverData.profilePicture ||
            `https://robohash.org/user${receiverData._id}.png`
        );
    }, [receiverData]);

    // Prepare header data for ChatHeader component
    const headerData = useMemo(() => {
        if (!receiverData) return null;

        return {
            name: receiverData.fullName,
            username: receiverData.username,
            isOnline: receiverData.isOnline || false,
            _id: receiverData._id,
        };
    }, [receiverData]);

    // Get sender avatar URL
    const senderAvatarUrl = useMemo(() => {
        const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
        return `https://robohash.org/${userId}.png`;
    }, []);

    return {
        receiverData,
        avatarUrl,
        headerData,
        senderAvatarUrl,
    };
};
