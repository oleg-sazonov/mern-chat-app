/**
 * useOnlineStatus Hook
 * ---------------------
 * Custom hook to check if a user is online based on the `onlineUsers` state from the `SocketContext`.
 *
 * Exports:
 *   - useOnlineStatus: A function that determines whether a specific user is currently online.
 *
 * Parameters:
 *   - userId (string | number): The ID of the user to check online status for.
 *
 * Returns:
 *   - (boolean): `true` if the user is online, otherwise `false`.
 *
 * Behavior:
 *   - Accesses the `onlineUsers` array from the `SocketContext`.
 *   - Converts the `onlineUsers` array into a `Set` for fast lookups.
 *   - Normalizes both `userId` and `onlineUsers` to strings to ensure consistent comparisons.
 *   - Memoizes the `Set` to avoid unnecessary re-computations when `onlineUsers` changes.
 *   - Returns `false` if:
 *       - `userId` is not provided.
 *       - `onlineUsers` is not an array.
 *       - The user ID is not found in the `onlineUsers` array.
 *
 * Usage:
 *   - Import and use this hook in components to determine a user's online status.
 *
 * Example:
 *   - Checking if a user is online:
 *       const isOnline = useOnlineStatus("userId123");
 *       console.log(isOnline); // true or false
 *
 * Dependencies:
 *   - `useSocketContext`: Provides access to the `SocketContext` for retrieving the `onlineUsers` state.
 *   - `useMemo`: Optimizes performance by memoizing the result.
 */

import { useMemo } from "react";
import { useSocketContext } from "../../store/SocketContext";

export const useOnlineStatus = (userId) => {
    const { onlineUsers } = useSocketContext();

    // Build a Set for fast lookups and normalize to strings
    const onlineSet = useMemo(
        () => new Set((onlineUsers || []).map(String)),
        [onlineUsers]
    );

    const userIdStr = userId != null ? String(userId) : "";

    return userIdStr ? onlineSet.has(userIdStr) : false;
};

export default useOnlineStatus;
