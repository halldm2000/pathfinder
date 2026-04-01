import { useState, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";
import { ExpertRoster } from "./components/ExpertRoster";
import { ChatColumn } from "./components/ChatColumn";
import { QueryBar } from "./components/QueryBar";
import type { RosterExpert, ChatMessage, ServerMessage } from "./types";

let msgCounter = 0;
function newId() {
  return `msg-${++msgCounter}-${Date.now()}`;
}

export default function App() {
  const [experts, setExperts] = useState<Record<string, RosterExpert>>({});
  const [activeExperts, setActiveExperts] = useState<string[]>([
    "orchestrator",
  ]);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({
    orchestrator: [],
  });
  const [streaming, setStreaming] = useState<Record<string, boolean>>({});

  const handleMessage = useCallback((msg: ServerMessage) => {
    if (msg.type === "expert_list" && msg.experts) {
      setExperts(msg.experts);
    }

    if (msg.type === "stream_start" && msg.expertId) {
      const eid = msg.expertId;
      setStreaming((s) => ({ ...s, [eid]: true }));
      setChats((prev) => ({
        ...prev,
        [eid]: [
          ...(prev[eid] ?? []),
          {
            id: newId(),
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            streaming: true,
          },
        ],
      }));
    }

    if (msg.type === "stream_delta" && msg.expertId && msg.content) {
      const eid = msg.expertId;
      setChats((prev) => {
        const msgs = prev[eid] ?? [];
        const last = msgs[msgs.length - 1];
        if (last?.streaming) {
          return {
            ...prev,
            [eid]: [
              ...msgs.slice(0, -1),
              { ...last, content: last.content + msg.content },
            ],
          };
        }
        return prev;
      });
    }

    if (msg.type === "stream_done" && msg.expertId) {
      const eid = msg.expertId;
      setStreaming((s) => ({ ...s, [eid]: false }));
      setChats((prev) => {
        const msgs = prev[eid] ?? [];
        const last = msgs[msgs.length - 1];
        if (last?.streaming) {
          // Use result text if we have it and the accumulated content is empty
          const finalContent =
            last.content || msg.content || "(no response)";
          return {
            ...prev,
            [eid]: [
              ...msgs.slice(0, -1),
              { ...last, content: finalContent, streaming: false },
            ],
          };
        }
        return prev;
      });
    }

    if (msg.type === "error" && msg.expertId) {
      const eid = msg.expertId;
      setStreaming((s) => ({ ...s, [eid]: false }));
      setChats((prev) => ({
        ...prev,
        [eid]: [
          ...(prev[eid] ?? []),
          {
            id: newId(),
            role: "assistant",
            content: `Error: ${msg.content}`,
            timestamp: Date.now(),
          },
        ],
      }));
    }
  }, []);

  const { send, connected } = useWebSocket(handleMessage);

  const toggleExpert = useCallback((id: string) => {
    setActiveExperts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((e) => e !== id);
      }
      return [...prev, id];
    });
    setChats((prev) => (prev[id] ? prev : { ...prev, [id]: [] }));
  }, []);

  const sendToExpert = useCallback(
    (expertId: string, content: string) => {
      // Add user message to chat
      setChats((prev) => ({
        ...prev,
        [expertId]: [
          ...(prev[expertId] ?? []),
          { id: newId(), role: "user", content, timestamp: Date.now() },
        ],
      }));
      send(expertId, content);
    },
    [send]
  );

  const sendToAll = useCallback(
    (content: string) => {
      for (const eid of activeExperts) {
        sendToExpert(eid, content);
      }
    },
    [activeExperts, sendToExpert]
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 bg-zinc-900 shrink-0">
        <div className="text-nvidia font-bold text-lg">Pathfinder</div>
        <div className="text-zinc-500 text-sm">Multi-Expert Chat</div>
        <div className="ml-auto flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-nvidia" : "bg-red-500"}`}
          />
          <span className="text-xs text-zinc-500">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ExpertRoster
          experts={experts}
          activeExperts={activeExperts}
          onToggle={toggleExpert}
          streaming={streaming}
        />

        {/* Chat columns */}
        <div className="flex-1 flex overflow-x-auto">
          {activeExperts.map((eid) => (
            <ChatColumn
              key={eid}
              expertId={eid}
              expertName={
                eid === "orchestrator"
                  ? "Orchestrator"
                  : experts[eid]?.name ?? eid
              }
              messages={chats[eid] ?? []}
              isStreaming={streaming[eid] ?? false}
              onSend={(content) => sendToExpert(eid, content)}
              onClose={
                eid !== "orchestrator"
                  ? () => toggleExpert(eid)
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Bottom query bar — broadcast to all */}
      <QueryBar
        onSend={sendToAll}
        placeholder="Send to all active experts..."
        disabled={!connected || activeExperts.length === 0}
      />
    </div>
  );
}
