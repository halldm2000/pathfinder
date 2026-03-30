# Ocean & ENSO Expert: Retrieval Strategy

This expert runs as a Claude Code project or Cowork session. Retrieval follows a strict three-tier hierarchy: orientation doc first, reference docs second, web search last. The expert should feel fast -- most questions are answerable in seconds from local context.

## Three-Tier Hierarchy

### Tier 1: Orientation Doc (always loaded, instant)

Answer directly from ORIENTATION.md when the question involves:
- ENSO phase definitions, Nino regions, index thresholds
- Ocean circulation overview (AMOC, gyres, upwelling)
- Sea ice trends and key statistics
- Dataset overviews (Argo, OISST, OSCAR, altimetry, reanalyses)
- Ocean model components in NWP/climate models
- AI ocean model summaries (DLESyM, SamudrACE)
- S2S-ocean connection framework
- Field map and ecosystem structure
- Any fact explicitly stated in the orientation doc

**Rule: If the orientation doc has the fact, use it. Do not search.**

### Tier 2: Reference Docs (read on demand, milliseconds)

Read the relevant file from `reference/` when the question goes deeper than the orientation doc covers:
- "How do ENSO teleconnections work for the PNA pattern?" -> read `reference/enso.md`
- "What are the specifications of Argo Deep floats?" -> read `reference/ocean-observations.md`
- "How does MOM6 handle vertical coordinates?" -> read `reference/ocean-models.md`
- "What's the latest on Antarctic sea ice mechanisms?" -> read `reference/sea-ice.md`
- "How does DLESyM couple ocean and atmosphere?" -> read `reference/ocean-models.md`
- ENSO dynamics, prediction skill details, historical events
- Observation system design, satellite altimetry details, SST product comparisons
- Ocean model architecture, coupling details, AI ocean approaches
- Sea ice observation systems, model representation, projections

**Available reference docs:**
- `reference/enso.md` -- ENSO dynamics, Nino indices, teleconnections, prediction skill
- `reference/ocean-observations.md` -- Argo, satellite altimetry, SST products, OSCAR
- `reference/ocean-models.md` -- Ocean components in coupled models, AI ocean approaches
- `reference/sea-ice.md` -- Arctic/Antarctic ice, NSIDC data, trends, models

**Rule: Read the reference doc before web searching. If the reference doc answers the question, do not search.**

### Tier 3: Web Search (last resort, seconds)

Search the web only when:
- The question is about the **current ENSO state** (indices change monthly)
- The question asks for **current sea ice extent** (changes daily/weekly)
- The question is about **very recent publications or model releases** (last 2-4 weeks)
- The question asks for specific **data access URLs or API endpoints** that may have changed
- The question is about a **topic not covered** by the orientation doc or any reference doc
- The user explicitly asks "what's the latest" or "has anything changed recently"

**Rule: Do not web search for ENSO dynamics, teleconnection patterns, observation system descriptions, ocean model architectures, or sea ice trend statistics. These are stable and covered by tiers 1-2.**

## When NOT to Search

- **ENSO mechanisms and teleconnection pathways** -- slow-changing, covered by reference docs
- **Argo network design and capability** -- stable, in reference doc
- **SST product descriptions and biases** -- stable, in reference doc
- **AMOC observations and RAPID array** -- stable, in orientation + reference docs
- **Ocean model architectures (MOM6, NEMO, HYCOM)** -- stable, in reference doc
- **Sea ice long-term trends** -- well-established, in reference doc
- **Historical ENSO events** -- in reference doc

If a fact in the orientation or reference doc says "as of [date]" and the date is **within the last 3 months**, trust it. Only search if the date is older than 3 months or the user specifically asks about very recent changes.

## Search Patterns (when Tier 3 is warranted)

### For current ENSO state
1. NOAA CPC: `site:cpc.ncep.noaa.gov ENSO`
2. IRI: `site:iri.columbia.edu ENSO`
3. Australian BoM: `site:bom.gov.au ENSO`

### For current sea ice extent
1. NSIDC: `site:nsidc.org "sea ice"`
2. JAXA: `site:ads.nipr.ac.jp/vishop/`

### For ocean model and AI updates
1. arXiv: `site:arxiv.org "ocean model" OR "coupled climate" OR "ENSO prediction"`
2. NVIDIA: `site:arxiv.org DLESyM`
3. Allen AI: `site:allenai.org SamudrACE OR ACE2`

### For data access
1. Copernicus Marine: `site:marine.copernicus.eu`
2. NOAA ERDDAP: `site:coastwatch.pfeg.noaa.gov`
3. Argo: `site:argo.ucsd.edu`

## Freshness Protocol

1. **Facts dated within the last 3 months are trusted.** Do not search for updates unless the user specifically asks.
2. **ENSO state changes monthly.** Always search for current state if the question implies "right now."
3. **Sea ice extent is seasonal.** Search for current extent; trust trend statistics from reference docs.
4. **AI ocean models are a new and fast-moving area.** Search for recent developments if the question is about new AI ocean work.
5. **Established ocean science is stable.** AMOC dynamics, ENSO mechanisms, gyre circulation -- do not search for these.
