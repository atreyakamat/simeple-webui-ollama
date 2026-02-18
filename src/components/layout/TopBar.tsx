import { useChatStore } from '../../store/chatStore';
import { useUIStore } from '../../store/uiStore';
import { IconButton } from '../common/IconButton';

export function TopBar() {
    const activeChat = useChatStore(s => s.chats.find(c => c.id === s.activeChatId));
    const isStreaming = useChatStore(s => s.isStreaming);
    const stopStreaming = useChatStore(s => s.stopStreaming);
    const clearChat = useChatStore(s => s.clearChat);
    const toggleSidebar = useUIStore(s => s.toggleSidebar);
    const toggleRightPanel = useUIStore(s => s.toggleRightPanel);
    const isRightPanelOpen = useUIStore(s => s.isRightPanelOpen);

    return (
        <header
            className="h-14 flex items-center justify-between px-4 flex-shrink-0 border-b"
            style={{ background: 'rgba(10,14,23,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
            <div className="flex items-center gap-3">
                <IconButton icon="menu" onClick={toggleSidebar} title="Toggle sidebar (⌘B)" />
                {activeChat && (
                    <>
                        <h2 className="font-semibold text-sm text-white truncate max-w-xs">{activeChat.title}</h2>
                        {activeChat.model && (
                            <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#195de6] uppercase tracking-wider"
                                style={{ background: 'rgba(25,93,230,0.1)', border: '1px solid rgba(25,93,230,0.2)' }}
                            >
                                {activeChat.model.split(':')[0]}
                            </span>
                        )}
                    </>
                )}
            </div>

            <div className="flex items-center gap-1">
                {isStreaming && (
                    <button
                        onClick={stopStreaming}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 transition-all mr-2"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>stop</span>
                        Stop
                    </button>
                )}
                {activeChat && (
                    <IconButton
                        icon="delete_sweep"
                        title="Clear chat"
                        onClick={() => clearChat(activeChat.id)}
                    />
                )}
                <IconButton
                    icon="dock_to_right"
                    title="Toggle system panel"
                    onClick={toggleRightPanel}
                    className={isRightPanelOpen ? 'text-[#195de6]' : ''}
                />
            </div>
        </header>
    );
}
