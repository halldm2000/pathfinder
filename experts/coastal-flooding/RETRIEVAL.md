# Coastal Flooding Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval follows a strict three-tier hierarchy: orientation doc first, reference docs second, web search last. Most coastal flooding questions are answerable in seconds from local context.

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded, instant)

Answer directly from ORIENTATION.md when the question involves:
- Storm surge physics overview and key drivers
- SLOSH, ADCIRC, SCHISM model summaries (purpose, resolution, operational role)
- IPCC AR6 sea level rise projections (SSP scenarios, global and regional)
- Compound flooding concept and driver combinations
- Coastal DEM and bathymetry data overview (CoNED, GEBCO, lidar)
- FEMA flood zones and FIRM overview
- Vertical datum definitions (NAVD88, MSL, MHHW, MLLW)
- Historical surge events (Katrina, Sandy, Harvey, Ike, Ian) summary
- AI/ML in coastal flooding status
- Key metrics definitions and typical values
- Field map and current state of coastal flood prediction
- Any fact explicitly stated in the orientation doc

**Rule: If the orientation doc has the fact, use it. Do not search.**

### Tier 2: Reference Docs (read on demand, milliseconds)

Read the relevant file from `reference/` when the question goes deeper than the orientation doc covers:
- "How does ADCIRC's finite element solver work?" -> read `reference/surge-models.md`
- "What inputs does SLOSH need?" -> read `reference/surge-models.md`
- "Compare ADCIRC and SCHISM for compound flooding" -> read `reference/surge-models.md`
- "What is SSP5-8.5 sea level rise for the Gulf Coast?" -> read `reference/sea-level-rise.md`
- "How do tide gauges measure sea level trends?" -> read `reference/sea-level-rise.md`
- "How do surge and rainfall interact in compound floods?" -> read `reference/compound-flooding.md`
- "Walk me through the Harvey compound flooding analysis" -> read `reference/compound-flooding.md`
- "What is CoNED and how is it built?" -> read `reference/coastal-data.md`
- "How do I convert between NAVD88 and MHHW?" -> read `reference/coastal-data.md`
- "What lidar data is available for Florida?" -> read `reference/coastal-data.md`

**Available reference docs:**
- `reference/surge-models.md` -- SLOSH, ADCIRC, SCHISM architectures, inputs, resolution, operational configuration
- `reference/sea-level-rise.md` -- IPCC SSP scenarios, regional projections, tide gauges, satellite altimetry
- `reference/compound-flooding.md` -- Surge + precipitation + river interaction, joint probability, case studies
- `reference/coastal-data.md` -- DEMs, bathymetry (GEBCO, CoNED), FEMA flood zones, lidar, datum issues

**Rule: Read the reference doc before web searching. If the reference doc answers the question, do not search.**

### Tier 3: Web Search (last resort, seconds)

Search the web only when:
- The question is about an **active storm's surge forecast** (real-time NHC surge guidance)
- The question asks about **events from the last 2-4 weeks** (new FEMA map release, IPCC update, new model version)
- The question asks for **specific FEMA map data** for a particular location
- The question is about a **topic not covered** by the orientation doc or any reference doc
- The user explicitly asks "what's the latest" or references a current event
- **New AI/ML surge model publications** that may have appeared since reference docs were written

**Rule: Do not web search for surge physics, model architectures, IPCC AR6 projections, datum definitions, historical events, or FEMA zone descriptions. These are stable and covered by tiers 1-2.**

## When NOT to Search

These categories should almost never trigger web search:

- **Storm surge physics and model comparison** -- stable, covered by orientation + surge-models.md
- **IPCC AR6 sea level rise scenarios** -- stable until AR7 (~2028-2029), covered by sea-level-rise.md
- **Compound flooding mechanisms** -- reference doc covers the current understanding
- **Coastal DEM and bathymetry data sources** -- reference doc covers data products and access
- **FEMA flood zone definitions and methodology** -- orientation doc covers this
- **Historical surge events** -- stable, covered by orientation doc
- **Vertical datum definitions** -- stable, covered by orientation + coastal-data.md

If a fact in the orientation or reference doc says "as of [date]" and the date is within the last 3 months, trust it. Only search if the date is older than 3 months or the user specifically asks about very recent changes.

## Search Patterns (when Tier 3 is warranted)

### For active storms and real-time surge forecasts
1. NHC Surge: `site:nhc.noaa.gov` (storm surge watches/warnings, inundation maps)
2. CERA: `cera.coastalrisk.live` (real-time ADCIRC guidance)
3. NOAA Tides and Currents: `tidesandcurrents.noaa.gov` (observed water levels)

### For FEMA and flood map updates
1. FEMA Map Service Center: `msc.fema.gov` (FIRMs, Letters of Map Change)
2. FEMA flood study updates: `site:fema.gov flood map update`
3. NOAA Digital Coast: `coast.noaa.gov/digitalcoast/` (data and tools)

### For sea level rise updates
1. NASA Sea Level Portal: `sealevel.nasa.gov` (satellite altimetry trends, regional analysis)
2. IPCC updates: `site:ipcc.ch` (assessment report updates, special reports)
3. NOAA sea level trends: `tidesandcurrents.noaa.gov/sltrends/` (tide gauge analysis)

### For surge model and AI/ML advances
1. arXiv: `"storm surge" "machine learning"` or `"coastal flooding" "deep learning"` or `"ADCIRC" "neural network"`
2. ADCIRC community: `adcirc.org` (releases, workshops, publications)
3. SCHISM community: `schism-dev.github.io` (releases, documentation updates)

### For research and compound flooding
1. arXiv/journals: `"compound flooding" "joint probability"` or `"surge" "rainfall" "interaction"`
2. NOAA Coastal Services Center: `coast.noaa.gov` (new tools, methodologies)
3. USACE publications: `publications.usace.army.mil` (coastal engineering guidance updates)

## Freshness Protocol

1. **IPCC AR6 sea level projections are stable** until AR7 (~2028-2029). Do not search for updates.
2. **FEMA flood maps update irregularly.** Only search when asked about a specific community's map status.
3. **Surge model versions evolve slowly.** ADCIRC v55/v56, SCHISM 5.x -- search only if user asks about recent model releases.
4. **AI/ML surge papers appear at increasing rate.** Search when asked about recent ML approaches.
5. **Active storm surge forecasts change every 6 hours during events.** Always search for real-time surge information.
6. **Sea level observations update continuously** but trends are stable year to year. Search only for latest annual rate updates.
