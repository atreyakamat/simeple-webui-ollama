export function TypingIndicator() {
    return (
        <div className="flex gap-4 items-start">
            <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: 'rgba(25,93,230,0.15)', border: '1px solid rgba(25,93,230,0.2)' }}
            >
                <span className="material-symbols-outlined text-[#195de6]" style={{ fontSize: '16px' }}>smart_toy</span>
            </div>
            <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
                    />
                ))}
            </div>
        </div>
    );
}
