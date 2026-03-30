# Space Weather Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval follows a strict three-tier hierarchy: orientation doc first, reference docs second, web search last. The expert should feel fast -- most questions about solar physics and space weather impacts are answerable in seconds from local context.

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded, instant)

Answer directly from ORIENTATION.md when the question involves:
- Solar phenomena definitions, relationships, and physical mechanisms
- NOAA G/S/R scale levels and thresholds
- Solar Cycle 25 status and timeline
- HelioFM/Surya overview (what it is, who built it, basic capabilities)
- Observational system summaries (which satellite, which orbit, key instruments)
- Impact categories and mechanisms (power grids, satellites, GPS, aviation)
- AI in space weather landscape overview
- Forecasting lead times and uncertainty ranges
- Field map and ecosystem structure
- Any fact explicitly stated in the orientation doc

**Rule: If the orientation doc has the fact, use it. Do not search.**

### Tier 2: Reference Docs (read on demand, milliseconds)

Read the relevant file from `reference/` when the question goes deeper than the orientation doc covers:
- "How does Surya's architecture work?" -> read `reference/heliofm.md`
- "What are the SDO/AIA wavelength channels?" -> read `reference/observational-systems.md`
- "Explain the Carrington Event impact estimate" -> read `reference/impacts.md`
- "How do CME arrival time predictions work?" -> read `reference/solar-phenomena.md`
- "What instruments does DSCOVR carry?" -> read `reference/observational-systems.md`
- "How does surface charging damage satellites?" -> read `reference/impacts.md`
- "What's the difference between halo and partial-halo CMEs?" -> read `reference/solar-phenomena.md`
- "Where can I get SDO data?" -> read `reference/observational-systems.md`
- Flare classification details, specific instrument capabilities, detailed impact mechanisms, historical event specifics

**Available reference docs:**
- `reference/heliofm.md` -- Surya/HelioFM architecture, training data, capabilities, downstream tasks
- `reference/solar-phenomena.md` -- Flares, CMEs, solar wind, coronal holes: physics, classification, prediction challenges
- `reference/impacts.md` -- Technology impacts by system: power grids, satellites, GPS, aviation, communications
- `reference/observational-systems.md` -- SDO, SOHO, ACE, DSCOVR, GOES: instruments, data products, access URLs

**Rule: Read the reference doc before web searching. If the reference doc answers the question, do not search.**

### Tier 3: Web Search (last resort, seconds)

Search the web only when:
- The question asks about **current solar activity** (today's Kp, recent flares, active CMEs in transit)
- The question is about events from the **last 2-4 weeks** (reference docs may not cover very recent events)
- The question asks about **Surya/HelioFM updates** since March 2026 (new papers, new downstream tasks, model updates)
- The question asks "what happened with the latest storm" or "what's the Sun doing now"
- The question involves **specific ongoing space weather events** (is there a CME heading toward Earth right now)
- The question asks about **new AI space weather papers** not yet in the reference corpus

**Rule: Do not web search for solar physics fundamentals, instrument specifications, NOAA scale definitions, impact mechanisms, or historical events. These are stable and covered by tiers 1-2.**

## When NOT to Search

These categories should almost never trigger web search:

- **Solar physics and phenomena** -- stable, covered by orientation + reference docs
- **NOAA space weather scales** -- stable, in orientation doc
- **Instrument capabilities and wavelength channels** -- stable, in reference docs
- **Impact mechanisms and historical precedents** -- slow-changing, in reference docs
- **HelioFM/Surya architecture and training data** -- reference doc covers this
- **Solar cycle structure and history** -- stable except for very recent activity
- **Forecasting methodology and lead times** -- stable, in orientation doc

If a fact in the orientation or reference doc says "as of [date]" and the date is **within the last 3 months**, trust it. Only search if the date is older than 3 months or the user specifically asks about very recent events.

## Search Patterns (when Tier 3 is warranted)

### For current solar activity
1. SWPC real-time: `site:swpc.noaa.gov` current conditions
2. SpaceWeatherLive: `site:spaceweatherlive.com` real-time data
3. NOAA alerts: `site:swpc.noaa.gov/products/alerts-watches-and-warnings`

### For HelioFM/Surya updates
1. GitHub: `site:github.com/NASA-IMPACT/Surya` releases
2. Hugging Face: `site:huggingface.co surya heliofm`
3. arXiv: `site:arxiv.org surya heliophysics foundation model`

### For AI space weather research
1. arXiv: `site:arxiv.org "space weather" machine learning` + relevant terms
2. NASA: `site:nasa.gov space weather AI` or `site:nasa.gov heliophysics AI`
3. ESA: `site:esa.int space weather` updates

### For recent space weather events
1. SWPC event reports: `site:swpc.noaa.gov` event details
2. SpaceWeather.com for accessible summaries
3. NASA Goddard: `site:nasa.gov solar flare` or `site:nasa.gov geomagnetic storm`

## Freshness Protocol

1. **Facts dated within the last 3 months are trusted.** Do not search for updates unless the user specifically asks.
2. **Current solar activity is always live.** Never state today's Kp index or flare activity from the orientation doc -- always search for real-time data.
3. **Solar cycle position updates slowly.** Cycle phase (maximum, declining, minimum) changes over months, not days. Trust the orientation doc.
4. **HelioFM/Surya is actively evolving.** If the user asks about the latest capabilities or downstream tasks, search even if the reference doc is recent.
5. **Historical events don't change.** Never search for the Carrington Event, 1989 Quebec blackout, or May 2024 superstorm details. Reference docs have these.
