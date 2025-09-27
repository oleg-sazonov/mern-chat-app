/**
 * useConversationsHydration Hook
 * ------------------------------
 * Ensures that conversations are "hydrated" with complete participant data.
 *
 * What is Hydration?
 * -------------------
 * In the context of this hook, "hydration" refers to the process of ensuring that all conversations
 * have complete and accurate participant data. This is necessary because conversations may initially
 * arrive with incomplete data (e.g., only participant IDs) due to performance optimizations or partial
 * updates from the server (e.g., via WebSocket events). Hydration ensures that the UI has all the
 * necessary information (e.g., full names, usernames, profile pictures) to render conversations correctly.
 *
 * Why Use Hydration?
 * -------------------
 * - Prevents UI issues caused by missing or incomplete participant data (e.g., blank names or avatars).
 * - Ensures a consistent user experience by fetching the latest and most accurate data.
 * - Handles cases where conversations are created dynamically (e.g., via WebSocket events) but lack
 *   full participant details.
 *
 * Exports:
 *   - useConversationsHydration: Checks for incomplete participant data in conversations and triggers a refresh if needed.
 *
 * Parameters:
 *   - conversations (array): The list of conversations to check for hydration.
 *   - refreshConversations (function): A function to fetch and refresh the conversations.
 *
 * Behavior:
 *   - Skips hydration if:
 *       - `conversations` is not an array or is empty.
 *       - Hydration has already been performed (tracked via `didHydrateRef`).
 *   - Checks each conversation for:
 *       - Missing or empty `participants` array.
 *       - Participants with missing `_id`, `fullName`, or `username`.
 *   - If any conversation needs hydration, calls `refreshConversations` and prevents duplicate hydration using `didHydrateRef`.
 *
 * Usage:
 *   - Used in components like `SidebarConversations` to ensure conversations have complete participant data.
 *
 * Example:
 *   import { useConversationsHydration } from "../../hooks/conversation/useConversationsHydration";
 *
 *   useConversationsHydration(conversations, refreshConversations);
 */

import { useEffect, useRef } from "react";

export const useConversationsHydration = (
    conversations,
    refreshConversations
) => {
    const didHydrateRef = useRef(false);

    useEffect(() => {
        if (!Array.isArray(conversations) || conversations.length === 0) return;
        if (didHydrateRef.current) return;

        const needsHydration = conversations.some(
            (c) =>
                !Array.isArray(c.participants) ||
                c.participants.length === 0 ||
                c.participants.some(
                    (p) =>
                        !p ||
                        typeof p === "string" ||
                        !p._id ||
                        (!p.fullName && !p.username)
                )
        );

        if (needsHydration) {
            didHydrateRef.current = true;
            refreshConversations();
        }
    }, [conversations, refreshConversations]);
};
