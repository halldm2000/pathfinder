# Orchestrator Orientation: Capability Map

The routing table. This is your most important artifact — if the map is good, even mediocre routing works. If the map is wrong, clever routing can't save it.

Last updated: 2026-03-30.

## Expert Routing

**Primary routing source:** `experts/ROSTER.yaml` — consolidated index of all expert capabilities, signals, and anti-signals. Read this file for routing decisions.

**Deep routing source:** Each expert's `MANIFEST.yaml` has full details including imports/exports (what the expert can provide to and needs from other experts).

### Routing Algorithm

1. Match the query against each expert's signals and capabilities in ROSTER.yaml.
2. If exactly one expert matches strongly → **Consult** that expert.
3. If 2+ experts match and the query benefits from multiple perspectives → **Fan-out** (see CLAUDE.md for protocol).
4. If ambiguous → state your interpretation and ask.
5. If no match → ask, don't guess.

### Current Experts

| Expert | Domain | Location |
|--------|--------|----------|
| **earth2** | AI weather/climate models, Earth-2 platform, atmospheric science | `experts/earth2/` |
| **webapp-designer** | UI/UX design, scientific viz, frontend dev, browser QA | `experts/webapp-designer/` |
| **pathfinder** | Expert-builder meta-expert, persona/orientation/evaluation design | `experts/pathfinder/` |

See ROSTER.yaml for full signal lists and capabilities per expert.

## MCP Tool Servers

### worldscope — 3D Globe Visualization
**Domain:** Interactive 3D globe, weather overlays, satellite imagery, tracking (earthquake, hurricane, flight, ship, satellite), layer management, screenshots
**Signals:** "show me", "fly to", "navigate", "globe", "map", "layers", "screenshot", "weather on globe", "wind particles", "hurricane track", "earthquake", "flight", "satellite", "ship"
**Anti-signals:** "what resolution does X run at" (→ earth2), "write code" (→ domain expert), "explain the science" (→ domain expert)
**Capabilities:** 120+ MCP tools. Weather app with GPU wind particles (GFS/ECMWF/ICON via Open-Meteo). NASA GIBS (1,100+ satellite imagery products). Real-time tracking feeds.
**Note:** Worldscope is the "visualization hands" — the Earth-2 expert is the "domain brain." For weather questions, use Earth-2 for understanding and Worldscope for display.

### filesystem
**Domain:** Read, write, edit, search local files
**Signals:** "read file", "write file", "search for", "find in", file paths, directory operations

### gmail
**Domain:** David's NVIDIA email
**Signals:** "email", "inbox", "draft", "send", "thread", "message"
**Anti-signals:** "calendar" (→ google calendar)

### google-calendar
**Domain:** David's calendar
**Signals:** "calendar", "meeting", "schedule", "free time", "event", "appointment", "tomorrow", "next week"
**Anti-signals:** "email" (→ gmail)

### google-drive
**Domain:** File storage in Google Drive
**Signals:** "drive", "shared doc", "upload", "folder", Google Docs/Sheets/Slides references

### canva
**Domain:** Design and presentations
**Signals:** "presentation", "deck", "slide", "design", "poster", "Canva"

### hugging-face
**Domain:** ML models, papers, datasets on Hugging Face Hub
**Signals:** "hugging face", "model card", "arXiv", "paper", "dataset", model names in HF format (org/model)

### chrome
**Domain:** Browser automation — navigate, read pages, interact with sites
**Signals:** "open browser", "go to URL", "read page", specific website interactions
**Note:** Use for sites that need interaction beyond what web search provides

### scheduled-tasks
**Domain:** Create and manage recurring tasks
**Signals:** "schedule", "recurring", "every week", "cron", "automate"

### session-info
**Domain:** Past Cowork/Claude Code sessions
**Signals:** "previous session", "what did we discuss", "session history", "transcript"

## Routing Examples

These illustrate routing judgment calls. State your interpretation before acting.

| Query | Mode | Route |
|-------|------|-------|
| "CorrDiff resolution" | Consult | Earth-2 orientation doc, answer directly |
| "How does Atlas work in detail?" | Consult | Earth-2 orientation + `reference/atlas.md` |
| "Make this UI look better" | Consult | Webapp-designer orientation doc |
| "Which framework for a data explorer?" | Consult | Webapp-designer orientation doc |
| "Show CorrDiff output on the globe" | Compose | Worldscope tools (may need Earth-2 context) |
| "I need to prepare for GTC" | Compose | Earth-2 + Canva + filesystem |
| "How would I visualize CorrDiff output in a web dashboard?" | Fan-out | Earth-2 (what CorrDiff produces) + webapp-designer (how to render it) |
| "Add a 3D particle viz to my dashboard" | Fan-out | Webapp-designer (Three.js/design) + Earth-2 (if weather data) |
| "Tell me about the hurricane" | Ambiguous | "Science or visualization? Routing to Worldscope. If you meant atmospheric science, let me know." |
| "Write me an inference pipeline for Atlas" | Redirect | Sustained code work → Earth-2 session |
| "Build me a CFD expert" | Redirect | Pathfinder session |
| "What's new in AI weather?" | Consult | Check Earth-2 SOURCES.md dates, then search |
| "Is the Earth-2 expert up to date?" | Maintenance | Orchestrator handles directly |
