# React Headless Example

React + Vite app using only the `useAgentChat()` hook from `@kapaai/agent-react` with a fully custom UI. No SDK UI components are used — all rendering is hand-built.

Demonstrates how to build a complete chat experience using only the SDK's hooks and types: custom message bubbles, custom tool cards with expand/collapse and approval buttons, markdown rendering via `marked` + `DOMPurify`, and streaming state management.

## Setup

1. Start the [session server](../server):

   ```bash
   cd ../server
   npm install && npm run dev
   ```

2. Configure and run:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your project ID, integration ID, and model

   npm install
   npm run dev   # http://localhost:5176
   ```
