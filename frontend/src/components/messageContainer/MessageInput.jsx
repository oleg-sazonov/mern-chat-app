/**
 * MessageInput Component
 * ----------------------
 * Renders the message text field and send button.
 *
 * Exports:
 *   - MessageInput: Controlled input used in the chat composer.
 *
 * Props:
 *   - message (string): Current input value.
 *   - onChange (function): Change handler for the input (receives event).
 *   - onSubmit (function): Submit handler for the form (receives event).
 *   - isDisabled (boolean): Disables input and button when true.
 *
 * Behavior:
 *   - Submits on form submit (Enter).
 *   - Disables the send button when the input is empty or isDisabled is true.
 *
 * Usage:
 *   <MessageInput
 *     message={message}
 *     onChange={handleMessageChange}
 *     onSubmit={handleSubmit}
 *     isDisabled={!receiverData || loading}
 *   />
 */

const MessageInput = ({ message, onChange, onSubmit, isDisabled }) => (
    <div className="p-4 border-t border-white/10">
        <form className="flex gap-2" onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="Type a message..."
                className="input input-bordered flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors"
                value={message}
                onChange={onChange}
                disabled={isDisabled}
            />
            <button
                type="submit"
                className="btn bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm transition-all duration-200"
                disabled={!message.trim() || isDisabled}
            >
                Send
            </button>
        </form>
    </div>
);

export default MessageInput;
