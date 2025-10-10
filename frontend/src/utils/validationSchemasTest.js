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
