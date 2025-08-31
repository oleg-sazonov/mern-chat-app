/**
 * FormContainer Component
 * ----------------------
 * Reusable container for authentication forms.
 *
 * Exports:
 *   - FormContainer: A wrapper component for form layouts with a title and content.
 *
 * Props:
 *   - children: The content of the form (e.g., input fields, buttons).
 *   - title: The title of the form (e.g., "Login", "Sign Up").
 *
 * Layout:
 *   - Outer Container: Provides a styled wrapper for the form.
 *   - Form Wrapper: Adds padding, background, and border styles to the form.
 *   - Heading: Displays the form title at the top.
 *
 * Usage:
 *   - Used in authentication pages like `Login` and `SignUp` to wrap form content.
 *
 * Example:
 *   - Rendered in `SignUp.jsx`:
 *       <FormContainer title="Sign Up">
 *           <form>...</form>
 *       </FormContainer>
 *
 *   - Rendered in `Login.jsx`:
 *       <FormContainer title="Login">
 *           <form>...</form>
 *       </FormContainer>
 */

import {
    getContainerClass,
    getFormWrapperClass,
    getHeadingClass,
} from "../../styles/AuthStyles";

const FormContainer = ({ children, title }) => {
    return (
        <div className={getContainerClass()} id="form-container">
            <div className={getFormWrapperClass()}>
                <h1 className={getHeadingClass()}>{title}</h1>
                {children}
            </div>
        </div>
    );
};

export default FormContainer;
