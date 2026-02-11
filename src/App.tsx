import { useEffect } from 'react';
import { useChatStore } from './store/chatStore';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';

export default function App() {
  const loadModels = useChatStore((s) => s.loadModels);
  const loadChats = useChatStore((s) => s.loadChats);

  useEffect(() => {
    loadModels();
    loadChats();

    // Periodically check connection
    const interval = setInterval(() => {
      useChatStore.getState().checkOllamaConnection();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadModels, loadChats]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
