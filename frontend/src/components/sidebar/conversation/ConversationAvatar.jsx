/**
 * ConversationAvatar Component
 * ----------------------------
 * Displays a user's avatar with online status indicator and selection styling.
 *
 * Exports:
 *   - ConversationAvatar: Renders the avatar for a user with dynamic styles based on selection and online status.
 *
 * Props:
 *   - user: The user object containing `id` and `name`.
 *   - isSelected: Boolean indicating if this conversation is selected.
 *   - isOnline: Boolean indicating if the user is online (default: true).
 *
 * Layout:
 *   - Avatar Container: A circular container with dynamic styles for selection.
 *   - Avatar Image: Displays the user's avatar image, fetched dynamically using the user's ID.
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
import { getAvatarClass, getAvatarContainerClass } from "./ConversationStyles";

const ConversationAvatar = memo(({ user, isSelected, isOnline = true }) => {
    if (!user) return null;

    const avatarClass = getAvatarClass(isOnline);
    const containerClass = getAvatarContainerClass(isSelected);

    return (
        <div className={avatarClass}>
            <div className={containerClass}>
                <img
                    src={`https://robohash.org/user${user.id}.png`}
                    alt={`${user.name}'s avatar`}
                    className="transition-opacity duration-150 ease-in-out hover:opacity-95"
                    loading="lazy"
                />
            </div>
        </div>
    );
});

ConversationAvatar.displayName = "ConversationAvatar";

export default ConversationAvatar;
