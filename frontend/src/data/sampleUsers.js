/**
 * Sample User Data
 * ---------------
 * Provides mock user data for the chat application UI.
 *
 * This data is used for development and demonstration purposes.
 * In a production environment, this would be replaced with API calls.
 */

const generateSampleUsers = () => [
    {
        id: 1,
        name: "Sarah Johnson",
        lastMessage: "Let's meet tomorrow",
        unreadCount: 2,
        isOnline: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
        id: 2,
        name: "Mike Chen",
        lastMessage: "Thanks for your help!",
        unreadCount: 0,
        isOnline: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: 3,
        name: "Jessica Williams",
        lastMessage: "Did you see the new movie?",
        unreadCount: 1,
        isOnline: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    },
    {
        id: 4,
        name: "David Brown",
        lastMessage: "I'll send you the docs later",
        unreadCount: 0,
        isOnline: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: 5,
        name: "Emma Davis",
        lastMessage: "How was your weekend?",
        unreadCount: 0,
        isOnline: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
];

export default generateSampleUsers;
