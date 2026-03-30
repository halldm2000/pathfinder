# Wildfire Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval follows a strict three-tier hierarchy: orientation doc first, reference docs second, web search last. Most wildfire questions are answerable in seconds from local context.

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded, instant)

Answer directly from ORIENTATION.md when the question involves:
- FIRMS/VIIRS/GOES detection system overview and capabilities
- Fire spread model landscape (FARSITE, FlamMap, WRF-SFIRE, Phoenix -- summary level)
- Rothermel equations overview and limitations
- FWI System and NFDRS overview, component names
- Fuel moisture classes (1h/10h/100h/1000h, LFMC)
- Smoke modeling overview (HRRR-Smoke, BlueSky)
- AQI breakpoints and PM2.5 health thresholds
- AI/ML fire applications overview
- Historical fire data sources (MTBS, GeoMAC, NIFC)
- Fire-climate trends (season lengthening, VPD)
- Key metrics definitions and typical values
- Field map and current state of wildfire science
- Any fact explicitly stated in the orientation doc

**Rule: If the orientation doc has the fact, use it. Do not search.**

### Tier 2: Reference Docs (read on demand, milliseconds)

Read the relevant file from `reference/` when the question goes deeper than the orientation doc covers:
- "How does VIIRS detect fires at night vs day?" -> read `reference/fire-detection.md`
- "What are the GOES FHS false-positive sources?" -> read `reference/fire-detection.md`
- "Walk me through the Rothermel spread rate equation" -> read `reference/spread-models.md`
- "How does WRF-SFIRE couple fire and atmosphere?" -> read `reference/spread-models.md`
- "How does FARSITE handle crown fire transition?" -> read `reference/spread-models.md`
- "What goes into the FFMC calculation?" -> read `reference/fire-weather.md`
- "What are Red Flag criteria for the Pacific Northwest?" -> read `reference/fire-weather.md`
- "How does HRRR-Smoke estimate plume rise?" -> read `reference/smoke-air-quality.md`
- "What's the BlueSky emissions chain?" -> read `reference/smoke-air-quality.md`
- "How does NowCast differ from 24h average AQI?" -> read `reference/smoke-air-quality.md`

**Available reference docs:**
- `reference/fire-detection.md` -- FIRMS, VIIRS, GOES, ground sensors, camera networks, detection algorithms
- `reference/spread-models.md` -- FARSITE, FlamMap, WRF-SFIRE, Phoenix, Rothermel equations, fuel models
- `reference/smoke-air-quality.md` -- HRRR-Smoke, BlueSky, CMAQ, PM2.5, AQI, NowCast
- `reference/fire-weather.md` -- FWI System component calculations, NFDRS, Red Flag criteria, Haines Index

**Rule: Read the reference doc before web searching. If the reference doc answers the question, do not search.**

### Tier 3: Web Search (last resort, seconds)

Search the web only when:
- The question is about an **active wildfire** (real-time perimeters, current conditions, evacuation orders)
- The question asks about **events from the last 2-4 weeks** (new paper, model update, fire season summary)
- The question asks for **current fire weather conditions or Red Flag warnings** (these change daily)
- The question is about a **topic not covered** by the orientation doc or any reference doc
- The user explicitly asks "what's the latest" or references a current event
- **Season fire statistics** for the current or most recent completed year

**Rule: Do not web search for fire science fundamentals, Rothermel equations, FWI System structure, detection sensor specs, or smoke model architectures. These are stable and covered by tiers 1-2.**

## When NOT to Search

These categories should almost never trigger web search:

- **Fire behavior science** -- stable, covered by orientation + spread-models.md
- **Detection sensor specifications and algorithms** -- reference doc has this
- **FWI/NFDRS component structure and calculations** -- reference doc covers this
- **Smoke model architecture (HRRR-Smoke, BlueSky)** -- reference doc covers this
- **AQI breakpoints and PM2.5 health thresholds** -- orientation doc has this
- **Historical fire databases (MTBS, NIFC) structure and content** -- orientation doc covers this
- **Rothermel limitations and fuel model structure** -- orientation doc + reference doc cover this

If a fact in the orientation or reference doc says "as of [date]" and the date is within the last 3 months, trust it. Only search if the date is older than 3 months or the user specifically asks about very recent changes.

## Search Patterns (when Tier 3 is warranted)

### For active wildfires and current conditions
1. InciWeb: `site:inciweb.wildfire.gov` (active incident information)
2. NIFC Sit Reports: `site:nifc.gov` (national situation reports)
3. AirNow: `site:airnow.gov` (current AQI and smoke forecasts)
4. FIRMS: `site:firms.modaps.eosdis.nasa.gov` (active fire map)

### For fire weather conditions
1. SPC Fire Weather Outlook: `site:spc.noaa.gov/products/fire_wx/` (current Red Flag warnings)
2. Predictive Services: `site:predictiveservices.nifc.gov` (fire weather, 7-day outlook)
3. RAWS data: `site:wrcc.dri.edu/raws/` (station observations)

### For research and model updates
1. arXiv: `site:arxiv.org "wildfire" "machine learning"` or `"fire spread" "deep learning"`
2. USFS research: `site:fs.usda.gov/research` (fire science publications)
3. IJWF: International Journal of Wildland Fire (primary fire science journal)

### For smoke and air quality
1. AirFire: `site:airfire.org` (BlueSky smoke forecasts)
2. NOAA smoke: `site:rapidrefresh.noaa.gov` (HRRR-Smoke products)
3. EPA AirNow: `site:airnow.gov/fires` (fire and smoke map)

## Freshness Protocol

1. **Facts dated within the last 3 months are trusted.** Do not search for updates unless the user specifically asks.
2. **Active fire information changes hourly.** Always search for real-time fire information.
3. **Fire weather conditions change daily.** Always search for current Red Flag warnings or fire weather outlooks.
4. **Fire detection satellite missions are stable.** VIIRS, GOES specs change only with new satellite launches -- trust reference doc.
5. **AI fire research updates appear frequently.** If user asks about a specific ML fire model and reference doc is >3 months old, consider searching.
6. **Annual fire statistics update in January-February.** Search for updated NIFC numbers when asked about the most recent season.
