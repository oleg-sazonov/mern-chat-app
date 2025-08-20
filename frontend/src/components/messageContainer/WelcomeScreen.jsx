/**
 * WelcomeScreen Component
 * -----------------------
 * Displays a welcome message when no conversation is selected.
 *
 * Layout:
 *   - Centered content with a welcoming icon, title, and description.
 *   - Encourages the user to select a conversation or discover new friends.
 *
 * Usage:
 *   - Used within the `MessageContainer` component to display a placeholder when no conversation is selected.
 *   - Responsive and styled for glassmorphism chat UI.
 */

const WelcomeScreen = () => (
    <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-white/70">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">
                Welcome to MERN Chat App
            </h3>
            <p className="max-w-xs mx-auto">
                Select a conversation to start messaging or discover new friends
            </p>
        </div>
    </div>
);

export default WelcomeScreen;
