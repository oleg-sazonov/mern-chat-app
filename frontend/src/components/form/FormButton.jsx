/**
 * FormButton Component
 * -------------------
 * Reusable submit button for forms.
 *
 * Exports:
 *   - FormButton: A customizable button component for form submissions.
 *
 * Props:
 *   - children: The text or elements to display inside the button.
 *   - type: The button type (default: "submit").
 *   - disabled: Boolean indicating whether the button is disabled (default: false).
 *   - className: Additional CSS classes to apply to the button.
 *
 * Layout:
 *   - Renders a button element with dynamic classes and content.
 *   - Displays a loading spinner when the button is disabled.
 *   - Applies styles from `getButtonClass` and any additional classes passed via `className`.
 *
 * Usage:
 *   - Used in authentication forms like `Login` and `SignUp` to render submit buttons.
 *
 * Example:
 *   - Rendered in `SignUp.jsx`:
 *       <FormButton>Sign Up</FormButton>
 *
 *   - Rendered in `Login.jsx`:
 *       <FormButton disabled={!isValid}>Login</FormButton>
 *
 * Related Components:
 *   - Referenced in `Home.jsx` for managing form submissions in the chat application.
 */

import { getButtonClass } from "../../styles/AuthStyles";

const FormButton = ({
    children,
    type = "submit",
    disabled = false,
    className = "",
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`${getButtonClass()} ${className} flex items-center justify-center`}
        >
            {disabled ? (
                <span className="loading loading-spinner loading-md"></span>
            ) : (
                children
            )}
        </button>
    );
};

export default FormButton;
