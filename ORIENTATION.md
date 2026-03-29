# Orchestrator Orientation: Capability Map

The routing table. This is your most important artifact — if the map is good, even mediocre routing works. If the map is wrong, clever routing can't save it.

Last updated: 2026-03-28.

## Experts

### earth2 — AI Weather & Climate
**Domain:** NVIDIA Earth-2 platform, AI weather models, atmospheric science, Python code for inference
**Signals:** Model names (CorrDiff, FourCastNet, Atlas, Pangu-Weather, GraphCast, StormCast), resolution, inference, PhysicsNeMo, Earth2Studio, ERA5, NWP, atmospheric science terms
**Anti-signals:** "show me on globe" (→ worldscope), "build an expert" (→ pathfinder), "what's on my calendar" (→ calendar)
**Location:** `experts/earth2/`
**Archetype:** Scientific Domain + Tool/Platform blend

### pathfinder — Expert Builder
**Domain:** Designing and building AI domain experts. Persona engineering, orientation docs, retrieval strategies, archetypes, evaluation.
**Signals:** "build an expert", "improve the expert", "expert's persona isn't working", "new domain", archetype, orientation doc, retrieval strategy
**Anti-signals:** Specific domain questions (→ domain expert), tool operations (→ tools), "what should I use for X" (→ orchestrator handles routing itself)
**Location:** `experts/pathfinder/`
**Archetype:** Meta-expert (builds other experts)

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

## Ambiguous Query Examples

These are routing judgment calls. State your interpretation before acting.

| Query | Interpretation | Route |
|-------|---------------|-------|
| "Tell me about the hurricane" | Ambiguous: science or visualization? | "I think you want to see it on the globe — routing to Worldscope. If you meant the atmospheric science, let me know." |
| "CorrDiff resolution" | Domain fact (quick) | Consult: read Earth-2 orientation doc, answer |
| "How does Atlas work in detail?" | Domain depth | Consult: read Earth-2 orientation doc + `reference/atlas.md`, answer |
| "Show CorrDiff output on the globe" | Visualization | Worldscope tools (may need Earth-2 context for what to overlay) |
| "I need to prepare for GTC" | Multi-step workflow | Compose: "Last time you pulled model comparisons (Earth-2), built a deck (Canva), and updated the platform ref doc (filesystem). Want me to start that sequence?" |
| "What's new in AI weather?" | Domain freshness | Consult: check Earth-2 SOURCES.md dates, then search |
| "Write me an inference pipeline for Atlas" | Sustained code work | Redirect: "This needs the Earth-2 expert's full context — open a session in `experts/earth2/`." |
| "Build me a CFD expert" | Expert construction | Redirect to Pathfinder (`experts/pathfinder/`) |
| "Is the Earth-2 expert up to date?" | Maintenance | Orchestrator handles directly — check SOURCES.md dates, produce freshness report |
