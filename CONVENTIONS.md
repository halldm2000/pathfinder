# Expert Conventions

Cross-cutting rules that apply to all experts in this repo. The orchestrator checks compliance during freshness sweeps.

Last updated: 2026-03-29.

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
