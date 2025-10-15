/**
 * Validation Tips
 * ---------------
 * Provides helper functions to generate validation tips for form fields.
 * Each function returns an array of validation rules with their satisfaction status.
 *
 * Exports:
 *   - getFullNameTips: Generates validation tips for the "Full Name" field.
 *   - getUsernameTips: Generates validation tips for the "Username" field.
 *   - getPasswordTips: Generates validation tips for the "Password" field.
 *   - getConfirmPasswordTips: Generates validation tips for the "Confirm Password" field.
 *
 * Functions:
 * ----------
 * getFullNameTips(fullName)
 *   - Parameters:
 *       - fullName (string): The full name input value.
 *   - Returns:
 *       - {Array}: An array of validation rules with:
 *           - `label` (string): Description of the rule.
 *           - `satisfied` (boolean): Whether the rule is satisfied.
 *   - Rules:
 *       - Must contain only letters and spaces.
 *       - Must be between 3 and 50 characters.
 *
 * getUsernameTips(username)
 *   - Parameters:
 *       - username (string): The username input value.
 *   - Returns:
 *       - {Array}: An array of validation rules with:
 *           - `label` (string): Description of the rule.
 *           - `satisfied` (boolean): Whether the rule is satisfied.
 *   - Rules:
 *       - Must be between 3 and 30 characters.
 *       - Must contain only letters, numbers, or underscores.
 *
 * getPasswordTips(password)
 *   - Parameters:
 *       - password (string): The password input value.
 *   - Returns:
 *       - {Array}: An array of validation rules with:
 *           - `label` (string): Description of the rule.
 *           - `satisfied` (boolean): Whether the rule is satisfied.
 *   - Rules:
 *       - Must be at least 6 characters.
 *       - Must contain at least one uppercase letter.
 *       - Must contain at least one lowercase letter.
 *       - Must contain at least one number.
 *       - Must contain at least one special character (@, $, !, %, *, ?, &, #).
 *
 * getConfirmPasswordTips(password, confirmPassword)
 *   - Parameters:
 *       - password (string): The original password input value.
 *       - confirmPassword (string): The confirm password input value.
 *   - Returns:
 *       - {Array}: An array of validation rules with:
 *           - `label` (string): Description of the rule.
 *           - `satisfied` (boolean): Whether the rule is satisfied.
 *   - Rules:
 *       - Must match the original password exactly.
 *
 * Usage:
 *   - These functions are used in `SignUp.jsx` and `Login.jsx` to dynamically display validation tips for user inputs.
 *
 * Example:
 *   const fullNameTips = getFullNameTips("John Doe");
 *   console.log(fullNameTips);
 *   // Output:
 *   // [
 *   //   { label: "Only letters and spaces", satisfied: true },
 *   //   { label: "Between 3 and 50 characters", satisfied: true }
 *   // ]
 */

export const getFullNameTips = (fullName) => {
    const trimmed = fullName.trim();
    return [
        {
            label: "Only letters and spaces",
            satisfied: /^[a-zA-Z\s]*$/.test(trimmed),
        },
        {
            label: "Between 3 and 50 characters",
            satisfied: trimmed.length >= 3 && trimmed.length <= 50,
        },
    ];
};

export const getUsernameTips = (username) => [
    {
        label: "3–30 characters",
        satisfied: username.length >= 3 && username.length <= 30,
    },
    {
        label: "Letters, numbers, or underscores only",
        satisfied: /^[a-zA-Z0-9_]*$/.test(username),
    },
];

export const getPasswordTips = (password) => [
    {
        label: "At least 6 characters",
        satisfied: password.length >= 6,
    },
    {
        label: "Contains an uppercase letter",
        satisfied: /[A-Z]/.test(password),
    },
    {
        label: "Contains a lowercase letter",
        satisfied: /[a-z]/.test(password),
    },
    {
        label: "Contains a number",
        satisfied: /[0-9]/.test(password),
    },
    {
        label: "Contains a special character (@, $, !, %, *, ?, &, #)",
        satisfied: /[@$!%*?&#]/.test(password),
    },
];

export const getConfirmPasswordTips = (password, confirmPassword) => [
    {
        label: "Matches the password exactly",
        satisfied: password.length > 0 && password === confirmPassword,
    },
];
