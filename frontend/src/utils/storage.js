/**
 * setStorageItem Utility
 * ----------------------
 * A utility function for safely storing items in the browser's localStorage.
 *
 * Exports:
 *   - setStorageItem: Stores a key-value pair in localStorage after serializing the value to JSON.
 *
 * Parameters:
 *   - key (string): The key under which the value will be stored in localStorage.
 *   - value (any): The value to be stored. It will be serialized to a JSON string.
 *
 * Returns:
 *   - (boolean): Returns `true` if the item was successfully stored, otherwise `false`.
 *
 * Error Handling:
 *   - If an error occurs during the storage process (e.g., storage quota exceeded),
 *     it logs the error to the console and returns `false`.
 *
 * Usage:
 *   - This utility is used to store user data, settings, or other application state in localStorage.
 *
 * Example:
 *   - Storing user data:
 *       const user = { id: 1, name: "John Doe" };
 *       const success = setStorageItem("user", user);
 *       if (success) {
 *           console.log("User data saved successfully!");
 *       }
 *
 * Related Components:
 *   - Referenced in `Home.jsx` for managing user session data.
 */

export const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error storing ${key} in localStorage:`, error);
        return false;
    }
};
