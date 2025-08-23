/**
 * SignUp Component
 * -----------------
 * Handles new user registration functionality.
 *
 * Exports:
 *   - SignUp: Renders the signup form for new user registration.
 *
 * State:
 *   - inputs: Stores form values (fullName, username, password, confirmPassword, gender).
 *
 * Functions:
 *   - handleInputs(e): Updates the `inputs` state based on form changes.
 *   - handleCheckboxChange(gender): Updates the gender selection in the `inputs` state.
 *   - handleSubmit(e): Handles form submission (to be implemented).
 *
 * Layout:
 *   - FormContainer: Wraps the signup form with a styled container.
 *   - FormInput: Reusable input fields for full name, username, password, and confirm password.
 *   - GenderCheckbox: Radio button group for gender selection.
 *   - FormButton: Submit button for the signup form.
 *   - FormFooter: Displays a link to the login page for existing users.
 *
 * Usage:
 *   - This component is rendered in `App.jsx` as part of the `/signup` route.
 *
 * Example:
 *   - Rendered in `App.jsx`:
 *       <Route path="/signup" element={<SignUp />} />
 */

import { useState } from "react";
import { getInputWrapperClass } from "../../styles/AuthStyles";
import FormContainer from "../../components/form/FormContainer";
import FormInput from "../../components/form/FormInput";
import FormButton from "../../components/form/FormButton";
import FormFooter from "../../components/form/FormFooter";
import GenderCheckbox from "../../components/form/GenderCheckbox";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "",
    });

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleCheckboxChange = (gender) => {
        setInputs({ ...inputs, gender });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // SignUp logic will be implemented here
        console.log("SignUp form submitted", inputs);
    };

    return (
        <FormContainer title="Sign Up">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className={getInputWrapperClass()}>
                    <FormInput
                        id="fullName"
                        name="fullName"
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={inputs.fullName}
                        onChange={handleInputs}
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

                <div className={getInputWrapperClass()}>
                    <FormInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={inputs.confirmPassword}
                        onChange={handleInputs}
                    />
                </div>

                <GenderCheckbox
                    onCheckboxChange={handleCheckboxChange}
                    selectedGender={inputs.gender}
                />

                <div>
                    <FormButton>Sign Up</FormButton>
                </div>
            </form>

            <FormFooter
                text="Already have an account?"
                linkText="Login"
                linkHref="/login"
            />
        </FormContainer>
    );
};

export default SignUp;
