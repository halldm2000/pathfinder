import { useEffect, useRef, useCallback, useState } from "react";
import type { ServerMessage } from "./types";

export function useWebSocket(onMessage: (msg: ServerMessage) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 2s
      setTimeout(() => {
        wsRef.current = null;
      }, 2000);
    };
    ws.onmessage = (event) => {
      const msg: ServerMessage = JSON.parse(event.data);
      onMessageRef.current(msg);
    };

    return () => {
      ws.close();
    };
  }, []);

  const send = useCallback(
    (expertId: string, content: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: "send_message", expertId, content })
        );
      }
    },
    []
  );

  return { send, connected };
}
