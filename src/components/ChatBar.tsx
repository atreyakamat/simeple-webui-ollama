import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';

export function ChatBar() {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const sendMessage = useChatStore((s) => s.sendMessage);
    const isStreaming = useChatStore((s) => s.isStreaming);
    const stopStreaming = useChatStore((s) => s.stopStreaming);
    const activeChatId = useChatStore((s) => s.activeChatId);
    const isConnected = useChatStore((s) => s.isConnected);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 200) + 'px';
        }
    }, [input]);

    const handleSend = () => {
        if (!input.trim() || isStreaming || !activeChatId) return;
        sendMessage(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const disabled = !activeChatId || !isConnected;

    return (
        <div className="p-4 pt-0">
            <div className="max-w-[700px] mx-auto relative">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-sm focus-within:border-zinc-700 transition-all p-1.5 flex flex-col gap-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            disabled
                                ? 'Connect to Ollama to start chatting...'
                                : 'Type a message...'
                        }
                        disabled={disabled}
                        rows={1}
                        className="w-full bg-transparent border-none text-sm py-2 px-3 resize-none min-h-[44px] max-h-[200px] placeholder:text-zinc-600 text-zinc-100 custom-scrollbar disabled:opacity-50"
                    />
                    <div className="flex items-center justify-end px-2 pb-1">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-zinc-500 font-medium hidden sm:block">
                                Shift + Enter for new line
                            </span>
                            {isStreaming ? (
                                <button
                                    onClick={stopStreaming}
                                    className="bg-red-500/20 text-red-400 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/30 transition-all border border-red-500/30"
                                    title="Stop generating"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        stop
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || disabled}
                                    className="bg-[#195de6] text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#195de6]/90 transition-all shadow-lg shadow-[#195de6]/20 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        arrow_upward
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-3 text-zinc-600 font-medium">
                    OllaDesk connects directly to your local Ollama instance
                </p>
            </div>
        </div>
    );
}
