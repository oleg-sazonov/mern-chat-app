/**
 * ConversationStyles
 * -----------------
 * Centralized styles for conversation components to ensure consistency
 * and reduce duplication across components.
 *
 * Exports:
 *   - getContainerClass: Returns the container class for conversation items
 *   - getAvatarClass: Returns classes for the avatar component
 *   - getAvatarContainerClass: Returns classes for the avatar container
 *   - getNameClass: Returns classes for user name text
 *   - getMessageClass: Returns classes for message preview text
 *   - getTimeClass: Returns classes for timestamp display
 *   - getBadgeClass: Returns classes for unread count badge
 */

/**
 * Returns the class for the conversation container element
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getContainerClass = (isSelected) => `
  flex items-center gap-3 p-2 rounded-lg cursor-pointer 
  transition-colors duration-150
  ${isSelected ? "bg-white/15" : "hover:bg-white/10"}
`;

/**
 * Returns the class for the avatar component
 * @param {boolean} isOnline - Whether the user is online
 */
export const getAvatarClass = (isOnline) => `
  avatar ${isOnline ? "avatar-online" : ""}
`;

/**
 * Returns the class for the avatar container
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getAvatarContainerClass = (isSelected) => `
  w-12 rounded-full
  ${isSelected ? "ring ring-white/30" : "bg-white/10"}
`;

/**
 * Returns the class for the user name text
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getNameClass = (isSelected) => `
  font-medium text-ellipsis whitespace-nowrap overflow-hidden max-w-[180px]
  ${isSelected ? "text-white" : "text-white/90"}
`;

/**
 * Returns the class for the message preview text
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getMessageClass = (isSelected) => `
  text-sm truncate
  ${isSelected ? "text-white/80" : "text-white/60"}
`;

/**
 * Returns the class for the timestamp
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getTimeClass = (isSelected) => `
  text-xs
  ${isSelected ? "text-white/70" : "text-white/40"}
`;

/**
 * Returns the class for the unread count badge
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getBadgeClass = (isSelected) => `
  badge badge-sm mt-1
  ${isSelected ? "bg-white/30 text-white" : "bg-white/20 text-white"}
`;
