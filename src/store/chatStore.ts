import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Chat, Message, OllamaModel } from '../types/chat';
import { fetchModels, checkConnection, streamChat } from '../lib/ollama';
import { getChats, saveChat, deleteChat as removeChat } from '../lib/storage';

interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
    models: OllamaModel[];
    selectedModel: string;
    isConnected: boolean;
    isStreaming: boolean;
    abortController: AbortController | null;

    loadChats: () => Promise<void>;
    loadModels: () => Promise<void>;
    checkOllamaConnection: () => Promise<void>;
    createChat: () => void;
    setActiveChat: (id: string) => void;
    deleteChat: (id: string) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    stopStreaming: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    chats: [],
    activeChatId: null,
    models: [],
    selectedModel: '',
    isConnected: false,
    isStreaming: false,
    abortController: null,

    loadChats: async () => {
        const chats = await getChats();
        set({ chats });
        if (chats.length > 0 && !get().activeChatId) {
            set({ activeChatId: chats[0].id });
        }
    },

    loadModels: async () => {
        try {
            const models = await fetchModels();
            set({
                models,
                selectedModel: models.length > 0 ? models[0].name : '',
                isConnected: true,
            });
        } catch {
            set({ models: [], isConnected: false });
        }
    },

    checkOllamaConnection: async () => {
        const connected = await checkConnection();
        set({ isConnected: connected });
        if (connected) {
            await get().loadModels();
        }
    },

    createChat: () => {
        const { selectedModel } = get();
        const chat: Chat = {
            id: uuidv4(),
            title: 'New Chat',
            model: selectedModel,
            createdAt: Date.now(),
            messages: [],
        };
        set((state) => ({
            chats: [chat, ...state.chats],
            activeChatId: chat.id,
        }));
        saveChat(chat);
    },

    setActiveChat: (id: string) => {
        set({ activeChatId: id });
    },

    deleteChat: async (id: string) => {
        await removeChat(id);
        set((state) => {
            const chats = state.chats.filter((c) => c.id !== id);
            const activeChatId =
                state.activeChatId === id
                    ? chats.length > 0
                        ? chats[0].id
                        : null
                    : state.activeChatId;
            return { chats, activeChatId };
        });
    },

    sendMessage: async (content: string) => {
        const { activeChatId, chats, selectedModel } = get();
        if (!activeChatId || !content.trim()) return;

        const chat = chats.find((c) => c.id === activeChatId);
        if (!chat) return;

        // Create user message
        const userMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content: content.trim(),
            timestamp: Date.now(),
        };

        // Auto-generate title from first user message
        const isFirstMessage = chat.messages.length === 0;
        const title = isFirstMessage
            ? content.trim().slice(0, 50) + (content.trim().length > 50 ? '...' : '')
            : chat.title;

        // Create assistant placeholder
        const assistantMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
        };

        const updatedMessages = [...chat.messages, userMessage, assistantMessage];
        const updatedChat: Chat = {
            ...chat,
            title,
            model: selectedModel,
            messages: updatedMessages,
        };

        // Update state
        set((state) => ({
            chats: state.chats.map((c) => (c.id === activeChatId ? updatedChat : c)),
            isStreaming: true,
        }));
        await saveChat(updatedChat);

        // Stream response
        const abortController = new AbortController();
        set({ abortController });

        try {
            const chatMessages = updatedMessages
                .filter((m) => m.role === 'user' || (m.role === 'assistant' && m.content))
                .map((m) => ({ role: m.role, content: m.content }));

            for await (const chunk of streamChat(selectedModel, chatMessages, abortController.signal)) {
                set((state) => {
                    const chat = state.chats.find((c) => c.id === activeChatId);
                    if (!chat) return state;

                    const messages = [...chat.messages];
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                        messages[messages.length - 1] = {
                            ...lastMsg,
                            content: lastMsg.content + chunk,
                        };
                    }

                    const updatedChat = { ...chat, messages };
                    return {
                        chats: state.chats.map((c) => (c.id === activeChatId ? updatedChat : c)),
                    };
                });
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                // User cancelled — that's fine
            } else {
                // Show error in assistant message
                set((state) => {
                    const chat = state.chats.find((c) => c.id === activeChatId);
                    if (!chat) return state;

                    const messages = [...chat.messages];
                    const lastMsg = messages[messages.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                        messages[messages.length - 1] = {
                            ...lastMsg,
                            content: lastMsg.content || `Error: ${err instanceof Error ? err.message : 'Failed to get response'}`,
                        };
                    }

                    const updatedChat = { ...chat, messages };
                    return {
                        chats: state.chats.map((c) => (c.id === activeChatId ? updatedChat : c)),
                    };
                });
            }
        } finally {
            // Save final state
            const finalChat = get().chats.find((c) => c.id === activeChatId);
            if (finalChat) {
                await saveChat(finalChat);
            }
            set({ isStreaming: false, abortController: null });
        }
    },

    stopStreaming: () => {
        const { abortController } = get();
        if (abortController) {
            abortController.abort();
        }
    },
}));
