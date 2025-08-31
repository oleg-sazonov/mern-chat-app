/**
 * SidebarConversation Component
 * -----------------------------
 * Represents a single user conversation item in the sidebar.
 *
 * Exports:
 *   - SidebarConversation: Renders user avatar, name, last message, unread count, and selection state.
 *
 * Props:
 *   - user (object): The user object containing:
 *       - _id (string): The user's unique ID.
 *       - fullName (string): The user's full name.
 *       - lastMessage (string): The last message in the conversation (optional).
 *       - unreadCount (number): The number of unread messages (optional).
 *       - isOnline (boolean): Indicates if the user is online (optional).
 *       - updatedAt (string): The timestamp of the last message or update.
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
 *       <SidebarConversation user={user} />
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

const SidebarConversation = memo(({ user }) => {
    const { handleSelectConversation, isSelected } = useConversationStore();
    const isUserSelected = isSelected(user._id);

    // Memoize the click handler
    const onClickConversation = useCallback(() => {
        handleSelectConversation(user);
    }, [user, handleSelectConversation]);

    // Get classes from shared styles
    const containerClass = getContainerClass(isUserSelected);
    const nameClass = getNameClass(isUserSelected);
    const messageClass = getMessageClass(isUserSelected);
    const timeClass = getTimeClass(isUserSelected);
    const badgeClass = getBadgeClass(isUserSelected);

    return (
        <div className={containerClass} onClick={onClickConversation}>
            <ConversationAvatar
                user={user}
                isSelected={isUserSelected}
                isOnline={user.isOnline || false}
            />
            <div className="flex-1 min-w-0 transition-all duration-150 ease-in-out">
                <h3 className={nameClass}>{user.fullName}</h3>
                <p className={messageClass}>
                    {user.lastMessage || "Click to start a conversation"}
                </p>
            </div>
            <div className="flex flex-col items-end transition-all duration-150 ease-in-out">
                <span className={timeClass}>
                    {formatMessageTime(user.updatedAt) || "New"}
                </span>
                {user.unreadCount > 0 && (
                    <span className={badgeClass}>{user.unreadCount}</span>
                )}
            </div>
        </div>
    );
});

SidebarConversation.displayName = "SidebarConversation";

export default SidebarConversation;
