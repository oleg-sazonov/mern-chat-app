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
