export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Chat {
    id: string;
    title: string;
    model: string;
    createdAt: number;
    messages: Message[];
}

export interface OllamaModel {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
}
