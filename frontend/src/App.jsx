/**
 * App Component
 * -------------
 * The root component of the application. Wraps the entire app with necessary providers and renders the main pages.
 *
 * Exports:
 *   - App: The main entry point for the React application.
 *
 * State:
 *   - location: The current location object from React Router, used for handling route transitions.
 *
 * Layout:
 *   - Wraps the application with the ConversationProvider to provide global state for conversations.
 *   - Uses AnimatePresence from Framer Motion to enable smooth page transitions.
 *   - Renders the Home component as the default page.
 *   - Includes Login and SignUp components for authentication routes.
 *
 * Components:
 *   - ConversationProvider: Provides conversation-related state and functions to the app.
 *   - AnimatePresence: Enables animations for route transitions.
 *   - Routes: Defines the application's routing structure.
 *   - Home: The main chat interface.
 *   - Login: The login page for user authentication.
 *   - SignUp: The signup page for new user registration.
 *
 * Usage:
 *   - This component is rendered in `frontend/src/main.jsx` and serves as the root of the React app.
 *   - Provides global state for conversations using the ConversationProvider.
 *
 * Example:
 *   - Rendered in `main.jsx`:
 *       <App />
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ConversationProvider } from "./context/ConversationContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

function App() {
    const location = useLocation();

    return (
        <ConversationProvider>
            <div className="p-4 h-screen flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </ConversationProvider>
    );
}

export default App;
