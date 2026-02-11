import { useChatStore } from '../store/chatStore';
import { StatusBadge } from './StatusBadge';
import { ModelSelector } from './ModelSelector';

export function Sidebar() {
    const chats = useChatStore((s) => s.chats);
    const activeChatId = useChatStore((s) => s.activeChatId);
    const createChat = useChatStore((s) => s.createChat);
    const setActiveChat = useChatStore((s) => s.setActiveChat);
    const deleteChat = useChatStore((s) => s.deleteChat);

    return (
        <aside className="w-[260px] flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#195de6] rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[18px]">
                            bolt
                        </span>
                    </div>
                    <h1 className="font-bold text-lg tracking-tight text-zinc-100">
                        OllaDesk
                    </h1>
                </div>
                <StatusBadge />
            </div>

            {/* New Chat */}
            <div className="px-4 mb-4">
                <button
                    onClick={createChat}
                    className="w-full flex items-center justify-center gap-2 bg-[#195de6] hover:bg-[#195de6]/90 text-white py-2.5 rounded-lg font-medium transition-all shadow-sm cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>New Chat</span>
                </button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
                {chats.length > 0 && (
                    <p className="px-2 pt-2 pb-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                        Recent Chats
                    </p>
                )}
                {chats.map((chat) => {
                    const isActive = chat.id === activeChatId;
                    return (
                        <div key={chat.id} className="relative group">
                            <button
                                onClick={() => setActiveChat(chat.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${isActive
                                        ? 'bg-[#195de6]/10 border border-[#195de6]/20'
                                        : 'hover:bg-zinc-900 border border-transparent'
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined text-[18px] ${isActive
                                            ? 'text-[#195de6]'
                                            : 'text-zinc-500 group-hover:text-zinc-400'
                                        }`}
                                >
                                    {isActive ? 'auto_awesome' : 'chat_bubble_outline'}
                                </span>
                                <span
                                    className={`text-sm font-medium truncate ${isActive
                                            ? 'text-[#195de6]'
                                            : 'text-zinc-400 group-hover:text-zinc-200'
                                        }`}
                                >
                                    {chat.title}
                                </span>
                            </button>
                            {/* Delete button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat.id);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-all"
                                title="Delete chat"
                            >
                                <span className="material-symbols-outlined text-[14px]">
                                    delete
                                </span>
                            </button>
                        </div>
                    );
                })}
                {chats.length === 0 && (
                    <div className="px-3 py-8 text-center">
                        <span className="material-symbols-outlined text-zinc-700 text-[32px] mb-2 block">
                            forum
                        </span>
                        <p className="text-xs text-zinc-600">No chats yet</p>
                        <p className="text-xs text-zinc-700 mt-1">Click "New Chat" to start</p>
                    </div>
                )}
            </div>

            {/* Footer - Model Selector */}
            <div className="p-3 mt-auto border-t border-zinc-800">
                <ModelSelector />
            </div>
        </aside>
    );
}
