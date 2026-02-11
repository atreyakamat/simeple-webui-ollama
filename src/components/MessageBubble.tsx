import { useState } from 'react';
import type { Message } from '../types/chat';

interface MessageBubbleProps {
    message: Message;
    isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isUser) {
        return (
            <div className="flex gap-3 items-start flex-row-reverse group">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="material-symbols-outlined text-zinc-400 text-[16px]">
                        person
                    </span>
                </div>
                <div className="max-w-[85%] bg-zinc-900/50 border border-zinc-800 px-4 py-3 rounded-xl rounded-tr-none">
                    <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-3 items-start group">
            <div className="w-8 h-8 rounded-full bg-[#195de6] flex-shrink-0 flex items-center justify-center mt-1">
                <span className="material-symbols-outlined text-white text-[16px]">
                    bolt
                </span>
            </div>
            <div className="max-w-[90%] space-y-2">
                <div className="message-content text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {isStreaming && !message.content && (
                        <span className="inline-flex gap-1 ml-1">
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                    )}
                    {isStreaming && message.content && (
                        <span className="inline-block w-1.5 h-4 bg-zinc-400 animate-pulse ml-0.5 align-text-bottom rounded-sm" />
                    )}
                </div>
                {!isStreaming && message.content && (
                    <button
                        onClick={handleCopy}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                        title="Copy message"
                    >
                        <span className="material-symbols-outlined text-[14px]">
                            {copied ? 'check' : 'content_copy'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}
