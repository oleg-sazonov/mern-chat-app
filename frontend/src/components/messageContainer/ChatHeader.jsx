/**
 * ChatHeader Component
 * --------------------
 * Displays the header for the chat interface, including the conversation's avatar, name, and online status.
 *
 * Exports:
 *   - ChatHeader: Renders the chat header with back navigation for mobile.
 *
 * Props:
 *   - conversation: The selected conversation object containing details like name and online status.
 *   - avatarUrl: The URL of the avatar image for the conversation.
 *   - isMobile: Boolean indicating if the viewport is mobile-sized (<768px).
 *   - onBackClick: Callback function to handle back navigation (used for mobile view).
 *
 * Layout:
 *   - Back Button: Displays a back button for mobile view to navigate back to the sidebar.
 *   - Avatar: Shows the conversation's avatar image.
 *   - Conversation Info: Displays the conversation's name and online status.
 *
 * Usage:
 *   - Used within the `MessageContainer` component to display the header for the selected conversation.
 *   - Responsive and styled for glassmorphism chat UI.
 */

const ChatHeader = ({ conversation, avatarUrl, isMobile, onBackClick }) => (
    <div className="p-4 border-b border-white/10 flex items-center gap-3">
        {isMobile && (
            <button
                onClick={onBackClick}
                className="btn btn-circle btn-sm bg-white/10 border-white/20 text-white"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                    />
                </svg>
            </button>
        )}
        <div className="avatar">
            <div className="w-10 rounded-full bg-white/20">
                <img src={avatarUrl} alt={`${conversation.name}'s avatar`} />
            </div>
        </div>
        <div className="flex-1">
            <h3 className="text-white font-medium">{conversation.name}</h3>
            <p className="text-white/60 text-xs">
                {conversation.isOnline ? "Online" : "Offline"}
            </p>
        </div>
    </div>
);

export default ChatHeader;
