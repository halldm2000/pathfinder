# Expert Conventions

Cross-cutting rules that apply to all experts in this repo. The orchestrator checks compliance during freshness sweeps.

Last updated: 2026-03-30.

## Session Greeting

Every expert must introduce itself on session start with a single-line greeting: who it is and what it does. Then offer: "Ask me what I can help with if you want details." Do not list capabilities, bullet points, or examples unless the user asks.

## Confidence Calibration

Every expert must distinguish between:
- **Confirmed**: facts from its orientation doc or verified sources
- **Believed**: patterns from training, generally reliable but not absolute
- **Unknown**: explicitly state "I don't know" rather than guessing

## Failure Modes

Every expert's PERSONA.md must include a "Failure Modes" section listing specific things the model tends to get wrong in this domain, with corrections.

## Docs Over Assumptions

When assessing external codebases or projects, check `git log` for recent changes rather than relying solely on documentation. Docs go stale; commits don't.

## Freshness

Every expert with fast-moving domain knowledge must have a SOURCES.md listing what to monitor and when it was last checked. The orchestrator checks these dates during maintenance sweeps.

### SOURCES.md Format

Sources are organized into priority groups (Primary, Secondary, etc.). Each group has a check cadence and a `last_checked` date:

```markdown
## Primary Sources (check weekly)
Last checked: 2026-03-29

### NVIDIA Earth-2
- **Earth2Studio GitHub**: github.com/NVIDIA/earth2studio (releases, changelogs)
...
```

Rules:
- `last_checked` is per group, not per individual source. Per-source dates are noise at this scale.
- The date records when the Orchestrator last swept that group, regardless of whether anything new was found.
- If a group has never been checked, write `Last checked: never`.

### Freshness Check Routine

The Orchestrator executes freshness checks. Pathfinder designs the protocol. Individual experts never schedule their own updates.

**For each source group, by type:**

| Source type | What to check | How |
|---|---|---|
| GitHub repos | Latest release tag, date, changelog | Fetch releases page or use `gh` CLI |
| arXiv | Recent papers matching domain keywords | Search arXiv or HuggingFace paper_search |
| Blogs / news sites | New posts since last check | Web fetch, scan for new entries |
| HuggingFace | New model uploads in relevant collections | HuggingFace hub search tools |
| Benchmarks | Leaderboard position changes | Web fetch the leaderboard page |
| Conferences | Upcoming deadlines, accepted papers, announcements | Web search for recent program/schedule |
| Journals | High-impact publications in domain | arXiv cross-listings, journal RSS |

**After checking each group:**
1. Update the group's `last_checked` date in SOURCES.md
2. If new information was found, update the appropriate reference doc or orientation doc
3. Append a NEWS.md entry describing what changed (see NEWS.md below)

### Update Thresholds

**Minor update — Orchestrator handles directly:**
- New version/release of an existing tool or model
- Updated benchmark position or performance number
- New paper that extends the existing landscape (no new category)
- Corrected date, URL, or factual detail
- New conference deadline or result

These update reference docs and/or orientation doc in place. Commit with a descriptive message.

**Major structural change — route to Pathfinder:**
- New model category or entity that needs its own reference doc
- Fundamental architecture change in a key entity
- Scope expansion or contraction of the expert
- New source category to monitor
- Redesign of retrieval strategy

The Orchestrator flags these and defers to Pathfinder for design.

### Freshness Cadence

| Priority | Cadence | Typical sources |
|---|---|---|
| Primary | Weekly | Core repos, key research groups, benchmarks |
| Secondary | Monthly | Operational deployment, adjacent research, journals |
| Conferences | Event-driven | Check 2 weeks before and 1 week after major events |

When run on demand, the Orchestrator checks all groups. When scheduled, it follows these cadences.

## NEWS.md

Every expert with a SOURCES.md must also have a NEWS.md. This is the user-facing changelog — what changed and why it matters, written editorially, not as a doc diff.

### Format

```markdown
# Earth-2 Expert: News

## YYYY-MM-DD
- **Headline** — One-to-three line summary of what changed and why it matters

## YYYY-MM-DD
- **Headline** — Summary
- **Headline** — Summary
```

### Rules

- Newest entries at the top.
- Written for the user, not for the system. Answer: *what changed, why it matters, when.*
- Each entry is 1–3 lines. Link to the source if useful.
- Written by the Orchestrator during freshness checks, or by the expert if it discovers something new during a conversation.
- Entries older than 3 months may be archived or removed — the underlying reference docs already reflect the change.
- The Orchestrator reads `experts/*/NEWS.md` to produce cross-expert summaries on demand or at session start.

## MANIFEST.yaml

Every expert must have a `MANIFEST.yaml` — a machine-readable capability declaration used by the orchestrator for routing. This is separate from PERSONA.md (which is human-readable system instructions).

### Format

```yaml
id: {expert-id}              # directory name, kebab-case
name: "{Display Name}"
version: "1.0"
archetype: [{primary}, {secondary}]  # from the archetype list in Pathfinder ORIENTATION.md

capabilities:                 # 3-8 compact descriptors (future: embedding targets)
  - "One-line description of what this expert knows or can do"

produces:                     # structured output types
  - narrative                 # prose answer
  - comparison_table          # structured comparison
  - code_snippet              # working code
  - data_reference            # pointer to data source
  # add domain-specific types as needed

exports:                      # what this expert can provide to other experts
  - {capability_name}         # short descriptor

imports:                      # what this expert might need from other experts
  - {capability_name}         # matches an export from another expert

signals: [keyword1, keyword2]       # trigger routing to this expert
anti_signals: ["phrase1", "phrase2"] # route away from this expert
```

### Rules

- The MANIFEST.yaml is the source of truth for routing. The orchestrator reads `experts/ROSTER.yaml` (consolidated from manifests) rather than scanning PERSONA.md files.
- Pathfinder produces a MANIFEST.yaml as part of every expert build (Step 6b, after evaluation).
- When an expert's scope changes, update its MANIFEST.yaml and regenerate ROSTER.yaml.
- Capabilities should be specific enough to distinguish this expert from adjacent ones but general enough for embedding-based matching at scale.

## Structured Expert Response Format

When the orchestrator invokes an expert during fan-out (multi-expert consultation), the expert returns a structured response. This format enables the orchestrator to merge multiple expert perspectives.

This format is used ONLY when the orchestrator consults an expert programmatically. When a user talks to an expert directly, the expert responds naturally per its PERSONA.md.

### Format

```markdown
## Expert Response: {expert_id}
**Confidence:** high | medium | low
**Scope match:** full | partial | tangential
**Key claims:**
- Claim 1 (source: orientation doc, as of YYYY-MM)
- Claim 2 (source: reference/{file}.md)
- Claim 3 (source: web search, verified YYYY-MM-DD)
**Answer:**
[Prose answer to the question]
**Gaps:**
[What this expert cannot address about the query]
**See also:** [expert_ids that might have additional perspective]
```

### Fields

- **Confidence:** How well this question falls within the expert's domain. High = core expertise, medium = adjacent, low = tangential.
- **Scope match:** Full = question is squarely in-scope, partial = partially in-scope, tangential = mostly outside scope but has something relevant to contribute.
- **Key claims:** The most important facts in the answer, with source attribution. This lets the synthesizer check for agreement/disagreement across experts.
- **Gaps:** Honest about what the expert doesn't know. This tells the orchestrator whether to consult additional experts.
- **See also:** Pointers to other experts that might add value. The orchestrator uses these to decide whether to extend the fan-out.
