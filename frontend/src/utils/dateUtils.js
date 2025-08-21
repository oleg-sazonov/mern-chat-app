/**
 * Date and Time Utility Functions
 * -------------------------------
 * Helper functions for formatting and working with dates and times in the chat application.
 *
 * Exports:
 *   - formatMessageTime: Formats a timestamp into a readable format (e.g., "12:30" for today, "Jan 5" for past dates).
 *   - getRelativeTime: Returns "Now" for recent timestamps or the formatted time for older timestamps.
 *
 * Functions:
 *   - formatMessageTime(timestamp)
 *     - Parameters:
 *         - timestamp: The timestamp to format (string, number, or Date object).
 *     - Returns:
 *         - A formatted time string (e.g., "14:30", "Jan 5").
 *     - Behavior:
 *         - If the timestamp is today, formats it as "HH:MM" in 24-hour format.
 *         - If the timestamp is yesterday, returns "Yesterday".
 *         - If the timestamp is within the current year, formats it as "MMM DD".
 *         - Otherwise, formats it as "MMM DD, YY".
 *
 *   - getRelativeTime(timestamp, recentSeconds = 60)
 *     - Parameters:
 *         - timestamp: The timestamp to format (string, number, or Date object).
 *         - recentSeconds: The number of seconds to consider as "Now" (default: 60).
 *     - Returns:
 *         - "Now" for timestamps within the recentSeconds threshold.
 *         - A formatted time string for older timestamps.
 *
 * Usage:
 *   - Import and use these functions to format timestamps in chat messages or UI components.
 *   - Example:
 *       const formattedTime = formatMessageTime(message.timestamp);
 *       const relativeTime = getRelativeTime(message.timestamp);
 */

/**
 * Formats a message timestamp into a readable format
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted time string (e.g., "12:30" for today, "Jan 5" for past dates)
 */
export const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(date.getTime())) return "";

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
        new Date(now - 86400000).toDateString() === date.toDateString();
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (isToday) {
        // Format time as 24-hour format: "14:30" or "09:05"
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // Use 24-hour format
        });
    } else if (isYesterday) {
        return "Yesterday";
    } else if (isThisYear) {
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } else {
        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "2-digit",
        });
    }
};

/**
 * Returns "Now" for recent timestamps or the formatted time
 * @param {string|number|Date} timestamp - The timestamp to format
 * @param {number} recentSeconds - Number of seconds to consider as "now" (default: 60)
 * @returns {string} "Now" for recent messages, otherwise formatted time
 */
export const getRelativeTime = (timestamp, recentSeconds = 60) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < recentSeconds) {
        return "Now";
    }

    return formatMessageTime(timestamp);
};
