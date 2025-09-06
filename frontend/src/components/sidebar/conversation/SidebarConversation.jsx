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
 *
 * Functions:
 *   - onClickConversation:
 *       - Memoized function to handle conversation selection when clicked.
 *
 * Layout:
 *   - Avatar: Displays the user's profile picture with online indicator and selection styling.
 *   - User Info: Shows the user's name and last message.
 *   - Status:
 *       - Displays the formatted timestamp of the last message.
 *       - Shows a badge with the unread message count if applicable.
 *
 * Styling:
 *   - Uses shared styles from `ConversationStyles` for consistent appearance.
 *       - `getContainerClass`: Styles for the conversation container.
 *       - `getNameClass`: Styles for the user's name.
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

import { memo, useCallback } from "react";
import { formatMessageTime } from "../../../utils/dateUtils";
import ConversationAvatar from "./ConversationAvatar";
import {
    getContainerClass,
    getNameClass,
    getMessageClass,
    getTimeClass,
    getBadgeClass,
} from "../../../styles/ConversationStyles";
import { useConversationStore } from "../../../hooks/conversation/useConversationStore";

const SidebarConversation = memo(({ conversation }) => {
    const { handleSelectConversation, isSelected } = useConversationStore();
    const isConversationSelected = isSelected(conversation._id);

    // Get the other participant in the conversation (excluding the current user)
    // This assumes participants[0] is the other user, but you may need more logic here
    const user = conversation.participants[0];

    // Memoize the click handler
    const onClickConversation = useCallback(() => {
        handleSelectConversation(conversation);
    }, [conversation, handleSelectConversation]);

    // Get classes from shared styles
    const containerClass = getContainerClass(isConversationSelected);
    const nameClass = getNameClass(isConversationSelected);
    const messageClass = getMessageClass(isConversationSelected);
    const timeClass = getTimeClass(isConversationSelected);
    const badgeClass = getBadgeClass(isConversationSelected);

    return (
        <div className={containerClass} onClick={onClickConversation}>
            <ConversationAvatar
                user={user}
                isSelected={isConversationSelected}
                isOnline={user.isOnline || false}
            />
            <div className="flex-1 min-w-0 transition-all duration-150 ease-in-out">
                <h3 className={nameClass}>{user.fullName}</h3>
                <p className={messageClass}>
                    {conversation.lastMessage?.content ||
                        "Click to start a conversation"}
                </p>
            </div>
            <div className="flex flex-col items-end transition-all duration-150 ease-in-out">
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
