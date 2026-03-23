# Session Server

Express server that proxies session token creation to the Kapa API. Used by the `react`, `react-headless`, and `vanilla-js` examples. The Next.js example has its own API route and does not need this server.

The server keeps your API key on the backend — it never reaches the browser.

## Setup

```bash
cp .env.example .env.local
# Edit .env.local with your Kapa API key and project ID

npm install
npm run dev   # http://localhost:3456
```

## How it works

`POST /api/session` forwards to the Kapa session endpoint with the API key header and returns the session token to the browser. CORS is restricted to the example app ports (5174-5177).
