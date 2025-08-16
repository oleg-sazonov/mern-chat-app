/**
 * Home Component
 * --------------
 * Main layout and state manager for the chat application's frontend.
 *
 * Exports:
 *   - Home: Renders the chat interface with responsive sidebar and message container.
 *
 * State:
 *   - selectedConversation: Stores the currently selected conversation object (or null if none selected).
 *   - isMobile: Boolean indicating if the viewport is mobile-sized (<768px).
 *
 * Functions:
 *   - handleSelectConversation(conversation)
 *     - Sets the selectedConversation state to the chosen conversation object.
 *     - Used as a callback for Sidebar to update the current chat.
 *
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
 * Props Passed:
 *   - Sidebar:
 *       - onSelectConversation: callback to update selectedConversation.
 *       - selectedUserId: id of the selected conversation (for highlighting).
 *       - className: responsive width classes.
 *   - MessageContainer:
 *       - selectedConversation: the selected conversation object.
 *       - onBackClick: callback to clear selection (mobile only).
 *       - className: responsive width classes.
 *
 * Usage:
 *   - Centralizes chat state and layout logic.
 *   - Ensures a seamless, responsive chat experience across devices.
 */

import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messageContainer/MessageContainer";

const Home = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Handle conversation selection
    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
    };

    // Handle responsive layout changes
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full px-3 md:px-4 lg:px-6">
            <div
                className="flex h-[85vh] md:h-[90vh] lg:h-[85vh] xl:h-[80vh] 
                      max-h-[950px] min-h-[550px] rounded-lg overflow-hidden 
                      w-full max-w-[1600px] mx-auto
                      shadow-2xl bg-white/5 backdrop-blur-md border border-white/10"
            >
                {/* On mobile: show sidebar or conversation based on selection */}
                {isMobile && selectedConversation ? (
                    <MessageContainer
                        selectedConversation={selectedConversation}
                        onBackClick={() => setSelectedConversation(null)}
                    />
                ) : isMobile ? (
                    <Sidebar
                        onSelectConversation={handleSelectConversation}
                        selectedUserId={selectedConversation?.id}
                        className="w-full"
                    />
                ) : (
                    <>
                        {/* Desktop layout with responsive widths */}
                        <Sidebar
                            onSelectConversation={handleSelectConversation}
                            selectedUserId={selectedConversation?.id}
                            className="w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/5"
                        />
                        <MessageContainer
                            selectedConversation={selectedConversation}
                            className="w-3/4 md:w-2/3 lg:w-3/4 xl:w-4/5"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
