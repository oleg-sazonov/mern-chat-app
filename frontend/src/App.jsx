/**
 * App Component
 * -------------
 * The root component of the application. Wraps the entire app with necessary providers and renders the main pages.
 *
 * Exports:
 *   - App: The main entry point for the React application.
 *
 * Layout:
 *   - Wraps the application with the ConversationProvider to provide global state for conversations.
 *   - Renders the Home component as the default page.
 *   - Includes commented-out Login and SignUp components for potential use.
 *
 * Usage:
 *   - This component is rendered in `frontend/src/main.jsx` and serves as the root of the React app.
 *   - Provides global state for conversations using the ConversationProvider.
 *
 * Components:
 *   - ConversationProvider: Provides conversation-related state and functions to the app.
 *   - Home: The main chat interface.
 *   - Login (commented): Placeholder for the login page.
 *   - SignUp (commented): Placeholder for the signup page.
 *
 * Props Passed:
 *   - None directly, but the ConversationProvider wraps the app to provide context.
 *
 * Example:
 *   - Rendered in `main.jsx`:
 *       <App />
 */

import { ConversationProvider } from "./context/ConversationContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

function App() {
    return (
        <ConversationProvider>
            <div className="p-4 h-screen flex items-center justify-center">
                <Home />
                {/* <Login /> */}
                {/* <SignUp /> */}
            </div>
        </ConversationProvider>
    );
}

export default App;
