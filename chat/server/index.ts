import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { readFileSync } from "fs";
import { resolve, join } from "path";
import yaml from "js-yaml";
import { query } from "@anthropic-ai/claude-agent-sdk";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const EXPERTS_DIR = join(REPO_ROOT, "experts");
const PORT = 5181;

// Load roster
interface RosterExpert {
  name: string;
  archetype: string[];
  capabilities: string[];
  signals: string[];
  anti_signals: string[];
}

interface Roster {
  expert_count: number;
  experts: Record<string, RosterExpert>;
}

function loadRoster(): Roster {
  const raw = readFileSync(join(EXPERTS_DIR, "ROSTER.yaml"), "utf-8");
  return yaml.load(raw) as Roster;
}

// Message types between client and server
interface ClientMessage {
  type: "send_message";
  expertId: string; // expert id or "orchestrator"
  content: string;
  sessionId?: string;
}

interface ServerMessage {
  type: "expert_list" | "stream_start" | "stream_delta" | "stream_done" | "error";
  expertId?: string;
  content?: string;
  experts?: Record<string, RosterExpert>;
  sessionId?: string;
}

function send(ws: WebSocket, msg: ServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

async function handleExpertQuery(
  ws: WebSocket,
  expertId: string,
  content: string
) {
  const isOrchestrator = expertId === "orchestrator";
  const cwd = isOrchestrator ? REPO_ROOT : join(EXPERTS_DIR, expertId);

  send(ws, { type: "stream_start", expertId });

  try {
    const stream = query({
      prompt: content,
      options: {
        cwd,
        allowedTools: [
          "Read",
          "Glob",
          "Grep",
          "Agent",
          "WebSearch",
          "WebFetch",
        ],
        maxTurns: 15,
      },
    });

    for await (const message of stream) {
      if (message.type === "assistant") {
        for (const block of message.message.content) {
          if (block.type === "text") {
            send(ws, {
              type: "stream_delta",
              expertId,
              content: block.text,
            });
          }
        }
      }

      if (message.type === "result") {
        const resultText =
          message.subtype === "success" ? message.result : "";
        send(ws, {
          type: "stream_done",
          expertId,
          content: resultText ?? "",
          sessionId: message.session_id,
        });
      }
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    send(ws, {
      type: "error",
      expertId,
      content: `Error querying ${expertId}: ${errMsg}`,
    });
  }
}

// Express + WebSocket server
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

// REST endpoint: list experts
app.get("/api/experts", (_req, res) => {
  const roster = loadRoster();
  res.json(roster.experts);
});

// WebSocket: handle chat messages
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Send expert list on connect
  const roster = loadRoster();
  send(ws, { type: "expert_list", experts: roster.experts });

  ws.on("message", (raw) => {
    try {
      const msg: ClientMessage = JSON.parse(raw.toString());
      if (msg.type === "send_message") {
        // Fire and forget — response streams back via WebSocket
        handleExpertQuery(ws, msg.expertId, msg.content);
      }
    } catch (err) {
      console.error("Bad message:", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Pathfinder Chat server on http://localhost:${PORT}`);
  console.log(`Repo root: ${REPO_ROOT}`);
  console.log(`Experts: ${Object.keys(loadRoster().experts).join(", ")}`);
});
