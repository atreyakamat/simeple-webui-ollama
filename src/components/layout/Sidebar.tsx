import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useUIStore } from '../../store/uiStore';
import { cn, formatTimestamp } from '../../lib/utils';
import type { Chat } from '../../types/chat';

// ─── Search Bar ──────────────────────────────────────────────────────────────

function SearchBar() {
    const searchQuery = useChatStore(s => s.searchQuery);
    const setSearchQuery = useChatStore(s => s.setSearchQuery);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" style={{ fontSize: '16px' }}>search</span>
            <input
                ref={inputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-9 pr-8 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                </button>
            )}
        </div>
    );
}

// ─── Chat Item ───────────────────────────────────────────────────────────────

function ChatItem({ chat, isActive }: { chat: Chat; isActive: boolean }) {
    const setActiveChat = useChatStore(s => s.setActiveChat);
    const deleteChat = useChatStore(s => s.deleteChat);
    const renameChat = useChatStore(s => s.renameChat);
    const duplicateChat = useChatStore(s => s.duplicateChat);
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [renameVal, setRenameVal] = useState(chat.title);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        if (menuOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    const handleRename = () => {
        if (renameVal.trim()) renameChat(chat.id, renameVal.trim());
        setRenaming(false);
        setMenuOpen(false);
    };

    return (
        <div
            className={cn(
                'group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
                isActive
                    ? 'bg-[#195de6]/15 border border-[#195de6]/25'
                    : 'hover:bg-white/5 border border-transparent'
            )}
            onClick={() => !renaming && setActiveChat(chat.id)}
        >
            <span
                className="material-symbols-outlined flex-shrink-0"
                style={{ fontSize: '16px', color: isActive ? '#195de6' : 'rgba(255,255,255,0.3)' }}
            >
                {isActive ? 'chat' : 'chat_bubble_outline'}
            </span>

            {renaming ? (
                <input
                    autoFocus
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false); }}
                    className="flex-1 bg-transparent text-sm text-white outline-none border-b border-[#195de6]"
                    onClick={e => e.stopPropagation()}
                />
            ) : (
                <div className="flex-1 min-w-0">
                    <p className={cn('text-sm truncate', isActive ? 'text-white font-medium' : 'text-slate-400')}>{chat.title}</p>
                    <p className="text-[10px] text-slate-600">{formatTimestamp(chat.updatedAt)}</p>
                </div>
            )}

            {/* Context menu trigger */}
            {!renaming && (
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>more_horiz</span>
                    </button>
                    {menuOpen && (
                        <div
                            className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl overflow-hidden shadow-2xl py-1"
                            style={{ background: '#111621', border: '1px solid rgba(255,255,255,0.1)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            {[
                                { icon: 'edit', label: 'Rename', action: () => { setRenaming(true); setMenuOpen(false); } },
                                { icon: 'content_copy', label: 'Duplicate', action: () => { duplicateChat(chat.id); setMenuOpen(false); } },
                                { icon: 'delete', label: 'Delete', action: () => { deleteChat(chat.id); setMenuOpen(false); }, danger: true },
                            ].map(item => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left',
                                        item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:bg-white/5'
                                    )}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function Sidebar() {
    const chats = useChatStore(s => s.chats);
    const activeChatId = useChatStore(s => s.activeChatId);
    const createChat = useChatStore(s => s.createChat);
    const models = useChatStore(s => s.models);
    const selectedModel = useChatStore(s => s.selectedModel);
    const isConnected = useChatStore(s => s.isConnected);
    const searchQuery = useChatStore(s => s.searchQuery);
    const searchResults = useChatStore(s => s.searchResults);
    const openSettings = useUIStore(s => s.openSettings);
    const isSidebarOpen = useUIStore(s => s.isSidebarOpen);

    const displayedChats = searchQuery
        ? searchResults.map(r => r.chat)
        : chats.filter(c => !c.archived);

    if (!isSidebarOpen) return null;

    return (
        <aside
            className="w-64 flex-shrink-0 flex flex-col h-full border-r"
            style={{ background: 'rgba(10,14,23,0.95)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#195de6] rounded-lg flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 0 20px rgba(25,93,230,0.4)' }}>
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>rocket_launch</span>
                    </div>
                    <span className="font-bold text-white tracking-tight">OllaDesk</span>
                </div>
                <div className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-full border',
                    isConnected ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
                )}>
                    <div className={cn('w-1.5 h-1.5 rounded-full', isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500')} />
                    <span className={cn('text-[9px] font-bold uppercase tracking-wider', isConnected ? 'text-emerald-400' : 'text-red-400')}>
                        {isConnected ? 'Live' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* New Chat */}
            <div className="px-3 pt-3 pb-2">
                <button
                    onClick={createChat}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
                    style={{ background: '#195de6', boxShadow: '0 4px 20px rgba(25,93,230,0.25)' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                    New Chat
                </button>
            </div>

            {/* Search */}
            <div className="px-3 pb-2">
                <SearchBar />
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-0.5 pb-2">
                {displayedChats.length === 0 ? (
                    <div className="text-center py-12 text-slate-600">
                        <span className="material-symbols-outlined text-4xl block mb-2">chat_bubble_outline</span>
                        <p className="text-xs">{searchQuery ? 'No results found' : 'No chats yet'}</p>
                    </div>
                ) : (
                    displayedChats.map(chat => (
                        <ChatItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} />
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {/* Model selector */}
                <div className="relative">
                    <select
                        value={selectedModel}
                        onChange={e => useChatStore.setState({ selectedModel: e.target.value })}
                        className="w-full rounded-lg py-2 pl-3 pr-8 text-xs text-slate-300 appearance-none outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        {models.length === 0 && <option value="">No models available</option>}
                        {models.map(m => (
                            <option key={m.name} value={m.name} style={{ background: '#0a0e17' }}>{m.name}</option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" style={{ fontSize: '14px' }}>expand_more</span>
                </div>

                {/* Settings */}
                <button
                    onClick={openSettings}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>settings</span>
                    Settings
                    <span className="ml-auto text-[10px] text-slate-600">⌘,</span>
                </button>
            </div>
        </aside>
    );
}
