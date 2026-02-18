import { openDB, type IDBPDatabase } from 'idb';
import type { Chat } from '../types/chat';
import type { Settings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

const DB_NAME = 'olladesk';
const DB_VERSION = 1;
const CHATS_STORE = 'chats';
const SETTINGS_KEY = 'olladesk_settings';

// ─── IndexedDB ───────────────────────────────────────────────────────────────

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(CHATS_STORE)) {
                    db.createObjectStore(CHATS_STORE, { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
}

export async function getChats(): Promise<Chat[]> {
    const db = await getDB();
    const chats = await db.getAll(CHATS_STORE);
    return chats.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveChat(chat: Chat): Promise<void> {
    const db = await getDB();
    await db.put(CHATS_STORE, chat);
}

export async function deleteChat(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(CHATS_STORE, id);
}

export async function clearAllChats(): Promise<void> {
    const db = await getDB();
    await db.clear(CHATS_STORE);
}

// ─── Settings (localStorage) ─────────────────────────────────────────────────

export function loadSettings(): Settings {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { ...DEFAULT_SETTINGS };
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

export function saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
