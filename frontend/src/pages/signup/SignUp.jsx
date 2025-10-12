/**
 * SignUp Component
 * -----------------
 * Handles new user registration functionality.
 *
 * Exports:
 *   - SignUp: Renders the signup form for new user registration.
 *
 * State:
 *   - inputs: Stores form values (fullName, username, password, confirmPassword).
 *
 * Functions:
 *   - handleInputs(e): Updates the `inputs` state based on form changes.
 *   - handleSubmit(e): Handles form submission using the `useSignup` hook.
 *
 * Layout:
 *   - PageTransition: Wraps the signup form with smooth animations for route transitions.
 *   - FormContainer: Wraps the signup form with a styled container.
 *   - FormInput: Reusable input fields for full name, username, password, and confirm password.
 *   - FormButton: Submit button for the signup form.
 *   - FormFooter: Displays a link to the login page for existing users.
 *
 * Usage:
 *   - This component is rendered in `App.jsx` as part of the `/signup` route.
 *   - Manages form state and submission using the `useSignup` hook.
 *
 * Example:
 *   - Rendered in `App.jsx`:
 *       <Route path="/signup" element={<SignUp />} />
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

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => {
            if (!prev?.[name]) return prev;
            const { [name]: _removed, ...rest } = prev;
            return rest;
        });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

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
        <PageTransition type="auth">
            <FormContainer title="Sign Up">
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
                                touched.fullName ? errors.fullName ?? "" : ""
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
                                touched.username ? errors.username ?? "" : ""
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
                                touched.password ? errors.password ?? "" : ""
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
    );
};

export default SignUp;
