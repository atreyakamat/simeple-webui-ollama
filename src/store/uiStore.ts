import { create } from 'zustand';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface UIState {
    isSidebarOpen: boolean;
    isSettingsOpen: boolean;
    isRightPanelOpen: boolean;
    toasts: Toast[];

    toggleSidebar: () => void;
    openSettings: () => void;
    closeSettings: () => void;
    toggleRightPanel: () => void;
    showToast: (message: string, type?: Toast['type']) => void;
    dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    isSidebarOpen: true,
    isSettingsOpen: false,
    isRightPanelOpen: false,
    toasts: [],

    toggleSidebar: () => set(s => ({ isSidebarOpen: !s.isSidebarOpen })),
    openSettings: () => set({ isSettingsOpen: true }),
    closeSettings: () => set({ isSettingsOpen: false }),
    toggleRightPanel: () => set(s => ({ isRightPanelOpen: !s.isRightPanelOpen })),

    showToast: (message, type = 'info') => {
        const id = Math.random().toString(36).slice(2);
        set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => get().dismissToast(id), 3500);
    },

    dismissToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));
