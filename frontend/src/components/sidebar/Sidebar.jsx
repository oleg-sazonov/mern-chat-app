const Sidebar = ({
    onSelectConversation,
    selectedUserId,
    className = "w-1/4",
}) => {
    // Sample data - replace with actual API call
    const users = [1, 2, 3, 4, 5];

    return (
        <div
            className={`${className} bg-white/10 backdrop-blur-md border-r border-white/10`}
        >
            <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Chats</h2>
            </div>
            <div className="overflow-auto h-[calc(100%-65px)]">
                <div className="flex flex-col gap-1 p-2">
                    {users.map((user) => {
                        const isSelected = selectedUserId === user;

                        return (
                            <div
                                key={user}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
                                    ${
                                        isSelected
                                            ? "border-white/30 shadow-md"
                                            : "hover:bg-white/5"
                                    }`}
                                onClick={() => onSelectConversation(user)}
                            >
                                <div className="avatar">
                                    <div
                                        className={`w-12 rounded-full ${
                                            isSelected
                                                ? "ring ring-white/40 ring-offset-1 ring-offset-transparent"
                                                : "bg-white/20"
                                        }`}
                                    >
                                        <img
                                            src={`https://robohash.org/user${user}.png`}
                                            alt={`User ${user} avatar`}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3
                                        className={`font-medium ${
                                            isSelected
                                                ? "text-white"
                                                : "text-white"
                                        }`}
                                    >
                                        User {user}
                                    </h3>
                                    <p
                                        className={`text-sm ${
                                            isSelected
                                                ? "text-white/80"
                                                : "text-white/60"
                                        }`}
                                    >
                                        Last message...
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
