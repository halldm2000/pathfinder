# Hurricane Expert: Sources

Sources for ingestion and ongoing monitoring. Organized by type and priority.

## Primary Sources (check weekly)
Last checked: never

### NVIDIA HENS
- **NVIDIA Technical Blog (hurricane/HENS tag)**: blogs.nvidia.com (HENS announcements, season retrospectives)
- **Atlas paper and updates**: arXiv:2601.18111 (TC-specific results section)
- **Earth2Studio GitHub**: github.com/NVIDIA/earth2studio (HENS-related features, TC tracker updates)
- **NVIDIA GTC / AMS presentations**: Conference talks on HENS methodology and verification

### NHC / Operational Forecasting
- **NHC main page**: nhc.noaa.gov (active storm advisories during season, model guidance updates)
- **NHC Verification Reports**: nhc.noaa.gov/verification (annual verification, published ~Feb each year)
- **NHC Model Summary**: nhc.noaa.gov/modelsummary.shtml (which models are in the operational suite)
- **HAFS updates**: emc.ncep.noaa.gov (HAFS operational changes, configuration updates)

### AI TC Research
- **arXiv**: arxiv.org (search: "tropical cyclone" + "machine learning", "hurricane" + "deep learning", "AI weather" + "tropical")
- **BAMS (Bulletin of AMS)**: ametsoc.org (TC summary articles, AI weather reviews)
- **WeatherBench 2**: sites.research.google/gr/weatherbench/ (TC-specific evaluation if available)

## Secondary Sources (check monthly)
Last checked: never

### JTWC and International Agencies
- **JTWC**: metoc.navy.mil/jtwc (Western Pacific, Indian Ocean TC guidance)
- **JMA Typhoon Center**: jma.go.jp/jma/en/ (WPac best track, seasonal summaries)
- **BoM Tropical Cyclones**: bom.gov.au (Australian region, Southern Hemisphere)

### Historical Databases
- **IBTrACS**: ncei.noaa.gov/products/international-best-track-archive (global database updates, typically annual)
- **HURDAT2**: nhc.noaa.gov/data/ (Atlantic/EPac best track revisions)
- **ATCF documentation**: nrlmry.navy.mil/atcf_web (format changes, new model additions)

### TC Science / Research Groups
- **RAMMB/CIRA (Colorado State)**: rammb.cira.colostate.edu (satellite-based TC analysis tools, SHIPS-RI updates, ADT)
- **Colorado State Seasonal Forecasts**: tropical.colostate.edu (Klotzbach et al. seasonal outlooks)
- **GFDL Hurricane Research**: gfdl.noaa.gov (dynamical TC research, HAFS development)
- **University of Miami / RSMAS**: rsmas.miami.edu (TC observation, air-sea interaction)

### Conference Proceedings
- **AMS Annual Meeting** (January) -- TC-specific sessions, AI weather sessions
- **AMS Tropical Conference** (biennial) -- dedicated TC research
- **AGU Fall Meeting** (December) -- TC/climate sessions
- **IWTC (International Workshop on Tropical Cyclones)** -- WMO-sponsored, every 4 years

### Key Journals
- Monthly Weather Review (operational TC forecasting, model evaluation)
- Weather and Forecasting (NHC methods, verification)
- Journal of the Atmospheric Sciences (TC dynamics, RI theory)
- Nature / Science (high-impact TC + climate papers)
- Geophysical Research Letters (rapid communications on TC trends)

## Ingestion Notes

- HENS verification data is highest priority: directly impacts this expert's core claims about AI TC prediction quality.
- NHC annual verification report (typically published February) provides the ground truth for all model TC skill claims.
- During Atlantic hurricane season (June-November), NHC advisories and model guidance are operationally relevant and should be checked if users ask about active storms.
- arXiv TC+AI papers are appearing at increasing frequency; a new paper claiming improved TC prediction should be evaluated against the cross-cutting findings in reference/ai-tc-models.md.
- Wind convention differences across basins (1-min vs 10-min) are a persistent source of confusion in the literature; always verify which convention a paper uses.
