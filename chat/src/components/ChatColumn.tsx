import { useRef, useEffect, useState } from "react";
import type { ChatMessage } from "../types";

interface Props {
  expertId: string;
  expertName: string;
  messages: ChatMessage[];
  isStreaming: boolean;
  onSend: (content: string) => void;
  onClose?: () => void;
}

export function ChatColumn({
  expertId,
  expertName,
  messages,
  isStreaming,
  onSend,
  onClose,
}: Props) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput("");
  };

  const isOrchestrator = expertId === "orchestrator";

  return (
    <div
      className={`flex flex-col min-w-[360px] flex-1 border-r border-zinc-800 ${
        isOrchestrator ? "max-w-[600px]" : ""
      }`}
    >
      {/* Column header */}
      <div className="flex items-center px-3 py-2 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
        <span
          className={`font-medium text-sm ${
            isOrchestrator ? "text-nvidia" : "text-zinc-200"
          }`}
        >
          {expertName}
        </span>
        {isStreaming && (
          <span className="ml-2 text-[10px] text-nvidia animate-pulse">
            thinking...
          </span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-zinc-600 hover:text-zinc-300 text-xs"
          >
            x
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-zinc-600 text-sm text-center mt-8">
            {isOrchestrator
              ? "Send a message to the orchestrator — it routes to your experts."
              : `Ask ${expertName} anything in its domain.`}
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${
              msg.role === "user" ? "flex justify-end" : ""
            }`}
          >
            <div
              className={`max-w-[95%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-zinc-800 text-zinc-200"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-800"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="markdown-content whitespace-pre-wrap">
                  {msg.content}
                  {msg.streaming && (
                    <span className="inline-block w-1.5 h-4 bg-nvidia ml-0.5 animate-pulse" />
                  )}
                </div>
              ) : (
                <div>{msg.content}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Per-column input */}
      <form
        onSubmit={handleSubmit}
        className="p-2 border-t border-zinc-800 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${expertName}...`}
          disabled={isStreaming}
          className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-nvidia disabled:opacity-50"
        />
      </form>
    </div>
  );
}
