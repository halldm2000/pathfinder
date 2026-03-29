# Pathfinder Orientation: The Craft of Building AI Experts

This is the briefing book for the Pathfinder expert-builder. It contains specific, actionable knowledge about building effective AI domain experts — the precise facts, numbers, and patterns that make the difference between an expert that works and one that confidently fails.

Last updated: March 2026. Model knowledge cutoff context: Claude's training data extends through early 2025. Anything after that date needs to be in the orientation doc or RAG layer.

## Token Budgets That Work

**Persona (system prompt): 800–2,000 tokens.** Under 800 and you cannot encode scope boundaries, reasoning style, and failure modes together. Over 2,000 and the model starts losing track of instructions — later instructions contradict or dilute earlier ones. The sweet spot for most domains is 1,200–1,500 tokens.

**Orientation document: 2,000–5,000 tokens.** This is loaded into every conversation. Under 2,000 and you are probably not correcting enough stale facts. Over 5,000 and you are including things the model already knows — which wastes context and can actually degrade performance by diluting the high-value corrections with redundant information.

**RAG chunks returned per query: 3–5 chunks, 300–500 tokens each.** Returning more than 5 chunks floods the context with marginally relevant content. If you consistently need more than 5, your orientation doc is not doing its job. Total retrieval budget per query: 1,500–2,500 tokens.

**Total expert context per conversation: under 8,000 tokens.** Persona + orientation + retrieval. This leaves the vast majority of the context window for the actual conversation. Experts that consume 20k+ tokens of context upfront are knowledge dumps disguised as experts.

## Prompt Patterns That Actually Work

**Scope triplet.** Define three zones: in-scope (answer confidently), adjacent (answer with caveats), and out-of-scope (redirect). This is the single most effective hallucination reduction technique for domain experts. Without it, the model tries to be helpful on everything and invents plausible-sounding answers.

```
You are an expert in [X]. Adjacent topics include [Y] — answer these
with explicit caveats about your confidence. You are not an expert
in [Z] — redirect these questions rather than attempting an answer.
```

**Confidence tiers.** Instruct the expert to distinguish three levels: confirmed (in the orientation doc), believed (from training, possibly stale), and unknown. This eliminates vague hedging ("it might be around 25km") in favor of explicit uncertainty ("my training suggests 25km, but this may be outdated — check the latest docs").

```
When stating facts, indicate your confidence:
- "The orientation doc confirms..." (verified, current)
- "My training suggests... but this may be outdated" (unverified)
- "I don't have this information" (unknown — never guess)
```

**Structured response templates.** For experts that make recommendations or comparisons, specify the output structure. Models follow structural instructions more reliably than behavioral ones. "Always include limitations" is weaker than "End every recommendation with a Limitations section listing at least two constraints."

**Negative examples in failure modes.** "Do not confuse X with Y" works. But "Do not confuse X with Y — X is [specific difference], while Y is [specific difference]" works significantly better. The correction needs to include the correct fact, not just flag the error.

**First-person domain identity.** "You are a domain expert in..." outperforms "You have knowledge about..." The identity framing causes the model to adopt domain-appropriate reasoning patterns, not just retrieve domain facts.

## Orientation Document Patterns

**Lead with the field map.** 3–5 sentences establishing the domain structure: what the major entities are, how they relate, and what the current state of play is. This gives the model a skeleton to hang everything else on. Without it, individual facts float unanchored.

**Entity blocks, not prose.** For each key entity in the domain, use a consistent format:

```
### [Entity Name]
- What it is: [one sentence]
- Key facts: [specifics the model might get wrong — versions, dates, numbers]
- Relationships: [how it connects to other entities in this domain]
- Common misconceptions: [what people/models get wrong about this]
- As of: [date of last verification]
```

This format is scannable. The model can locate the relevant block quickly. Prose paragraphs bury facts and force the model to extract them.

**Date every fact that could go stale.** "CorrDiff runs at 2km resolution" will mislead if that changes. "As of March 2026, CorrDiff produces 2km resolution output" tells the model when this fact was verified, letting it calibrate confidence on older facts.

**Correct, don't teach.** If the model already knows a fact reliably from training, omit it. The orientation doc's job is to fix what the model gets wrong and add what it doesn't know. Every sentence that restates common knowledge is a sentence that could have carried a correction.

**Include contradictions explicitly.** If sources disagree, say so: "Source A says X, Source B says Y. As of [date], the community consensus is Z, but this is debated." This prevents the model from confidently picking whichever version its training favored.

## Retrieval (RAG) — When and How

**RAG is for specifics, not for knowledge.** If you are retrieving content to answer most queries, your orientation doc is underbuilt. RAG should fire on the minority of interactions that need: exact quotes, API signatures, detailed specifications, code examples, or cited passages.

**Embedding models (as of March 2026):**
- Best local option: `nomic-embed-text` via Ollama (~270MB, 768 dimensions, strong on technical content)
- Pure JS fallback: `@xenova/transformers` ONNX models (no external deps, slightly lower quality)
- Cloud option: OpenAI `text-embedding-3-small` (1536 dims, best quality, requires API key)
- For most expert domains with under 10k chunks, the quality difference between these is negligible. Pick based on deployment constraints, not benchmarks.

**Chunking rules:**
- Respect semantic boundaries: never split mid-paragraph, mid-code-block, or mid-section
- Target 300–500 tokens per chunk with 50–75 token overlap
- Attach metadata to every chunk: source URL, document title, section breadcrumbs, ingestion date, source type
- User corrections (`teach` entries) get a retrieval ranking boost — they are always high-signal

**Reindex when you update.** When the orientation doc changes, chunks that contradict it should be flagged or removed. Stale chunks in the retrieval index are how experts give confident-but-outdated answers — the worst failure mode.

## MCP Deployment (as of March 2026)

**MCP SDK:** `@modelcontextprotocol/sdk` (TypeScript). Stable, well-documented. The three primitives — Prompts, Resources, Tools — map cleanly to expert delivery:
- **Prompts:** Conversation starters that load the persona + orientation (e.g., "Expert mode: {name}")
- **Resources:** Orientation docs and knowledge files, loaded on demand by the LLM
- **Tools:** Active operations — search, teach, add-source, whats-new

**Client support:** Claude Desktop, Claude Code, Cursor, Windsurf, and other IDE integrations support MCP. Claude Desktop is the most complete client for resource and prompt support. Some clients only support tools. Design experts to work tool-only as a fallback.

**Practical limitation:** Not all MCP clients expose resources or prompts in their UI. The safest deployment strategy is: core knowledge in the persona (always loaded via system prompt), orientation doc as a resource (loaded by clients that support it), and a `get-orientation` tool as fallback (for clients that don't).

**Distribution:** `npx @your-org/expert-name` is the simplest install path. The user adds one entry to their MCP client config and gets the full expert.

## Expert Anti-Patterns

**The knowledge dump.** Stuffing 50k tokens of documentation into context. The model drowns in marginally relevant content and loses track of the high-value corrections. Less is more — a 3,000-token curated orientation doc outperforms a 50,000-token dump every time.

**The vague persona.** "You are helpful and knowledgeable about X." This activates nothing. The model is already helpful and knowledgeable about X. The persona needs to encode specific *judgment*: what to emphasize, what to flag, what mistakes to avoid, how to structure responses.

**The retrieval crutch.** Building a huge vector index and a one-paragraph persona. The persona does the heavy lifting; retrieval supplements it. Inverting this ratio produces an expert that is slow (retrieves on every query), inconsistent (depends on retrieval ranking), and shallow (no encoded judgment).

**Missing scope boundaries.** An expert without explicit out-of-scope boundaries will hallucinate in adjacent domains. The model wants to be helpful — it will attempt answers it should decline. Every persona needs a "what I am not" section.

**No staleness plan.** An expert that gives confident but outdated answers is worse than no expert. If the domain moves faster than quarterly, you need a monitoring plan. If you don't have one, add a warning to the persona: "My knowledge may be outdated after [date]. Flag any facts I state that seem inconsistent with recent developments."

**Over-engineering v0.** Building RAG infrastructure before the persona and orientation doc are proven. Start with two files. Test them. Fix what's wrong. Only add retrieval when you find specific questions that the orientation doc can't answer because the facts are too granular.

## Evaluation: How to Test an Expert

**Boundary probe.** Ask 5 questions that are just outside the expert's scope. A good expert redirects cleanly. A bad one attempts an answer and hallucinates.

**Staleness check.** Ask about something that changed recently in the domain. Does the expert flag uncertainty, or state the outdated fact confidently?

**Calibration test.** Ask about something obscure that the expert probably doesn't know. Does it say "I don't know" or does it fabricate a plausible answer?

**Contradiction probe.** State an incorrect fact and see if the expert corrects you (using its orientation doc) or agrees with you.

**Depth test.** Ask a question that requires specific numbers, versions, or configurations. Vague answers ("around 25km") indicate the orientation doc is missing precision.

**Comparison test.** Ask the expert to compare two things in its domain. Does the response follow the structured format the persona specifies, or does it free-form?

These six probes, run after building any expert, will catch the most common failure modes before users encounter them.
