import { useChatStore } from '../store/chatStore';
import { MessageBubble } from './MessageBubble';
import { ChatBar } from './ChatBar';
import { useAutoScroll } from '../hooks/useAutoScroll';

export function ChatArea() {
    const chats = useChatStore((s) => s.chats);
    const activeChatId = useChatStore((s) => s.activeChatId);
    const isStreaming = useChatStore((s) => s.isStreaming);
    const selectedModel = useChatStore((s) => s.selectedModel);

    const activeChat = chats.find((c) => c.id === activeChatId);
    const messages = activeChat?.messages ?? [];
    const lastMessageContent = messages[messages.length - 1]?.content ?? '';

    const scrollRef = useAutoScroll([messages.length, lastMessageContent]);

    // Empty state — no active chat
    if (!activeChat) {
        return (
            <main className="flex-1 flex flex-col h-full bg-[#09090b]">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-[#195de6] text-[32px]">
                                bolt
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-200 mb-1">
                                Welcome to OllaDesk
                            </h2>
                            <p className="text-sm text-zinc-500 max-w-xs">
                                Start a new chat to begin talking with your local Ollama models
                            </p>
                        </div>
                    </div>
                </div>
                <ChatBar />
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col h-full bg-[#09090b]">
            {/* Header */}
            <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-sm text-zinc-100 truncate max-w-[400px]">
                        {activeChat.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                        {activeChat.model || selectedModel}
                    </span>
                </div>
                {isStreaming && (
                    <div className="flex items-center gap-2 text-zinc-500">
                        <div className="flex gap-1">
                            <span className="w-1 h-1 bg-[#195de6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-1 bg-[#195de6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-1 bg-[#195de6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[11px] font-medium">Generating...</span>
                    </div>
                )}
            </header>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar"
            >
                <div className="max-w-[700px] mx-auto px-6 py-8 space-y-8">
                    {messages.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-zinc-800 text-[48px] mb-3 block">
                                chat
                            </span>
                            <p className="text-sm text-zinc-600">
                                Send a message to start the conversation
                            </p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isStreaming={
                                isStreaming &&
                                msg.role === 'assistant' &&
                                i === messages.length - 1
                            }
                        />
                    ))}
                </div>
            </div>

            {/* Input */}
            <ChatBar />
        </main>
    );
}
