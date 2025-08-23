/**
 * GenderCheckbox Component
 * -----------------------
 * Radio button group for gender selection.
 *
 * Exports:
 *   - GenderCheckbox: A component for selecting gender with two options: Male and Female.
 *
 * Props:
 *   - onCheckboxChange: Function to handle gender selection.
 *   - selectedGender: The currently selected gender ("male" or "female").
 *
 * Layout:
 *   - Wrapper: A container with a label and two gender options.
 *   - GenderOption: A nested component for rendering individual gender options.
 *
 * Usage:
 *   - Used in authentication forms like `SignUp` to allow users to select their gender.
 *
 * Example:
 *   - Rendered in `SignUp.jsx`:
 *       <GenderCheckbox
 *           onCheckboxChange={handleCheckboxChange}
 *           selectedGender={inputs.gender}
 *       />
 */

import { getLabelClass } from "../../styles/AuthStyles";

const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
    return (
        <div className="space-y-2">
            <label className={getLabelClass()}>Gender</label>
            <div className="flex gap-6 mt-1">
                <GenderOption
                    gender="male"
                    label="Male"
                    isSelected={selectedGender === "male"}
                    onChange={onCheckboxChange}
                />
                <GenderOption
                    gender="female"
                    label="Female"
                    isSelected={selectedGender === "female"}
                    onChange={onCheckboxChange}
                />
            </div>
        </div>
    );
};

// Nested component for individual gender option
const GenderOption = ({ gender, label, isSelected, onChange }) => (
    <div className="form-control">
        <label className="label cursor-pointer space-x-2">
            <input
                type="checkbox"
                className="checkbox"
                checked={isSelected}
                onChange={() => onChange(gender)}
            />
            <span className="label-text text-white/90">{label}</span>
        </label>
    </div>
);

export default GenderCheckbox;
