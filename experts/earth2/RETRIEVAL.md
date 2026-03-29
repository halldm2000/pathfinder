# Earth-2 Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval uses Claude's built-in web search and web fetch tools rather than a custom RAG pipeline. The orientation doc handles stable knowledge; live search handles freshness.

## When to Search

**Always search before answering** when the question involves:
- Specific version numbers, API signatures, or installation commands
- Events or publications from the last 3 months
- Benchmark comparisons or leaderboard positions
- Model availability or release status
- Breaking changes or migration guides

**Use orientation doc directly** when the question involves:
- Model architecture and design (stable)
- Resolution/timescale framework (stable)
- Known limitations of AI weather models (slow-changing)
- Comparing model categories or approaches (stable)
- Atmospheric science fundamentals (stable)

**Search then synthesize** when the question involves:
- "What's the latest on X?" (always search)
- "Has anyone done X?" (search arXiv, then synthesize with orientation knowledge)
- "How does X compare to Y?" (use orientation for structure, search for current numbers)

## Search Patterns

### For Earth-2 model/tool questions
1. Search GitHub releases: `site:github.com/NVIDIA/earth2studio` or `site:github.com/NVIDIA/physicsnemo`
2. Search NVIDIA docs: `site:nvidia.github.io/earth2studio`
3. Search Hugging Face: `site:huggingface.co nvidia earth-2`
4. Fetch the specific page if you need API details

### For AI weather model landscape questions
1. Search arXiv: `site:arxiv.org "AI weather" OR "machine learning weather prediction"` + model name
2. Search Google Scholar or arXiv for the specific model/paper
3. Check WeatherBench 2 for benchmark comparisons

### For operational deployment questions
1. Search ECMWF news: `site:ecmwf.int AIFS`
2. Search NOAA: `site:noaa.gov AI weather`
3. Search Nature/Science for recent publications

### For code questions
1. Search Earth2Studio examples: `site:nvidia.github.io/earth2studio/examples`
2. Search GitHub issues for known problems: `site:github.com/NVIDIA/earth2studio/issues`
3. Fetch the relevant example notebook or API reference directly

## Supplementary Local Context

When deployed alongside David's CLAUDE-COWORK workspace, the following files contain additional Earth-2 context that may be more current than the orientation doc:

- `/Users/dhall/Dropbox/WORK_NVIDIA/CLAUDE-COWORK/reference/earth2-platform.md` -- Comprehensive internal Earth-2 platform reference (models, partnerships, team, strategy). Updated from internal meetings and Slack.
- `/Users/dhall/Dropbox/WORK_NVIDIA/CLAUDE-COWORK/reference/earth2-platform.html` -- HTML version of the above.
- `/Users/dhall/Dropbox/WORK_NVIDIA/CLAUDE-COWORK/deliverables/earth2-tutorials-plan.html` -- Tutorial repository plan.
- `/Users/dhall/Dropbox/WORK_NVIDIA/CLAUDE-COWORK/deliverables/earth2-platform-external.html` -- External-facing platform overview.

These files may contain internal NVIDIA information. Use judgment about what is appropriate to surface in responses depending on the audience.

## Freshness Protocol

This field moves fast. Follow these rules:

1. **Any fact older than 3 months is suspect.** If the orientation doc says "as of [date]" and the date is >3 months ago, search for updates before stating it.
2. **Benchmark numbers decay fastest.** Never cite a benchmark number without checking if there's a newer comparison.
3. **API patterns are version-sensitive.** Earth2Studio and PhysicsNeMo have breaking changes between minor versions. Always check the installed version or latest release notes.
4. **New models appear monthly.** If someone asks "what are the best AI weather models," search before answering to catch recent entrants.
5. **Operational status changes are high-impact.** When a model goes from research to operational, that's a major event. Track ECMWF, NOAA, and national met service announcements.
