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
 *   - getLabelClass: Returns the class for the label text.
 *   - getInputErrorClass: Returns the class for input fields with errors.
 *   - getErrorMessageClass: Returns the class for form validation errors.
 *   - getDisabledButtonClass: Returns the class for a disabled button.
 *   - getInputSuccessClass: Returns the class for success input fields.
 *   - getFieldContainerClass: Returns the class for form field containers with error state.
 *   - getInputDescriptionClass: Returns the class for input descriptions.
 *   - getEnhancedButtonClass: Returns enhanced button class with loading state.
 *
 * Usage:
 *   - These utility functions are used in authentication components like `SignUp` and `Login` to apply consistent styles.
 *   - Example in `Home.jsx`:
 *       import { getButtonClass } from "../../styles/AuthStyles";
 *       <button className={getButtonClass()}>Submit</button>
 *
 * Example:
 *   - Applying styles to a form container:
 *       <div className={getContainerClass()}>
 *           <div className={getFormWrapperClass()}>
 *               <h1 className={getHeadingClass()}>Sign Up</h1>
 *               <form>
 *                   <div className={getInputWrapperClass()}>
 *                       <input className={getInputClass()} />
 *                   </div>
 *                   <button className={getButtonClass()}>Submit</button>
 *               </form>
 *           </div>
 *       </div>
 *
 * Related Components:
 *   - Referenced in `Home.jsx` for managing authentication-related UI elements.
 */

/**
 * Returns the class for the outer container.
 */
export const getContainerClass = () => `
  flex flex-col items-center justify-center
  w-full sm:min-w-96 sm:w-auto mx-auto
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
  border-red-500 focus:border-red-500 bg-red-50/10 placeholder-red-300/70
`;

/**
 * Returns the class for form validation errors.
 */

export const getErrorMessageClass = () => `
  text-red-400 text-xs mt-1 font-medium
`;

/**
 * Returns the class for a disabled button.
 */

export const getDisabledButtonClass = () => `
  opacity-50 cursor-not-allowed bg-gray-600 border-gray-600 
  hover:bg-gray-600 transform-none
`;

/**
 * Returns the class for success input fields.
 */
export const getInputSuccessClass = () => `
  border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 
  bg-green-50/10 transition-all duration-200
`;

/**
 * Returns the class for form field containers with error state.
 */
export const getFieldContainerClass = (hasError = false) => `
  space-y-2 ${hasError ? "animate-shake" : ""}
`;

/**
 * Returns the class for input descriptions.
 */
export const getInputDescriptionClass = () => `
  text-white/60 text-xs mt-1
`;

/**
 * Returns enhanced button class with loading state.
 */
export const getEnhancedButtonClass = (
    isLoading = false,
    isDisabled = false
) => `
  ${getButtonClass()} 
  ${isLoading ? "cursor-wait" : ""} 
  ${isDisabled ? getDisabledButtonClass() : "hover:scale-105 active:scale-95"}
  transition-all duration-200 transform
`;
