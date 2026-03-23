import { useAgentChat } from "@kapaai/agent-react";
import { useEffect, useRef, useState } from "react";

import { Message } from "./Message";

export const ChatUI = () => {
  const {
    messages,
    isStreaming,
    sendMessage,
    resetConversation,
    stopGeneration,
    approveToolCall,
    rejectToolCall,
  } = useAgentChat();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: isStreaming ? "auto" : "smooth",
    });
  }, [messages, isStreaming]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    void sendMessage(text);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0d0d0f",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #2a2a2e",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#141517",
        }}
      >
        <strong style={{ color: "#e4e4e7", flex: 1 }}>
          Headless React Example
        </strong>
        {messages.length > 0 && (
          <button
            onClick={resetConversation}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              border: "1px solid #373a40",
              background: "none",
              color: "#c1c2c5",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            New Chat
          </button>
        )}
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#52525a",
              fontSize: 16,
            }}
          >
            Send a message to get started
          </div>
        ) : (
          messages.map((msg, i) => (
            <Message
              key={i}
              msg={msg}
              isStreaming={isStreaming && i === messages.length - 1}
              onApprove={approveToolCall}
              onReject={rejectToolCall}
            />
          ))
        )}
      </div>

      <div
        style={{
          padding: 16,
          borderTop: "1px solid #2a2a2e",
          background: "#141517",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask something..."
            rows={1}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #373a40",
              background: "#1a1b1e",
              color: "#c1c2c5",
              fontSize: 14,
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
            }}
          />
          {isStreaming ? (
            <button
              onClick={stopGeneration}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: "#e03131",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: input.trim() ? "#228be6" : "#373a40",
                color: "#fff",
                cursor: input.trim() ? "pointer" : "default",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
