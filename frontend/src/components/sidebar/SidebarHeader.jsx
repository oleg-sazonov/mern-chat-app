/**
 * SidebarHeader Component
 * ----------------------
 * Displays the sidebar header with the chat title and a search input for filtering users and conversations.
 *
 * Exports:
 *   - SidebarHeader: Renders the header section of the sidebar.
 *
 * Props:
 *   - onSearch (function): Callback function to handle search input changes. Receives the current search term.
 *
 * State:
 *   - searchTerm (string): Stores the current value of the search input.
 *
 * Functions:
 *   - handleSearch(e):
 *       - Updates the `searchTerm` state with the current input value.
 *       - Calls the `onSearch` callback with the updated value.
 *
 * Layout:
 *   - Title: Displays "Chats" as the sidebar heading.
 *   - Search Input: Allows users to filter conversations and users by name or username.
 *   - Search Icon: Positioned inside the input for visual feedback.
 *
 * Usage:
 *   - Used within the `Sidebar` component to provide a search bar for filtering conversations and users.
 *   - Responsive and styled for glassmorphism chat UI.
 */

import { useState } from "react";

const SidebarHeader = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="p-4 border-b border-white/10 space-y-4">
            <h2 className="text-xl font-semibold text-white">Chats</h2>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by name or username..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="input input-bordered w-full py-2 pl-10 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default SidebarHeader;
