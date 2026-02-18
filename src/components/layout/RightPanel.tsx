import { useChatStore } from '../../store/chatStore';
import { useSettingsStore } from '../../store/settingsStore';

export function RightPanel() {
    const activeChat = useChatStore(s => s.chats.find(c => c.id === s.activeChatId));
    const selectedModel = useChatStore(s => s.selectedModel);
    const settings = useSettingsStore(s => s.settings);

    const msgCount = activeChat?.messages.length ?? 0;
    const userMsgs = activeChat?.messages.filter(m => m.role === 'user').length ?? 0;
    const estimatedTokens = activeChat?.messages.reduce((acc, m) => acc + Math.ceil(m.content.length / 4), 0) ?? 0;

    return (
        <aside
            className="w-72 flex-shrink-0 flex flex-col gap-3 p-3 h-full overflow-y-auto custom-scrollbar border-l"
            style={{ background: 'rgba(10,14,23,0.95)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
            {/* System Monitor */}
            <div className="glass-panel rounded-xl p-5 space-y-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Monitor</h3>
                <div className="space-y-4">
                    {[
                        { label: 'VRAM', value: '6.4 / 12 GB', pct: 53, color: '#195de6' },
                        { label: 'Context', value: `${estimatedTokens.toLocaleString()} tokens`, pct: Math.min(100, (estimatedTokens / 8192) * 100), color: '#a855f7' },
                        { label: 'Speed', value: '~42 t/s', pct: 85, color: '#10b981' },
                    ].map(stat => (
                        <div key={stat.label} className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-500 uppercase tracking-wider">{stat.label}</span>
                                <span style={{ color: stat.color }}>{stat.value}</span>
                            </div>
                            <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${stat.pct}%`, background: stat.color, boxShadow: `0 0 8px ${stat.color}60` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Metadata */}
            <div className="glass-panel rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chat Info</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Messages', value: msgCount },
                        { label: 'User turns', value: userMsgs },
                        { label: 'Est. tokens', value: estimatedTokens.toLocaleString() },
                        { label: 'Model', value: selectedModel.split(':')[0] || '—' },
                    ].map(item => (
                        <div key={item.label} className="p-3 rounded-lg space-y-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-bold text-slate-200 truncate">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inference Params */}
            <div className="glass-panel rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inference</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Temperature', value: settings.temperature.toFixed(2) },
                        { label: 'Top-P', value: settings.topP.toFixed(2) },
                        { label: 'Max Tokens', value: settings.maxTokens },
                        { label: 'Streaming', value: settings.streamResponses ? 'On' : 'Off' },
                    ].map(item => (
                        <div key={item.label} className="p-3 rounded-lg space-y-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-bold text-slate-200">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* GPU Badge */}
            <div className="glass-primary rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(25,93,230,0.2)' }}>
                    <span className="material-symbols-outlined text-[#195de6]">auto_awesome</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Local GPU</p>
                    <p className="text-[11px] text-slate-400">Powered by Ollama</p>
                </div>
            </div>
        </aside>
    );
}
