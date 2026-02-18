import { useState } from 'react';
import { useChatStore } from '../store/chatStore';

interface SettingsModalProps {
    onClose: () => void;
}

type SettingsTab = 'general' | 'chat' | 'data' | 'advanced';

export function SettingsModal({ onClose }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [temperature, setTemperature] = useState(0.7);
    const [topP, setTopP] = useState(0.9);
    const [systemPrompt, setSystemPrompt] = useState('');
    const models = useChatStore((s) => s.models);
    const selectedModel = useChatStore((s) => s.selectedModel);

    const tabs: { id: SettingsTab; label: string; icon: string }[] = [
        { id: 'general', label: 'General', icon: 'settings' },
        { id: 'chat', label: 'Chat', icon: 'chat_bubble' },
        { id: 'advanced', label: 'Advanced', icon: 'psychology' },
        { id: 'data', label: 'Data', icon: 'database' },
    ];

    const handleClearChats = async () => {
        if (!confirm('Are you sure you want to delete all chats? This cannot be undone.')) return;
        const { chats, deleteChat } = useChatStore.getState();
        for (const chat of chats) {
            await deleteChat(chat.id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-2xl"
                style={{ background: 'rgba(10,14,23,0.7)' }}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-5xl rounded-xl flex overflow-hidden shadow-2xl"
                style={{
                    height: '85vh',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors z-10 p-1 rounded-lg hover:bg-white/5"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                {/* Sidebar */}
                <aside className="w-60 border-r border-white/10 flex flex-col p-6 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="mb-8">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-[#195de6] mb-1">Configuration</h2>
                        <p className="text-slate-400 text-[10px] font-medium">Local Ollama Instance</p>
                    </div>
                    <nav className="flex flex-col gap-1.5 flex-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left ${activeTab === tab.id
                                        ? 'bg-[#195de6] text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                style={activeTab === tab.id ? { boxShadow: '0 4px 20px rgba(25,93,230,0.2)' } : {}}
                            >
                                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 px-3">
                            <div className="w-8 h-8 rounded-full bg-[#195de6]/20 flex items-center justify-center text-[#195de6]">
                                <span className="material-symbols-outlined text-sm">bolt</span>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-medium">Ollama</p>
                                <p className="text-xs font-bold text-white">localhost:11434</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col" style={{ background: 'rgba(10,14,23,0.2)' }}>
                    <div className="flex-1 p-8 md:p-10 max-w-2xl">
                        {activeTab === 'general' && (
                            <section className="space-y-10">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">General Settings</h1>
                                    <p className="text-slate-400">Configure your workspace appearance and interface behavior.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg text-[#195de6]" style={{ background: 'rgba(25,93,230,0.1)' }}>
                                                <span className="material-symbols-outlined">dark_mode</span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-white">Interface Theme</h3>
                                                <p className="text-xs text-slate-400">Dark mode is always active for optimal AI workspace experience.</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-[#195de6] bg-[#195de6]/10 px-3 py-1 rounded-full">Dark</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg text-[#195de6]" style={{ background: 'rgba(25,93,230,0.1)' }}>
                                                <span className="material-symbols-outlined">view_compact</span>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-white">Compact Mode</h3>
                                                <p className="text-xs text-slate-400">Minimize padding and spacing in the chat interface.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input className="sr-only peer" type="checkbox" />
                                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#195de6]" style={{ background: 'rgba(255,255,255,0.1)' }} />
                                        </label>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'chat' && (
                            <section className="space-y-10">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">Chat Configuration</h1>
                                    <p className="text-slate-400">Customize how conversations work.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">Default Model</label>
                                        <div className="relative">
                                            <select
                                                value={selectedModel}
                                                onChange={(e) => useChatStore.setState({ selectedModel: e.target.value })}
                                                className="w-full rounded-lg py-3 px-4 text-sm text-white appearance-none outline-none focus:border-[#195de6] transition-all"
                                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                            >
                                                {models.length === 0 && <option value="">No models available</option>}
                                                {models.map((m) => (
                                                    <option key={m.name} value={m.name} style={{ background: '#0a0c10' }}>{m.name}</option>
                                                ))}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-3 text-slate-500 pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div>
                                            <h3 className="text-xs font-semibold text-white">Auto-Title Generation</h3>
                                            <p className="text-[10px] text-slate-400">Generate conversation titles from first message.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked className="sr-only peer" type="checkbox" />
                                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#195de6]" style={{ background: 'rgba(255,255,255,0.1)' }} />
                                        </label>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'advanced' && (
                            <section className="space-y-10">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">Inference Parameters</h1>
                                    <p className="text-slate-400">Fine-tune model behavior for your use case.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">System Prompt</label>
                                            <button onClick={() => setSystemPrompt('')} className="text-[10px] text-[#195de6] hover:underline">Reset</button>
                                        </div>
                                        <textarea
                                            value={systemPrompt}
                                            onChange={(e) => setSystemPrompt(e.target.value)}
                                            className="w-full h-28 rounded-lg p-4 text-xs font-mono text-slate-300 outline-none transition-all resize-none"
                                            placeholder="Enter global instructions for the AI..."
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                                        {[
                                            { label: 'Temperature', value: temperature, setter: setTemperature, min: 0, max: 1, step: 0.1, desc: 'Higher = more creative, lower = more deterministic.' },
                                            { label: 'Top-P', value: topP, setter: setTopP, min: 0, max: 1, step: 0.05, desc: 'Nucleus sampling probability threshold.' },
                                        ].map((param) => (
                                            <div key={param.label} className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-sm font-medium text-white">{param.label}</h3>
                                                    <span className="text-xs font-mono text-[#195de6]">{param.value.toFixed(2)}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={param.min}
                                                    max={param.max}
                                                    step={param.step}
                                                    value={param.value}
                                                    onChange={(e) => param.setter(parseFloat(e.target.value))}
                                                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                                                    style={{ background: 'rgba(255,255,255,0.1)', accentColor: '#195de6' }}
                                                />
                                                <p className="text-[10px] text-slate-500 leading-relaxed">{param.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === 'data' && (
                            <section className="space-y-10">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">Storage & Data</h1>
                                    <p className="text-slate-400">Manage your local chat data stored in IndexedDB.</p>
                                </div>
                                <div className="p-6 rounded-xl space-y-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-400">Local Browser Storage (IndexedDB)</span>
                                            <span className="text-white">Chat history</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                            <div className="h-full bg-[#195de6] rounded-full w-[24%]" style={{ boxShadow: '0 0 8px rgba(25,93,230,0.5)' }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span className="material-symbols-outlined text-lg">download</span>
                                            Export Chats
                                        </button>
                                        <button
                                            onClick={handleClearChats}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 transition-all ml-auto hover:bg-red-500/20"
                                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                                        >
                                            <span className="material-symbols-outlined text-lg">delete_forever</span>
                                            Clear All Chats
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 px-8 md:px-10 py-5 flex justify-end gap-4 border-t border-white/5" style={{ background: 'rgba(10,14,23,0.8)', backdropFilter: 'blur(12px)' }}>
                        <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 bg-[#195de6] hover:bg-[#195de6]/90 rounded-lg text-sm font-bold text-white transition-all"
                            style={{ boxShadow: '0 4px 20px rgba(25,93,230,0.2)' }}
                        >
                            Save Configuration
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
