/**
 * Toast Configuration
 * -------------------
 * Provides centralized configuration and utility functions for displaying toast notifications.
 *
 * Exports:
 *   - TOAST_STYLE: Default styling for toast notifications.
 *   - showToast: Object containing methods for displaying success, error, and loading toasts.
 *   - dismissToast: Function to dismiss a specific toast by its ID.
 *
 * TOAST_STYLE:
 *   - style: Defines the appearance of the toast notifications.
 *       - borderRadius: Rounded corners for the toast container.
 *       - background: Background color of the toast.
 *       - color: Text color of the toast.
 *   - duration: Default duration (in milliseconds) for which the toast is displayed (default: 4000ms).
 *
 * showToast:
 *   - success(message):
 *       - Displays a success toast with the provided message.
 *   - error(message):
 *       - Displays an error toast with the provided message.
 *   - loading(message):
 *       - Displays a loading toast with the provided message.
 *
 * dismissToast:
 *   - dismissToast(id):
 *       - Dismisses a specific toast notification by its ID.
 *
 * Usage:
 *   - Used throughout the application to provide user feedback for various actions.
 *   - Example in `Home.jsx`:
 *       import { showToast } from "../../utils/toastConfig";
 *       showToast.success("Welcome to the chat!");
 *
 * Example:
 *   - Displaying a success toast:
 *       showToast.success("Message sent successfully!");
 *
 *   - Displaying an error toast:
 *       showToast.error("Failed to send the message.");
 *
 *   - Displaying a loading toast:
 *       const toastId = showToast.loading("Sending message...");
 *       // Later, dismiss the toast
 *       dismissToast(toastId);
 *
 * Related Components:
 *   - Referenced in `Home.jsx` for providing feedback during user interactions.
 */

import toast from "react-hot-toast";

export const TOAST_STYLE = {
    style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
    },
    duration: 4000,
};

export const showToast = {
    success: (message) => toast.success(message, TOAST_STYLE),
    error: (message) => toast.error(message, TOAST_STYLE),
    loading: (message) => toast.loading(message, TOAST_STYLE),
};

export const dismissToast = (id) => toast.dismiss(id);
