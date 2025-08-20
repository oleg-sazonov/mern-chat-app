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
 *
 * Context:
 *   - selectedConversation: The currently selected conversation object, accessed via `useConversation`.
 *
 * Layout:
 *   - If users exist:
 *       - Maps each user to a SidebarConversation component.
 *       - Passes user data and selection state to SidebarConversation.
 *   - If no users:
 *       - Shows a "No users found" message.
 *
 * Usage:
 *   - Used within the `Sidebar` component to display the conversation list.
 *   - Handles user selection and highlights the active conversation.
 *   - Responsive and styled for glassmorphism chat UI.
 */

import SidebarConversation from "./SidebarConversation";
import { useConversation } from "../../hooks/useConversation";

const SidebarConversations = ({ users }) => {
    const { selectedConversation } = useConversation();

    return (
        <div className="overflow-auto flex-1">
            {users.length > 0 ? (
                <div className="flex flex-col gap-1 p-2">
                    {users.map((user) => (
                        <SidebarConversation
                            key={user.id}
                            user={user}
                            isSelected={selectedConversation?.id === user.id}
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
