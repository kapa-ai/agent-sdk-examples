# Kapa Agent SDK — Examples

Example applications showing how to build in-product AI agents with the [Kapa Agent Framework](https://docs.kapa.ai/dev/agent/).

## Examples

| Example | Description |
|---------|-------------|
| [`react`](./react) | React + Vite app using `AgentProvider` and `AgentChat` components with custom tools |
| [`nextjs`](./nextjs) | Next.js App Router app with server-side session creation and the full chat UI |
| [`react-headless`](./react-headless) | React + Vite app using only hooks (`useAgentChat`) with a fully custom UI |
| [`vanilla-js`](./vanilla-js) | Plain JavaScript app using the `Agent` class directly, no framework |
| [`server`](./server) | Express server that proxies session token creation (used by react, react-headless, and vanilla-js) |

## Prerequisites

- Node.js 18+
- A Kapa API key, project ID, and integration ID — see [Getting Started](https://docs.kapa.ai/dev/agent/)

## Quick Start

1. **Start the session server** (not needed for the Next.js example, which has its own API route):

   ```bash
   cd server
   cp .env.example .env.local   # fill in your API key and project ID
   npm install
   npm run dev                  # http://localhost:3456
   ```

2. **Run an example**:

   ```bash
   cd react                     # or nextjs, react-headless, vanilla-js
   cp .env.example .env.local   # fill in your project ID and integration ID
   npm install
   npm run dev
   ```

## Authentication

Session tokens are created server-side using your Kapa API key, then passed to the frontend. The API key never reaches the browser.

```
Browser → Your backend → POST /agent/v1/projects/{id}/agent/sessions/ (with API key)
Browser ← session token
Browser → Kapa API → POST /agent/v1/projects/{id}/agent/chat/ (with session token)
```

The `server/` directory and the Next.js `/api/session` route both implement this pattern. In production, replace these with your own backend endpoint.

## Packages

- [`@kapaai/agent-core`](https://www.npmjs.com/package/@kapaai/agent-core) — Headless core (Agent class, streaming, tools, session management)
- [`@kapaai/agent-react`](https://www.npmjs.com/package/@kapaai/agent-react) — React hooks and UI components

## License

MIT
