import type { OllamaModel, StreamOptions } from '../types/chat';

// In Tauri production builds, use the absolute 127.0.0.1 address.
// 127.0.0.1 is more reliable than 'localhost' on Windows WebView2 (avoids IPv6 resolution issues).
// In browser dev mode, use the Vite proxy (/api → localhost:11434).
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
const BASE_URL = isTauri ? 'http://127.0.0.1:11434/api' : '/api';

// ─── Connection ──────────────────────────────────────────────────────────────

export async function fetchModels(): Promise<OllamaModel[]> {
    const res = await fetch(`${BASE_URL}/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('Failed to fetch models');
    const data = await res.json();
    return data.models ?? [];
}

export async function checkConnection(): Promise<boolean> {
    try {
        await fetchModels();
        return true;
    } catch {
        return false;
    }
}

// ─── Streaming Chat ──────────────────────────────────────────────────────────

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function* streamChat(
    model: string,
    messages: ChatMessage[],
    options?: StreamOptions,
    signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
    const body: Record<string, unknown> = {
        model,
        messages,
        stream: true,
    };

    if (options) {
        body.options = {
            ...(options.temperature !== undefined && { temperature: options.temperature }),
            ...(options.top_p !== undefined && { top_p: options.top_p }),
            ...(options.num_predict !== undefined && { num_predict: options.num_predict }),
        };
    }

    const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
    });

    if (!res.ok) {
        throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.message?.content) yield json.message.content;
                } catch { /* skip malformed */ }
            }
        }

        // Flush remaining buffer
        if (buffer.trim()) {
            try {
                const json = JSON.parse(buffer);
                if (json.message?.content) yield json.message.content;
            } catch { /* skip */ }
        }
    } finally {
        reader.releaseLock();
    }
}
