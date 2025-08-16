/**
 * SidebarConversations Component
 * ------------------------------
 * Renders a list of user conversations for the chat sidebar.
 *
 * Exports:
 *   - SidebarConversations: Displays each conversation using SidebarConversation.
 *
 * Props:
 *   - users: Array of user objects to display in the sidebar.
 *   - onSelectConversation: Callback to update the selected conversation in Home.
 *   - selectedUserId: The id of the currently selected conversation (for highlighting).
 *
 * Layout:
 *   - If users exist:
 *       - Maps each user to a SidebarConversation component.
 *       - Passes user data, selection state, and selection handler to SidebarConversation.
 *   - If no users:
 *       - Shows a "No users found" message.
 *
 * Usage:
 *   - Receives filtered users and selection state from Sidebar.
 *   - Handles user selection and highlights the active conversation.
 *   - Used within Sidebar for displaying the conversation list.
 */

import SidebarConversation from "./SidebarConversation";

const SidebarConversations = ({
    users,
    onSelectConversation,
    selectedUserId,
}) => {
    return (
        <div className="overflow-auto flex-1">
            {users.length > 0 ? (
                <div className="flex flex-col gap-1 p-2">
                    {users.map((user) => (
                        <SidebarConversation
                            key={user.id}
                            user={user}
                            isSelected={selectedUserId === user.id}
                            onSelectConversation={onSelectConversation}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 text-white/50 text-sm">
                    No users found
                </div>
            )}
        </div>
    );
};

export default SidebarConversations;
