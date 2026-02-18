import { create } from 'zustand';
import type { Settings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';
import { loadSettings, saveSettings } from '../lib/storage';

interface SettingsState {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: loadSettings(),

    updateSetting: (key, value) => {
        const settings = { ...get().settings, [key]: value };
        set({ settings });
        saveSettings(settings);
    },

    resetSettings: () => {
        const settings = { ...DEFAULT_SETTINGS };
        set({ settings });
        saveSettings(settings);
    },
}));
