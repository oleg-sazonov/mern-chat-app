/**
 * Form Handlers
 * -------------
 * Factory helpers to generate shared input and blur handlers for form management.
 *
 * Exports:
 *   - createHandleInputs: Generates a reusable input change handler.
 *   - createHandleBlur: Generates a reusable blur handler.
 *
 * createHandleInputs
 * ------------------
 * Generates a handler for managing input changes in forms.
 *
 * Parameters:
 *   - setInputs (function): Updates the state of form inputs.
 *   - setErrors (function): Updates the state of form errors.
 *   - onChange (function, optional): A callback function triggered on input change.
 *
 * Behavior:
 *   - Updates the input value in the `inputs` state.
 *   - Clears the error for the specific field being updated.
 *   - Calls the optional `onChange` callback with the field name and value.
 *
 * Example Usage:
 *   const handleInputs = createHandleInputs({ setInputs, setErrors, onChange });
 *   <input name="username" onChange={handleInputs} />
 *
 * createHandleBlur
 * ----------------
 * Generates a handler for managing blur events in forms.
 *
 * Parameters:
 *   - setTouched (function): Updates the state of touched fields.
 *
 * Behavior:
 *   - Marks the field as touched in the `touched` state when it loses focus.
 *
 * Example Usage:
 *   const handleBlur = createHandleBlur({ setTouched });
 *   <input name="username" onBlur={handleBlur} />
 */

export const createHandleInputs = ({ setInputs, setErrors, onChange }) => {
    return (e) => {
        const { name, value } = e.target;

        setInputs((prev) => ({ ...prev, [name]: value }));

        // Clear field-specific error once user types
        setErrors((prev) => {
            if (!prev?.[name]) return prev;
            const { [name]: _removed, ...rest } = prev;
            return rest;
        });

        if (typeof onChange === "function") onChange(name, value);
    };
};

export const createHandleBlur = ({ setTouched }) => {
    return (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };
};
