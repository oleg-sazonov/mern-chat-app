/**
 * Sidebar Component
 * -----------------
 * Displays the sidebar with user conversations, search input, and user info/footer.
 *
 * Exports:
 *   - Sidebar: Renders the sidebar header, filtered conversations, and footer.
 *
 * Props:
 *   - className (string): Responsive width classes for layout (default: "w-1/4").
 *
 * State:
 *   - filteredUsers (array): Array of users filtered by the search term.
 *   - searchTerm (string): The current search term entered by the user.
 *
 * Functions:
 *   - handleSearch(searchTerm):
 *       - Updates the `searchTerm` state with the user's input.
 *   - useEffect (filtering logic):
 *       - Filters the `users` array based on the `searchTerm`.
 *       - Updates the `filteredUsers` state whenever `searchTerm` or `users` changes.
 *
 * Layout:
 *   - SidebarHeader: Displays the search input and title.
 *   - SidebarConversations: Renders the filtered list of user conversations.
 *   - SidebarFooter: Displays the current user's info and menu.
 *
 * Usage:
 *   - Used within the `Home` component to display the list of conversations and user info.
 *   - Passes filtered users and selection state to `SidebarConversations`.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `Home.jsx`:
 *       <Sidebar className="w-1/4" />
 */

import { useState, useEffect } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarConversations from "./SidebarConversations";
import SidebarFooter from "./SidebarFooter";
import { useUserStore } from "../../hooks/conversation/useUserStore";

const Sidebar = ({ className = "w-1/4" }) => {
    const { users } = useUserStore();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Handle search
    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    // Filter users whenever search term changes
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (user) =>
                    user.fullName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    return (
        <div
            className={`${className} bg-white/10 backdrop-blur-md border-r border-white/10 flex flex-col`}
        >
            <SidebarHeader onSearch={handleSearch} />
            <SidebarConversations
                users={filteredUsers.length > 0 ? filteredUsers : users}
            />
            <SidebarFooter />
        </div>
    );
};

export default Sidebar;
