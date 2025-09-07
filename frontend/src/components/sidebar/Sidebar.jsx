/**
 * Sidebar Component
 * -----------------
 * Displays the sidebar with a search bar, conversations list, and user info/footer.
 *
 * Exports:
 *   - Sidebar: Renders the sidebar header, filtered conversations and users, and footer.
 *
 * Props:
 *   - className (string): CSS classes for responsive layout (default: "w-1/4").
 *
 * State:
 *   - searchTerm (string): Stores the current search term entered by the user.
 *
 * Functions:
 *   - handleSearch(searchTerm):
 *       - Updates the `searchTerm` state with the user's input.
 *
 * Layout:
 *   - SidebarHeader: Displays the search bar and title.
 *   - SidebarConversations: Renders conversations and users filtered by the search term.
 *   - SidebarFooter: Displays the current user's info and menu.
 *
 * Usage:
 *   - Used within the `Home` component to display the sidebar with search and conversation functionality.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `Home.jsx`:
 *       <Sidebar className="w-1/4" />
 */

import { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarConversations from "./SidebarConversations";
import SidebarFooter from "./SidebarFooter";

const Sidebar = ({ className = "w-1/4" }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Handle search
    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    return (
        <div
            className={`${className} bg-white/10 backdrop-blur-md border-r border-white/10 flex flex-col`}
        >
            <SidebarHeader onSearch={handleSearch} />
            <SidebarConversations searchTerm={searchTerm} />
            <SidebarFooter />
        </div>
    );
};

export default Sidebar;
