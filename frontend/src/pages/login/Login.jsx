/**
 * Login Component
 * ---------------
 * Handles user login functionality.
 *
 * Purpose:
 *   - Provides a user interface for logging in with username and password.
 *   - Validates user inputs dynamically and displays validation tips.
 *   - Submits the form to authenticate the user.
 *
 * State:
 *   - `inputs`: Stores form values (username, password).
 *   - `errors`: Stores validation errors for each field.
 *   - `touched`: Tracks whether a field has been interacted with.
 *   - `formError`: Stores a general error message for the form.
 *
 * Hooks:
 *   - `useLogin`: Custom hook for handling login API requests.
 *   - `useEffect`: Validates inputs whenever they change.
 *   - `useMemo`: Optimizes validation tips computation for each field.
 *
 * Functions:
 *   - `handleInputs(e)`: Updates the `inputs` state and clears errors for the field being updated.
 *   - `handleBlur(e)`: Marks a field as touched when it loses focus.
 *   - `handleSubmit(e)`: Validates the form and submits the login request.
 *
 * Validation:
 *   - Uses `loginSchema` (Yup schema) for input validation.
 *   - Displays validation tips dynamically using `ValidationChecklist`.
 *   - Clears error messages when the user starts typing in a field.
 *
 * Layout:
 *   - `PageTransition`: Wraps the login form with smooth animations for route transitions.
 *   - `FormContainer`: Provides a styled container for the form.
 *   - `FormInput`: Reusable input fields for username and password.
 *   - `ValidationChecklist`: Displays dynamic validation tips for each field.
 *   - `FormButton`: Submit button for the login form.
 *   - `FormFooter`: Displays a link to the signup page for new users.
 *
 * Example Usage:
 *   - Rendered in `App.jsx` as part of the `/login` route:
 *       <Route path="/login" element={<Login />} />
 *
 * Example Workflow:
 *   1. User enters their username and password in the form fields.
 *   2. Validation tips update dynamically as the user types.
 *   3. On form submission:
 *       - If validation passes, the `handleLogin` function is called to authenticate the user.
 *       - If validation fails, error messages are displayed under the respective fields.
 *
 * Dependencies:
 *   - `useLogin`: Handles API requests for user login.
 *   - `loginSchema`: Yup schema for validating form inputs.
 *   - `ValidationChecklist`: Displays validation tips for each field.
 *   - `FormInput`, `FormButton`, `FormFooter`: Reusable form components.
 */

import { useEffect, useMemo, useState } from "react";
import { useLogin } from "../../hooks/auth/useLogin";
import { loginSchema } from "../../utils/validationSchemas";
import { extractErrors } from "../../utils/extractErrors";
import { getUsernameTips, getPasswordTips } from "../../utils/validationTips";
import { createHandleInputs, createHandleBlur } from "../../utils/formHandlers";
import { getInputWrapperClass } from "../../styles/AuthStyles";

import FormContainer from "../../components/form/FormContainer";
import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormFooter from "../../components/form/FormFooter";
import PageTransition from "../../components/transitions/PageTransition";
import ValidationChecklist from "../../components/form/ValidationChecklist";

const Login = () => {
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formError, setFormError] = useState("");
    const { loading, handleLogin } = useLogin();

    useEffect(() => {
        let mounted = true;
        const validate = async () => {
            try {
                await loginSchema.validate(inputs, { abortEarly: false });
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

    const handleInputs = createHandleInputs({
        setInputs,
        setErrors,
        onChange: () => setFormError(""),
    });

    const handleBlur = createHandleBlur({ setTouched });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            await loginSchema.validate(inputs, { abortEarly: false });
        } catch (error) {
            setErrors(extractErrors(error));
            setTouched({ username: true, password: true });
            return;
        }

        const result = await handleLogin({
            username: inputs.username,
            password: inputs.password,
        });

        if (!result?.success && result?.errorMessage) {
            setFormError(
                result.errorMessage.includes("Invalid username or password")
                    ? "Username or password do not match."
                    : result.errorMessage
            );
        } else {
            setFormError("");
        }
    };

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

    return (
        <PageTransition type="auth">
            <FormContainer title="Login">
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                    <div className={getInputWrapperClass()}>
                        <FormInput
                            id="username"
                            name="username"
                            type="text"
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
                        {/* <ValidationChecklist
                            title="Username reminder"
                            items={usernameTips}
                        /> */}
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
                        {/* <ValidationChecklist
                            title="Password reminder"
                            items={passwordTips}
                        /> */}
                    </div>

                    {formError && (
                        <div className="alert alert-error flex justify-center bg-error/20 border border-error/40 text-sm text-error">
                            {formError}
                        </div>
                    )}

                    <div className="mt-6">
                        <FormButton disabled={loading}>Login</FormButton>
                    </div>
                </form>

                <FormFooter
                    text="Don't have an account?"
                    linkText="Sign up"
                    linkHref="/signup"
                />
            </FormContainer>
        </PageTransition>
    );
};

export default Login;
