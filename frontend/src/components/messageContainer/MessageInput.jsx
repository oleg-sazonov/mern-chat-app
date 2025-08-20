/**
 * MessageInput Component
 * ----------------------
 * Renders the input field and send button for typing and submitting messages.
 *
 * Props:
 *   - message: The current value of the message input field.
 *   - onChange: Callback function to handle changes in the input field.
 *   - onSubmit: Callback function to handle form submission.
 *
 * Layout:
 *   - Input Field: A text input for typing messages.
 *   - Send Button: A button to submit the message, disabled if the input is empty.
 *
 * Usage:
 *   - Used within the `MessageContainer` component to handle message input and submission.
 *   - Responsive and styled for glassmorphism chat UI.
 */

const MessageInput = ({ message, onChange, onSubmit }) => (
    <div className="p-4 border-t border-white/10">
        <form className="flex gap-2" onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="Type a message..."
                className="input input-bordered flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors"
                value={message}
                onChange={onChange}
            />
            <button
                type="submit"
                className="btn bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm transition-all duration-200"
                disabled={!message.trim()}
            >
                Send
            </button>
        </form>
    </div>
);

export default MessageInput;
