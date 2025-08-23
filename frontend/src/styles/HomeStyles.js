/**
 * HomeStyles
 * ----------
 * Centralized styles for the Home component to ensure consistency
 * and reduce duplication across the component.
 *
 * Exports:
 *   - getOuterContainerClass: Returns the class for the outer container.
 *   - getInnerContainerClass: Returns the class for the inner container.
 *   - getSidebarClass: Returns the class for the sidebar.
 *   - getMessageContainerClass: Returns the class for the message container.
 */

/**
 * Returns the class for the outer container.
 */
export const getOuterContainerClass = () => `
  flex flex-col items-center justify-center w-full px-3 md:px-4 lg:px-6
`;

/**
 * Returns the class for the inner container.
 */
export const getInnerContainerClass = () => `
  flex h-[85vh] md:h-[90vh] lg:h-[85vh] xl:h-[80vh]
  max-h-[950px] min-h-[550px] rounded-lg overflow-hidden
  w-full max-w-[1600px] mx-auto
  shadow-2xl bg-white/5 backdrop-blur-md border border-white/10
`;

/**
 * Returns the class for the sidebar.
 */
export const getSidebarClass = () => `
  w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/5
`;

/**
 * Returns the class for the message container.
 */
export const getMessageContainerClass = () => `
  w-3/4 md:w-2/3 lg:w-3/4 xl:w-4/5
`;
