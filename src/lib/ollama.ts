import type { OllamaModel } from '../types/chat';

const BASE_URL = '/api';

export async function fetchModels(): Promise<OllamaModel[]> {
    const res = await fetch(`${BASE_URL}/tags`);
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

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function* streamChat(
    model: string,
    messages: ChatMessage[],
    signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
    const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, stream: true }),
        signal,
    });

    if (!res.ok) {
        throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

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
                if (json.message?.content) {
                    yield json.message.content;
                }
            } catch {
                // skip malformed lines
            }
        }
    }

    // process remaining buffer
    if (buffer.trim()) {
        try {
            const json = JSON.parse(buffer);
            if (json.message?.content) {
                yield json.message.content;
            }
        } catch {
            // skip
        }
    }
}
