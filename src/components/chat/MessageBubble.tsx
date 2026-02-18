import { useState } from 'react';
import type { Message } from '../../types/chat';
import { formatTimestamp } from '../../lib/utils';
import { useSettingsStore } from '../../store/settingsStore';

interface MessageBubbleProps {
    message: Message;
    onRegenerate?: () => void;
    isLast?: boolean;
}

export function MessageBubble({ message, onRegenerate, isLast }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const showTimestamps = useSettingsStore(s => s.settings.showTimestamps);
    const isUser = message.role === 'user';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isUser) {
        return (
            <div className="flex gap-3 items-start flex-row-reverse group">
                <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '16px' }}>person</span>
                </div>
                <div className="max-w-[75%] space-y-1">
                    <div
                        className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-slate-100 leading-relaxed"
                        style={{ background: 'rgba(25,93,230,0.15)', border: '1px solid rgba(25,93,230,0.2)' }}
                    >
                        {message.content}
                    </div>
                    {showTimestamps && (
                        <p className="text-[10px] text-slate-600 text-right pr-1">{formatTimestamp(message.timestamp)}</p>
                    )}
                </div>
                <button
                    onClick={handleCopy}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all self-end"
                    title="Copy"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{copied ? 'check' : 'content_copy'}</span>
                </button>
            </div>
        );
    }

    // Assistant message
    return (
        <div className="flex gap-3 items-start group">
            <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(25,93,230,0.15)', border: '1px solid rgba(25,93,230,0.2)' }}
            >
                <span className="material-symbols-outlined text-[#195de6]" style={{ fontSize: '16px' }}>smart_toy</span>
            </div>
            <div className="flex-1 min-w-0 space-y-1">
                <div
                    className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-slate-200 leading-relaxed whitespace-pre-wrap"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                    {message.content || (
                        <span className="text-slate-600 italic">Thinking...</span>
                    )}
                </div>
                {showTimestamps && (
                    <p className="text-[10px] text-slate-600 pl-1">{formatTimestamp(message.timestamp)}</p>
                )}
            </div>
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all self-start mt-1">
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
                    title="Copy"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{copied ? 'check' : 'content_copy'}</span>
                </button>
                {isLast && onRegenerate && (
                    <button
                        onClick={onRegenerate}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
                        title="Regenerate"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                    </button>
                )}
            </div>
        </div>
    );
}
