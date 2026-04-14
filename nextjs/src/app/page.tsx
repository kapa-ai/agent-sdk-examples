"use client";

import {
  AgentChat,
  type AgentChatBranding,
  AgentProvider,
  type ToolDisplayMeta,
} from "@kapaai/agent-react";
import { useCallback } from "react";

import { exampleTools } from "./tools";

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;
const INTEGRATION_ID = process.env.NEXT_PUBLIC_INTEGRATION_ID!;
const AGENT_MODEL = process.env.NEXT_PUBLIC_AGENT_MODEL!;

const branding: AgentChatBranding = {
  title: "Acme Support",
  subtitle: "How can I help?",
  description: "Ask about your projects, usage, or team.",
  examplePrompts: [
    "Show me my projects",
    "What does my API usage look like?",
    'Create a new project called "Analytics v2" in us-east-1 on the pro tier',
  ],
  inputPlaceholder: "Ask the agent something...",
};

const BUILTIN_TOOL_META: Record<string, ToolDisplayMeta> = {
  search_knowledge_base: { displayName: "Search Knowledge Base" },
};

const Page = () => {
  const getSessionToken = useCallback(async () => {
    const res = await fetch("/api/session", { method: "POST" });
    if (!res.ok) throw new Error(`Session failed: ${res.status}`);
    return res.json();
  }, []);

  return (
    <AgentProvider
      getSessionToken={getSessionToken}
      projectId={PROJECT_ID}
      integrationId={INTEGRATION_ID}
      model={AGENT_MODEL}
      tools={exampleTools}
      builtinToolMeta={BUILTIN_TOOL_META}
      theme={{ accentColor: "#2563eb", colorScheme: "dark" }}
    >
      <div style={{ height: "100vh" }}>
        <AgentChat branding={branding} />
      </div>
    </AgentProvider>
  );
};

export default Page;
