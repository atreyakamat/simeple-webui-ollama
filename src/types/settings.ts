export interface Settings {
    // Appearance
    compactMode: boolean;
    animationsEnabled: boolean;
    showTimestamps: boolean;

    // Chat behavior
    defaultModel: string;
    autoTitle: boolean;
    autoScroll: boolean;
    streamResponses: boolean;

    // Inference
    temperature: number;
    topP: number;
    maxTokens: number;
    systemPrompt: string;
}

export const DEFAULT_SETTINGS: Settings = {
    compactMode: false,
    animationsEnabled: true,
    showTimestamps: true,
    defaultModel: '',
    autoTitle: true,
    autoScroll: true,
    streamResponses: true,
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    systemPrompt: '',
};
