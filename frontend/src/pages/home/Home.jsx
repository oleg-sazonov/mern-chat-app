import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messageContainer/MessageContainer";

const Home = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
                        onSelectConversation={setSelectedConversation}
                        selectedUserId={selectedConversation}
                        className="w-full"
                    />
                ) : (
                    <>
                        {/* Desktop layout with responsive widths */}
                        <Sidebar
                            onSelectConversation={setSelectedConversation}
                            selectedUserId={selectedConversation}
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
