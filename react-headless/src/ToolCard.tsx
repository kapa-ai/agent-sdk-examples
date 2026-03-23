import { type ToolCallDisplay } from "@kapaai/agent-react";
import { useState } from "react";

const statusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "#40c057";
    case "error":
      return "#fa5252";
    case "denied":
      return "#fa5252";
    case "stopped":
      return "#868e96";
    case "executing":
      return "#fab005";
    case "approval_requested":
      return "#228be6";
    default:
      return "#868e96";
  }
};

type ToolCardProps = {
  tc: ToolCallDisplay;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export const ToolCard = ({ tc, onApprove, onReject }: ToolCardProps) => {
  const [expanded, setExpanded] = useState(tc.status === "approval_requested");

  return (
    <div
      style={{
        border: "1px solid #373a40",
        borderRadius: 6,
        marginBottom: 6,
        background: "#1a1b1e",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "8px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#c1c2c5",
          fontFamily: "inherit",
          fontSize: 13,
        }}
      >
        <span>{tc.displayName || tc.name}</span>
        <span style={{ fontSize: 11, color: statusColor(tc.status) }}>
          {tc.status}
          {tc.durationMs != null ? ` · ${tc.durationMs}ms` : ""}
        </span>
      </button>

      {expanded && (
        <div style={{ padding: "0 12px 10px", fontSize: 12 }}>
          {tc.status === "approval_requested" && (
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button
                onClick={() => onApprove(tc.id)}
                style={{
                  padding: "4px 14px",
                  borderRadius: 4,
                  border: "none",
                  background: "#228be6",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Allow
              </button>
              <button
                onClick={() => onReject(tc.id)}
                style={{
                  padding: "4px 14px",
                  borderRadius: 4,
                  border: "1px solid #373a40",
                  background: "none",
                  color: "#868e96",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Deny
              </button>
            </div>
          )}
          {tc.result !== undefined && (
            <pre
              style={{
                background: "#141517",
                padding: 8,
                borderRadius: 4,
                overflow: "auto",
                maxHeight: 150,
                margin: 0,
                color: "#a1a1a9",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {typeof tc.result === "string"
                ? tc.result
                : JSON.stringify(tc.result, null, 2)}
            </pre>
          )}
          {tc.sources && tc.sources.length > 0 && (
            <div
              style={{
                marginTop: 6,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#52525a",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Sources
              </span>
              {tc.sources.map((s) => (
                <a
                  key={s.sourceUrl}
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    color: "#868e96",
                    textDecoration: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {s.title || s.sourceUrl}
                </a>
              ))}
            </div>
          )}
          {tc.error && tc.status !== "stopped" && (
            <div style={{ color: "#fa5252" }}>{tc.error}</div>
          )}
        </div>
      )}
    </div>
  );
};
