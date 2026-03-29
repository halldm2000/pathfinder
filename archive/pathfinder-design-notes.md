# Pathfinder: Design Notes

*Earth science AI expert and tool operator — idea logged March 27, 2026*

## Core Concept

Pathfinder is a dedicated AI expert system for Earth science, weather, climate, AI weather models, and digital twin applications. It is its own project, separate from Worldscope. Worldscope is a tool that AI chatbots and agents can use. Pathfinder is an AI platform, expert, and tool operator itself. Worldscope may become Pathfinder's most powerful tool, but it doesn't have to be the only one. Pathfinder could also operate Earth2Studio, query NIM endpoints, fetch observational data from NOAA or ECMWF APIs, run PhysicsNeMo training jobs, or interact with any other MCP-compatible tool that exists or gets built in the future. The separation matters architecturally: Worldscope shouldn't know or care that Pathfinder exists, and Pathfinder shouldn't depend on Worldscope to be useful.

**Repo: `halldm2000/pathfinder`** (separate from `halldm2000/worldscope`)

The flight simulator vs. pilot analogy still holds, but with an important extension: the pilot can fly other aircraft too. A pilot trained on one platform is valuable because of what they know about weather, navigation, and airspace, not because of which cockpit they're sitting in.

## Three Operating Modes

**Mode 1: Standalone Expert.** No globe, no visualization. Just a conversational AI that knows a lot about the Earth, weather and climate science, AI weather prediction models (what each one does, what inputs it needs, what resolution it runs at, strengths and weaknesses), observational data sources, and practical applications. Useful on its own for partner conversations, briefing prep, or anyone who wants to ask questions about Earth-2 capabilities without spinning up infrastructure.

**Mode 2: Tool Operator.** Pathfinder connects to external tools as an MCP client. Worldscope is the flagship (fly the globe, pull up data layers, narrate what's on screen, orchestrate visual demonstrations), but Pathfinder could equally drive Earth2Studio for model inference, query NIM endpoints for on-demand predictions, fetch NOAA or ECMWF observational data, or interact with any future MCP-compatible tool. The difference from a generic LLM using these same tools is that Pathfinder comes pre-loaded with domain knowledge: it knows which NASA GIBS layers are relevant for a hurricane analysis, which Earth-2 model to pick for a given question, and how to sequence a compelling multi-tool workflow.

**Mode 3: Model Orchestrator.** The most ambitious mode. Pathfinder serves as the connective tissue between multiple AI models running on the platform. It decides which model to invoke and how to compose their outputs. Example: "What happens to Berlin's weather if this Atlantic low-pressure system deepens?" becomes: run Atlas for the synoptic view, CorrDiff to downscale over Europe, overlay results on the globe, narrate what the models are showing. Today this pipeline composition is manual. Pathfinder would do it dynamically based on what the user is asking.

## Target Architecture: Pathfinder as an MCP Server

The core architectural insight: Pathfinder is not a chat application. It is an MCP server. The LLM (Opus, Nemotron, whatever) is not inside Pathfinder. It's outside, in whatever client the user prefers (Claude Desktop, Claude Code, Cursor, a custom app). Pathfinder sits between the LLM and the downstream tools, providing the domain expertise layer that turns a generic LLM into an Earth science expert.

```
User <-> LLM Client (Claude Desktop, etc.) <-> Pathfinder MCP <-> Worldscope MCP
         |                                                     <-> Earth2Studio
         | (the brain: Opus, Nemotron, etc.)                   <-> NIM endpoints
                                                               <-> NOAA/ECMWF APIs
                                                               <-> PhysicsNeMo
                                                               <-> (any future MCP server)
```

The LLM is the brain. Pathfinder MCP is the domain expertise layer. Worldscope MCP is one of several downstream tools that Pathfinder can delegate to. The user talks to the LLM in their preferred client, the LLM has access to Pathfinder which makes it an Earth science expert, and Pathfinder has access to Worldscope (and other tools) which give it operational capabilities.

This means Pathfinder doesn't need to build a chat UI, manage API keys, or implement an agent loop. The client already does all of that. Pathfinder just needs to be a really good MCP server.

### How MCP Makes the LLM an Expert

MCP has three primitives, and Pathfinder uses all three to inject domain expertise into whatever LLM is connected:

**Resources (the knowledge mechanism).** When a client connects to Pathfinder MCP, it can list and read resources. These are curated documents that get pulled into the LLM's context. The LLM reads them and "becomes" knowledgeable. You write the knowledge base once, and any LLM client that connects gets it.

```
earth2://models/corrdiff          -> CorrDiff model card (resolution, inputs, outputs, limitations)
earth2://models/atlas             -> Atlas/FCN3 model card
earth2://models/stormcast         -> StormCast model card
earth2://models/cbottle           -> cBottle model card
earth2://data-sources/gibs        -> catalog of 1,100+ NASA GIBS satellite imagery products
earth2://data-sources/noaa        -> NOAA data endpoints and what they provide
earth2://data-sources/ecmwf       -> ECMWF data access (ERA5, HRES, ENS)
earth2://concepts/downscaling     -> what downscaling is, when to use which method
earth2://concepts/ensemble        -> ensemble forecasting explained
earth2://concepts/digital-twin    -> what a digital twin is in the Earth-2 context
```

**Tools (the action mechanism).** Functions the LLM can call. Some are domain-specific workflows that Pathfinder handles internally. Some are pass-through orchestration where Pathfinder calls downstream MCP servers (Worldscope, Earth2Studio, etc.) on the LLM's behalf and stitches results together.

Domain tools (Pathfinder handles internally):
```
pathfinder://recommend-model      -> "I need X" -> Pathfinder picks the right Earth-2 model
pathfinder://compare-models       -> structured comparison of two or more models
pathfinder://explain-output       -> interpret model output in plain language
pathfinder://fetch-gfs-forecast   -> grab the latest GFS data for a region
pathfinder://search-knowledge     -> search the full knowledge base for a topic
```

Orchestration tools (Pathfinder delegates to downstream tools):
```
pathfinder://hurricane-analysis   -> internally calls Worldscope (fly to storm, overlay imagery,
                                     show forecast cone) + NIM (run StormCast) + NOAA (fetch track)
                                     and stitches the results together
pathfinder://downscale-region     -> fetches global forecast, runs CorrDiff via NIM or Earth2Studio,
                                     sends result to Worldscope for display
pathfinder://climate-scenario     -> runs cBottle for a given scenario, visualizes on globe
```

**Prompts (the recipe mechanism).** Pre-built conversation starters that the MCP client can offer to the user. Each one sets up the right context and guides the LLM into a specific workflow.

```
"Hurricane Analysis Mode"         -> sets up context for storm tracking and forecasting
"Climate Projection Explorer"     -> guides through cBottle CMIP6 scenarios
"Model Selection Assistant"       -> helps pick the right Earth-2 model for a task
"Conference Demo: EGU"            -> pre-loaded sequence for the EGU interactive demo
"Sovereign Deployment Advisor"    -> helps a met agency scope their AI weather setup
```

### Why This Architecture Works

**No chat UI to build.** Claude Desktop, Claude Code, Cursor, and future MCP clients all provide the conversation interface. Pathfinder doesn't compete with them.

**LLM-agnostic.** The user chooses their LLM. David uses Opus via his unlimited subscription in Claude Desktop. A partner uses their own API key. A met agency runs Nemotron locally via Ollama. Pathfinder doesn't care what's on the other end.

**Composable.** A user can connect Pathfinder MCP and Worldscope MCP to the same Claude Desktop session simultaneously. Or Pathfinder can internally connect to Worldscope as a downstream tool. Or someone can use Pathfinder without Worldscope at all. The pieces snap together however makes sense.

**Distributable.** `npm install @halldm2000/pathfinder-mcp`, add one line to your Claude Desktop config, done. The knowledge base, tools, and prompts ship with the package.

**David's own workflow gets better immediately.** Today David drives Worldscope from Claude Desktop with a generic LLM that doesn't know anything about Earth-2 models or data sources. Adding Pathfinder MCP to the same session gives Opus all that domain knowledge without changing anything else about how he works.

### Downstream Tool Connections

Pathfinder acts as an MCP client to downstream tools. The tool set is open-ended and grows as new MCP servers get built:

- **Worldscope MCP** (visualization, globe control, screenshots, layer management)
- **Earth2Studio** (model inference, ensemble generation, if/when it gets an MCP server)
- **NIM API endpoints** (on-demand predictions from NVIDIA's hosted models)
- **NOAA/ECMWF APIs** (observational data, forecast data, climate records)
- **PhysicsNeMo** (training, fine-tuning, if/when it gets an MCP server)
- **Shell/Python execution** (custom pipelines, data processing)

Any new MCP server that gets built (by David, by the Earth-2 team, by partners) automatically becomes something Pathfinder can operate. The key design principle: Pathfinder discovers and uses tools, it doesn't embed them.

### Runtime Options for the LLM

Pathfinder itself doesn't run an LLM. But the choice of LLM client matters for different deployment scenarios:

**Claude Desktop + Opus (David's setup, partners with subscriptions).** Most capable reasoning. Uses existing subscription, no additional cost. Best for development, demos, and complex exploration.

**Claude Code + Opus (David's development workflow).** Same LLM, terminal interface. Better for scripted workflows and development.

**Ollama + Nemotron on DGX Spark (sovereign deployments).** Token-cost-free, full data privacy, air-gapped. Smaller model means less capable reasoning, but for well-defined operational workflows it's sufficient. This is the deployment model that matters for national met agencies.

**NemoClaw + Nemotron (sovereign agent deployments).** NemoClaw provides its own agent loop and tool orchestration on top of Nemotron. Pathfinder MCP plugs into NemoClaw the same way it plugs into Claude Desktop. Together they give a national weather service an affordable, self-contained AI agent stack for weather operations.

**Any future MCP-compatible client.** The MCP standard is growing. Any client that supports MCP can connect to Pathfinder.

## What Would v0 Look Like?

Pathfinder v0 is an MCP server, implemented in TypeScript (consistent with Worldscope, strong MCP SDK ecosystem), that provides:

**Resources:** A curated set of Earth-2 model cards, data source catalogs, and concept explanations. Written as markdown files in the repo, served as MCP resources. This is where the domain expertise lives. Start with the ~10 most important models and ~5 most important data sources. Expand over time.

**Tools:** A handful of useful domain tools. Start simple:
- `recommend-model`: given a user's question, suggest which Earth-2 model(s) to use
- `compare-models`: structured side-by-side comparison
- `search-knowledge`: full-text search across the knowledge base
- `fetch-forecast`: grab GFS/ERA5 data for a region and time

**Prompts:** 2-3 workflow starters (hurricane analysis, model selection, general Earth science Q&A).

**Downstream MCP:** Optional connection to Worldscope MCP for visualization. When Worldscope is available, tools like `hurricane-analysis` can orchestrate the globe. When it's not, they still work but return text/data instead of visual output.

v0 works in Mode 1 (standalone expert) immediately just from the resources. Mode 2 (tool operator) comes when Worldscope MCP is connected. No fine-tuning, no RAG, no custom infrastructure. Just an MCP server with good content. Could be built in a few days with Claude Code.

Distribution: `npm install @halldm2000/pathfinder-mcp` and add to Claude Desktop config:
```json
{
  "mcpServers": {
    "pathfinder": {
      "command": "npx",
      "args": ["@halldm2000/pathfinder-mcp"]
    },
    "worldscope": {
      "command": "npx",
      "args": ["worldscope-mcp"]
    }
  }
}
```

## Competitive Context

### Globeholder.ai — Thinking Lab

Flagged by Niall Robinson on Mar 19. Investigated in detail Mar 27.

Globeholder AI is a Paris/Riyadh deep-tech startup (NVIDIA Inception member, also partnered with AWS and Core42) founded by Göknur Sirin Jubin (PhD, ML scientist) and a simulation expert. They've been building since 2024 and publicly launched their product, "Thinking Lab," on March 26, 2026. It's in limited early access with no public pricing, almost certainly enterprise SaaS.

Thinking Lab is an autonomous research platform for "planetary physical reasoning." Users pose complex physical-world questions (climate risk to a nuclear site, data center siting, infrastructure resilience), and AI agents autonomously investigate: pulling satellite imagery, geospatial data, and weather/earth foundation models, running simulations, testing hypotheses, cross-validating results, and producing auditable "insight packs" with full evidence chains. They brand this "Type-2 Intelligence" (deliberate, physics-grounded, causal) versus conventional LLM "Type-1" (pattern matching, hallucination-prone). Target customers are enterprise and government decision-makers in energy, infrastructure, and regulatory compliance.

**Same space, not really competition.** Both Pathfinder and Globeholder put AI agents in front of Earth/weather models, but the purpose, audience, and architecture diverge sharply:

- Globeholder is a closed, commercial risk analytics platform. You send it a question, it produces an auditable report. The user never sees the globe, never interacts with the models, never learns how the system works. It's a consulting firm made of AI agents.
- Pathfinder is an open, interactive, educational tool. The user sees the globe, watches models run, learns what CorrDiff does versus Atlas versus StormCast. It's for scientists, partners, conference audiences, and met agencies who want to understand and operate the technology themselves.

Pathfinder's unique niches that Globeholder doesn't touch: interactive real-time exploration (vs. static reports), education and partner enablement (vs. abstracted-away internals), sovereign local deployment via NemoClaw + DGX Spark (vs. cloud-only), open platform with Apache 2.0 plugin architecture (vs. proprietary), and live conference demo vehicle (vs. enterprise back-office tool).

Where Globeholder is ahead: funded company, structured hypothesis-testing pipeline with audit trails, enterprise go-to-market. If a utility company needs a defensible climate risk report for a regulator, Globeholder is built for that and Pathfinder is not (and shouldn't try to be).

The main takeaway is that Globeholder validates commercial demand for "AI agents reasoning about the physical world," which is encouraging for the broader space Pathfinder inhabits.

## Open Questions

- How much knowledge fits in MCP resources before clients struggle with context window limits? Need to estimate token count for the full model card + data catalog set. May need a `search-knowledge` tool to pull specific resources on demand rather than loading everything upfront.
- Can Nemotron (via Ollama on Spark) reason well enough to use Pathfinder's tools and resources effectively, or does it need a frontier model to get value from the domain knowledge?
- How does Pathfinder connect to downstream MCP servers? Does the user configure them separately in their client (both Pathfinder and Worldscope side by side), or does Pathfinder internally spawn and manage downstream MCP connections?
- Should Pathfinder have persistent memory across sessions (remembering what a user explored last time, building on previous analyses)?
- Licensing and distribution: does the knowledge base content (model docs, data catalogs) need clearance from NVIDIA before publishing to npm?
- How does Pathfinder handle the case where a downstream tool (Worldscope, Earth2Studio) is not available? Graceful degradation to text-only responses, or explicit error?
- What's the relationship between Pathfinder MCP and the existing Worldscope AI chat panel? The chat panel currently has its own simple AI integration. Does Pathfinder make that redundant, or do they serve different purposes (quick in-app chat vs. deep expert reasoning)?
- Should Pathfinder resources be static (ship with the npm package) or dynamic (fetch latest model cards from a registry, pull updated data catalogs from APIs)?
