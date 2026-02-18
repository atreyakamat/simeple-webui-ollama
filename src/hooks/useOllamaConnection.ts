import { useEffect } from 'react';
import { useChatStore } from '../store/chatStore';

/** Polls Ollama connection every 30s and updates store */
export function useOllamaConnection() {
    const checkOllamaConnection = useChatStore(s => s.checkOllamaConnection);
    const loadModels = useChatStore(s => s.loadModels);
    const loadChats = useChatStore(s => s.loadChats);

    useEffect(() => {
        // Initial load
        loadChats();
        loadModels();

        // Poll every 30s
        const interval = setInterval(() => {
            checkOllamaConnection();
        }, 30_000);

        return () => clearInterval(interval);
    }, [checkOllamaConnection, loadModels, loadChats]);
}
