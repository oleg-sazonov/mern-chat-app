/**
 * ConversationAvatar Component
 * ----------------------------
 * Displays a user's avatar with online status indicator and selection styling.
 *
 * Exports:
 *   - ConversationAvatar: Renders the avatar for a user with dynamic styles based on selection and online status.
 *
 * Props:
 *   - user (object): The user object containing:
 *       - profilePicture (string): URL of the user's profile picture.
 *       - _id (string): The user's unique ID.
 *       - fullName (string): The user's full name.
 *   - isSelected (boolean): Indicates if this conversation is selected.
 *   - isOnline (boolean): Indicates if the user is online (default: false).
 *
 * Layout:
 *   - Avatar Container: A circular container with dynamic styles for selection.
 *   - Avatar Image: Displays the user's avatar image, fetched dynamically using the user's profile picture or ID.
 *
 * Styling:
 *   - Uses `getAvatarClass` for online status styling.
 *   - Uses `getAvatarContainerClass` for selection styling.
 *
 * Usage:
 *   - Used within the `SidebarConversation` component to display the user's avatar.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `SidebarConversation.jsx`:
 *       <ConversationAvatar user={user} isSelected={isSelected} isOnline={user.isOnline} />
 */

import { memo } from "react";
import {
    getAvatarClass,
    getAvatarContainerClass,
} from "../../../styles/ConversationStyles";

const ConversationAvatar = memo(({ user, isSelected, isOnline = false }) => {
    if (!user) return null;

    const avatarClass = getAvatarClass(isOnline);
    const containerClass = getAvatarContainerClass(isSelected);

    return (
        <div className={avatarClass}>
            <div className={containerClass}>
                <img
                    src={
                        user.profilePicture ||
                        `https://robohash.org/user${user._id}.png`
                    }
                    alt={`${user.fullName}'s avatar`}
                    className="transition-opacity duration-150 ease-in-out hover:opacity-95"
                    loading="lazy"
                />
            </div>
        </div>
    );
});

ConversationAvatar.displayName = "ConversationAvatar";

export default ConversationAvatar;
