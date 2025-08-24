/**
 * AuthStyles
 * ----------
 * Centralized styles for authentication components (SignUp and Login) to ensure consistency
 * and reduce duplication across components.
 *
 * Exports:
 *   - getContainerClass: Returns the class for the outer container.
 *   - getFormWrapperClass: Returns the class for the form wrapper.
 *   - getHeadingClass: Returns the class for the heading.
 *   - getInputWrapperClass: Returns the class for input field wrappers.
 *   - getInputClass: Returns the class for input fields.
 *   - getButtonClass: Returns the class for the submit button.
 *   - getFooterClass: Returns the class for the footer text.
 */

/**
 * Returns the class for the outer container.
 */
export const getContainerClass = () => `
  flex flex-col items-center justify-center min-w-96 mx-auto
`;

/**
 * Returns the class for the form wrapper.
 */
export const getFormWrapperClass = () => `
  w-full p-6 rounded-lg shadow-xl bg-white/10 backdrop-blur-md border border-white/20
`;

/**
 * Returns the class for the heading.
 */
export const getHeadingClass = () => `
  text-3xl font-semibold text-center text-white mb-6
`;

/**
 * Returns the class for input field wrappers.
 */
export const getInputWrapperClass = () => `
  space-y-2
`;

/**
 * Returns the class for input fields.
 */
export const getInputClass = () => `
  input input-bordered w-full bg-white/10 backdrop-blur-sm border border-white/20 
  text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors
`;

/**
 * Returns the class for the submit button.
 */
export const getButtonClass = () => `
  btn btn-block bg-white/20 hover:bg-white/30 border border-white/30 
  text-white backdrop-blur-sm transition-all duration-200
`;

/**
 * Returns the class for the footer text.
 */
export const getFooterClass = () => `
  text-center mt-6 text-white/70 text-sm
`;

/**
 * Returns the class for the label text.
 */
export const getLabelClass = () => `text-sm font-medium text-white/90`;

/**
 * Returns the class for input fields with errors.
 */
export const getInputErrorClass = () => `
  border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/10
`;

/**
 * Returns the class for form validation errors.
 */
export const getErrorMessageClass = () => `
  text-red-400 text-xs mt-1
`;

/**
 * Returns the class for a disabled button.
 */
export const getDisabledButtonClass = () => `
  opacity-50 cursor-not-allowed bg-gray-400 border-gray-500 hover:bg-gray-400
`;
