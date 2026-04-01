export interface RosterExpert {
  name: string;
  archetype: string[];
  capabilities: string[];
  signals: string[];
  anti_signals: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  streaming?: boolean;
}

export interface ServerMessage {
  type:
    | "expert_list"
    | "stream_start"
    | "stream_delta"
    | "stream_done"
    | "error";
  expertId?: string;
  content?: string;
  experts?: Record<string, RosterExpert>;
  sessionId?: string;
}
