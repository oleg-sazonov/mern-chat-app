import { useState } from "react";
import GenderCheckbox from "./GenderCheckbox";

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

    return (
        <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
            <div className="w-full p-6 rounded-lg shadow-xl bg-white/10 backdrop-blur-md border border-white/20">
                <h1 className="text-3xl font-semibold text-center text-white mb-6">
                    Sign Up
                </h1>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="input input-bordered w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors"
                            value={inputs.fullName}
                            onChange={(e) => handleInputs(e)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            className="input input-bordered w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors"
                            value={inputs.username}
                            onChange={(e) => handleInputs(e)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            className="input input-bordered w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors"
                            value={inputs.password}
                            onChange={(e) => handleInputs(e)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            className="input input-bordered w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:outline-none transition-colors"
                            value={inputs.confirmPassword}
                            onChange={(e) => handleInputs(e)}
                        />
                    </div>

                    <GenderCheckbox
                        onCheckboxChange={handleCheckboxChange}
                        selectedGender={inputs.gender}
                    />

                    <div>
                        <button
                            type="submit"
                            className="btn btn-block bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm transition-all duration-200"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <span className="text-white/70 text-sm">
                        Already have an account?{" "}
                        <a
                            href="#"
                            className="text-white hover:text-white/80 underline font-medium"
                        >
                            Login
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
