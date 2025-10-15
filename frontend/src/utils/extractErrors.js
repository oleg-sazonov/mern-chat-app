/**
 * extractErrors Utility
 * ---------------------
 * Extracts validation errors from a Yup validation error object and maps them to their corresponding fields.
 *
 * Purpose:
 *   - Simplifies the process of handling validation errors by converting them into a structured object.
 *   - Maps each error to its respective field for easier integration with forms.
 *
 * Parameters:
 *   @param {Object} error - The Yup validation error object.
 *       - `error.inner`: An array of validation issues, each containing:
 *           - `path`: The field name associated with the error.
 *           - `message`: The error message for the field.
 *       - `error.path`: The field name for a single validation error.
 *       - `error.message`: The error message for a single validation error.
 *
 * Returns:
 *   - {Object}: A key-value pair object where:
 *       - Keys are field names (e.g., "username", "password").
 *       - Values are error messages for the respective fields.
 *   - If no errors are found, returns an empty object.
 *
 * Example Usage:
 *   - Extracting errors from a Yup validation error:
 *       try {
 *           await schema.validate(data, { abortEarly: false });
 *       } catch (error) {
 *           const errors = extractErrors(error);
 *           console.log(errors); // { username: "Username is required", password: "Password must be at least 6 characters" }
 *       }
 *
 * Behavior:
 *   - If `error.inner` exists and contains multiple validation issues:
 *       - Iterates through each issue and maps the `path` to its `message`.
 *       - Ensures no duplicate keys are added to the result object.
 *   - If `error.path` exists (single validation error):
 *       - Maps the `path` to its `message`.
 *   - If no errors are found, returns an empty object.
 */

export const extractErrors = (error) => {
    if (!error) return {};
    if (error.inner && error.inner.length > 0) {
        const mapped = {};
        error.inner.forEach((issue) => {
            if (issue.path && !mapped[issue.path]) {
                mapped[issue.path] = issue.message;
            }
        });
        return mapped;
    }
    if (error.path) {
        return { [error.path]: error.message };
    }
    return {};
};
