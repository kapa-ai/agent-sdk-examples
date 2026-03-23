# Next.js Example

Next.js 15 App Router app using `@kapaai/agent-react`. Session tokens are created server-side via a Route Handler — the API key never reaches the browser.

Demonstrates the same features as the React example (custom tools with `render` props, approval flow, streaming) in a Next.js context with `"use client"` directives.

## Setup

```bash
cp .env.example .env.local
# Edit .env.local with your API key, project ID, and integration ID

npm install
npm run dev   # http://localhost:5177
```

No separate session server needed — the `/api/session` Route Handler handles token creation.
