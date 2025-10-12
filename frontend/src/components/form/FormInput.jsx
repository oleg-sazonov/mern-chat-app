/**
 * FormInput Component
 * ------------------
 * Reusable input field with label for forms.
 *
 * Exports:
 *   - FormInput: A customizable input field with an associated label.
 *
 * Props:
 *   - id: Input ID (required for accessibility and label association).
 *   - name: Input name attribute (used for form handling).
 *   - type: Input type (e.g., "text", "password", "email"). Defaults to "text".
 *   - label: The text for the input's label.
 *   - value: The current value of the input field.
 *   - onChange: Callback function to handle changes in the input field.
 *   - placeholder: Placeholder text for the input field.
 *
 * Layout:
 *   - Wrapper: A container with spacing for the label and input field.
 *   - Label: Associated with the input field via the `htmlFor` attribute.
 *   - Input: Styled input field with dynamic attributes.
 *
 * Usage:
 *   - Used in authentication forms like `Login` and `SignUp` to render input fields.
 *
 * Example:
 *   - Rendered in `SignUp.jsx`:
 *       <FormInput
 *           id="username"
 *           name="username"
 *           label="Username"
 *           placeholder="Enter your username"
 *           value={inputs.username}
 *           onChange={handleInputs}
 *       />
 *
 *   - Rendered in `Login.jsx`:
 *       <FormInput
 *           id="password"
 *           name="password"
 *           type="password"
 *           label="Password"
 *           placeholder="Enter your password"
 *           value={inputs.password}
 *           onChange={handleInputs}
 *       />
 */

import { getLabelClass, getInputClass } from "../../styles/AuthStyles";

const FormInput = ({
    id,
    name,
    type = "text",
    label,
    value,
    onChange,
    placeholder,
    onBlur,
    hasError = false,
    isSuccess = false,
    helperText = "",
    className = "",
    showHelper = true,
}) => {
    const baseClass = getInputClass();
    const stateClass = hasError
        ? "input-error"
        : isSuccess
        ? "input-success"
        : "";
    return (
        // <div className="space-y-2">
        //     <label htmlFor={id} className={getLabelClass()}>
        //         {label}
        //     </label>
        //     <input
        //         id={id}
        //         name={name}
        //         type={type}
        //         placeholder={placeholder}
        //         className={getInputClass()}
        //         value={value}
        //         onChange={onChange}
        //     />
        // </div>
        <div className="space-y-2">
            <label htmlFor={id} className={getLabelClass()}>
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`${baseClass} ${stateClass} ${className}`.trim()}
            />
            {showHelper && helperText && (
                <p
                    className={`text-xs ${
                        hasError ? "text-error" : "text-white/60"
                    }`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default FormInput;
