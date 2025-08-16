/**
 * SidebarConversation Component
 * ----------------------------
 * Represents a single user conversation item in the sidebar.
 *
 * Exports:
 *   - SidebarConversation: Renders user avatar, name, last message, unread count, and selection state.
 *
 * Props:
 *   - user: The user object containing id, name, lastMessage, unreadCount, etc.
 *   - isSelected: Boolean indicating if this conversation is currently selected.
 *   - onSelectConversation: Callback to update the selected conversation in Home.
 *
 * Functions:
 *   - handleSelect()
 *     - Invokes onSelectConversation with the full user object when the item is clicked.
 *
 * Layout:
 *   - Avatar: Displays user's profile picture with online indicator and ring if selected.
 *   - User Info: Shows user's name and last message.
 *   - Status: Shows message time and unread count badge.
 *   - Applies smooth transitions and highlight styles when selected or hovered.
 *
 * Usage:
 *   - Used within SidebarConversations to display each conversation in the sidebar.
 *   - Handles user selection and highlights the active conversation.
 *   - Responsive and styled for glassmorphism chat UI.
 */

import { memo } from "react";

const SidebarConversation = ({ user, isSelected, onSelectConversation }) => {
    // Handle click with full user data
    const handleSelect = () => {
        onSelectConversation(user); // Pass the entire user object instead of just ID
    };
    return (
        <div
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer 
                transition-all duration-300 ease-in-out transform
                ${
                    isSelected
                        ? "border-white/30 shadow-md"
                        : "hover:bg-white/5"
                }`}
            onClick={handleSelect}
        >
            <div className="avatar avatar-online transition-all duration-300 ease-in-out">
                <div
                    className={`w-12 rounded-full transition-all duration-300 ease-in-out ${
                        isSelected
                            ? "ring ring-white/40 ring-offset-1 ring-offset-transparent shadow-lg"
                            : "bg-white/10"
                    }`}
                >
                    <img
                        src={`https://robohash.org/user${user.id}.png`}
                        alt={`${user.name}'s avatar`}
                        className="transition-opacity duration-300 ease-in-out"
                    />
                </div>
            </div>
            <div className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
                <h3
                    className={`font-medium truncate transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-white/90"
                    }`}
                >
                    {user.name}
                </h3>
                <p
                    className={`text-sm truncate transition-colors duration-300 ${
                        isSelected ? "text-white/80" : "text-white/60"
                    }`}
                >
                    {user.lastMessage}
                </p>
            </div>
            <div className="flex flex-col items-end transition-all duration-300 ease-in-out">
                <span
                    className={`text-xs transition-colors duration-300 ${
                        isSelected ? "text-white/70" : "text-white/40"
                    }`}
                >
                    12:30
                </span>
                {user.unreadCount > 0 && (
                    <span
                        className={`badge badge-sm transition-all duration-300 ${
                            isSelected
                                ? "bg-white/30 text-white border-white/20"
                                : "bg-white/20 text-white border-white/10"
                        } mt-1`}
                    >
                        {user.unreadCount}
                    </span>
                )}
            </div>
        </div>
    );
};

// Use memo to prevent unnecessary re-renders when other conversations change
export default memo(SidebarConversation);
