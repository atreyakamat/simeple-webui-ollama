import { useChatStore } from '../store/chatStore';

export function ModelSelector() {
    const models = useChatStore((s) => s.models);
    const selectedModel = useChatStore((s) => s.selectedModel);
    const isConnected = useChatStore((s) => s.isConnected);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        useChatStore.setState({ selectedModel: e.target.value });
    };

    if (!isConnected || models.length === 0) {
        return (
            <div className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs">
                No models available
            </div>
        );
    }

    return (
        <div className="relative">
            <select
                value={selectedModel}
                onChange={handleChange}
                className="w-full appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold px-3 py-2.5 rounded-lg cursor-pointer transition-colors focus:outline-none focus:border-zinc-600 pr-8"
            >
                {models.map((m) => (
                    <option key={m.name} value={m.name}>
                        {m.name}
                    </option>
                ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 text-[16px] pointer-events-none">
                unfold_more
            </span>
        </div>
    );
}
