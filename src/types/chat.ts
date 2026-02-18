// ─── Message ────────────────────────────────────────────────────────────────
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export interface Chat {
    id: string;
    title: string;
    model: string;
    createdAt: number;
    updatedAt: number;
    archived: boolean;
    messages: Message[];
}

// ─── Ollama ──────────────────────────────────────────────────────────────────
export interface OllamaModel {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
}

export interface StreamOptions {
    temperature?: number;
    top_p?: number;
    num_predict?: number;
}
