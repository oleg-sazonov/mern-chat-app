/**
 * Home Component
 * --------------
 * Main layout and state manager for the chat application's frontend.
 *
 * Exports:
 *   - Home: Renders the chat interface with responsive sidebar and message container.
 *
 * State:
 *   - isMobile: Boolean indicating if the viewport is mobile-sized (<768px).
 *
 * Functions:
 *   - useEffect (responsive layout)
 *     - Adds/removes a window resize event listener.
 *     - Updates isMobile state based on window width.
 *
 * Layout:
 *   - Outer Container: Centers content and applies responsive padding.
 *   - Inner Container: Uses responsive height/width, glassmorphism styles, and rounded corners.
 *   - Desktop View: Renders Sidebar and MessageContainer side-by-side with responsive widths.
 *   - Mobile View: Renders either Sidebar or MessageContainer based on the selected conversation.
 *
 * Components:
 *   - Sidebar: Displays the list of conversations and user info.
 *   - MessageContainer: Displays the selected conversation's messages and input area.
 *   - ConversationView: Helper component for mobile view to toggle between Sidebar and MessageContainer.
 *
 * Usage:
 *   - This component is rendered in `App.jsx` as part of the `/` route.
 *   - Manages responsive layout and conversation state using the ConversationProvider.
 *
 * Example:
 *   - Rendered in `App.jsx`:
 *       <Route path="/" element={<Home />} />
 */

import { useEffect } from "react";
import { useConversation } from "../../context/ConversationContext";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messageContainer/MessageContainer";
import {
    getOuterContainerClass,
    getInnerContainerClass,
    getSidebarClass,
    getMessageContainerClass,
} from "../../styles/HomeStyles";

const Home = () => {
    const { isMobile, setIsMobile } = useConversation();

    // Handle responsive layout changes
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsMobile]);

    return (
        <div className={getOuterContainerClass()}>
            <div className={getInnerContainerClass()}>
                {/* On mobile: show sidebar or conversation based on selection */}
                {isMobile ? (
                    <ConversationView />
                ) : (
                    <>
                        {/* Desktop layout with responsive widths */}
                        <Sidebar className={getSidebarClass()} />
                        <MessageContainer
                            className={getMessageContainerClass()}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// Helper component for mobile view
const ConversationView = () => {
    const { selectedConversation } = useConversation();

    return selectedConversation ? (
        <MessageContainer className="w-full" />
    ) : (
        <Sidebar className="w-full" />
    );
};

export default Home;
