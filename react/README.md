# React Example

React + Vite app using the `AgentProvider` and `AgentChat` components from `@kapaai/agent-react`.

Demonstrates the full SDK UI out of the box: streaming chat, tool execution with custom `render` props (progress bars, project cards), human-in-the-loop approval, and theming.

## Setup

1. Start the [session server](../server):

   ```bash
   cd ../server
   npm install && npm run dev
   ```

2. Configure and run:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your project ID and integration ID

   npm install
   npm run dev   # http://localhost:5175
   ```
