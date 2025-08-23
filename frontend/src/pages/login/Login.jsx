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
 *   - handleSubmit(e): Handles form submission (to be implemented).
 *
 * Layout:
 *   - FormContainer: Wraps the login form with a styled container.
 *   - FormInput: Reusable input fields for username and password.
 *   - FormButton: Submit button for the login form.
 *   - FormFooter: Displays a link to the signup page for new users.
 *
 * Usage:
 *   - This component is rendered in `App.jsx` as part of the `/login` route.
 *
 * Example:
 *   - Rendered in `App.jsx`:
 *       <Route path="/login" element={<Login />} />
 */

import { useState } from "react";
import { getInputWrapperClass } from "../../styles/AuthStyles";
import FormContainer from "../../components/form/FormContainer";
import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormFooter from "../../components/form/FormFooter";

const Login = () => {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Login logic will be implemented here
        console.log("Login form submitted", inputs);
        // Reset form
        setInputs({
            username: "",
            password: "",
        });
    };

    return (
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
                    <FormButton>Login</FormButton>
                </div>
            </form>

            <FormFooter
                text="Don't have an account?"
                linkText="Sign up"
                linkHref="/signup"
            />
        </FormContainer>
    );
};

export default Login;
