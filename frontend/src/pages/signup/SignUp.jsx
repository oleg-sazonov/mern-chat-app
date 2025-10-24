/**
 * SignUp Component
 * -----------------
 * Handles new user registration functionality.
 *
 * Purpose:
 *   - Provides a user interface for signing up with full name, username, password, and confirm password fields.
 *   - Validates user inputs dynamically and displays validation tips.
 *   - Submits the form to create a new user account.
 *
 * State:
 *   - `inputs`: Stores form values (fullName, username, password, confirmPassword).
 *   - `errors`: Stores validation errors for each field.
 *   - `touched`: Tracks whether a field has been interacted with.
 *   - `isShortViewport`: Tracks whether the viewport height is less than 950px.
 *
 * Hooks:
 *   - `useSignup`: Custom hook for handling signup API requests.
 *   - `useEffect`: Validates inputs whenever they change and tracks viewport height.
 *   - `useMemo`: Optimizes validation tips computation for each field.
 *
 * Functions:
 *   - `handleInputs(e)`: Updates the `inputs` state and clears errors for the field being updated.
 *   - `handleBlur(e)`: Marks a field as touched when it loses focus.
 *   - `handleSubmit(e)`: Validates the form and submits the signup request.
 *
 * Validation:
 *   - Uses `signupSchema` (Yup schema) for input validation.
 *   - Displays validation tips dynamically using `ValidationChecklist`.
 *   - Clears error messages when the user starts typing in a field.
 *
 * Layout:
 *   - `PageTransition`: Wraps the signup form with smooth animations for route transitions.
 *   - `FormContainer`: Provides a styled container for the form.
 *   - `FormInput`: Reusable input fields for full name, username, password, and confirm password.
 *   - `ValidationChecklist`: Displays dynamic validation tips for each field.
 *   - `FormButton`: Submit button for the signup form.
 *   - `FormFooter`: Displays a link to the login page for existing users.
 *
 * Example Usage:
 *   - Rendered in `App.jsx` as part of the `/signup` route:
 *       <Route path="/signup" element={<SignUp />} />
 *
 * Example Workflow:
 *   1. User enters their details in the form fields.
 *   2. Validation tips update dynamically as the user types.
 *   3. On form submission:
 *       - If validation passes, the `handleSignup` function is called to create the account.
 *       - If validation fails, error messages are displayed under the respective fields.
 *
 * Dependencies:
 *   - `useSignup`: Handles API requests for user signup.
 *   - `signupSchema`: Yup schema for validating form inputs.
 *   - `ValidationChecklist`: Displays validation tips for each field.
 *   - `FormInput`, `FormButton`, `FormFooter`: Reusable form components.
 */

import { useEffect, useMemo, useState } from "react";
import { useSignup } from "../../hooks/auth/useSignup";
import { signupSchema } from "../../utils/validationSchemas";
import { extractErrors } from "../../utils/extractErrors";
import {
    getFullNameTips,
    getUsernameTips,
    getPasswordTips,
    getConfirmPasswordTips,
} from "../../utils/validationTips";
import { createHandleInputs, createHandleBlur } from "../../utils/formHandlers";
import { getInputWrapperClass } from "../../styles/AuthStyles";

import FormContainer from "../../components/form/FormContainer";
import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormFooter from "../../components/form/FormFooter";
import PageTransition from "../../components/transitions/PageTransition";
import ValidationChecklist from "../../components/form/ValidationChecklist";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const { loading, handleSignup } = useSignup();

    useEffect(() => {
        let mounted = true;
        const validate = async () => {
            try {
                await signupSchema.validate(inputs, { abortEarly: false });
                if (mounted) setErrors({});
            } catch (error) {
                if (!mounted) return;
                setErrors(extractErrors(error));
            }
        };
        validate();
        return () => {
            mounted = false;
        };
    }, [inputs]);

    // Enable scroll on short viewports (< 950px)
    const [isShortViewport, setIsShortViewport] = useState(
        typeof window !== "undefined" ? window.innerHeight < 950 : false
    );

    useEffect(() => {
        const onResize = () => setIsShortViewport(window.innerHeight < 950);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const handleInputs = createHandleInputs({ setInputs, setErrors });
    const handleBlur = createHandleBlur({ setTouched });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            await signupSchema.validate(inputs, { abortEarly: false });
        } catch (error) {
            setErrors(extractErrors(error));
            setTouched({
                fullName: true,
                username: true,
                password: true,
                confirmPassword: true,
            });
            return;
        }

        await handleSignup({
            fullName: inputs.fullName,
            username: inputs.username,
            password: inputs.password,
            confirmPassword: inputs.confirmPassword,
        });
    };

    const fullNameTips = useMemo(
        () => getFullNameTips(inputs.fullName),
        [inputs.fullName]
    );
    const isFullNameComplete = fullNameTips.every((tip) => tip.satisfied);

    const usernameTips = useMemo(
        () => getUsernameTips(inputs.username),
        [inputs.username]
    );
    const isUsernameComplete = usernameTips.every((tip) => tip.satisfied);

    const passwordTips = useMemo(
        () => getPasswordTips(inputs.password),
        [inputs.password]
    );
    const isPasswordComplete = passwordTips.every((tip) => tip.satisfied);

    const confirmPasswordTips = useMemo(
        () => getConfirmPasswordTips(inputs.password, inputs.confirmPassword),
        [inputs.password, inputs.confirmPassword]
    );
    const isConfirmComplete = confirmPasswordTips.every((tip) => tip.satisfied);

    return (
        <div
            className={
                isShortViewport
                    ? "w-full h-full overflow-auto flex items-start justify-center"
                    : "w-full h-full overflow-hidden flex items-center justify-center"
            }
        >
            <PageTransition type="auth">
                <FormContainer title="Sign Up">
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className={getInputWrapperClass()}>
                            <FormInput
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={inputs.fullName}
                                onChange={handleInputs}
                                onBlur={handleBlur}
                                hasError={
                                    touched.fullName && Boolean(errors.fullName)
                                }
                                isSuccess={
                                    touched.fullName &&
                                    isFullNameComplete &&
                                    !errors.fullName
                                }
                                helperText={
                                    touched.fullName
                                        ? errors.fullName ?? ""
                                        : ""
                                }
                            />
                            <ValidationChecklist
                                title="Full name tips"
                                items={fullNameTips}
                            />
                        </div>

                        <div className={getInputWrapperClass()}>
                            <FormInput
                                id="username"
                                name="username"
                                label="Username"
                                placeholder="Enter username"
                                value={inputs.username}
                                onChange={handleInputs}
                                onBlur={handleBlur}
                                hasError={
                                    touched.username && Boolean(errors.username)
                                }
                                isSuccess={
                                    touched.username &&
                                    isUsernameComplete &&
                                    !errors.username
                                }
                                helperText={
                                    touched.username
                                        ? errors.username ?? ""
                                        : ""
                                }
                            />
                            <ValidationChecklist
                                title="Username requirements"
                                items={usernameTips}
                            />
                        </div>

                        <div className={getInputWrapperClass()}>
                            <FormInput
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                placeholder="Enter password"
                                value={inputs.password}
                                onChange={handleInputs}
                                onBlur={handleBlur}
                                hasError={
                                    touched.password && Boolean(errors.password)
                                }
                                isSuccess={
                                    touched.password &&
                                    isPasswordComplete &&
                                    !errors.password
                                }
                                helperText={
                                    touched.password
                                        ? errors.password ?? ""
                                        : ""
                                }
                            />
                            <ValidationChecklist
                                title="Password checklist"
                                items={passwordTips}
                            />
                        </div>

                        <div className={getInputWrapperClass()}>
                            <FormInput
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                value={inputs.confirmPassword}
                                onChange={handleInputs}
                                onBlur={handleBlur}
                                hasError={
                                    touched.confirmPassword &&
                                    Boolean(errors.confirmPassword)
                                }
                                isSuccess={
                                    touched.confirmPassword &&
                                    isConfirmComplete &&
                                    !errors.confirmPassword &&
                                    inputs.confirmPassword === inputs.password
                                }
                                helperText={
                                    touched.confirmPassword
                                        ? errors.confirmPassword ?? ""
                                        : ""
                                }
                            />
                            <ValidationChecklist
                                title="Confirmation"
                                items={confirmPasswordTips}
                            />
                        </div>

                        <div className="mt-6">
                            <FormButton disabled={loading}>Sign Up</FormButton>
                        </div>
                    </form>

                    <FormFooter
                        text="Already have an account?"
                        linkText="Login"
                        linkHref="/login"
                    />
                </FormContainer>
            </PageTransition>
        </div>
    );
};

export default SignUp;
