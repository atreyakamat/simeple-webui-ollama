import { useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';

export function ChatArea() {
    const activeChat = useChatStore(s => s.chats.find(c => c.id === s.activeChatId));
    const isStreaming = useChatStore(s => s.isStreaming);
    const createChat = useChatStore(s => s.createChat);
    const regenerateLastResponse = useChatStore(s => s.regenerateLastResponse);
    const autoScroll = useSettingsStore(s => s.settings.autoScroll);
    const scrollRef = useRef<HTMLDivElement>(null);

    useAutoScroll(scrollRef, [activeChat?.messages, isStreaming], autoScroll);

    if (!activeChat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
                <div className="text-center space-y-4">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                        style={{ background: 'rgba(25,93,230,0.1)', border: '1px solid rgba(25,93,230,0.2)' }}
                    >
                        <span className="material-symbols-outlined text-[#195de6]" style={{ fontSize: '40px' }}>chat_bubble_outline</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Start a conversation</h2>
                        <p className="text-slate-500 text-sm max-w-sm">Create a new chat to begin talking with your local AI models.</p>
                    </div>
                    <button
                        onClick={createChat}
                        className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
                        style={{ background: '#195de6', boxShadow: '0 4px 20px rgba(25,93,230,0.3)' }}
                    >
                        New Chat
                    </button>
                </div>

                {/* Feature hints */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mt-4">
                    {[
                        { icon: 'lock', title: 'Private', desc: '100% local' },
                        { icon: 'bolt', title: 'Fast', desc: 'GPU accelerated' },
                        { icon: 'model_training', title: 'Multi-model', desc: 'Any Ollama model' },
                    ].map(f => (
                        <div key={f.title} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="material-symbols-outlined text-[#195de6] text-2xl block mb-2">{f.icon}</span>
                            <p className="text-xs font-bold text-white">{f.title}</p>
                            <p className="text-[10px] text-slate-500">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const messages = activeChat.messages;
    const showTyping = isStreaming && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1]?.content;

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                    {messages.map((msg, i) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isLast={i === messages.length - 1}
                            onRegenerate={msg.role === 'assistant' && i === messages.length - 1 ? regenerateLastResponse : undefined}
                        />
                    ))}
                    {showTyping && <TypingIndicator />}
                </div>
            </div>

            {/* Input */}
            <ChatInput />
        </div>
    );
}
