/**
 * SidebarFooter Component
 * ----------------------
 * Displays the current user's avatar, online status, and a dropdown menu in the sidebar.
 *
 * Exports:
 *   - SidebarFooter: Renders the user info and menu at the bottom of the sidebar.
 *
 * Layout:
 *   - Avatar: Shows the user's profile picture.
 *   - User Info: Displays the user's name ("You") and online status.
 *   - Dropdown Menu: Provides quick access to Profile, Settings, and Logout actions.
 *
 * Props:
 *   - None
 *
 * Context:
 *   - useLogout: Provides the `handleLogout` function and `loading` state for managing user logout functionality.
 *
 * Functions:
 *   - handleLogout: Triggered when the "Logout" option is clicked. Logs the user out and updates the authentication state.
 *
 * Usage:
 *   - Used at the bottom of the Sidebar for persistent user info and actions.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `Home.jsx` as part of the Sidebar component:
 *       <SidebarFooter />
 *
 * Related Components:
 *   - Referenced in `Home.jsx` to manage user authentication state and logout functionality.
 */

import useLogout from "../../hooks/auth/useLogout";

const SidebarFooter = () => {
    const { loading, handleLogout } = useLogout();
    return (
        <div className="mt-auto border-t border-white/10 p-4 flex items-center">
            <div className="avatar">
                <div className="w-10 rounded-full bg-white/10">
                    <img src="https://robohash.org/me.png" alt="Your avatar" />
                </div>
            </div>
            <div className="ml-3 flex-1">
                <p className="text-white font-medium">You</p>
                <p className="text-white/60 text-xs">Online</p>
            </div>
            <div className="dropdown dropdown-top dropdown-end">
                <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-circle btn-sm bg-white/10 border-white/20 text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-box w-40"
                >
                    <li>
                        <a className="text-white hover:bg-white/10">Profile</a>
                    </li>
                    <li>
                        <a className="text-white hover:bg-white/10">Settings</a>
                    </li>
                    <li>
                        {loading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <a
                                className="text-white hover:bg-white/10"
                                onClick={handleLogout}
                                disabled={loading}
                            >
                                Logout
                            </a>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SidebarFooter;
