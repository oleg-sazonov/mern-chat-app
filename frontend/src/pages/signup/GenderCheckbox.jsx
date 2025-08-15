const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Gender</label>
            <div className="flex gap-6 mt-1">
                <div className="form-control">
                    <label className="label cursor-pointer space-x-2">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedGender === "male"}
                            onChange={() => onCheckboxChange("male")}
                        />
                        <span className="label-text text-white/90">Male</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer space-x-2">
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedGender === "female"}
                            onChange={() => onCheckboxChange("female")}
                        />
                        <span className="label-text text-white/90">Female</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default GenderCheckbox;
