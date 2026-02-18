import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useChatStore } from '../../store/chatStore';

export function ChatInput() {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const sendMessage = useChatStore(s => s.sendMessage);
    const isStreaming = useChatStore(s => s.isStreaming);
    const stopStreaming = useChatStore(s => s.stopStreaming);
    const isConnected = useChatStore(s => s.isConnected);
    const activeChatId = useChatStore(s => s.activeChatId);
    const selectedModel = useChatStore(s => s.selectedModel);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }, [value]);

    // Focus on chat change
    useEffect(() => {
        textareaRef.current?.focus();
    }, [activeChatId]);

    const handleSend = async () => {
        const content = value.trim();
        if (!content || isStreaming) return;
        setValue('');
        await sendMessage(content);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const canSend = value.trim().length > 0 && !isStreaming && isConnected && !!activeChatId;

    return (
        <div className="p-4 pt-0">
            <div className="max-w-3xl mx-auto">
                <div
                    className="rounded-2xl p-1.5 transition-all"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: value ? '0 0 0 2px rgba(25,93,230,0.2)' : 'none',
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isStreaming || !isConnected || !activeChatId}
                        placeholder={
                            !isConnected ? 'Ollama is not running...' :
                                !activeChatId ? 'Create a new chat to start...' :
                                    'Type a message... (Enter to send, Shift+Enter for newline)'
                        }
                        rows={1}
                        className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none outline-none py-2.5 px-3 custom-scrollbar"
                        style={{ maxHeight: '200px' }}
                    />
                    <div className="flex items-center justify-between px-2 pb-1.5">
                        <div className="flex items-center gap-1">
                            {selectedModel && (
                                <span className="text-[10px] text-slate-600 font-medium">{selectedModel.split(':')[0]}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-700 hidden sm:block">Shift+Enter for newline</span>
                            {isStreaming ? (
                                <button
                                    onClick={stopStreaming}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}
                                    title="Stop streaming"
                                >
                                    <span className="material-symbols-outlined text-red-400" style={{ fontSize: '16px' }}>stop</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSend}
                                    disabled={!canSend}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                                    style={{
                                        background: canSend ? '#195de6' : 'rgba(255,255,255,0.05)',
                                        boxShadow: canSend ? '0 4px 15px rgba(25,93,230,0.3)' : 'none',
                                        cursor: canSend ? 'pointer' : 'not-allowed',
                                    }}
                                    title="Send (Enter)"
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: '16px', color: canSend ? 'white' : 'rgba(255,255,255,0.2)' }}
                                    >
                                        arrow_upward
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-center mt-2 text-slate-700">
                    OllaDesk runs locally — your data never leaves your machine.
                </p>
            </div>
        </div>
    );
}
