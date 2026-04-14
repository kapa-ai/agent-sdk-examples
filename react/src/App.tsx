import {
  AgentProvider,
  AgentChat,
  type AgentChatBranding,
  type ToolDisplayMeta,
} from "@kapaai/agent-react";
import { useCallback, useMemo } from "react";

import { exampleTools } from "./tools";

const PROJECT_ID = import.meta.env.VITE_AGENT_PROJECT_ID;
const INTEGRATION_ID = import.meta.env.VITE_AGENT_INTEGRATION_ID;
const AGENT_MODEL = import.meta.env.VITE_AGENT_MODEL;
const SESSION_SERVER = import.meta.env.VITE_SESSION_SERVER_URL;

const BUILTIN_TOOL_META: Record<string, ToolDisplayMeta> = {
  search_knowledge_base: { displayName: "Search Knowledge Base" },
};

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

const App = () => {
  const getSessionToken = useCallback(async () => {
    const res = await fetch(`${SESSION_SERVER}/api/session`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(`Session failed: ${res.status}`);
    return res.json();
  }, []);

  const context = useMemo(() => ({ userId: "demo-user" }), []);

  return (
    <AgentProvider
      getSessionToken={getSessionToken}
      projectId={PROJECT_ID}
      integrationId={INTEGRATION_ID}
      model={AGENT_MODEL}
      tools={exampleTools}
      context={context}
      builtinToolMeta={BUILTIN_TOOL_META}
      theme={{ accentColor: "#2563eb", colorScheme: "dark" }}
    >
      <div style={{ height: "100vh" }}>
        <AgentChat branding={branding} />
      </div>
    </AgentProvider>
  );
};

export { App };
