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
  transition-all duration-150 ease-in-out transform
  ${
      isSelected
          ? "bg-white/15 selected"
          : "hover:bg-white/10 hover:scale-[1.01]"
  }
`;

/**
 * Returns the class for the avatar component
 * @param {boolean} isOnline - Whether the user is online
 */
export const getAvatarClass = (isOnline) => `
  avatar ${isOnline ? "avatar-online" : ""} 
  transition-all duration-150 ease-in-out
`;

/**
 * Returns the class for the avatar container
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getAvatarContainerClass = (isSelected) => `
  w-12 rounded-full transition-all duration-150 ease-in-out
  ${
      isSelected
          ? "ring ring-white/40 ring-offset-1 ring-offset-transparent shadow-lg"
          : "bg-white/10 hover:bg-white/15"
  }
`;

/**
 * Returns the class for the user name text
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getNameClass = (isSelected) => `
  font-medium truncate transition-colors duration-150
  ${isSelected ? "text-white" : "text-white/90 group-hover:text-white"}
`;

/**
 * Returns the class for the message preview text
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getMessageClass = (isSelected) => `
  text-sm truncate transition-colors duration-150
  ${isSelected ? "text-white/80" : "text-white/60 hover:text-white/70"}
`;

/**
 * Returns the class for the timestamp
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getTimeClass = (isSelected) => `
  text-xs transition-colors duration-150
  ${isSelected ? "text-white/70" : "text-white/40 hover:text-white/50"}
`;

/**
 * Returns the class for the unread count badge
 * @param {boolean} isSelected - Whether the conversation is selected
 */
export const getBadgeClass = (isSelected) => `
  badge badge-sm transition-all duration-150 mt-1
  ${
      isSelected
          ? "bg-white/30 text-white border-white/20"
          : "bg-white/20 text-white border-white/10 hover:bg-white/25"
  }
`;
