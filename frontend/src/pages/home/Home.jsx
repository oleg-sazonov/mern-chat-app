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
 *   - Outer container centers content and applies responsive padding.
 *   - Inner container uses responsive height/width, glassmorphism styles, and rounded corners.
 *   - Renders Sidebar and MessageContainer side-by-side on desktop.
 *   - Renders either Sidebar or MessageContainer on mobile, depending on selection.
 *
 * Conditional Rendering:
 *   - If mobile and a conversation is selected: shows MessageContainer with back button.
 *   - If mobile and no conversation is selected: shows Sidebar.
 *   - If desktop: shows both Sidebar and MessageContainer with responsive widths.
 *
 * Components:
 *   - Sidebar: Displays the list of conversations and user info.
 *   - MessageContainer: Displays the selected conversation's messages and input area.
 *   - ConversationView: Helper component for mobile view to toggle between Sidebar and MessageContainer.
 *
 * Usage:
 *   - This component is rendered in `App.jsx` and serves as the main chat interface.
 *   - Manages responsive layout and conversation state using the ConversationProvider.
 */

import { useEffect } from "react";
import { useConversation } from "../../hooks/useConversation";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messageContainer/MessageContainer";

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
        <div className="flex flex-col items-center justify-center w-full px-3 md:px-4 lg:px-6">
            <div
                className="flex h-[85vh] md:h-[90vh] lg:h-[85vh] xl:h-[80vh] 
                      max-h-[950px] min-h-[550px] rounded-lg overflow-hidden 
                      w-full max-w-[1600px] mx-auto
                      shadow-2xl bg-white/5 backdrop-blur-md border border-white/10"
            >
                {/* On mobile: show sidebar or conversation based on selection */}
                {isMobile ? (
                    <>
                        <ConversationView />
                    </>
                ) : (
                    <>
                        {/* Desktop layout with responsive widths */}
                        <Sidebar className="w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/5" />
                        <MessageContainer className="w-3/4 md:w-2/3 lg:w-3/4 xl:w-4/5" />
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
