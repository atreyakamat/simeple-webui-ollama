import { openDB, type IDBPDatabase } from 'idb';
import type { Chat } from '../types/chat';

const DB_NAME = 'olladesk';
const DB_VERSION = 1;
const STORE_NAME = 'chats';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
}

export async function getChats(): Promise<Chat[]> {
    const db = await getDB();
    const chats = await db.getAll(STORE_NAME);
    return chats.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveChat(chat: Chat): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, chat);
}

export async function deleteChat(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
}
