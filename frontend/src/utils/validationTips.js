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
