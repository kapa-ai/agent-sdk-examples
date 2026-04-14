# Vanilla JS Example

Plain JavaScript example using `@kapaai/agent-core` directly, without any UI framework.

Demonstrates the `Agent` class with tool definitions, streaming callbacks, tool approval, and DOM rendering using `marked` + `DOMPurify`.

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
   npm run dev   # http://localhost:5174
   ```
