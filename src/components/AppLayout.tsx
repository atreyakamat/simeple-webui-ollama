import { lazy, Suspense } from 'react';
import { Sidebar } from './layout/Sidebar';
import { TopBar } from './layout/TopBar';
import { RightPanel } from './layout/RightPanel';
import { ChatArea } from './chat/ChatArea';
import { useUIStore } from '../store/uiStore';

const SettingsModal = lazy(() => import('./settings/SettingsModal').then(m => ({ default: m.SettingsModal })));

export function AppLayout() {
    const isSettingsOpen = useUIStore(s => s.isSettingsOpen);
    const isRightPanelOpen = useUIStore(s => s.isRightPanelOpen);
    const toasts = useUIStore(s => s.toasts);
    const dismissToast = useUIStore(s => s.dismissToast);

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: '#0a0e17', color: '#f1f5f9' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
                <TopBar />
                <ChatArea />
            </div>

            {/* Right panel */}
            {isRightPanelOpen && <RightPanel />}

            {/* Settings modal */}
            {isSettingsOpen && (
                <Suspense fallback={null}>
                    <SettingsModal />
                </Suspense>
            )}

            {/* Toast notifications */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium text-white cursor-pointer"
                        style={{
                            background: toast.type === 'error' ? 'rgba(239,68,68,0.9)' : toast.type === 'success' ? 'rgba(16,185,129,0.9)' : 'rgba(25,93,230,0.9)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                        onClick={() => dismissToast(toast.id)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                            {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
                        </span>
                        {toast.message}
                    </div>
                ))}
            </div>
        </div>
    );
}
