# Hurricane Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval follows a strict three-tier hierarchy: orientation doc first, reference docs second, web search last. Most TC questions are answerable in seconds from local context.

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded, instant)

Answer directly from ORIENTATION.md when the question involves:
- HENS overview, key capabilities, and ensemble size
- AI vs traditional model landscape for TCs (summary level)
- TC science concepts: RI definition, EWRC, wind radii, Saffir-Simpson limitations
- Observational systems overview (recon, satellite, radar)
- Database identity and purpose (IBTrACS, HURDAT2, ATCF)
- Key metrics definitions and typical values
- Field map and current state of AI TC prediction
- Any fact explicitly stated in the orientation doc

**Rule: If the orientation doc has the fact, use it. Do not search.**

### Tier 2: Reference Docs (read on demand, milliseconds)

Read the relevant file from `reference/` when the question goes deeper than the orientation doc covers:
- "How does HENS generate its ensemble members?" -> read `reference/hens.md`
- "How does HENS compare to ECMWF ENS for TC tracks?" -> read `reference/hens.md`
- "How well does GenCast predict hurricane tracks?" -> read `reference/ai-tc-models.md`
- "Why do AI models fail at rapid intensification?" -> read `reference/ai-tc-models.md` + `reference/tc-science.md`
- "What is the NHC forecast process?" -> read `reference/operational-forecasting.md`
- "How do consensus models work?" -> read `reference/operational-forecasting.md`
- "What's the SHIPS-RI methodology?" -> read `reference/operational-forecasting.md`
- "Tell me about eyewall replacement cycles in detail" -> read `reference/tc-science.md`
- "What are the climate trends in TC intensity?" -> read `reference/tc-science.md`
- "How does storm surge relate to storm size?" -> read `reference/tc-science.md`

**Available reference docs:**
- `reference/hens.md` -- HENS architecture, verification scores, NHC integration, ensemble configuration
- `reference/ai-tc-models.md` -- AI model TC performance: Atlas, GenCast, Pangu, AIFS, FuXi, cross-cutting findings
- `reference/operational-forecasting.md` -- NHC/JTWC workflow, consensus models, verification, warning process
- `reference/tc-science.md` -- RI mechanisms, genesis, EWRCs, surge physics, climate trends, wind conventions

**Rule: Read the reference doc before web searching. If the reference doc answers the question, do not search.**

### Tier 3: Web Search (last resort, seconds)

Search the web only when:
- The question is about an **active storm** (real-time advisories, latest position/intensity)
- The question asks about **events from the last 2-4 weeks** (new paper, model update, season summary)
- The question asks for **specific ATCF data or current NHC products** that change operationally
- The question is about a **topic not covered** by the orientation doc or any reference doc
- The user explicitly asks "what's the latest" or references a current event
- **Season verification statistics** for the most recent completed season

**Rule: Do not web search for TC science fundamentals, HENS architecture, AI model comparison, NHC workflow, or historical database structure. These are stable and covered by tiers 1-2.**

## When NOT to Search

These categories should almost never trigger web search:

- **TC dynamics and science** -- stable, covered by orientation + tc-science.md
- **HENS architecture and ensemble methodology** -- reference doc has this
- **AI model TC skill comparisons** -- reference doc covers the current landscape
- **NHC/JTWC operational workflow** -- reference doc covers this
- **Historical TC databases (IBTrACS, HURDAT2, ATCF) format and content** -- orientation doc covers this
- **Saffir-Simpson scale, wind radii definitions, basin conventions** -- orientation doc covers this

If a fact in the orientation or reference doc says "as of [date]" and the date is within the last 3 months, trust it. Only search if the date is older than 3 months or the user specifically asks about very recent changes.

## Search Patterns (when Tier 3 is warranted)

### For active storms and current season
1. NHC: `site:nhc.noaa.gov` (advisories, graphics, discussions)
2. JTWC: `site:metoc.navy.mil` (Western Pacific, Indian Ocean)
3. ATCF data: `ftp.nhc.noaa.gov/atcf/`

### For HENS and AI model updates
1. NVIDIA technical blog: `site:blogs.nvidia.com HENS hurricane`
2. arXiv: `site:arxiv.org "hurricane" "ensemble" "AI"` or `"tropical cyclone" "machine learning"`
3. AMS/AGU conference proceedings for recent presentations

### For verification and seasonal summaries
1. NHC verification: `site:nhc.noaa.gov/verification`
2. Colorado State seasonal summary: `site:tropical.colostate.edu`
3. NOAA Climate Prediction Center: `site:cpc.ncep.noaa.gov`

### For research frontiers
1. arXiv: `"rapid intensification" "machine learning"` or `"tropical cyclone" "deep learning"`
2. BAMS (Bulletin of AMS) for annual TC summaries
3. Nature/Science for high-impact TC research

## Freshness Protocol

1. **Facts dated within the last 3 months are trusted.** Do not search for updates unless the user specifically asks.
2. **Verification statistics decay after each season.** When the current season's verification is published (typically January-February for prior Atlantic season), search for updated numbers.
3. **Active storm advisories change every 6 hours.** Always search for real-time storm information.
4. **AI model TC evaluations update when new papers drop.** If the user asks about a specific model's TC skill and the reference doc is >3 months old, consider searching.
5. **HENS/NHC integration status is actively evolving.** Search if asked about operational status changes.
