import { AgentProvider, type ToolDisplayMeta } from "@kapaai/agent-react";
import { useCallback, useMemo } from "react";

import { ChatUI } from "./ChatUI";
import { tools } from "./tools";

const PROJECT_ID = import.meta.env.VITE_AGENT_PROJECT_ID;
const INTEGRATION_ID = import.meta.env.VITE_AGENT_INTEGRATION_ID;
const AGENT_MODEL = import.meta.env.VITE_AGENT_MODEL;
const SESSION_SERVER = import.meta.env.VITE_SESSION_SERVER_URL;

const BUILTIN_TOOL_META: Record<string, ToolDisplayMeta> = {
  search_knowledge_base: { displayName: "Search Knowledge Base" },
};

export const App = () => {
  const getSessionToken = useCallback(async () => {
    const res = await fetch(`${SESSION_SERVER}/api/session`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(`Session failed: ${res.status}`);
    return res.json();
  }, []);

  const context = useMemo(() => ({}), []);

  return (
    <AgentProvider
      getSessionToken={getSessionToken}
      projectId={PROJECT_ID}
      integrationId={INTEGRATION_ID}
      model={AGENT_MODEL}
      tools={tools}
      context={context}
      builtinToolMeta={BUILTIN_TOOL_META}
    >
      <ChatUI />
    </AgentProvider>
  );
};
