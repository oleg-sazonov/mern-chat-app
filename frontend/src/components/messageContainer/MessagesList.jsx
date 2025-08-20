/**
 * MessagesList Component
 * ----------------------
 * Displays the list of chat messages for the selected conversation.
 *
 * Props:
 *   - conversation: The selected conversation object containing details like id and lastMessage.
 *
 * Layout:
 *   - Chat Bubbles:
 *       - Alternates between "chat-start" (messages from the other user) and "chat-end" (messages from the current user).
 *       - Includes avatar, message content, and timestamp.
 *   - Sample Messages:
 *       - Displays placeholder messages for demonstration purposes.
 *       - Uses the conversation's `id` and `lastMessage` for dynamic content.
 *
 * Usage:
 *   - Used within the `MessageContainer` component to display the messages of the selected conversation.
 *   - Responsive and styled for glassmorphism chat UI.
 */

const MessagesList = ({ conversation }) => (
    <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Sample messages - replace with actual data */}
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-8 rounded-full bg-white/10">
                    <img
                        src={`https://robohash.org/user${conversation.id}.png`}
                        alt="User avatar"
                    />
                </div>
            </div>
            <div className="chat-bubble bg-white/10 text-white">
                Hi there! How are you doing?
            </div>
            <div className="chat-footer text-white/40 text-xs mt-1">
                10:32 AM
            </div>
        </div>
        <div className="chat chat-end">
            <div className="chat-image avatar">
                <div className="w-8 rounded-full bg-white/10">
                    <img src="https://robohash.org/me.png" alt="My avatar" />
                </div>
            </div>
            <div className="chat-bubble bg-white/20 text-white">
                I'm good, thanks for asking! How about you?
            </div>
            <div className="chat-footer text-white/40 text-xs mt-1">
                10:35 AM
            </div>
        </div>
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-8 rounded-full bg-white/10">
                    <img
                        src={`https://robohash.org/user${conversation.id}.png`}
                        alt="User avatar"
                    />
                </div>
            </div>
            <div className="chat-bubble bg-white/10 text-white">
                {conversation?.lastMessage || "No message yet"}
            </div>
            <div className="chat-footer text-white/40 text-xs mt-1">
                10:36 AM
            </div>
        </div>
    </div>
);

export default MessagesList;
