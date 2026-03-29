# Pathfinder: Design Specification

## What Pathfinder Is

Pathfinder is a framework for building AI domain experts. Each expert is defined by four artifacts: a persona, an orientation document, a retrieval index, and a monitoring plan. These artifacts can be used manually (paste into a conversation) or served automatically via MCP.

Pathfinder itself is the first expert built with this framework: its domain is "how to build AI experts." It eats its own cooking.

## Architecture Overview

```
Pathfinder (meta-expert, MCP server)
│
├── Expert definitions (~/.pathfinder/experts/)
│   ├── {domain-name}/
│   │   ├── PERSONA.md          <- system instructions
│   │   ├── ORIENTATION.md      <- briefing book (2-5k tokens, always loaded)
│   │   ├── reference/          <- deep-dive docs (500-2k tokens each, read on demand)
│   │   ├── SOURCES.md          <- ingestion + monitoring sources
│   │   ├── RETRIEVAL.md        <- retrieval strategy (three-tier hierarchy)
│   │   ├── knowledge.db        <- SQLite + vector embeddings (optional, for large corpora)
│   │   └── sources/            <- cached raw content
│   └── pathfinder/             <- Pathfinder is its own first expert
│       ├── PERSONA.md
│       ├── ORIENTATION.md
│       └── ...
│
└── MCP interface
    ├── Prompts   (conversation starters per expert)
    ├── Resources (orientation docs, loaded on demand)
    └── Tools     (create-expert, ask, search, add-source, teach, whats-new)
```

## Implementation Phases

### v0: Two Files + Reference (no code)

The minimum viable expert is PERSONA.md + ORIENTATION.md + reference/ directory. These can be:
- Used as a Claude Code project (the primary deployment model)
- Loaded into a Claude Cowork session
- Pasted into any Claude conversation's system prompt (orientation doc only; reference docs loaded as needed)
- Added to a Claude Desktop project as project knowledge
- Used as MCP prompt + resource definitions

The orientation doc is the always-loaded cheat sheet (top 50–100 facts). The reference/ directory contains deep-dive docs on key entities (10–30 files, 500–2,000 tokens each) that the expert reads on demand. Together they give the expert both breadth (orientation) and depth (reference) without web search latency.

Pathfinder's own PERSONA.md and ORIENTATION.md are the v0 deliverables. A user can paste them into Claude and say "build me an expert on X," and Pathfinder walks them through domain scoping, persona drafting, orientation writing, reference doc creation, and retrieval planning.

**What v0 proves:** That context engineering (persona + orientation + local reference depth) produces measurably better domain expertise than a generic Claude conversation — and that the expert can answer detailed questions in seconds rather than minutes. Test by asking domain-specific questions with and without the context layer, measuring both quality and response time.

### v1: MCP Server (TypeScript)

An MCP server that automates what v0 does manually.

**Prompts (conversation starters):**
- "Build a new expert" — triggers the domain scoping workflow
- "Expert mode: {name}" — loads a specific expert's persona + orientation

**Resources (loaded on demand by the LLM):**
- `expert://{name}/orientation` — the orientation document
- `expert://{name}/persona` — the persona (also usable as system prompt)
- `expert://{name}/sources` — the source list and monitoring plan

**Tools:**
- `create-expert` — guided workflow: domain scoping → archetype identification → persona generation → orientation writing
- `ask` — query an expert's knowledge (orientation doc + RAG if available)
- `search-knowledge` — vector search against the retrieval index
- `add-source` — add a URL, document, or feed to an expert's source list
- `teach` — user corrects or adds knowledge (e.g., "actually the API changed in v3.2")
- `whats-new` — check monitoring sources for recent updates
- `list-experts` — show all configured experts
- `evaluate` — run the six-probe evaluation suite against an expert

**Tech stack:**
- TypeScript + MCP SDK (`@modelcontextprotocol/sdk`)
- SQLite (`better-sqlite3`) for vector storage
- Local embeddings: Ollama `nomic-embed-text` (preferred), `@xenova/transformers` ONNX (fallback)
- Web fetch for ingestion (built-in Node fetch or lightweight scraper)
- Distribution: `npx @halldm2000/pathfinder`

**The `create-expert` workflow:**

When the user says "create me an expert on X," Pathfinder runs a guided conversation, not autonomous research:

1. Assess whether an expert is warranted (Step 0 pre-check)
2. Ask scoping questions (domain, audience, tasks, boundaries, velocity, failure cost)
3. Identify the expert archetype (see ORIENTATION.md for definitions)
4. Draft a persona based on archetype + user responses
5. Draft an orientation document, asking the user to verify key facts and fill gaps
6. Build reference docs for the top entities (detailed deep-dives, read on demand)
7. Design retrieval strategy (three-tier hierarchy) and suggest sources for monitoring
8. Run the six-probe evaluation (see ORIENTATION.md) and iterate
9. Save all artifacts to `~/.pathfinder/experts/{name}/`

This is collaborative. The user's domain knowledge combined with Pathfinder's expert-design knowledge produces better results than either alone.

### v2: Agentic Research + Monitoring

Add autonomous capabilities to the builder and serving layers.

**Agentic research during create-expert:**
- After the user provides domain scope, an agent loop searches the web, evaluates sources, fetches and parses content, and builds an initial knowledge base
- The agent has tools: web search, fetch URL, parse HTML/PDF, assess quality, chunk, embed
- The user reviews and approves the result before it becomes the expert's corpus
- Can run on any agent framework (Claude API with tool use, LangChain, or custom)

**Automated monitoring:**
- Scheduled checks of monitoring sources (cron, launchd, or built-in scheduler)
- New content is ingested, chunked, and added to the retrieval index
- High-importance updates flagged for orientation document revision
- Staleness detection: flag retrieval chunks that contradict newer information

**Expert export:**
- `pathfinder export {name}` produces a standalone MCP server package
- Package includes: persona, orientation, retrieval index, monitoring config
- Distribution via npm: `npm install @your-org/expert-name`
- Exported packages do NOT include the Pathfinder framework — just the expert

**Expert-to-expert composition:**
- Experts can reference other experts for adjacent domains
- An advisory expert can delegate to a technical reference expert for specific lookups
- Composition is via MCP tool calls, not monolithic context loading

**Orchestrator for expert maintenance:**

Experts don't maintain themselves — Pathfinder maintains them. A centralized orchestrator is preferred over N independent expert update jobs.

- One orchestrator process runs on a secondary machine (not the user's primary dev laptop). Suitable machines: a DGX Spark (if GPU-backed verification is needed), a desktop, or a secondary laptop.
- The orchestrator cycles through experts by priority, using each expert's SOURCES.md to determine what to check and how often.
- For each expert: fetch fresh content from sources, diff against current reference docs, rewrite what's changed, update "as of" dates.
- Produces git commits on a branch. The user pulls updates when ready — no disruption to active work.
- The orchestrator is a Pathfinder feature, not an expert feature. Individual experts never schedule their own updates. This keeps the boundary clean and avoids resource contention from multiple independent cron jobs.
- Open question: should the orchestrator also manage Claude Code memory files, or only Pathfinder-managed artifacts? Current recommendation: only Pathfinder artifacts. Memory files are personal and conversation-driven — they don't belong in a batch refresh cycle.

## Key Design Decisions

### The persona is the product, not the knowledge base

Most RAG systems treat the vector index as the core value. Pathfinder treats the persona + orientation document + reference docs as the core value. The retrieval index supplements them. Reasons:

1. A good persona improves every response, even when retrieval returns nothing
2. The orientation document is always in context — critical facts are always available, not subject to retrieval ranking
3. Reference docs give the expert instant depth on key entities — the answers that would otherwise require slow web searches
4. A persona encodes judgment (how to reason, when to flag uncertainty, what mistakes to avoid), which no retrieval system can provide
5. Together, persona + orientation + reference docs cover 80%+ of questions without any external calls — this is what makes an expert feel like a knowledgeable colleague rather than a slow librarian

### Collaborative creation over autonomous creation (v1)

v1's create-expert is a guided conversation, not autonomous research. Reasons:

1. The user has domain knowledge that web search cannot replicate
2. Persona design requires understanding the user's needs, not just the domain
3. A collaborative process produces artifacts the user trusts (they helped write them)
4. Autonomous research is a harder technical problem that can wait for v2

### Each expert is files + reference docs

An expert is fully defined by PERSONA.md, ORIENTATION.md, reference/ directory, SOURCES.md, and RETRIEVAL.md. The knowledge.db (vector index) is optional and derived from these. This means:

1. Experts are human-readable and human-editable
2. Experts can be version-controlled (git)
3. Experts can be shared without sharing the full retrieval index
4. The retrieval index can be rebuilt from SOURCES.md at any time
5. Reference docs give the expert instant depth without infrastructure — just file reads

### MCP uses all three primitives

- **Prompts:** Conversation starters that set up the right context
- **Resources:** Orientation docs and source lists, loaded on demand
- **Tools:** Active operations (search, teach, add-source, whats-new, evaluate)

Most MCP servers only use tools. Using all three means the LLM can decide how to engage: load the orientation doc for broad context, call a tool for a specific fact, or start a prompted workflow for a structured task.

### Archetype-driven design

Expert archetypes are design accelerators, not rigid categories. Identifying the archetype early gives the builder a template for persona emphasis, orientation doc structure, retrieval priorities, and monitoring sources. See ORIENTATION.md for archetype definitions and design implications.

## Storage Layout

```
~/.pathfinder/
  config.json                     <- global config (default embedding model, etc.)
  experts/
    {name}/
      PERSONA.md                  <- system instructions
      ORIENTATION.md              <- briefing book (always loaded)
      reference/                  <- deep-dive entity docs (read on demand)
        {entity}.md               <- one file per key entity (500-2k tokens)
      SOURCES.md                  <- ingestion + monitoring sources
      RETRIEVAL.md                <- retrieval strategy (three-tier hierarchy)
      knowledge.db                <- SQLite with embeddings (optional, for large corpora)
      sources/                    <- cached raw content
        {hash}.md                 <- parsed + cleaned source content
        {hash}.meta.json          <- source metadata (URL, title, date, type)
```

**Dual knowledge layers (Claude Code deployment):** When experts are deployed as Claude Code projects, the host environment adds a second knowledge system: `~/.claude/projects/.../memory/`. This is Claude Code's built-in memory — ad hoc, conversation-driven, per-user. It stores user preferences, project context, and corrections that emerge during conversations.

These two systems are complementary but disconnected:
- **Pathfinder artifacts** (ORIENTATION.md, reference/, RETRIEVAL.md): domain knowledge, shared, version-controlled, refreshed by the orchestrator
- **Claude Code memory** (~/.claude/projects/.../memory/): user context, personal, not version-controlled, updated during conversations

The boundary: domain facts belong in Pathfinder artifacts. User context belongs in memory. If something learned via memory is actually domain knowledge (e.g., "the API changed in v3.2"), it should be promoted to a reference doc via Pathfinder. The orchestrator manages Pathfinder artifacts only — it does not read or write Claude Code memory files.

**Shared memory in monorepo:** All experts in the same repo may share a single Claude Code memory directory. This is acceptable — user context (role, preferences, projects) is useful across experts. Experts should save only cross-expert user context to memory, not domain-specific facts or conversation ephemera. See ORIENTATION.md "Dual Knowledge Layers" for the full policy.

**Memory is per-user, not part of the repo.** Claude Code memory lives at `~/.claude/projects/.../memory/` on each user's machine — outside the git tree, never committed. This is intentional. Memories contain personal context (user role, preferences, working relationships) that is specific to one person's usage. When sharing or distributing a Pathfinder repo, memories are not included and should not be. Each new user starts with a clean memory space. Do not copy memory files into the repo thinking they are part of an expert's knowledge — domain knowledge belongs in reference docs.

## Embedding and Retrieval

**Embedding model (auto-detected):**
1. Try Ollama `nomic-embed-text` (better quality, ~270MB memory, requires Ollama)
2. Fall back to `@xenova/transformers` ONNX (pure JS, no external deps, slightly lower quality)

**Vector storage:** SQLite with embeddings stored as BLOBs. Cosine similarity search via a simple scan for v1 (fast enough for focused corpora under 10k chunks). Upgrade path to SQLite-vss or LanceDB if needed.

**Chunking:** 300–500 tokens, 50–75 token overlap, with semantic boundary respect. Never split across section headers, code blocks, or paragraph boundaries.

**Chunk metadata:** source_url, document_title, section_headers (breadcrumb), ingestion_date, source_type (paper|docs|blog|tweet|user_correction), priority (normal|high for user corrections).

**Retrieval at query time:** Top 3–5 chunks by cosine similarity. User corrections (`source_type = user_correction`) get a ranking boost. Chunks whose ingestion_date predates a contradicting orientation doc update get a ranking penalty.

## The `teach` Mechanism

When a user calls `teach` (e.g., "the API actually changed in v3.2"):

1. Store the correction as a high-priority chunk in knowledge.db
2. Search for contradicting chunks in the index and flag them
3. Surface the contradiction: "I found 3 existing chunks that say otherwise. Should I update the orientation document?"
4. If confirmed, update ORIENTATION.md with the corrected fact and date

This is how experts learn from their users. The teach mechanism is more valuable than automated monitoring because user corrections are always high-signal.

## The `evaluate` Tool

Runs the six-probe evaluation suite (boundary, staleness, calibration, contradiction, depth, comparison) against any expert. Returns a scorecard with pass/fail per probe and specific recommendations for improvement. See ORIENTATION.md for probe definitions and scoring criteria.
