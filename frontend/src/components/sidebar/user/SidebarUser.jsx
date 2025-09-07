/**
 * SidebarUser Component
 * ---------------------
 * Represents a user without an existing conversation in the sidebar.
 *
 * Exports:
 *   - SidebarUser: Renders user avatar, name, username, and a "New" status indicator.
 *
 * Props:
 *   - user (object): The user object containing:
 *       - _id (string): The user's unique ID.
 *       - fullName (string): The user's full name.
 *       - username (string): The user's username.
 *       - profilePicture (string): The URL to the user's profile picture.
 *       - isOnline (boolean): Indicates whether the user is currently online.
 *
 * Functions:
 *   - onClickUser:
 *       - Handles the click event to initiate a new conversation with the user.
 *       - Calls the `handleSelectUser` function from `useConversationStore`.
 *
 * Layout:
 *   - Avatar: Displays the user's profile picture with an online indicator.
 *   - User Info:
 *       - Name: Displays the user's full name with truncation if necessary.
 *       - Username: Displays the user's username prefixed with "@".
 *   - Status:
 *       - Displays "New" to indicate no existing conversation.
 *       - Shows a placeholder message "No chat".
 *
 * Styling:
 *   - Uses shared styles from `ConversationStyles` for consistent appearance.
 *       - `getContainerClass`: Styles for the container.
 *       - `getNameClass`: Styles for the user's name.
 *       - `getMessageClass`: Styles for the username.
 *       - `getTimeClass`: Styles for the "New" status.
 *
 * Usage:
 *   - Used within the `SidebarConversations` component to display users that match the search term
 *     but do not have an existing conversation with the current user.
 *
 * Example:
 *   - Rendered in `SidebarConversations.jsx`:
 *       <SidebarUser user={user} />
 */

import { memo, useCallback } from "react";
import ConversationAvatar from "../conversation/ConversationAvatar";
import {
    getContainerClass,
    getNameClass,
    getMessageClass,
    getTimeClass,
} from "../../../styles/ConversationStyles";
import { useConversationStore } from "../../../hooks/conversation/useConversationStore";

const SidebarUser = memo(({ user }) => {
    const { handleSelectUser } = useConversationStore();

    // Handle click to create a new conversation
    const onClickUser = useCallback(() => {
        handleSelectUser(user);
    }, [user, handleSelectUser]);

    // Get classes from shared styles
    const containerClass = getContainerClass(false);
    const nameClass = getNameClass(false);
    const messageClass = getMessageClass(false);
    const timeClass = getTimeClass(false);

    return (
        <div className={containerClass} onClick={onClickUser}>
            <ConversationAvatar
                user={user}
                isSelected={false}
                isOnline={user.isOnline || false}
            />
            <div className="flex-1 min-w-0">
                <h3 className={nameClass} title={user.fullName}>
                    {user.fullName}
                </h3>
                <p className={messageClass}>@{user.username}</p>
            </div>
            <div className="flex flex-col items-end min-w-[50px] text-right">
                <span className={timeClass}>New</span>
                <span className="text-xs text-white/40">No chat</span>
            </div>
        </div>
    );
});

SidebarUser.displayName = "SidebarUser";

export default SidebarUser;
