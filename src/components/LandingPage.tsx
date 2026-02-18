import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';

export function LandingPage() {
    const navigate = useNavigate();
    const isConnected = useChatStore(s => s.isConnected);
    const createChat = useChatStore(s => s.createChat);
    const models = useChatStore(s => s.models);

    const handleOpenWorkspace = () => {
        navigate('/chat');
    };

    const handleNewChat = () => {
        createChat();
        navigate('/chat');
    };

    return (
        <div className="min-h-screen text-slate-100 relative overflow-x-hidden" style={{ background: '#080c14', fontFamily: "'Inter', sans-serif" }}>
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #195de6, transparent 70%)', filter: 'blur(80px)' }} />
                <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)', filter: 'blur(80px)' }} />
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 pt-6">
                <div
                    className="max-w-6xl mx-auto px-6 py-3 rounded-2xl flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#195de6] rounded-lg flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(25,93,230,0.4)' }}>
                            <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>rocket_launch</span>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">OllaDesk</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#preview" className="text-sm text-slate-400 hover:text-white transition-colors">Preview</a>
                        <a href="https://ollama.ai" target="_blank" rel="noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">Ollama</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{
                                background: isConnected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                border: `1px solid ${isConnected ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                            }}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isConnected ? `${models.length} model${models.length !== 1 ? 's' : ''}` : 'Ollama offline'}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-44 pb-24 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
                        style={{ background: 'rgba(25,93,230,0.1)', border: '1px solid rgba(25,93,230,0.2)', color: '#60a5fa' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified_user</span>
                        100% Local · Zero Data Leaks · No Subscriptions
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.05]">
                        Your AI.<br />
                        <span style={{ background: 'linear-gradient(135deg, #195de6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Fully Local.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        A glassmorphism-native AI workspace powered by Ollama. Multi-model, multi-chat, persistent, and blazing fast — all running on your machine.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleOpenWorkspace}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all group"
                            style={{ background: '#195de6', boxShadow: '0 8px 30px rgba(25,93,230,0.3)' }}
                        >
                            Open Workspace
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>arrow_forward</span>
                        </button>
                        <button
                            onClick={handleNewChat}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:bg-white/10"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                            New Chat
                        </button>
                    </div>
                </div>
            </section>

            {/* App Preview */}
            <section id="preview" className="px-6 pb-24">
                <div className="max-w-6xl mx-auto relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3/4 h-24 opacity-40" style={{ background: 'rgba(25,93,230,0.3)', filter: 'blur(60px)' }} />
                    <div
                        className="rounded-2xl overflow-hidden flex h-[520px]"
                        style={{ background: 'rgba(10,14,23,0.9)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
                    >
                        {/* Mock Sidebar */}
                        <div className="w-56 border-r flex flex-col p-3 gap-2" style={{ background: 'rgba(10,14,23,0.95)', borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-2 p-2 mb-2">
                                <div className="w-7 h-7 bg-[#195de6] rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white" style={{ fontSize: '14px' }}>rocket_launch</span>
                                </div>
                                <span className="text-sm font-bold text-white">OllaDesk</span>
                            </div>
                            <div className="px-2 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2" style={{ background: 'rgba(25,93,230,0.15)', border: '1px solid rgba(25,93,230,0.25)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#195de6' }}>chat</span>
                                Market Analysis
                            </div>
                            {['Code Refactoring', 'Product Roadmap', 'API Design'].map(t => (
                                <div key={t} className="px-2 py-2 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chat_bubble_outline</span>
                                    {t}
                                </div>
                            ))}
                        </div>
                        {/* Mock Chat */}
                        <div className="flex-1 flex flex-col" style={{ background: 'rgba(8,12,20,0.8)' }}>
                            <div className="h-12 border-b flex items-center px-4 gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,14,23,0.8)' }}>
                                <span className="text-sm font-semibold text-white">Market Analysis</span>
                                <span className="text-[10px] font-bold text-[#195de6] px-2 py-0.5 rounded-full" style={{ background: 'rgba(25,93,230,0.1)' }}>llama3</span>
                            </div>
                            <div className="flex-1 p-6 space-y-5 overflow-hidden">
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '14px' }}>person</span>
                                    </div>
                                    <div className="text-sm text-slate-300 pt-1 max-w-sm">Analyze the current AI market trends and identify key growth opportunities for 2025.</div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(25,93,230,0.15)' }}>
                                        <span className="material-symbols-outlined text-[#195de6]" style={{ fontSize: '14px' }}>smart_toy</span>
                                    </div>
                                    <div className="p-3 rounded-2xl rounded-tl-sm text-sm text-slate-200 max-w-md" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                        The AI market is experiencing exponential growth, with key opportunities in: <strong className="text-white">edge inference</strong>, <strong className="text-white">local-first AI</strong>, and <strong className="text-white">domain-specific models</strong>...
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                <div className="rounded-xl px-4 py-2.5 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <span className="text-sm text-slate-600 flex-1">Type a message...</span>
                                    <div className="w-7 h-7 bg-[#195de6] rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white" style={{ fontSize: '14px' }}>arrow_upward</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="px-6 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-3">Built for power users</h2>
                        <p className="text-slate-400">Everything you need, nothing you don't.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { icon: 'shield_lock', title: 'Military-Grade Privacy', desc: 'Your data stays on your silicon. No cloud sync, no telemetry, no external API calls. Ever.', color: '#195de6' },
                            { icon: 'bolt', title: 'Zero Latency', desc: 'Direct connection to Ollama. Response speed is limited only by your local GPU.', color: '#a855f7' },
                            { icon: 'model_training', title: 'Multi-Model', desc: 'Switch between Llama 3, Mistral, Phi-3, CodeLlama or any model you pull via Ollama CLI.', color: '#10b981' },
                            { icon: 'search', title: 'Global Search', desc: 'Search across all chat titles and message content instantly. Find anything in seconds.', color: '#f59e0b' },
                            { icon: 'history', title: 'Persistent History', desc: 'All chats saved locally in IndexedDB. Rename, duplicate, or delete with full CRUD control.', color: '#ef4444' },
                            { icon: 'settings', title: 'Deep Customization', desc: 'Control temperature, top-p, max tokens, system prompt, and more from the settings panel.', color: '#06b6d4' },
                        ].map(f => (
                            <div
                                key={f.title}
                                className="p-6 rounded-2xl transition-all hover:scale-[1.02]"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                            >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${f.color}15` }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: f.color }}>{f.icon}</span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
                <div className="max-w-2xl mx-auto text-center p-12 rounded-2xl" style={{ background: 'rgba(25,93,230,0.08)', border: '1px solid rgba(25,93,230,0.15)' }}>
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to start?</h2>
                    <p className="text-slate-400 mb-8">Make sure Ollama is running locally, then open the workspace.</p>
                    <button
                        onClick={handleOpenWorkspace}
                        className="px-10 py-4 rounded-2xl font-bold text-white transition-all"
                        style={{ background: '#195de6', boxShadow: '0 8px 30px rgba(25,93,230,0.3)' }}
                    >
                        Open OllaDesk Workspace
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-white">OllaDesk</span>
                        <span>© 2025 · Local AI Workspace</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="https://github.com/ollama/ollama" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
                        <a href="https://ollama.ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Ollama Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
