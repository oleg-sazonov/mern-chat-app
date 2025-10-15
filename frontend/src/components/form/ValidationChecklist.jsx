/**
 * ValidationChecklist Component
 * -----------------------------
 * Displays a list of validation rules with their satisfaction status.
 *
 * Props:
 *   - title (string): The title of the checklist (e.g., "Password checklist").
 *   - items (Array): An array of validation rules, where each rule is an object with:
 *       - `label` (string): Description of the validation rule.
 *       - `satisfied` (boolean): Whether the rule is satisfied.
 *
 * Layout:
 *   - Wrapper: A styled container with a border and background.
 *   - Title: Displays the title of the checklist.
 *   - List: Renders each validation rule with an icon and description.
 *       - Icon:
 *           - A checkmark ("✓") if the rule is satisfied.
 *           - A bullet ("•") if the rule is not satisfied.
 *       - Description: The label of the validation rule.
 *
 * Styling:
 *   - Uses Tailwind CSS classes for styling.
 *   - Satisfied rules are styled with `text-success` and `border-success`.
 *   - Unsatisfied rules are styled with muted colors (`text-white/60` and `border-white/30`).
 *
 * Usage:
 *   - Used in forms like `SignUp` and `Login` to display dynamic validation tips.
 *
 * Example:
 *   <ValidationChecklist
 *       title="Password checklist"
 *       items={[
 *           { label: "At least 6 characters", satisfied: true },
 *           { label: "Contains an uppercase letter", satisfied: false },
 *       ]}
 *   />
 */

const ValidationChecklist = ({ title, items }) => (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-xs">
        <p className="mb-2 font-medium text-white">{title}</p>
        <ul className="space-y-1">
            {items.map(({ label, satisfied }) => (
                <li
                    key={label}
                    className={`flex items-center gap-2 ${
                        satisfied ? "text-success" : "text-white/60"
                    }`}
                >
                    <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                            satisfied
                                ? "border-success bg-success/20 text-success"
                                : "border-white/30 text-white/50"
                        }`}
                    >
                        {satisfied ? "✓" : "•"}
                    </span>
                    <span>{label}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default ValidationChecklist;
