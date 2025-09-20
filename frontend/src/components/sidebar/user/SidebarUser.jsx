/**
 * SidebarUser Component
 * ---------------------
 * Represents a user without an existing conversation in the sidebar.
 *
 * Exports:
 *   - SidebarUser: Renders user avatar, name, username, and join date.
 *
 * Props:
 *   - user (object): The user object containing:
 *       - _id (string): The user's unique ID.
 *       - fullName (string): The user's full name.
 *       - username (string): The user's username.
 *       - profilePicture (string): The URL to the user's profile picture.
 *       - isOnline (boolean): Indicates whether the user is currently online.
 *       - createdAt (string): The timestamp of when the user joined.
 *   - isSelected (boolean): Indicates whether the user is currently selected.
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
 *       - Displays the user's join date or "New user" if no join date is available.
 *
 * Styling:
 *   - Uses shared styles from `ConversationStyles` for consistent appearance:
 *       - `getContainerClass`: Styles for the container.
 *       - `getMessageClass`: Styles for the username.
 *       - `getTimeClass`: Styles for the join date.
 *
 * Usage:
 *   - Used within the `SidebarConversations` component to display users that match the search term
 *     but do not have an existing conversation with the current user.
 *
 * Example:
 *   - Rendered in `SidebarConversations.jsx`:
 *       <SidebarUser user={user} isSelected={isSelected} />
 */

import { memo, useCallback } from "react";
import ConversationAvatar from "../conversation/ConversationAvatar";
import {
    getContainerClass,
    // getNameClass,
    getMessageClass,
    getTimeClass,
} from "../../../styles/ConversationStyles";
import { useConversationStore } from "../../../hooks/conversation/useConversationStore";
import { formatJoinDate } from "../../../utils/dateUtils";

const SidebarUser = memo(({ user, isSelected = false }) => {
    const { handleSelectUser } = useConversationStore();

    // Handle click to create a new conversation
    const onClickUser = useCallback(() => {
        handleSelectUser(user);
    }, [user, handleSelectUser]);

    // Get classes from shared styles - use the isSelected prop passed from parent
    const containerClass = getContainerClass(isSelected);
    // const nameClass = getNameClass(isSelected);
    const messageClass = getMessageClass(isSelected);
    const timeClass = getTimeClass(isSelected);

    // Format join date if available
    const joinDate = user.createdAt
        ? formatJoinDate(user.createdAt)
        : "New user";

    return (
        <div className={containerClass} onClick={onClickUser}>
            <ConversationAvatar
                user={user}
                isSelected={isSelected}
                // isOnline={user.isOnline || false}
            />
            <div className="flex-1 min-w-0">
                <h3
                    className="font-medium text-ellipsis whitespace-nowrap overflow-hidden max-w-[180px]"
                    title={user.fullName}
                    style={{
                        color: isSelected
                            ? "white"
                            : "rgba(255, 255, 255, 0.9)",
                    }}
                >
                    {user.fullName}
                </h3>
                <p className={messageClass}>@{user.username}</p>
            </div>
            <div className="flex flex-col items-end min-w-[50px] text-right">
                <span className={timeClass}>{joinDate}</span>
                {/* <span className="text-xs text-white/40">
                    {user.isOnline ? "Online" : "No chat"}
                </span> */}
            </div>
        </div>
    );
});

SidebarUser.displayName = "SidebarUser";

export default SidebarUser;
