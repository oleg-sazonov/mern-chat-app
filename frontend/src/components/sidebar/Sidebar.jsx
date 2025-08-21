/**
 * Sidebar Component
 * -----------------
 * Displays the sidebar with user conversations, search input, and user info/footer.
 *
 * Exports:
 *   - Sidebar: Renders the sidebar header, filtered conversations, and footer.
 *
 * Props:
 *   - className: Responsive width classes for layout (default: "w-1/4").
 *
 * State:
 *   - filteredUsers: Array of users filtered by the search term.
 *   - searchTerm: The current search term entered by the user.
 *
 * Functions:
 *   - handleSearch(searchTerm)
 *     - Filters users by name based on the search term.
 *     - Updates the `filteredUsers` state.
 *
 *   - useEffect (filtering logic)
 *     - Updates the `filteredUsers` state whenever the `searchTerm` or `allUsers` changes.
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

import { useState, useEffect, useMemo } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarConversations from "./SidebarConversations";
import SidebarFooter from "./SidebarFooter";
import generateSampleUsers from "../../data/sampleUsers";

const Sidebar = ({ className = "w-1/4" }) => {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Use the imported sample data function
    const allUsers = useMemo(() => generateSampleUsers(), []);

    // Handle search
    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    // Filter users whenever search term changes
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers(allUsers);
        } else {
            const filtered = allUsers.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, allUsers]);

    return (
        <div
            className={`${className} bg-white/10 backdrop-blur-md border-r border-white/10 flex flex-col`}
        >
            <SidebarHeader onSearch={handleSearch} />
            <SidebarConversations users={filteredUsers} />
            <SidebarFooter />
        </div>
    );
};

export default Sidebar;
