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

import { useState } from "react";

import useLogin from "../../hooks/auth/useLogin";
import { getInputWrapperClass } from "../../styles/AuthStyles";

import FormContainer from "../../components/form/FormContainer";
import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormFooter from "../../components/form/FormFooter";
import PageTransition from "../../components/transitions/PageTransition";

const Login = () => {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });
    const { loading, handleLogin } = useLogin();

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return; // Prevent multiple submissions while loading

        // Login logic will be implemented here
        await handleLogin({
            username: inputs.username,
            password: inputs.password,
        });
    };

    return (
        <PageTransition type="auth">
            <FormContainer title="Login">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className={getInputWrapperClass()}>
                        <FormInput
                            id="username"
                            name="username"
                            type="text"
                            label="Username"
                            placeholder="Enter username"
                            value={inputs.username}
                            onChange={handleInputs}
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
