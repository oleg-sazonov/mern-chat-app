/**
 * SidebarFooter Component
 * ----------------------
 * Displays the current user's avatar, username, and a dropdown menu in the sidebar.
 *
 * Exports:
 *   - SidebarFooter: Renders the user info and menu at the bottom of the sidebar.
 *
 * Context:
 *   - useLogout: Provides the `handleLogout` function and `loading` state for managing user logout functionality.
 *   - useAuthContext: Provides the current authenticated user's basic data.
 *   - useCurrentUser: Fetches the current authenticated user's complete profile.
 *
 * State:
 *   - userLoading: Indicates whether the user's profile data is being loaded.
 *   - logoutLoading: Indicates whether the logout process is in progress.
 *
 * Layout:
 *   - Avatar: Displays the user's profile picture or a placeholder if unavailable.
 *   - User Info: Shows the user's full name (or username as a fallback).
 *   - Dropdown Menu: Provides options for Profile, Settings, and Logout.
 *
 * Functions:
 *   - handleLogout: Logs the user out and clears authentication state.
 *
 * Usage:
 *   - Used at the bottom of the Sidebar for persistent user info and actions.
 *   - Responsive and styled for glassmorphism chat UI.
 *
 * Example:
 *   - Rendered in `Sidebar.jsx`:
 *       <SidebarFooter />
 */

import useLogout from "../../hooks/auth/useLogout";
import { useAuthContext } from "../../store/AuthContext";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";

const SidebarFooter = () => {
    const { loading: logoutLoading, handleLogout } = useLogout();
    const { currentUser, loading: userLoading } = useCurrentUser();
    const { authUser } = useAuthContext();

    // Use the full user data if available, otherwise fall back to authUser
    const userData = currentUser || authUser || {};

    // Get display name (prefer fullName, fall back to username)
    const displayName = userData.fullName || userData.username || "You";

    // Get avatar URL
    const avatarUrl =
        userData.profilePicture ||
        (userData.username
            ? `https://robohash.org/${userData.username}.png`
            : "https://robohash.org/me.png");

    return (
        <div className="mt-auto border-t border-white/10 p-4 flex items-center">
            <div className="avatar">
                <div className="w-10 rounded-full bg-white/10">
                    {userLoading ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <span className="loading loading-spinner loading-xs"></span>
                        </div>
                    ) : (
                        <img
                            src={avatarUrl}
                            alt={`${displayName}'s avatar`}
                            className="transition-opacity duration-150 ease-in-out hover:opacity-95"
                            loading="lazy"
                        />
                    )}
                </div>
            </div>
            <div className="ml-3 flex-1 truncate">
                <p
                    className="text-white font-medium truncate"
                    title={displayName}
                >
                    {userLoading ? "Loading..." : displayName}
                </p>
                {userData.username && !userLoading && (
                    <p className="text-white/60 text-xs">
                        @{userData.username}
                    </p>
                )}
            </div>
            {/* <div className="dropdown dropdown-top dropdown-end">
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
                        {logoutLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <button
                                className="text-white hover:bg-white/10 w-full text-left"
                                onClick={handleLogout}
                                disabled={logoutLoading}
                            >
                                Logout
                            </button>
                        )}
                    </li>
                </ul>
            </div> */}
            <div className="ml-auto">
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    aria-label="Logout"
                    title="Logout"
                    className="btn btn-circle btn-sm bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                    {logoutLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M10 17l5-5-5-5" />
                            <path d="M15 12H3" />
                            <path d="M21 19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SidebarFooter;
