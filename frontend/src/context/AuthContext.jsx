/**
 * AuthContext
 * -----------
 * Provides a global context for managing authentication-related state and functions.
 *
 * Exports:
 *   - AuthContext: The React context object for authentication.
 *   - AuthProvider: A provider component that wraps the application and supplies authentication-related state and functions.
 *   - useAuthContext: A custom hook to access the authentication context.
 *
 * State:
 *   - authUser: Stores the currently authenticated user's data (retrieved from localStorage or set during login/signup).
 *
 * Functions:
 *   - setAuthUser(user): Updates the `authUser` state with the provided user data.
 *
 * Context Value:
 *   - authUser: The currently authenticated user's data.
 *   - setAuthUser: Function to update the `authUser` state.
 *
 * Error Handling:
 *   - Throws an error if `useAuthContext` is used outside of an `AuthProvider`.
 *
 * Usage:
 *   - Wrap the application with the `AuthProvider` in `App.jsx` to provide global authentication state.
 *   - Use the `useAuthContext` hook in child components to access or update authentication state.
 *
 * Example:
 *   - Wrapping the app in `App.jsx`:
 *       <AuthProvider>
 *           <Home />
 *       </AuthProvider>
 *
 *   - Accessing context in a component:
 *       const { authUser, setAuthUser } = useAuthContext();
 *       console.log(authUser);
 *
 * Related Components:
 *   - Referenced in `Home.jsx` for managing user authentication state.
 */

import { createContext, useState, useContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(
        localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user"))
            : null
    );

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};
