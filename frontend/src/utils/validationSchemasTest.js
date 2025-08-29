import { signupSchema } from "./validationSchemas.js";

const testSignupSchema = () => {
    const testCases = [
        {
            description: "Valid input",
            input: {
                fullName: "John Doe",
                username: "johndoe",
                password: "Password123!",
                confirmPassword: "Password123!",
                gender: "male",
            },
            shouldPass: true,
        },
        {
            description: "Missing fullName",
            input: {
                fullName: "",
                username: "johndoe",
                password: "Password123!",
                confirmPassword: "Password123!",
                gender: "male",
            },
            shouldPass: false,
        },
        {
            description: "Invalid username (too short)",
            input: {
                fullName: "John Doe",
                username: "jd",
                password: "Password123!",
                confirmPassword: "Password123!",
                gender: "male",
            },
            shouldPass: false,
        },
        {
            description: "Invalid password (missing special character)",
            input: {
                fullName: "John Doe",
                username: "johndoe",
                password: "Password123",
                confirmPassword: "Password123",
                gender: "male",
            },
            shouldPass: false,
        },
        {
            description: "Passwords do not match",
            input: {
                fullName: "John Doe",
                username: "johndoe",
                password: "Password123!",
                confirmPassword: "Password456!",
                gender: "male",
            },
            shouldPass: false,
        },
        {
            description: "Invalid gender",
            input: {
                fullName: "John Doe",
                username: "johndoe",
                password: "Password123!",
                confirmPassword: "Password123!",
                gender: "other",
            },
            shouldPass: false,
        },
        {
            description: "Valid input with optional profilePicture",
            input: {
                fullName: "Jane Doe",
                username: "janedoe",
                password: "Password123!",
                confirmPassword: "Password123!",
                gender: "female",
                profilePicture: "https://example.com/avatar.png",
            },
            shouldPass: true,
        },
        {
            description: "Invalid profilePicture (not a URL)",
            input: {
                fullName: "Jane Doe",
                username: "janedoe",
                password: "Password123!",
                confirmPassword: "Password123!",
                gender: "female",
                profilePicture: "invalid-url",
            },
            shouldPass: false,
        },
    ];

    testCases.forEach(({ description, input, shouldPass }) => {
        console.log(`\nTesting: ${description}`);
        try {
            const result = signupSchema.parse(input);
            console.log("✅ Passed:", result);
            if (!shouldPass) {
                console.error(
                    "❌ Test failed: Expected validation to fail but it passed."
                );
            }
        } catch (error) {
            console.error("❌ Failed:", error.issues);
            if (shouldPass) {
                console.error(
                    "❌ Test failed: Expected validation to pass but it failed."
                );
            }
        }
    });
};

testSignupSchema();
