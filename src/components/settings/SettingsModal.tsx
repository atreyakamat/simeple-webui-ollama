import { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useChatStore } from '../../store/chatStore';
import { Toggle } from '../common/Toggle';
import { Slider } from '../common/Slider';
import { clearAllChats } from '../../lib/storage';

type Tab = 'general' | 'chat' | 'advanced' | 'data';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'chat', label: 'Chat', icon: 'chat_bubble' },
    { id: 'advanced', label: 'Advanced', icon: 'psychology' },
    { id: 'data', label: 'Data', icon: 'database' },
];

export function SettingsModal() {
    const closeSettings = useUIStore(s => s.closeSettings);
    const { settings, updateSetting } = useSettingsStore();
    const models = useChatStore(s => s.models);
    const [activeTab, setActiveTab] = useState<Tab>('general');

    const handleClearAll = async () => {
        if (!confirm('Delete ALL chats? This cannot be undone.')) return;
        await clearAllChats();
        useChatStore.setState({ chats: [], activeChatId: null });
        closeSettings();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-2xl cursor-pointer"
                style={{ background: 'rgba(5,8,15,0.75)' }}
                onClick={closeSettings}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-5xl rounded-2xl flex overflow-hidden shadow-2xl"
                style={{
                    height: '85vh',
                    background: 'rgba(10,14,23,0.95)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                {/* Close button */}
                <button
                    onClick={closeSettings}
                    className="absolute top-5 right-5 z-10 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>close</span>
                </button>

                {/* Sidebar nav */}
                <aside className="w-56 flex-shrink-0 flex flex-col p-5 border-r" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="mb-8">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#195de6] mb-1">Configuration</p>
                        <p className="text-[10px] text-slate-500">Local Ollama Instance</p>
                    </div>
                    <nav className="flex flex-col gap-1 flex-1">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                                style={activeTab === tab.id
                                    ? { background: '#195de6', color: 'white', boxShadow: '0 4px 20px rgba(25,93,230,0.25)' }
                                    : { color: 'rgba(148,163,184,1)' }
                                }
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                    <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(25,93,230,0.15)' }}>
                                <span className="material-symbols-outlined text-[#195de6]" style={{ fontSize: '16px' }}>bolt</span>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500">Ollama</p>
                                <p className="text-xs font-bold text-white">localhost:11434</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10">
                        <div className="max-w-2xl space-y-8">

                            {activeTab === 'general' && (
                                <>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white mb-1">General Settings</h1>
                                        <p className="text-slate-500 text-sm">Workspace appearance and behavior.</p>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'compactMode' as const, label: 'Compact Mode', desc: 'Reduce padding and spacing throughout the interface.' },
                                            { key: 'animationsEnabled' as const, label: 'Animations', desc: 'Enable smooth transitions and micro-animations.' },
                                            { key: 'showTimestamps' as const, label: 'Show Timestamps', desc: 'Display message timestamps in conversations.' },
                                        ].map(item => (
                                            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{item.label}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                                </div>
                                                <Toggle
                                                    checked={settings[item.key] as boolean}
                                                    onChange={v => updateSetting(item.key, v)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {activeTab === 'chat' && (
                                <>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white mb-1">Chat Configuration</h1>
                                        <p className="text-slate-500 text-sm">Customize conversation behavior.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Model</label>
                                            <div className="relative">
                                                <select
                                                    value={settings.defaultModel}
                                                    onChange={e => updateSetting('defaultModel', e.target.value)}
                                                    className="w-full rounded-xl py-3 px-4 text-sm text-slate-200 appearance-none outline-none"
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                                                >
                                                    <option value="" style={{ background: '#0a0e17' }}>Use first available</option>
                                                    {models.map(m => (
                                                        <option key={m.name} value={m.name} style={{ background: '#0a0e17' }}>{m.name}</option>
                                                    ))}
                                                </select>
                                                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-500 pointer-events-none" style={{ fontSize: '18px' }}>expand_more</span>
                                            </div>
                                        </div>
                                        {[
                                            { key: 'autoTitle' as const, label: 'Auto-Title Generation', desc: 'Automatically title chats from the first message.' },
                                            { key: 'autoScroll' as const, label: 'Auto-Scroll', desc: 'Scroll to bottom as new tokens arrive.' },
                                            { key: 'streamResponses' as const, label: 'Stream Responses', desc: 'Show tokens as they are generated.' },
                                        ].map(item => (
                                            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{item.label}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                                </div>
                                                <Toggle
                                                    checked={settings[item.key] as boolean}
                                                    onChange={v => updateSetting(item.key, v)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {activeTab === 'advanced' && (
                                <>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white mb-1">Inference Parameters</h1>
                                        <p className="text-slate-500 text-sm">Fine-tune model behavior.</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Prompt</label>
                                            <textarea
                                                value={settings.systemPrompt}
                                                onChange={e => updateSetting('systemPrompt', e.target.value)}
                                                placeholder="Enter global instructions for the AI..."
                                                rows={4}
                                                className="w-full rounded-xl p-4 text-sm text-slate-300 font-mono resize-none outline-none"
                                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                                            />
                                        </div>
                                        <Slider
                                            label="Temperature"
                                            value={settings.temperature}
                                            min={0} max={2} step={0.05}
                                            onChange={v => updateSetting('temperature', v)}
                                            description="Higher = more creative. Lower = more deterministic."
                                        />
                                        <Slider
                                            label="Top-P"
                                            value={settings.topP}
                                            min={0} max={1} step={0.05}
                                            onChange={v => updateSetting('topP', v)}
                                            description="Nucleus sampling: limits to tokens with cumulative probability P."
                                        />
                                        <Slider
                                            label="Max Tokens"
                                            value={settings.maxTokens}
                                            min={256} max={8192} step={256}
                                            onChange={v => updateSetting('maxTokens', v)}
                                            description="Maximum number of tokens to generate per response."
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'data' && (
                                <>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white mb-1">Storage & Data</h1>
                                        <p className="text-slate-500 text-sm">Manage local chat data stored in IndexedDB.</p>
                                    </div>
                                    <div className="p-6 rounded-xl space-y-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-slate-400">IndexedDB Storage</span>
                                                <span className="text-white">Chat history</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                <div className="h-full bg-[#195de6] rounded-full w-[24%]" style={{ boxShadow: '0 0 8px rgba(25,93,230,0.5)' }} />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                                                Export Chats
                                            </button>
                                            <button
                                                onClick={handleClearAll}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 transition-all ml-auto hover:bg-red-500/20"
                                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_forever</span>
                                                Clear All Chats
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="flex-shrink-0 px-8 md:px-10 py-4 flex justify-end gap-3 border-t"
                        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(10,14,23,0.8)', backdropFilter: 'blur(12px)' }}
                    >
                        <button onClick={closeSettings} className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={closeSettings}
                            className="px-7 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                            style={{ background: '#195de6', boxShadow: '0 4px 20px rgba(25,93,230,0.25)' }}
                        >
                            Done
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
