# OllaDesk

A minimal, modern, Ollama-native chat interface.

## Tech Stack

- **React** (Vite) + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Zustand** — lightweight state management
- **IndexedDB** (via `idb`) — chat persistence

## Prerequisites

- [Ollama](https://ollama.ai) must be running locally at `http://localhost:11434`
- At least one model pulled (e.g., `ollama pull llama3.2`)

## Installation

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Features

- **Auto-detect Ollama** — connects to `localhost:11434`, shows connection status
- **Dynamic model selection** — picks up all models from `/api/tags`
- **Streaming responses** — real-time token-by-token display
- **Chat persistence** — all conversations saved in IndexedDB
- **Minimal dark UI** — zinc palette, Inter font, no visual noise
- **Create / delete chats** — full chat management
- **Copy messages** — one-click copy on any assistant message
- **Auto-scroll** — follows streaming output smoothly

## Architecture

```
src/
├── components/
│   ├── Sidebar.tsx
│   ├── ChatArea.tsx
│   ├── ChatBar.tsx
│   ├── MessageBubble.tsx
│   ├── ModelSelector.tsx
│   └── StatusBadge.tsx
├── store/
│   └── chatStore.ts
├── lib/
│   ├── ollama.ts
│   └── storage.ts
├── hooks/
│   └── useAutoScroll.ts
├── types/
│   └── chat.ts
├── App.tsx
└── main.tsx
```
