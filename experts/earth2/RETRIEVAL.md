# Earth-2 Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval follows a strict three-tier hierarchy: orientation doc first, reference docs second, web search last. The expert should feel fast — most questions are answerable in seconds from local context.

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded, instant)

Answer directly from ORIENTATION.md when the question involves:
- Model identity, purpose, and key differentiators ("What is Atlas?", "How does CorrDiff differ from StormScope?")
- Architecture summaries and model relationships
- Resolution/timescale framework
- Known limitations of AI weather models
- Comparing model categories or approaches
- Field map and ecosystem structure
- Atmospheric science fundamentals for ML weather
- Any fact explicitly stated in the orientation doc

**Rule: If the orientation doc has the fact, use it. Do not search.**

### Tier 2: Reference Docs (read on demand, milliseconds)

Read the relevant file from `reference/` when the question goes deeper than the orientation doc covers:
- "How does Atlas's latent space work?" → read `reference/atlas.md`
- "What observation types does HealDA ingest?" → read `reference/healda.md`
- "Show me Earth2Studio code" → read `reference/earth2studio.md`
- "What's the CorrDiff NIM performance?" → read `reference/corrdiff.md`
- "How does GenCast compare to Atlas in detail?" → read `reference/landscape.md` + `reference/atlas.md`
- "What changed in PhysicsNeMo v2.0?" → read `reference/physicsnemo.md`
- Architecture deep-dives, training details, paper specifics, code examples, performance numbers
- Detailed comparisons requiring specifics from multiple models

**Available reference docs:**
- `reference/atlas.md` — Atlas architecture, three estimators, speed, paper
- `reference/corrdiff.md` — CorrDiff downscaling, TWC deployment, NIM
- `reference/stormscope.md` — StormScope modes, DiT architecture, vs HRRR
- `reference/stormcast.md` — StormCast regional modeling, Science Advances paper
- `reference/fcn3.md` — FCN3 probabilistic forecasting, BVMC, 60-day range
- `reference/healda.md` — HealDA observation types, inference speed, sovereign role
- `reference/earth2studio.md` — Earth2Studio API, run functions, code examples
- `reference/physicsnemo.md` — PhysicsNeMo v2.0, Modulus migration
- `reference/cbottle.md` — cBottle climate model, CMIP6 validation
- `reference/aifs.md` — ECMWF AIFS, Anemoi framework, met service adoption
- `reference/landscape.md` — GenCast, Aurora, FuXi, NeuralGCM, WeatherMesh, NOAA AI, ACE2

**Rule: Read the reference doc before web searching. If the reference doc answers the question, do not search.**

### Tier 3: Web Search (last resort, seconds)

Search the web only when:
- The question is about events from the **last 2–4 weeks** (reference docs may not cover very recent releases)
- The question asks for specific **version numbers, API signatures, or installation commands** that change between releases
- The question is about a **topic not covered** by the orientation doc or any reference doc
- The question explicitly asks "what's the latest" or "has anything changed recently"
- **Benchmark leaderboard positions** (these shift frequently)
- **New model releases or papers** not yet in the reference corpus

**Rule: Do not web search for architecture, model relationships, training data, resolution, known limitations, or comparative framework. These are stable and covered by tiers 1–2.**

## When NOT to Search

The previous retrieval strategy was too aggressive about searching. These categories should almost never trigger web search:

- **Model architecture and design** — stable, covered by orientation + reference docs
- **How models relate to each other** — stable, covered by orientation doc
- **Known limitations of AI weather models** — slow-changing, in orientation doc
- **Earth2Studio core API patterns** — reference doc has code examples
- **PhysicsNeMo migration from Modulus** — reference doc covers this
- **Paper findings and key results** — reference docs have these
- **AIFS/Anemoi framework and adoption** — reference doc covers this
- **Landscape model capabilities** — reference doc covers GenCast, Aurora, FuXi, etc.

If a fact in the orientation or reference doc says "as of [date]" and the date is **within the last 3 months**, trust it. Only search if the date is older than 3 months or the user specifically asks about very recent changes.

## Search Patterns (when Tier 3 is warranted)

### For Earth-2 model/tool freshness checks
1. GitHub releases: `site:github.com/NVIDIA/earth2studio` or `site:github.com/NVIDIA/physicsnemo`
2. NVIDIA docs: `site:nvidia.github.io/earth2studio`
3. Hugging Face: `site:huggingface.co nvidia earth-2`

### For AI weather model landscape updates
1. arXiv: `site:arxiv.org "AI weather"` + model name
2. WeatherBench 2 for benchmark comparisons
3. ECMWF news: `site:ecmwf.int AIFS`

### For operational deployment news
1. NOAA: `site:noaa.gov AI weather`
2. ECMWF: `site:ecmwf.int`
3. Nature/Science for recent publications

### For code questions beyond reference docs
1. Earth2Studio examples: `site:nvidia.github.io/earth2studio/examples`
2. GitHub issues: `site:github.com/NVIDIA/earth2studio/issues`

## Supplementary Local Context

When deployed alongside David's CLAUDE-COWORK workspace, these files contain additional Earth-2 context:

- `/Users/dhall/Dropbox/WORK_NVIDIA/CLAUDE-COWORK/reference/earth2-platform.md` — Comprehensive internal reference (models, partnerships, team, strategy). May contain internal NVIDIA information — use judgment about what to surface depending on audience.

## Freshness Protocol

1. **Facts dated within the last 3 months are trusted.** Do not search for updates unless the user specifically asks.
2. **Facts older than 3 months are suspect.** Search before stating them.
3. **Benchmark numbers decay fastest.** Always search for benchmark leaderboard positions.
4. **API patterns are version-sensitive.** If the user reports an error, check for breaking changes in latest release.
5. **New models appear monthly.** If asked "what are the best AI weather models," check reference/landscape.md first, then search only for very recent entrants.
