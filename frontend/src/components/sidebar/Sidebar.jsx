/**
 * Sidebar Component
 * -----------------
 * Displays the sidebar with user conversations, search input, and user info/footer.
 *
 * Exports:
 *   - Sidebar: Renders the sidebar header, filtered conversations, and footer.
 *
 * Props:
 *   - onSelectConversation: Callback to update the selected conversation in Home.
 *   - selectedUserId: The id of the currently selected conversation (for highlighting).
 *   - className: Responsive width classes for layout.
 *
 * State:
 *   - filteredUsers: Array of users filtered by the search term.
 *
 * Functions:
 *   - handleSearch(searchTerm)
 *     - Filters users by name based on the search term.
 *     - Updates filteredUsers state.
 *
 *   - useEffect (initialization)
 *     - Sets filteredUsers to allUsers on mount.
 *
 * Layout:
 *   - SidebarHeader: Search input and title.
 *   - SidebarConversations: List of user conversations (filtered).
 *   - SidebarFooter: Current user info and menu.
 *
 * Usage:
 *   - Used within the `Home` component to display the list of conversations and user info.
 *   - Receives onSelectConversation and selectedUserId from Home.
 *   - Passes filtered users and selection state to SidebarConversations.
 *   - Responsive and styled for glassmorphism chat UI.
 */

import { useState, useEffect } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarConversations from "./SidebarConversations";
import SidebarFooter from "./SidebarFooter";

const Sidebar = ({ className = "w-1/4" }) => {
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Sample data - replace with actual API call
    const allUsers = [
        {
            id: 1,
            name: "Sarah Johnson",
            lastMessage: "Let's meet tomorrow",
            unreadCount: 2,
            isOnline: true,
        },
        {
            id: 2,
            name: "Mike Chen",
            lastMessage: "Thanks for your help!",
            unreadCount: 0,
            isOnline: true,
        },
        {
            id: 3,
            name: "Jessica Williams",
            lastMessage: "Did you see the new movie?",
            unreadCount: 1,
            isOnline: true,
        },
        {
            id: 4,
            name: "David Brown",
            lastMessage: "I'll send you the docs later",
            unreadCount: 0,
            isOnline: true,
        },
        {
            id: 5,
            name: "Emma Davis",
            lastMessage: "How was your weekend?",
            unreadCount: 0,
            isOnline: true,
        },
    ];

    // Handle search
    const handleSearch = (searchTerm) => {
        if (searchTerm.trim() === "") {
            setFilteredUsers(allUsers);
        } else {
            const filtered = allUsers.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    // Initialize filtered users with all users
    useEffect(() => {
        setFilteredUsers(allUsers);
    }, []);

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

// Default Sidebar
// const Sidebar = ({
//     onSelectConversation,
//     selectedUserId,
//     className = "w-1/4",
// }) => {
//     // Sample data - replace with actual API call
//     const users = [1, 2, 3, 4, 5];

//     return (
//         <div
//             className={`${className} bg-white/10 backdrop-blur-md border-r border-white/10`}
//         >
//             <div className="p-4 border-b border-white/10">
//                 <h2 className="text-xl font-semibold text-white">Chats</h2>
//             </div>
//             <div className="overflow-auto h-[calc(100%-65px)]">
//                 <div className="flex flex-col gap-1 p-2">
//                     {users.map((user) => {
//                         const isSelected = selectedUserId === user;

//                         return (
//                             <div
//                                 key={user}
//                                 className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
//                                     ${
//                                         isSelected
//                                             ? "border-white/30 shadow-md"
//                                             : "hover:bg-white/5"
//                                     }`}
//                                 onClick={() => onSelectConversation(user)}
//                             >
//                                 <div className="avatar">
//                                     <div
//                                         className={`w-12 rounded-full ${
//                                             isSelected
//                                                 ? "ring ring-white/40 ring-offset-1 ring-offset-transparent"
//                                                 : "bg-white/20"
//                                         }`}
//                                     >
//                                         <img
//                                             src={`https://robohash.org/user${user}.png`}
//                                             alt={`User ${user} avatar`}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="flex-1">
//                                     <h3
//                                         className={`font-medium ${
//                                             isSelected
//                                                 ? "text-white"
//                                                 : "text-white"
//                                         }`}
//                                     >
//                                         User {user}
//                                     </h3>
//                                     <p
//                                         className={`text-sm ${
//                                             isSelected
//                                                 ? "text-white/80"
//                                                 : "text-white/60"
//                                         }`}
//                                     >
//                                         Last message...
//                                     </p>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;
