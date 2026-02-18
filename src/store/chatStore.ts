import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Chat, Message, OllamaModel } from '../types/chat';
import { fetchModels, checkConnection, streamChat } from '../lib/ollama';
import { getChats, saveChat, deleteChat as removeChat, clearAllChats } from '../lib/storage';
import { searchChats, type SearchResult } from '../lib/search';
import { generateTitle } from '../lib/utils';
import { useSettingsStore } from './settingsStore';

interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
    models: OllamaModel[];
    selectedModel: string;
    isConnected: boolean;
    isStreaming: boolean;
    abortController: AbortController | null;
    searchQuery: string;
    searchResults: SearchResult[];

    // Data loading
    loadChats: () => Promise<void>;
    loadModels: () => Promise<void>;
    checkOllamaConnection: () => Promise<void>;

    // Chat CRUD
    createChat: () => void;
    setActiveChat: (id: string) => void;
    deleteChat: (id: string) => Promise<void>;
    renameChat: (id: string, title: string) => Promise<void>;
    duplicateChat: (id: string) => Promise<void>;
    clearChat: (id: string) => Promise<void>;
    clearAllChats: () => Promise<void>;

    // Messaging
    sendMessage: (content: string) => Promise<void>;
    regenerateLastResponse: () => Promise<void>;
    stopStreaming: () => void;

    // Search
    setSearchQuery: (q: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    chats: [],
    activeChatId: null,
    models: [],
    selectedModel: '',
    isConnected: false,
    isStreaming: false,
    abortController: null,
    searchQuery: '',
    searchResults: [],

    // ─── Loading ────────────────────────────────────────────────────────────────

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
            const settings = useSettingsStore.getState().settings;
            const preferred = settings.defaultModel;
            const selectedModel = models.find(m => m.name === preferred)?.name ?? (models[0]?.name ?? '');
            set({ models, selectedModel, isConnected: true });
        } catch {
            set({ models: [], isConnected: false });
        }
    },

    checkOllamaConnection: async () => {
        const connected = await checkConnection();
        set({ isConnected: connected });
        if (connected) await get().loadModels();
    },

    // ─── Chat CRUD ──────────────────────────────────────────────────────────────

    createChat: () => {
        const { selectedModel } = get();
        const now = Date.now();
        const chat: Chat = {
            id: uuidv4(),
            title: 'New Chat',
            model: selectedModel,
            createdAt: now,
            updatedAt: now,
            archived: false,
            messages: [],
        };
        set(state => ({ chats: [chat, ...state.chats], activeChatId: chat.id }));
        saveChat(chat);
    },

    setActiveChat: (id) => set({ activeChatId: id }),

    deleteChat: async (id) => {
        await removeChat(id);
        set(state => {
            const chats = state.chats.filter(c => c.id !== id);
            const activeChatId = state.activeChatId === id
                ? (chats[0]?.id ?? null)
                : state.activeChatId;
            return { chats, activeChatId };
        });
    },

    renameChat: async (id, title) => {
        set(state => {
            const chats = state.chats.map(c =>
                c.id === id ? { ...c, title, updatedAt: Date.now() } : c
            );
            return { chats };
        });
        const chat = get().chats.find(c => c.id === id);
        if (chat) await saveChat(chat);
    },

    duplicateChat: async (id) => {
        const chat = get().chats.find(c => c.id === id);
        if (!chat) return;
        const now = Date.now();
        const copy: Chat = {
            ...chat,
            id: uuidv4(),
            title: `${chat.title} (copy)`,
            createdAt: now,
            updatedAt: now,
        };
        set(state => ({ chats: [copy, ...state.chats], activeChatId: copy.id }));
        await saveChat(copy);
    },

    clearChat: async (id) => {
        const now = Date.now();
        set(state => ({
            chats: state.chats.map(c =>
                c.id === id ? { ...c, messages: [], updatedAt: now } : c
            ),
        }));
        const chat = get().chats.find(c => c.id === id);
        if (chat) await saveChat(chat);
    },

    clearAllChats: async () => {
        await clearAllChats();
        set({ chats: [], activeChatId: null });
    },

    // ─── Messaging ──────────────────────────────────────────────────────────────

    sendMessage: async (content) => {
        const { activeChatId, chats, selectedModel } = get();
        if (!activeChatId || !content.trim()) return;

        const chat = chats.find(c => c.id === activeChatId);
        if (!chat) return;

        const settings = useSettingsStore.getState().settings;
        const now = Date.now();

        const userMsg: Message = { id: uuidv4(), role: 'user', content: content.trim(), timestamp: now };
        const assistantMsg: Message = { id: uuidv4(), role: 'assistant', content: '', timestamp: now };

        const isFirst = chat.messages.length === 0;
        const title = isFirst && settings.autoTitle ? generateTitle(content) : chat.title;

        const updatedChat: Chat = {
            ...chat,
            title,
            model: selectedModel,
            updatedAt: now,
            messages: [...chat.messages, userMsg, assistantMsg],
        };

        set(state => ({
            chats: state.chats.map(c => c.id === activeChatId ? updatedChat : c),
            isStreaming: true,
        }));
        await saveChat(updatedChat);

        const abortController = new AbortController();
        set({ abortController });

        try {
            // Build message history for Ollama (include system prompt if set)
            const history = updatedChat.messages
                .filter(m => m.role === 'user' || (m.role === 'assistant' && m.content))
                .map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content }));

            if (settings.systemPrompt) {
                history.unshift({ role: 'system', content: settings.systemPrompt });
            }

            const streamOptions = {
                temperature: settings.temperature,
                top_p: settings.topP,
                num_predict: settings.maxTokens,
            };

            for await (const chunk of streamChat(selectedModel, history, streamOptions, abortController.signal)) {
                set(state => {
                    const c = state.chats.find(c => c.id === activeChatId);
                    if (!c) return state;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role === 'assistant') {
                        msgs[msgs.length - 1] = { ...last, content: last.content + chunk };
                    }
                    return { chats: state.chats.map(x => x.id === activeChatId ? { ...c, messages: msgs } : x) };
                });
            }
        } catch (err) {
            if (!(err instanceof DOMException && err.name === 'AbortError')) {
                set(state => {
                    const c = state.chats.find(c => c.id === activeChatId);
                    if (!c) return state;
                    const msgs = [...c.messages];
                    const last = msgs[msgs.length - 1];
                    if (last?.role === 'assistant') {
                        msgs[msgs.length - 1] = {
                            ...last,
                            content: last.content || `⚠️ Error: ${err instanceof Error ? err.message : 'Failed to get response'}`,
                        };
                    }
                    return { chats: state.chats.map(x => x.id === activeChatId ? { ...c, messages: msgs } : x) };
                });
            }
        } finally {
            const finalChat = get().chats.find(c => c.id === activeChatId);
            if (finalChat) await saveChat(finalChat);
            set({ isStreaming: false, abortController: null });
        }
    },

    regenerateLastResponse: async () => {
        const { activeChatId, chats } = get();
        if (!activeChatId) return;
        const chat = chats.find(c => c.id === activeChatId);
        if (!chat || chat.messages.length < 2) return;

        // Remove last assistant message
        const msgs = [...chat.messages];
        if (msgs[msgs.length - 1]?.role === 'assistant') msgs.pop();
        const lastUserMsg = msgs[msgs.length - 1];
        if (!lastUserMsg || lastUserMsg.role !== 'user') return;

        const now = Date.now();
        const updatedChat = { ...chat, messages: msgs, updatedAt: now };
        set(state => ({ chats: state.chats.map(c => c.id === activeChatId ? updatedChat : c) }));
        await saveChat(updatedChat);

        await get().sendMessage(lastUserMsg.content);
    },

    stopStreaming: () => {
        get().abortController?.abort();
    },

    // ─── Search ─────────────────────────────────────────────────────────────────

    setSearchQuery: (q) => {
        const results = searchChats(get().chats, q);
        set({ searchQuery: q, searchResults: results });
    },
}));
