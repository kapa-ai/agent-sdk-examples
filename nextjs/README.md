# Next.js Example

Next.js 15 App Router app using `@kapaai/agent-react`. Session tokens are created server-side via a Route Handler — the API key never reaches the browser.

Demonstrates:

- Server-side session creation via a Route Handler (`/api/session`)
- `AgentProvider` and `AgentChat` components with `"use client"` directives
- Custom tools with Zod schemas and type-safe argument inference
- Tool `render` props for inline UI (usage stats with progress bars, project creation card)
- Human-in-the-loop approval flow (`needsApproval`) for write operations
- Streaming responses with the built-in chat UI
- Theming configuration (accent color, color scheme)

## Setup

```bash
cp .env.example .env.local
# Edit .env.local with your API key, project ID, and integration ID

npm install
npm run dev   # http://localhost:5177
```

No separate session server needed — the `/api/session` Route Handler handles token creation.
