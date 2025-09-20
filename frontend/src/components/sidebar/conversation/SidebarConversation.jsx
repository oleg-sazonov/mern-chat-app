/**
 * SidebarConversation Component
 * -----------------------------
 * Represents a single user conversation item in the sidebar.
 *
 * Exports:
 *   - SidebarConversation: Renders user avatar, name, last message, unread count, and selection state.
 *
 * Props:
 *   - conversation (object): The conversation object containing:
 *       - _id (string): The unique ID of the conversation.
 *       - participants (array): An array of participant objects in the conversation.
 *           - Each participant contains:
 *               - _id (string): The participant's unique ID.
 *               - fullName (string): The participant's full name.
 *               - isOnline (boolean): Indicates if the participant is online (optional).
 *       - lastMessage (object | null): The last message in the conversation (optional).
 *           - content (string): The content of the last message.
 *           - createdAt (string): The timestamp of the last message.
 *       - unreadCount (number): The number of unread messages in the conversation (optional).
 *
 * Context:
 *   - handleSelectConversation: Function to update the selected conversation, accessed via `useConversationStore`.
 *   - isSelected: Function to check if the current conversation is selected, accessed via `useConversationStore`.
 *   - authUser: The currently authenticated user, accessed via `useAuthContext`.
 *
 * Functions:
 *   - onClickConversation:
 *       - Memoized function to handle conversation selection when clicked.
 *   - otherUser:
 *       - Memoized function to find the other participant in the conversation (not the current user).
 *   - isOtherUserOnline:
 *       - Determines if the other participant is currently online using the `useOnlineStatus` hook.
 *
 * Layout:
 *   - Avatar: Displays the user's profile picture with online indicator and selection styling.
 *   - User Info:
 *       - Name: Displays the other participant's full name.
 *       - Last Message: Shows the last message content or a placeholder if no messages exist.
 *   - Status:
 *       - Timestamp: Displays the formatted timestamp of the last message.
 *       - Unread Badge: Shows a badge with the unread message count if applicable.
 *
 * Styling:
 *   - Uses shared styles from `ConversationStyles` for consistent appearance.
 *       - `getContainerClass`: Styles for the conversation container.
 *       - `getMessageClass`: Styles for the last message preview.
 *       - `getTimeClass`: Styles for the timestamp.
 *       - `getBadgeClass`: Styles for the unread message count badge.
 *
 * Usage:
 *   - Used within the `SidebarConversations` component to display each conversation in the sidebar.
 *   - Handles user selection and highlights the active conversation.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `SidebarConversations.jsx`:
 *       <SidebarConversation conversation={conversation} />
 */

import { memo, useCallback, useMemo } from "react";
import { formatMessageTime } from "../../../utils/dateUtils";
import ConversationAvatar from "./ConversationAvatar";
import {
    getContainerClass,
    // getNameClass,
    getMessageClass,
    getTimeClass,
    getBadgeClass,
} from "../../../styles/ConversationStyles";
import { useConversationStore } from "../../../hooks/conversation/useConversationStore";
import { useAuthContext } from "../../../store/AuthContext";
import { useOnlineStatus } from "../../../hooks/socket/useOnlineStatus";

const SidebarConversation = memo(({ conversation }) => {
    const { handleSelectConversation, isSelected } = useConversationStore();
    const { authUser } = useAuthContext();
    const isConversationSelected = isSelected(conversation._id);

    // Find the other participant (not the current user) from the participants array
    const otherUser = useMemo(() => {
        if (!conversation.participants || !authUser)
            return conversation.participants[0];

        // Find the participant that is not the current user
        return (
            conversation.participants.find(
                (participant) => participant._id !== authUser.id
            ) || conversation.participants[0]
        ); // Fallback to first participant if not found
    }, [conversation.participants, authUser]);

    // Check if the other user is online
    const isOtherUserOnline = useOnlineStatus(otherUser?._id);

    // Memoize the click handler
    const onClickConversation = useCallback(() => {
        handleSelectConversation(conversation);
    }, [conversation, handleSelectConversation]);

    // Get classes from shared styles
    const containerClass = getContainerClass(isConversationSelected);
    // const nameClass = getNameClass(isConversationSelected);
    const messageClass = getMessageClass(isConversationSelected);
    const timeClass = getTimeClass(isConversationSelected);
    const badgeClass = getBadgeClass(isConversationSelected);

    return (
        <div className={containerClass} onClick={onClickConversation}>
            <ConversationAvatar
                user={otherUser}
                isSelected={isConversationSelected}
                isOnline={isOtherUserOnline}
            />
            <div className="flex-1 min-w-0">
                <h3
                    className="font-medium text-ellipsis whitespace-nowrap overflow-hidden max-w-[180px]"
                    title={otherUser.fullName}
                    style={{
                        color: isConversationSelected
                            ? "white"
                            : "rgba(255, 255, 255, 0.9)",
                    }}
                >
                    {otherUser.fullName}
                </h3>
                <p className={messageClass}>
                    {conversation.lastMessage?.content ||
                        "Click to start a conversation"}
                </p>
            </div>
            <div className="flex flex-col items-end min-w-[50px] text-right">
                <span className={timeClass}>
                    {conversation.lastMessage
                        ? formatMessageTime(conversation.lastMessage.createdAt)
                        : "New"}
                </span>
                {conversation.unreadCount > 0 && (
                    <span className={badgeClass}>
                        {conversation.unreadCount}
                    </span>
                )}
            </div>
        </div>
    );
});

SidebarConversation.displayName = "SidebarConversation";

export default SidebarConversation;
