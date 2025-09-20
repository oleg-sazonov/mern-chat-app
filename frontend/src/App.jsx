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
 *   - Wraps the application with the AuthProvider to provide global authentication state.
 *   - Wraps the application with the SocketContextProvider to provide real-time communication state.
 *   - Uses AnimatePresence from Framer Motion to enable smooth page transitions.
 *   - Renders the Home component as the default page.
 *   - Includes Login and SignUp components for authentication routes.
 *   - Displays toast notifications using the Toaster component from react-hot-toast.
 *
 * Components:
 *   - AuthProvider: Provides authentication-related state and functions to the app.
 *   - SocketContextProvider: Provides real-time communication state and functions to the app.
 *   - AnimatePresence: Enables animations for route transitions.
 *   - Routes: Defines the application's routing structure.
 *   - Home: The main chat interface.
 *   - Login: The login page for user authentication.
 *   - SignUp: The signup page for new user registration.
 *   - Toaster: Displays toast notifications with a dark theme.
 *   - ProtectedRoute: Protects routes that require authentication, redirecting to the login page if the user is not authenticated.
 *   - PublicRoute: Protects routes that should only be accessible to unauthenticated users, redirecting to the home page if the user is authenticated.
 *
 * Usage:
 *   - This component is rendered in `frontend/src/main.jsx` and serves as the root of the React app.
 *   - Provides global state for authentication and real-time communication using the AuthProvider and SocketContextProvider.
 *
 * Example:
 *   - Rendered in `main.jsx`:
 *       <App />
 *
 * ProtectedRoute Component
 * -------------------------
 * Protects routes that require authentication.
 *
 * Props:
 *   - children: The component(s) to render if the user is authenticated.
 *
 * Behavior:
 *   - If the user is authenticated (`authUser` exists), renders the children.
 *   - If the user is not authenticated, redirects to the `/login` page.
 *
 * PublicRoute Component
 * ----------------------
 * Protects routes that should only be accessible to unauthenticated users.
 *
 * Props:
 *   - children: The component(s) to render if the user is not authenticated.
 *
 * Behavior:
 *   - If the user is not authenticated (`authUser` does not exist), renders the children.
 *   - If the user is authenticated, redirects to the `/` (home) page.
 */

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./store/AuthContext";
import { SocketContextProvider } from "./store/SocketContext";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

import { Toaster } from "react-hot-toast";
import { TOAST_STYLE } from "./utils/toastConfig";
import { useAuthContext } from "./store/AuthContext";

// Main App component - only sets up providers
function App() {
    return (
        <AuthProvider>
            <SocketContextProvider>
                <AppContent />
            </SocketContextProvider>
        </AuthProvider>
    );
}

// Secondary component that uses the context
function AppContent() {
    const location = useLocation();

    return (
        <div className="p-4 h-screen flex items-center justify-center">
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <SignUp />
                            </PublicRoute>
                        }
                    />
                </Routes>
                <Toaster position="top-center" toastOptions={TOAST_STYLE} />
            </AnimatePresence>
        </div>
    );
}

// Protected route - redirects to login if not authenticated
function ProtectedRoute({ children }) {
    const { authUser } = useAuthContext();
    return authUser ? children : <Navigate to="/login" />;
}

// Public route - redirects to home if already authenticated
function PublicRoute({ children }) {
    const { authUser } = useAuthContext();
    return authUser ? <Navigate to="/" /> : children;
}

export default App;
