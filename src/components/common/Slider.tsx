interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (val: number) => void;
    description?: string;
}

export function Slider({ label, value, min, max, step, onChange, description }: SliderProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">{label}</span>
                <span className="text-xs font-mono text-[#195de6] bg-[#195de6]/10 px-2 py-0.5 rounded">{value.toFixed(2)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(parseFloat(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#195de6', background: `linear-gradient(to right, #195de6 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 0%)` }}
            />
            {description && <p className="text-[10px] text-slate-500 leading-relaxed">{description}</p>}
        </div>
    );
}
