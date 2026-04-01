import type { RosterExpert } from "../types";

const ARCHETYPE_COLORS: Record<string, string> = {
  "scientific-domain": "text-blue-400",
  "tool-platform": "text-green-400",
  "advisory-decision": "text-amber-400",
  "creative-domain": "text-purple-400",
  "technical-reference": "text-cyan-400",
  "meta-expert": "text-nvidia",
};

function archetypeColor(archetypes: string[]): string {
  for (const a of archetypes) {
    if (ARCHETYPE_COLORS[a]) return ARCHETYPE_COLORS[a];
  }
  return "text-zinc-400";
}

interface Props {
  experts: Record<string, RosterExpert>;
  activeExperts: string[];
  onToggle: (id: string) => void;
  streaming: Record<string, boolean>;
}

export function ExpertRoster({
  experts,
  activeExperts,
  onToggle,
  streaming,
}: Props) {
  return (
    <aside className="w-56 border-r border-zinc-800 bg-zinc-900 p-3 shrink-0 overflow-y-auto">
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        Experts
      </h2>

      {/* Orchestrator always shown */}
      <button
        onClick={() => onToggle("orchestrator")}
        className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 flex items-center gap-2 ${
          activeExperts.includes("orchestrator")
            ? "bg-zinc-800 text-nvidia"
            : "text-zinc-400 hover:bg-zinc-800/50"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-nvidia shrink-0" />
        Orchestrator
        {streaming["orchestrator"] && (
          <span className="ml-auto text-[10px] text-nvidia animate-pulse">
            ...
          </span>
        )}
      </button>

      <div className="border-t border-zinc-800 my-2" />

      {Object.entries(experts).map(([id, expert]) => (
        <button
          key={id}
          onClick={() => onToggle(id)}
          className={`w-full text-left px-2 py-1.5 rounded text-sm mb-0.5 flex items-center gap-2 ${
            activeExperts.includes(id)
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              activeExperts.includes(id) ? "bg-current" : "bg-zinc-700"
            }`}
          />
          <span className={activeExperts.includes(id) ? archetypeColor(expert.archetype) : ""}>
            {expert.name}
          </span>
          {streaming[id] && (
            <span className="ml-auto text-[10px] text-nvidia animate-pulse">
              ...
            </span>
          )}
        </button>
      ))}
    </aside>
  );
}
