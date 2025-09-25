/**
 * useResponsiveBreakpoint Hook
 * ----------------------------
 * A custom hook to dynamically update the `isMobile` state based on the viewport width.
 *
 * Exports:
 *   - useResponsiveBreakpoint: Automatically sets the `isMobile` state in the Zustand store.
 *
 * Behavior:
 *   - Adds a `resize` event listener to the window to monitor viewport width changes.
 *   - Updates the `isMobile` state to `true` if the viewport width is less than 768px, otherwise `false`.
 *   - Cleans up the event listener when the component using the hook unmounts.
 *
 * Dependencies:
 *   - `useConversation`: Zustand store hook for managing conversation-related state.
 *
 * Usage:
 *   - Import and use this hook in components to ensure the `isMobile` state is updated dynamically.
 *
 * Example:
 *   - Used in `useConversationStore` to manage responsive layout:
 *       import { useResponsiveBreakpoint } from "../ui/useResponsiveBreakpoint";
 *       useResponsiveBreakpoint();
 *
 * Returns:
 *   - None (side-effect only).
 */

import { useEffect } from "react";
import useConversation from "../../store/zustand/useConversation";

export const useResponsiveBreakpoint = () => {
    const { setIsMobile } = useConversation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setIsMobile]);
};
