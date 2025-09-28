/**
 * NotFound Component
 * ------------------
 * Displays a 404 error page when the user navigates to a non-existent route.
 *
 * Exports:
 *   - NotFound: A functional component that renders the "Page Not Found" UI.
 *
 * Context:
 *   - useAuthContext: Provides access to the authenticated user's state (`authUser`).
 *   - useNavigate: React Router hook for programmatic navigation.
 *
 * Layout:
 *   - PageTransition: Wraps the content with smooth animations for route transitions.
 *   - FormContainer: Provides a styled container with a title and content.
 *   - Buttons/Links:
 *       - Authenticated users:
 *           - "Go Back" button: Navigates to the previous page.
 *           - "Open Chat" link: Redirects to the home page (`/`).
 *       - Unauthenticated users:
 *           - "Login" link: Redirects to the login page (`/login`).
 *           - "Sign Up" link: Redirects to the signup page (`/signup`).
 *
 * Props:
 *   - None.
 *
 * Behavior:
 *   - If the user is authenticated (`authUser` exists):
 *       - Displays "Go Back" and "Open Chat" options.
 *   - If the user is not authenticated:
 *       - Displays "Login" and "Sign Up" options.
 *
 * Styling:
 *   - Uses Tailwind CSS and custom classes for styling buttons and layout.
 *   - Buttons have hover effects and consistent spacing.
 *
 * Usage:
 *   - Used as a fallback route in the application to handle 404 errors.
 *   - Defined in `App.jsx` as:
 *       <Route path="*" element={<NotFound />} />
 *
 * Example:
 *   - Rendered when the user navigates to an undefined route:
 *       <NotFound />
 */

import PageTransition from "../../components/transitions/PageTransition";
import FormContainer from "../../components/form/FormContainer";
import AnimatedLink from "../../components/transitions/AnimatedLink";
import { useAuthContext } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const { authUser } = useAuthContext();
    const navigate = useNavigate();

    return (
        <PageTransition type="auth">
            <div className="flex items-center justify-center min-h-[70vh]">
                <FormContainer title="Page Not Found">
                    <div className="text-center text-white/80 space-y-4">
                        <div className="text-6xl font-bold">404</div>
                        <p>
                            The page you’re looking for doesn’t exist or was
                            moved.
                        </p>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            {authUser ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="btn bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                                        aria-label="Go back"
                                        title="Go back"
                                    >
                                        Go Back
                                    </button>
                                    <AnimatedLink
                                        to="/"
                                        className="btn bg-white/20 hover:bg-white/30 border border-white/30 text-white"
                                    >
                                        Open Chat
                                    </AnimatedLink>
                                </>
                            ) : (
                                <>
                                    <AnimatedLink
                                        to="/login"
                                        className="btn bg-white/20 hover:bg-white/30 border border-white/30 text-white"
                                    >
                                        Login
                                    </AnimatedLink>
                                    <AnimatedLink
                                        to="/signup"
                                        className="btn bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                                    >
                                        Sign Up
                                    </AnimatedLink>
                                </>
                            )}
                        </div>
                    </div>
                </FormContainer>
            </div>
        </PageTransition>
    );
};

export default NotFound;
