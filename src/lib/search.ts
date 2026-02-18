import type { Chat } from '../types/chat';

export interface SearchResult {
    chat: Chat;
    matchType: 'title' | 'message';
    snippet?: string;
}

/** Search chats by title and message content */
export function searchChats(chats: Chat[], query: string): SearchResult[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    for (const chat of chats) {
        if (chat.archived) continue;

        // Title match
        if (chat.title.toLowerCase().includes(q)) {
            results.push({ chat, matchType: 'title' });
            continue;
        }

        // Message content match — find first matching message
        for (const msg of chat.messages) {
            const idx = msg.content.toLowerCase().indexOf(q);
            if (idx !== -1) {
                const start = Math.max(0, idx - 30);
                const end = Math.min(msg.content.length, idx + q.length + 30);
                const snippet = (start > 0 ? '…' : '') + msg.content.slice(start, end) + (end < msg.content.length ? '…' : '');
                results.push({ chat, matchType: 'message', snippet });
                break;
            }
        }
    }

    return results;
}
