export function SystemPanel() {
    return (
        <aside className="w-72 flex flex-col gap-3 flex-shrink-0 h-full">
            {/* System Monitor */}
            <div className="glass-panel rounded-xl p-5 flex flex-col gap-6 flex-1">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white text-sm">System Monitor</h3>
                        <span className="material-symbols-outlined text-slate-500 text-sm cursor-pointer">info</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'VRAM Usage', value: '6.4 / 12 GB', pct: 53, color: '#195de6', glow: 'rgba(25,93,230,0.5)' },
                            { label: 'Context Window', value: '1,240 / 8,192', pct: 15, color: '#a855f7', glow: 'rgba(168,85,247,0.3)' },
                            { label: 'Tokens / sec', value: '42.8 t/s', pct: 85, color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
                        ].map((stat) => (
                            <div key={stat.label} className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <span>{stat.label}</span>
                                    <span style={{ color: stat.color }}>{stat.value}</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${stat.pct}%`, background: stat.color, boxShadow: `0 0 10px ${stat.glow}` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Model Parameters */}
                <div className="pt-4 border-t border-white/10">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Model Parameters</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { label: 'Temperature', value: '0.7' },
                            { label: 'Top-P', value: '0.9' },
                            { label: 'Repeat Pen', value: '1.1' },
                            { label: 'Seed', value: '-1' },
                        ].map((p) => (
                            <div key={p.label} className="p-3 rounded-lg flex flex-col gap-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">{p.label}</span>
                                <span className="text-sm font-bold text-slate-200">{p.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GPU Badge */}
                <div className="mt-auto">
                    <div className="p-4 glass-primary rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(25,93,230,0.2)' }}>
                            <span className="material-symbols-outlined text-[#195de6]">auto_awesome</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">Local GPU Accelerated</p>
                            <p className="text-[11px] text-slate-400 leading-tight">Running via Ollama</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Persistence Toggle */}
            <div className="glass-panel rounded-xl p-4 flex items-center justify-between" style={{ borderColor: 'rgba(25,93,230,0.2)' }}>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#195de6]">data_object</span>
                    <span className="text-xs font-bold text-slate-300">Context Persistence</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#195de6]" style={{ background: 'rgba(25,93,230,0.2)' }} />
                </label>
            </div>
        </aside>
    );
}
