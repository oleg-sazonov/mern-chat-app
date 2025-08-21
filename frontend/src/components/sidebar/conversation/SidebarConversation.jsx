/**
 * SidebarConversation Component
 * -----------------------------
 * Represents a single user conversation item in the sidebar.
 *
 * Exports:
 *   - SidebarConversation: Renders user avatar, name, last message, unread count, and selection state.
 *
 * Props:
 *   - user: The user object containing details like `id`, `name`, `lastMessage`, `unreadCount`, `isOnline`, and `timestamp`.
 *
 * Context:
 *   - selectedConversation: The currently selected conversation object, accessed via `useConversation`.
 *   - handleSelectConversation: Function to update the selected conversation, accessed via `useConversation`.
 *
 * Functions:
 *   - onClickConversation
 *     - Memoized function to handle conversation selection.
 *
 * Layout:
 *   - Avatar: Displays the user's profile picture with online indicator and selection styling.
 *   - User Info: Shows the user's name and last message.
 *   - Status: Displays the message timestamp and unread message count badge.
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
import { useConversation } from "../../../hooks/useConversation";
import { formatMessageTime } from "../../../utils/dateUtils";
import ConversationAvatar from "./ConversationAvatar";
import {
    getContainerClass,
    getNameClass,
    getMessageClass,
    getTimeClass,
    getBadgeClass,
} from "./ConversationStyles";

const SidebarConversation = memo(({ user }) => {
    const { selectedConversation, handleSelectConversation } =
        useConversation();
    const isSelected = selectedConversation?.id === user.id;

    // Memoize the click handler to prevent unnecessary re-renders
    const onClickConversation = useCallback(() => {
        handleSelectConversation(user);
    }, [user, handleSelectConversation]);

    // Get classes from shared styles
    const containerClass = getContainerClass(isSelected);
    const nameClass = getNameClass(isSelected);
    const messageClass = getMessageClass(isSelected);
    const timeClass = getTimeClass(isSelected);
    const badgeClass = getBadgeClass(isSelected);

    return (
        <div className={containerClass} onClick={onClickConversation}>
            <ConversationAvatar
                user={user}
                isSelected={isSelected}
                isOnline={user.isOnline}
            />
            <div className="flex-1 min-w-0 transition-all duration-150 ease-in-out">
                <h3 className={nameClass}>{user.name}</h3>
                <p className={messageClass}>{user.lastMessage}</p>
            </div>
            <div className="flex flex-col items-end transition-all duration-150 ease-in-out">
                <span className={timeClass}>
                    {formatMessageTime(user.timestamp) || "12:30"}
                </span>
                {user.unreadCount > 0 && (
                    <span className={badgeClass}>{user.unreadCount}</span>
                )}
            </div>
        </div>
    );
});

// Add a displayName for better debugging
SidebarConversation.displayName = "SidebarConversation";

export default SidebarConversation;
