import { type ConversationMessage } from "@kapaai/agent-react";
import DOMPurify from "dompurify";
import { marked } from "marked";

import { ToolCard } from "./ToolCard";

type MessageProps = {
  msg: ConversationMessage;
  isStreaming: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export const Message = ({
  msg,
  isStreaming,
  onApprove,
  onReject,
}: MessageProps) => {
  if (msg.role === "user") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "8px 16px",
        }}
      >
        <div
          style={{
            background: "#2a2a2e",
            padding: "8px 14px",
            borderRadius: 12,
            maxWidth: "80%",
            color: "#c1c2c5",
            fontSize: 14,
            whiteSpace: "pre-wrap",
          }}
        >
          {msg.content}
        </div>
      </div>
    );
  }

  if (msg.isError) {
    return (
      <div style={{ padding: "8px 16px" }}>
        <div
          style={{
            background: "rgba(250,82,82,0.1)",
            border: "1px solid rgba(250,82,82,0.3)",
            color: "#fa5252",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 16px" }}>
      {msg.blocks.map((block, i) => {
        if (block.type === "text" && block.content) {
          return (
            <div
              key={i}
              className="md"
              style={{ fontSize: 14, color: "#c1c2c5", lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  marked.parse(block.content) as string
                ),
              }}
            />
          );
        }
        if (block.type === "tool_calls") {
          return (
            <div key={i} style={{ margin: "8px 0" }}>
              {block.toolCalls.map((tc) => (
                <ToolCard
                  key={tc.id}
                  tc={tc}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))}
            </div>
          );
        }
        return null;
      })}
      {isStreaming && msg.blocks.length === 0 && (
        <span style={{ color: "#868e96" }}>...</span>
      )}
    </div>
  );
};
