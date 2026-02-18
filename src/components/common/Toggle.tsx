interface ToggleProps {
    checked: boolean;
    onChange: (val: boolean) => void;
    label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            {label && <span className="text-sm text-slate-300">{label}</span>}
            <div className="relative" onClick={() => onChange(!checked)}>
                <div
                    className="w-11 h-6 rounded-full transition-colors duration-200"
                    style={{ background: checked ? '#195de6' : 'rgba(255,255,255,0.1)' }}
                />
                <div
                    className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                    style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
                />
            </div>
        </label>
    );
}
