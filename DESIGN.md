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
│   │   ├── ORIENTATION.md      <- briefing book (2-5k tokens)
│   │   ├── SOURCES.md          <- ingestion + monitoring sources
│   │   ├── RETRIEVAL.md        <- retrieval strategy config
│   │   ├── knowledge.db        <- SQLite + vector embeddings
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

### v0: Two Files (no code)

The minimum viable expert is PERSONA.md + ORIENTATION.md. These can be:
- Pasted into any Claude conversation's system prompt
- Added to a Claude Desktop project as project knowledge
- Used as MCP prompt + resource definitions

Pathfinder's own PERSONA.md and ORIENTATION.md are the v0 deliverables. A user can paste them into Claude and say "build me an expert on X," and Pathfinder walks them through domain scoping, persona drafting, orientation writing, and retrieval planning.

**What v0 proves:** That context engineering (persona + orientation) produces measurably better domain expertise than a generic Claude conversation. Test by asking domain-specific questions with and without the context layer.

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

1. Ask scoping questions (domain, audience, tasks, boundaries, domain velocity, failure cost)
2. Identify the expert archetype (Scientific, Tool/Platform, Advisory, Technical Reference, Creative, or blended)
3. Draft a persona based on the archetype + user responses
4. Draft an orientation document, asking the user to verify key facts and fill gaps
5. Suggest sources for ingestion and monitoring
6. Run the six-probe evaluation and iterate
7. Save all artifacts to `~/.pathfinder/experts/{name}/`

This is collaborative. The user's domain knowledge combined with Pathfinder's knowledge of expert design produces better results than either alone.

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

## Key Design Decisions

### The persona is the product, not the knowledge base

Most RAG systems treat the vector index as the core value. Pathfinder treats the persona + orientation document as the core value. The retrieval index supplements them. Reasons:

1. A good persona improves every response, even when retrieval returns nothing
2. The orientation document is always in context — critical facts are always available, not subject to retrieval ranking
3. A persona encodes judgment (how to reason, when to flag uncertainty, what mistakes to avoid), which no retrieval system can provide

### Collaborative creation over autonomous creation (v1)

v1's create-expert is a guided conversation, not autonomous research. Reasons:

1. The user has domain knowledge that web search cannot replicate
2. Persona design requires understanding the user's needs, not just the domain
3. A collaborative process produces artifacts the user trusts (they helped write them)
4. Autonomous research is a harder technical problem that can wait for v2

### Each expert is four files

An expert is fully defined by PERSONA.md, ORIENTATION.md, SOURCES.md, and RETRIEVAL.md. The knowledge.db (vector index) is derived from these. This means:

1. Experts are human-readable and human-editable
2. Experts can be version-controlled (git)
3. Experts can be shared without sharing the full retrieval index
4. The retrieval index can be rebuilt from SOURCES.md at any time

### MCP uses all three primitives

- **Prompts:** Conversation starters that set up the right context
- **Resources:** Orientation docs and source lists, loaded on demand
- **Tools:** Active operations (search, teach, add-source, whats-new, evaluate)

Most MCP servers only use tools. Using all three means the LLM can decide how to engage: load the orientation doc for broad context, call a tool for a specific fact, or start a prompted workflow for a structured task.

### Archetype-driven design

Expert archetypes (Scientific, Tool/Platform, Advisory, Technical Reference, Creative) are not rigid categories — they are design accelerators. Identifying the archetype early in the scoping process gives the builder a template for persona emphasis, orientation doc structure, retrieval priorities, and monitoring sources. This captures the patterns that emerge from building many experts, so each new expert benefits from prior experience.

## Storage Layout

```
~/.pathfinder/
  config.json                     <- global config (default embedding model, etc.)
  experts/
    {name}/
      PERSONA.md                  <- system instructions
      ORIENTATION.md              <- briefing book
      SOURCES.md                  <- ingestion + monitoring sources
      RETRIEVAL.md                <- retrieval strategy
      knowledge.db                <- SQLite with embeddings (derived, rebuildable)
      sources/                    <- cached raw content
        {hash}.md                 <- parsed + cleaned source content
        {hash}.meta.json          <- source metadata (URL, title, date, type)
```

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

Runs the six-probe evaluation suite against any expert:

1. **Boundary probe** — generates questions just outside scope, checks for clean redirection
2. **Staleness check** — asks about recent domain developments, checks for uncertainty flagging
3. **Calibration test** — asks obscure questions, checks for honest "I don't know" responses
4. **Contradiction probe** — states incorrect facts, checks whether the expert corrects them
5. **Depth test** — asks for specific numbers/versions, checks for precision vs. vagueness
6. **Comparison test** — asks for comparisons, checks for structured output format

Returns a scorecard with pass/fail per probe and specific recommendations for improvement. This is the feedback loop that makes experts get better over time.
