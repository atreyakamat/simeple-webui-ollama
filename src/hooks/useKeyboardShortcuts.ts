import { useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useUIStore } from '../store/uiStore';

/** Global keyboard shortcuts */
export function useKeyboardShortcuts() {
    const createChat = useChatStore(s => s.createChat);
    const openSettings = useUIStore(s => s.openSettings);
    const closeSettings = useUIStore(s => s.closeSettings);
    const isSettingsOpen = useUIStore(s => s.isSettingsOpen);
    const toggleSidebar = useUIStore(s => s.toggleSidebar);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const meta = e.metaKey || e.ctrlKey;

            // Cmd/Ctrl + K → new chat
            if (meta && e.key === 'k') {
                e.preventDefault();
                createChat();
            }

            // Cmd/Ctrl + , → toggle settings
            if (meta && e.key === ',') {
                e.preventDefault();
                if (isSettingsOpen) closeSettings();
                else openSettings();
            }

            // Cmd/Ctrl + B → toggle sidebar
            if (meta && e.key === 'b') {
                e.preventDefault();
                toggleSidebar();
            }

            // Escape → close settings
            if (e.key === 'Escape' && isSettingsOpen) {
                closeSettings();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [createChat, openSettings, closeSettings, isSettingsOpen, toggleSidebar]);
}
