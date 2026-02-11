import { useChatStore } from '../store/chatStore';

export function StatusBadge() {
    const isConnected = useChatStore((s) => s.isConnected);

    return (
        <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${isConnected
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                }`}
        >
            <div
                className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}
            />
            <span
                className={`text-[10px] font-medium uppercase tracking-wider ${isConnected ? 'text-green-400' : 'text-red-400'
                    }`}
            >
                {isConnected ? 'Connected' : 'Ollama not running'}
            </span>
        </div>
    );
}
