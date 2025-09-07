/**
 * Date and Time Utility Functions
 * -------------------------------
 * Helper functions for formatting and working with dates and times in the chat application.
 *
 * Exports:
 *   - formatMessageTime: Formats a timestamp into a readable format (e.g., "12:30" for today, "Jan 5" for past dates).
 *   - getRelativeTime: Returns "Now" for recent timestamps or the formatted time for older timestamps.
 *   - formatJoinDate: Formats a user's join date into a readable format (e.g., "Jan 2023").
 *
 * Functions:
 *   - formatMessageTime(timestamp)
 *     - Parameters:
 *         - timestamp (string|number|Date): The timestamp to format.
 *     - Returns:
 *         - A formatted time string:
 *             - "HH:MM" (24-hour format) if the timestamp is today.
 *             - "Yesterday" if the timestamp is from the previous day.
 *             - "MMM DD" if the timestamp is from the current year.
 *             - "MMM DD, YY" if the timestamp is from a previous year.
 *     - Behavior:
 *         - Validates the timestamp and formats it based on its relation to the current date.
 *         - Returns an empty string if the timestamp is invalid.
 *
 *   - getRelativeTime(timestamp, recentSeconds = 60)
 *     - Parameters:
 *         - timestamp (string|number|Date): The timestamp to format.
 *         - recentSeconds (number): The number of seconds to consider as "Now" (default: 60).
 *     - Returns:
 *         - "Now" if the timestamp is within the recentSeconds threshold.
 *         - A formatted time string for older timestamps (uses `formatMessageTime`).
 *     - Behavior:
 *         - Calculates the difference between the current time and the timestamp.
 *         - Returns "Now" for recent timestamps or formats the time for older ones.
 *
 *   - formatJoinDate(timestamp)
 *     - Parameters:
 *         - timestamp (string|number|Date): The timestamp to format.
 *     - Returns:
 *         - A formatted date string:
 *             - "MMM" if the timestamp is from the current year.
 *             - "MMM YYYY" if the timestamp is from a previous year.
 *             - "New" if the timestamp is invalid or not provided.
 *     - Behavior:
 *         - Validates the timestamp and formats it based on its relation to the current year.
 *
 * Usage:
 *   - Import and use these functions to format timestamps in chat messages or UI components.
 *   - Examples:
 *       const formattedTime = formatMessageTime(message.timestamp);
 *       const relativeTime = getRelativeTime(message.timestamp);
 *       const joinDate = formatJoinDate(user.createdAt);
 *
 * Example Outputs:
 *   - formatMessageTime("2023-10-01T12:30:00.000Z") -> "12:30" (if today)
 *   - getRelativeTime("2023-10-01T12:30:00.000Z", 60) -> "Now" (if within 60 seconds)
 *   - formatJoinDate("2023-01-01T00:00:00.000Z") -> "Jan 2023"
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

/**
 * Formats a user's join date into a readable format
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date string (e.g., "Jan 2023")
 */
export const formatJoinDate = (timestamp) => {
    if (!timestamp) return "New";

    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) return "New";

    const now = new Date();
    const isThisYear = date.getFullYear() === now.getFullYear();

    // If joined this year, show just month
    if (isThisYear) {
        return date.toLocaleDateString([], { month: "short" });
    }

    // Otherwise show month and year
    return date.toLocaleDateString([], { month: "short", year: "numeric" });
};
