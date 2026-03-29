# Pathfinder Orientation: The Craft of Building AI Experts

Actionable reference for the Pathfinder expert-builder. Specific facts, numbers, and patterns that make the difference between an expert that works and one that confidently fails.

Last updated: March 2026. Claude's training data extends through early 2025 — anything after that needs to be in the orientation doc or RAG layer.

## Token Budgets That Work

**Persona (system prompt): 800–2,000 tokens.** Under 800 and you cannot encode scope boundaries, reasoning style, and failure modes together. Over 2,000 and the model starts losing track of instructions — later instructions contradict or dilute earlier ones. Sweet spot: 1,200–1,500 tokens.

**Orientation document: 2,000–5,000 tokens.** Loaded into every conversation. Under 2,000 and you are probably not correcting enough stale facts. Over 5,000 and you are including things the model already knows — wasting context and degrading performance by diluting corrections with redundancy.

**Reference docs: 500–2,000 tokens each, 10–30 docs per expert.** Not always loaded — read on demand. Typically 1–2 reference docs loaded per query, so effective retrieval budget per query is 1,000–4,000 tokens. These replace most web searches for detailed questions.

**RAG chunks per query: 3–5 chunks, 300–500 tokens each.** Only needed when reference corpus exceeds ~50 documents. Total RAG retrieval budget per query: 1,500–2,500 tokens.

**Total expert context per conversation: under 10,000 tokens.** Persona + orientation + 1–2 reference docs loaded on demand. This leaves the majority of the context window for the actual conversation. Reference docs are loaded and released per question, not held permanently.

## Expert Archetypes

Most experts fit one of these patterns, or a blend. The archetype determines which persona traits to emphasize, how to structure the orientation doc, and what retrieval and monitoring look like.

**Scientific Domain Expert.** Deep knowledge of a research field — models, methods, datasets, open questions. Persona emphasizes calibrated confidence ("my training suggests X" vs. "the literature confirms Y"). Orientation doc heavy on entity relationships and recent developments. Retrieval indexes papers and technical reports. Monitoring watches arXiv, conferences, key labs.
*Example:* "AI-based weather prediction — architectures, capabilities, limitations, practical usage."
*Key trait:* Distinguishes settled science from active research frontiers.

**Tool/Platform Expert.** Specific technology stack inside-out — APIs, configurations, version history, common pitfalls, migration paths. Persona emphasizes precision and version-awareness. Orientation doc heavy on version-specific facts and breaking changes. Retrieval indexes documentation and changelogs. Monitoring watches release notes, GitHub issues.
*Example:* "Kubernetes networking — CNI plugins, service mesh, network policies, debugging."
*Key trait:* Always specifies which version an answer applies to.

**Advisory/Decision Expert.** Helps users make choices — which tool, approach, tradeoff. Orientation doc maps alternatives with structured comparisons. Persona emphasizes balanced analysis and context-sensitivity. Retrieval indexes benchmarks and case studies. Monitoring watches for new entrants and shifting consensus.
*Example:* "Choosing cloud infrastructure for ML training — providers, instance types, cost models."
*Key trait:* Never recommends without stating constraints and tradeoffs.

**Technical Reference Expert.** Living documentation for a complex system — configs, APIs, data formats, error codes. Orientation doc is structured quick-reference, not prose. Persona emphasizes exactness and completeness. Retrieval is critical — details too granular for the orientation doc. Monitoring watches changelogs and deprecation notices.
*Example:* "NASA GIBS satellite imagery API — 1,100+ products, identifiers, coverage, resolution."
*Key trait:* Provides exact, copy-pasteable answers.

**Creative Domain Expert.** Knows a craft — writing, design, music, cooking. Orientation doc covers principles, schools of thought, and current trends. Persona emphasizes taste and judgment, uses domain vocabulary naturally, critiques as well as generates. Retrieval indexes exemplary works. Monitoring watches trend-setting practitioners.
*Example:* "Narrative design for video games — branching dialogue, player agency, environmental storytelling."
*Key trait:* Offers specific, opinionated feedback rather than generic encouragement.

**Blended archetypes are common.** An expert on "deploying AI weather models" blends Scientific (understanding models) with Tool/Platform (running inference) and Advisory (choosing which model). Identify the primary archetype, note secondary influences.

## Prompt Patterns That Work

**Scope triplet.** Define three zones: in-scope (answer confidently), adjacent (answer with caveats), out-of-scope (redirect). The single most effective hallucination reduction technique. Without it, the model invents plausible answers for everything.

```
You are an expert in [X]. Adjacent topics include [Y] — answer these
with explicit caveats. You are not an expert in [Z] — redirect these.
```

**Confidence tiers.** Three levels: confirmed (in the orientation doc), believed (from training, possibly stale), unknown. Eliminates vague hedging in favor of explicit uncertainty.

```
- "The orientation doc confirms..." (verified, current)
- "My training suggests... but this may be outdated" (unverified)
- "I don't have this information" (unknown — never guess)
```

**Structured response templates.** Specify output structure for recommendations and comparisons. "Always include limitations" is weaker than "End every recommendation with a Limitations section listing at least two constraints."

**Negative examples with corrections.** "Do not confuse X with Y" works. "Do not confuse X with Y — X is [specific difference], while Y is [specific difference]" works significantly better. Include the correct fact, not just the warning.

**First-person domain identity.** "You are a domain expert in..." outperforms "You have knowledge about..." The identity framing activates domain-appropriate reasoning patterns.

## Orientation Document Patterns

**Lead with the field map.** 3–5 sentences establishing domain structure: major entities, how they relate, current state of play. Without it, individual facts float unanchored.

**Entity blocks, not prose.** For each key entity, use a consistent format:

```
### [Entity Name]
- What it is: [one sentence]
- Key facts: [specifics the model might get wrong]
- Relationships: [connections to other entities]
- Common misconceptions: [what models get wrong]
- As of: [date of last verification]
```

**Date every stale-able fact.** "CorrDiff runs at 2km resolution" misleads if it changes. "As of March 2026, CorrDiff produces 2km resolution output" lets the model calibrate confidence.

**Correct, don't teach.** Omit facts the model already knows reliably. The orientation doc fixes what's wrong and adds what's missing. Every sentence restating common knowledge wastes a correction's slot.

**Include contradictions explicitly.** "Source A says X, Source B says Y. As of [date], the consensus is Z, but this is debated."

## Response Templates for Pathfinder Outputs

**Persona draft** should always contain these sections, in order: (1) Identity and scope (with scope triplet), (2) Reasoning style (structural, not aspirational), (3) Failure modes (with corrections), (4) Confidence calibration (three tiers), (5) Response structure (for common task types).

**Orientation doc draft** should always contain: (1) Field map (3–5 sentences), (2) Entity blocks for key domain concepts (summaries, not exhaustive — reference docs have depth), (3) Dated facts for anything stale-able, (4) Explicit contradictions where sources disagree.

**Reference docs** should contain: (1) One file per major entity, (2) Structured format (what it is, key details, how to use it, relationships, known issues, sources), (3) 500–2,000 tokens each, (4) Prioritized by expected question frequency.

**Scoping summary** should capture: domain, audience, tasks, boundaries, archetype (primary + secondary), domain velocity, failure cost, existing resources.

**Evaluation scorecard** should report: probe name, pass/fail, evidence (what the expert said), recommendation (what to fix).

## Three-Tier Retrieval Hierarchy

Every expert should follow this hierarchy, in order:

**Tier 1: Orientation doc (always loaded, instant).** The expert's cheat sheet. Covers the top 50–100 facts: field map, entity summaries, key relationships, dated facts, common misconceptions. If the orientation doc has the answer, use it. Do not search.

**Tier 2: Reference docs (read on demand, milliseconds).** Deep-dive files on the expert's most important entities. The expert reads the relevant file when a question goes deeper than the orientation doc covers. This is what gives an expert instant depth — the difference between a 3-second answer and a 60-second web search. If the domain has 10+ entities that users will ask detailed questions about, reference docs are mandatory, not optional.

**Tier 3: Web search (last resort, seconds).** For facts that change weekly (version numbers, benchmark leaderboards, new releases), events from the last 2–4 weeks, and topics not in the reference corpus. If the expert is doing web searches for more than ~20% of questions, the reference docs are underbuilt.

**Tier 4 (optional): RAG / vector search.** For expert corpora that grow beyond what file reads can handle (100+ documents, thousands of chunks). Most experts never need this tier.

The retrieval strategy document (RETRIEVAL.md) should specify which tier handles which question types for the specific domain, and include patterns for how to search at each tier.

## Reference Document Patterns

**One file per entity.** Each reference doc covers one model, tool, concept, or API. File name matches the entity: `reference/atlas.md`, `reference/corrdiff.md`, `reference/era5.md`.

**Target: 500–2,000 tokens per file.** Enough to answer a detailed "how does X work?" question without web search. Not so long it floods context when loaded.

**Typical expert: 10–30 reference docs.** Prioritize by question frequency. The entities that users ask about most get reference docs first.

**Structured format:**

```
### [Entity Name]

**What it is:** [One paragraph — architecture, purpose, key innovation]

**Key details:**
- [Specific numbers, dates, versions that matter]
- [Training data, resolution, performance characteristics]

**How to use it:** [Code example or workflow, if applicable]

**Relationship to other entities:** [How it connects to the rest of the ecosystem]

**Known issues / limitations:** [What to watch out for]

**Sources:** [Paper URLs, docs, repos]

As of: [date of last verification]
```

**Curation criteria — what goes where:**

| Question type | Tier | Example |
|---|---|---|
| "What is X?" (brief) | Orientation doc | "Atlas is a global probabilistic model using DiT in latent space" |
| "How does X work?" (detailed) | Reference doc | Full architecture breakdown, training details, inference patterns |
| "What's the latest version of X?" | Web search | Version numbers change between releases |
| "Show me code to do X" | Reference doc | Working code examples with imports and data loading |
| "How does X compare to Y?" | Orientation doc (structure) + reference docs (detail) | Orientation doc has the comparison framework; reference docs have the specifics |
| "Has anyone published on X this month?" | Web search | Recent publications require live search |

**The orientation doc indexes the reference docs.** Entity blocks in the orientation doc should be summaries, not exhaustive. The reference doc has the depth. The orientation doc's job is to give the expert enough context to know which reference doc to read.

**Reference docs are curated, not dumped.** The same curation discipline that applies to the orientation doc applies here. Every sentence earns its place. A 1,000-token reference doc with the right 20 facts beats a 5,000-token doc with everything from the paper. The expert can always web search for edge cases — reference docs cover the questions that come up repeatedly.

## RAG / Vector Retrieval — When and How

**RAG is for scale, not for depth.** If the expert has fewer than ~50 reference documents, file reads are faster and more reliable than vector search. RAG becomes worthwhile when the corpus grows beyond what structured file reads can handle — hundreds of papers, thousands of API pages, large codebases.

**RAG is for specifics, not for knowledge.** If retrieval fires on most queries, the orientation doc and reference docs are underbuilt. RAG should handle: exact quotes, API signatures across many versions, detailed specifications from large doc sets, cited passages from papers.

**Embedding models (as of March 2026):**
- Local: `nomic-embed-text` via Ollama (~270MB, 768 dims, strong on technical content)
- Pure JS fallback: `@xenova/transformers` ONNX (no external deps, slightly lower quality)
- Cloud: OpenAI `text-embedding-3-small` (1536 dims, best quality, requires API key)
- Under 10k chunks, quality differences are negligible. Pick based on deployment constraints.

**Chunking:** Respect semantic boundaries (never split mid-paragraph or mid-code-block). Target 300–500 tokens, 50–75 token overlap. Attach metadata: source URL, title, section breadcrumbs, ingestion date, source type. User corrections get a retrieval ranking boost.

**Reindex when orientation doc changes.** Contradicting chunks are how experts give confident-but-outdated answers — the worst failure mode.

## MCP Deployment (as of March 2026)

**MCP SDK:** `@modelcontextprotocol/sdk` (TypeScript). Three primitives map to expert delivery: Prompts (conversation starters), Resources (orientation docs on demand), Tools (search, teach, add-source, whats-new).

**Client support:** Claude Desktop, Claude Code, Cursor, Windsurf. Not all clients expose resources or prompts. Safest strategy: core knowledge in the persona (always loaded), orientation doc as a resource (for supporting clients), and a `get-orientation` tool as fallback.

**Distribution:** `npx @your-org/expert-name` is the simplest install path.

## Expert Anti-Patterns

1. **Knowledge dump.** 50k tokens of documentation in context. The model drowns. A curated 3,000-token orientation doc outperforms every time.
2. **Vague persona.** "You are helpful and knowledgeable about X." This activates nothing. The persona encodes specific judgment.
3. **Retrieval crutch.** Huge vector index, one-paragraph persona. Inverts the correct ratio. Produces a slow, inconsistent, shallow expert.
4. **Missing scope boundaries.** Without explicit out-of-scope limits, the model will hallucinate in adjacent domains.
5. **No staleness plan.** Confident but outdated answers are worse than no expert. If domain velocity is faster than quarterly, you need monitoring.
6. **Over-engineering v0.** Building RAG before persona and orientation are proven. Start with two files.
7. **Web search as knowledge.** Expert web-searches for facts it should know cold. If users regularly wait 30–60 seconds for answers about core entities, the expert needs reference docs. Web search is for freshness, not for depth.
8. **Orientation-only expert.** Orientation doc covers the top 50 facts but users ask detailed questions about the top 10 entities. Without reference docs, every "how does X work?" question triggers a web search. An expert that knows about everything but knows nothing deeply is a librarian, not a colleague.

## Evaluation: The Six Probes

Run these after building any expert. Each catches a distinct failure mode.

1. **Boundary probe.** Ask 5 questions just outside scope. Good: clean redirect. Bad: attempted answer with hallucination.
2. **Staleness check.** Ask about something recent. Good: flags uncertainty. Bad: states outdated fact confidently.
3. **Calibration test.** Ask something obscure it shouldn't know. Good: "I don't know." Bad: fabricates a plausible answer.
4. **Contradiction probe.** State an incorrect fact. Good: corrects you using orientation doc. Bad: agrees with you.
5. **Depth test.** Ask for specific numbers/versions. Good: precise answer. Bad: vague ("around 25km").
6. **Comparison test.** Ask it to compare two things. Good: follows structured format. Bad: free-form prose.

Return a scorecard: probe name, pass/fail, evidence, and specific recommendations for improvement.
