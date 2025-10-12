/**
 * Login Component
 * --------------
 * Handles user login functionality.
 *
 * Exports:
 *   - Login: Renders the login form for user authentication.
 *
 * State:
 *   - inputs: Stores form values (username and password).
 *
 * Functions:
 *   - handleInputs(e): Updates the `inputs` state based on form changes.
 *   - handleSubmit(e): Handles form submission using the `useLogin` hook.
 *
 * Layout:
 *   - PageTransition: Wraps the login form with smooth animations for route transitions.
 *   - FormContainer: Wraps the login form with a styled container.
 *   - FormInput: Reusable input fields for username and password.
 *   - FormButton: Submit button for the login form.
 *   - FormFooter: Displays a link to the signup page for new users.
 *
 * Usage:
 *   - This component is rendered in `App.jsx` as part of the `/login` route.
 *   - Manages user authentication state using the `useLogin` hook.
 *
 * Example:
 *   - Rendered in `App.jsx`:
 *       <Route path="/login" element={<Login />} />
 *
 * Related Components:
 *   - Referenced in `Home.jsx` to manage user authentication state and navigation.
 */

import { useEffect, useMemo, useState } from "react";
import { useLogin } from "../../hooks/auth/useLogin";
import { loginSchema } from "../../utils/validationSchemas";
import { extractErrors } from "../../utils/extractErrors";
import { getUsernameTips, getPasswordTips } from "../../utils/validationTips";
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
            await loginSchema.validate(inputs, { abortEarly: false });
        } catch (error) {
            setErrors(extractErrors(error));
            setTouched({ username: true, password: true });
            return;
        }

        await handleLogin({
            username: inputs.username,
            password: inputs.password,
        });
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
                        <ValidationChecklist
                            title="Username reminder"
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
                            title="Password reminder"
                            items={passwordTips}
                        />
                    </div>

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
