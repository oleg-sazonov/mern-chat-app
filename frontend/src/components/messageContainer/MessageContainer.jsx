import { useState } from "react";

const MessageContainer = ({ selectedConversation, onBackClick }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // This would be replaced with actual API call
            console.log(
                "Sending message:",
                message,
                "to:",
                selectedConversation
            );
            setMessage(""); // Clear input after sending
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-md">
            {selectedConversation ? (
                <>
                    {/* Chat header */}
                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                        {onBackClick && (
                            <button
                                onClick={onBackClick}
                                className="btn btn-circle btn-sm bg-white/10 border-white/20 text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                                    />
                                </svg>
                            </button>
                        )}
                        <div className="avatar">
                            <div className="w-10 rounded-full bg-white/20">
                                <img
                                    src={`https://robohash.org/user${selectedConversation}.png`}
                                    alt="avatar"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-medium">
                                User {selectedConversation}
                            </h3>
                            <p className="text-white/60 text-xs">Online</p>
                        </div>
                    </div>

                    {/* Messages container */}
                    <div className="flex-1 overflow-auto p-4 space-y-4">
                        {/* Sample messages - replace with actual data */}
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-8 rounded-full bg-white/10">
                                    <img
                                        src={`https://robohash.org/user${selectedConversation}.png`}
                                        alt="User avatar"
                                    />
                                </div>
                            </div>
                            <div className="chat-bubble bg-white/10 text-white">
                                Hi there! How are you doing?
                            </div>
                            <div className="chat-footer text-white/40 text-xs mt-1">
                                10:32 AM
                            </div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-8 rounded-full bg-white/10">
                                    <img
                                        src="https://robohash.org/me.png"
                                        alt="My avatar"
                                    />
                                </div>
                            </div>
                            <div className="chat-bubble bg-white/20 text-white">
                                I'm good, thanks for asking! How about you?
                            </div>
                            <div className="chat-footer text-white/40 text-xs mt-1">
                                10:35 AM
                            </div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-8 rounded-full bg-white/10">
                                    <img
                                        src={`https://robohash.org/user${selectedConversation}.png`}
                                        alt="User avatar"
                                    />
                                </div>
                            </div>
                            <div className="chat-bubble bg-white/10 text-white">
                                I'm doing well! Just working on a new project.
                                It's a chat app built with the MERN stack.
                            </div>
                            <div className="chat-footer text-white/40 text-xs mt-1">
                                10:36 AM
                            </div>
                        </div>
                    </div>

                    {/* Message input */}
                    <div className="p-4 border-t border-white/10">
                        <form className="flex gap-2" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="input input-bordered flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm transition-all duration-200"
                                disabled={!message.trim()}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-white/70">
                        <div className="text-5xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold mb-2">
                            Welcome to MERN Chat App
                        </h3>
                        <p className="max-w-xs mx-auto">
                            Select a conversation to start messaging or discover
                            new friends
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageContainer;

// Default MessageContainer
// const MessageContainer = ({ selectedConversation }) => {
//     return (
//         <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-md">
//             {selectedConversation ? (
//                 <>
//                     {/* Chat header */}
//                     <div className="p-4 border-b border-white/10 flex items-center gap-2">
//                         <div className="avatar">
//                             <div className="w-10 rounded-full bg-white/20">
//                                 <img
//                                     src={`https://robohash.org/user${selectedConversation}.png`}
//                                     alt="avatar"
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <h3 className="text-white font-medium">
//                                 User {selectedConversation}
//                             </h3>
//                             <p className="text-white/60 text-xs">Online</p>
//                         </div>
//                     </div>

//                     {/* Messages container */}
//                     <div className="flex-1 overflow-auto p-4 space-y-4">
//                         {/* Sample messages - replace with actual data */}
//                         <div className="chat chat-start">
//                             <div className="chat-bubble bg-white/10 text-white">
//                                 Hi there! How are you doing?
//                             </div>
//                         </div>
//                         <div className="chat chat-end">
//                             <div className="chat-bubble bg-white/20 text-white">
//                                 I'm good, thanks for asking! How about you?
//                             </div>
//                         </div>
//                         <div className="chat chat-start">
//                             <div className="chat-bubble bg-white/10 text-white">
//                                 I'm doing well! Just working on a new project.
//                             </div>
//                         </div>
//                     </div>

//                     {/* Message input */}
//                     <div className="p-4 border-t border-white/10">
//                         <form className="flex gap-2">
//                             <input
//                                 type="text"
//                                 placeholder="Type a message..."
//                                 className="input input-bordered flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors"
//                             />
//                             <button
//                                 type="submit"
//                                 className="btn bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm transition-all duration-200"
//                             >
//                                 Send
//                             </button>
//                         </form>
//                     </div>
//                 </>
//             ) : (
//                 <div className="flex-1 flex items-center justify-center">
//                     <div className="text-center text-white/70">
//                         <div className="text-5xl mb-2">👋</div>
//                         <h3 className="text-xl font-semibold mb-1">
//                             Welcome to MERN Chat App
//                         </h3>
//                         <p>Select a conversation to start messaging</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MessageContainer;
